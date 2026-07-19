// Test-only defaults so `env.ts` validation passes without a real .env file.
// dotenv/config (loaded inside env.ts) never overrides variables already set,
// so these take precedence over any local .env during test runs.
process.env.DATABASE_URL ??= "postgresql://openehr:openehr@localhost:5432/openehr_bridge_test";
process.env.JWT_SECRET ??= "test-only-secret-not-for-production-use";
process.env.WEB_ORIGIN ??= "http://localhost:3000";
