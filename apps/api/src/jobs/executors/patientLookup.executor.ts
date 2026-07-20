import { prisma } from "../../lib/prisma";
import { runStep } from "../stepRunner";
import type { PatientLookupPayload, WorkflowJobData } from "../types";

export async function executePatientLookup(job: WorkflowJobData, attempt: number) {
  const payload = job.payload as PatientLookupPayload;
  let matchCount = 0;

  await runStep(job.automationJobId, attempt, "query_directory", async () => {
    matchCount = await prisma.patient.count({
      where: {
        organizationId: payload.organizationId,
        deletedAt: null,
        OR: [
          { name: { contains: payload.search, mode: "insensitive" } },
          { mrn: { contains: payload.search, mode: "insensitive" } },
        ],
      },
    });
    return { logs: `Found ${matchCount} matching patient(s) for "${payload.search}"` };
  });

  return { matchCount };
}
