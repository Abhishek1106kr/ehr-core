/**
 * Production startup orchestrator.
 *
 * Runs in order:
 *   1. prisma db push   — apply schema (exits hard on failure, DB is required)
 *   2. prisma/seed.ts   — seed demo data (logs warning on failure, non-fatal)
 *   3. src/server.ts    — start the HTTP server
 *
 * Using a Node.js script instead of &&-chained shell commands gives
 * proper error handling and clear log output on Railway.
 */

import { execSync, spawn } from "child_process";
import path from "node:path";

// When running as dist/src/scripts/startup.js, __dirname = <workspace>/dist/src/scripts
// The api workspace root (where prisma/schema.prisma lives) is 3 levels up
const API_ROOT = path.resolve(__dirname, "..", "..", "..");

function run(cmd: string, label: string): boolean {
  console.log(`\n[startup] ▶ ${label}`);
  try {
    execSync(cmd, { stdio: "inherit", cwd: API_ROOT });
    console.log(`[startup] ✓ ${label} completed`);
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[startup] ✗ ${label} failed: ${msg}`);
    return false;
  }
}

async function main() {
  // 1. Schema migration — hard requirement, exit if this fails
  const migrated = run("npx prisma db push --accept-data-loss", "prisma db push");
  if (!migrated) {
    console.error("[startup] FATAL: Cannot apply database schema. Exiting.");
    process.exit(1);
  }

  // 2. Seed — best-effort, non-fatal (idempotent upserts safe to re-run)
  run("npx tsx prisma/seed.ts", "seed demo data");

  // 3. Start the compiled server
  console.log("\n[startup] ▶ Starting API server...");
  const serverPath = path.join(API_ROOT, "dist", "src", "server.js");
  const server = spawn("node", [serverPath], {
    stdio: "inherit",
    cwd: API_ROOT,
  });

  server.on("error", (err) => {
    console.error("[startup] Server process error:", err.message);
    process.exit(1);
  });

  server.on("exit", (code) => {
    console.log(`[startup] Server exited with code ${code}`);
    process.exit(code ?? 0);
  });

  // Forward signals to the child server process
  process.on("SIGTERM", () => server.kill("SIGTERM"));
  process.on("SIGINT", () => server.kill("SIGINT"));
}

main().catch((err) => {
  console.error("[startup] Unhandled error:", err);
  process.exit(1);
});
