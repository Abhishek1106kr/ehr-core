import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";

/**
 * Aggregate dashboard summary. Deliberately computed with a handful of
 * targeted count()/aggregate() queries rather than one giant query — each
 * metric can evolve independently as workflows are added in later phases.
 */
export const getDashboardSummaryHandler = asyncHandler(async (req: Request, res: Response) => {
  const organizationId = req.query.organizationId as string | undefined;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const doctorWhere = organizationId ? { organizationId } : {};

  const [
    todaysAppointments,
    pendingInsurance,
    recentAuditLogs,
    jobCounts,
    failedJobs,
    doctorIds,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { startsAt: { gte: startOfDay, lte: endOfDay }, status: { not: "CANCELLED" } },
    }),
    prisma.insurance.count({ where: { status: { in: ["NOT_CHECKED", "PENDING"] } } }),
    prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 10 }),
    prisma.automationJob.groupBy({ by: ["status"], _count: true }),
    prisma.automationJob.count({ where: { status: "FAILED" } }),
    prisma.doctor.findMany({ where: doctorWhere, select: { id: true } }),
  ]);

  const totalJobs = jobCounts.reduce((sum, g) => sum + g._count, 0);
  const successJobs = jobCounts.find((g) => g.status === "SUCCESS")?._count ?? 0;
  const automationSuccessRate = totalJobs > 0 ? Math.round((successJobs / totalJobs) * 100) : 100;

  const avgDuration = await prisma.automationJob.aggregate({
    _avg: { durationMs: true },
    where: { durationMs: { not: null } },
  });

  res.json({
    todaysAppointments,
    pendingInsuranceVerifications: pendingInsurance,
    automationSuccessRatePct: automationSuccessRate,
    failedWorkflows: failedJobs,
    averageResponseTimeMs: Math.round(avgDuration._avg.durationMs ?? 0),
    activeDoctors: doctorIds.length,
    jobStatusBreakdown: jobCounts.map((g) => ({ status: g.status, count: g._count })),
    recentActivity: recentAuditLogs,
  });
});
