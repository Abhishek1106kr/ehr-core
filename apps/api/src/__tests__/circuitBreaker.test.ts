import { describe, it, expect, vi } from "vitest";
import { CircuitBreaker, CircuitState, CircuitBreakerError } from "../lib/circuitBreaker";

describe("CircuitBreaker Resilience Module", () => {
  it("should execute successfully when state is CLOSED", async () => {
    const cb = new CircuitBreaker("TestService", { failureThreshold: 2, resetTimeoutMs: 100 });
    const fn = vi.fn().mockResolvedValue("SUCCESS");

    const result = await cb.execute(fn);
    expect(result).toBe("SUCCESS");
    expect(cb.getState()).toBe(CircuitState.CLOSED);
  });

  it("should open circuit after failure threshold is exceeded", async () => {
    const cb = new CircuitBreaker("FailingService", { failureThreshold: 2, resetTimeoutMs: 500 });
    const failingFn = vi.fn().mockRejectedValue(new Error("External API Timeout"));

    await expect(cb.execute(failingFn)).rejects.toThrow("External API Timeout");
    await expect(cb.execute(failingFn)).rejects.toThrow("External API Timeout");

    expect(cb.getState()).toBe(CircuitState.OPEN);

    // Subsequent call should throw CircuitBreakerError immediately
    await expect(cb.execute(failingFn)).rejects.toThrow(CircuitBreakerError);
    expect(failingFn).toHaveBeenCalledTimes(2);
  });

  it("should transition to HALF_OPEN after reset timeout and reset to CLOSED on consecutive successes", async () => {
    const cb = new CircuitBreaker("RecoveringService", {
      failureThreshold: 1,
      resetTimeoutMs: 50,
      halfOpenMaxRequests: 1,
    });
    const failingFn = vi.fn().mockRejectedValue(new Error("Down"));

    await expect(cb.execute(failingFn)).rejects.toThrow("Down");
    expect(cb.getState()).toBe(CircuitState.OPEN);

    // Wait past reset timeout
    await new Promise((resolve) => setTimeout(resolve, 60));

    const successFn = vi.fn().mockResolvedValue("RECOVERED");
    const result = await cb.execute(successFn);

    expect(result).toBe("RECOVERED");
    expect(cb.getState()).toBe(CircuitState.CLOSED);
  });
});
