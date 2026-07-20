import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { paginationSchema } from "../lib/pagination";
import { listAutomationJobs, getAutomationJob } from "../services/automationJob.service";

export const listAutomationJobsHandler = asyncHandler(async (req: Request, res: Response) => {
  const pagination = paginationSchema.parse(req.query);
  const { status, type, integrationMode } = req.query;
  res.json(
    await listAutomationJobs({
      ...pagination,
      status: status as string | undefined,
      type: type as string | undefined,
      integrationMode: integrationMode as string | undefined,
    }),
  );
});

export const getAutomationJobHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await getAutomationJob(req.params.id));
});
