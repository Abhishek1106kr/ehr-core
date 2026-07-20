import { prisma } from "../lib/prisma";
import { workflowQueue } from "../jobs/queue";

export interface SystemMetrics {
  timestamp: string;
  uptimeSeconds: number;
  memoryUsageMb: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  database: {
    connected: boolean;
    activeUsers: number;
    totalAppointments: number;
  };
  queue: {
    activeJobs: number;
    waitingJobs: number;
    failedJobs: number;
  };
}

export async function collectSystemMetrics(): Promise<SystemMetrics> {
  const mem = process.memoryUsage();
  let dbConnected = true;
  let activeUsers = 0;
  let totalAppointments = 0;

  try {
    const [usersCount, apptCount] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.appointment.count(),
    ]);
    activeUsers = usersCount;
    totalAppointments = apptCount;
  } catch {
    dbConnected = false;
  }

  let activeJobs = 0;
  let waitingJobs = 0;
  let failedJobs = 0;

  try {
    const counts = await workflowQueue.getJobCounts("active", "waiting", "failed");
    activeJobs = counts.active ?? 0;
    waitingJobs = counts.waiting ?? 0;
    failedJobs = counts.failed ?? 0;
  } catch {
    // Queue might be disabled in non-Redis dev mode
  }

  return {
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memoryUsageMb: {
      rss: Math.round(mem.rss / (1024 * 1024)),
      heapTotal: Math.round(mem.heapTotal / (1024 * 1024)),
      heapUsed: Math.round(mem.heapUsed / (1024 * 1024)),
    },
    database: {
      connected: dbConnected,
      activeUsers,
      totalAppointments,
    },
    queue: {
      activeJobs,
      waitingJobs,
      failedJobs,
    },
  };
}
