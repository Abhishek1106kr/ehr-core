import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { runStep } from "./stepRunner";
import { LEGACY_PORTAL_USERNAME, LEGACY_PORTAL_PASSWORD } from "../legacyPortal/session";
import { env } from "../config/env";
import type { AppointmentBookingPayload } from "./types";

const STORAGE_DIR = path.join(__dirname, "..", "..", "storage", "screenshots");
const PORTAL_BASE_URL = `http://localhost:${env.PORT}`;

/**
 * Drives the simulated legacy hospital portal end-to-end with a real
 * headless browser: log in, search for the patient, submit the booking
 * form, and read back the confirmation number — screenshotting every step.
 * This is the fallback path taken when an organization has no FHIR
 * integration configured for appointment booking.
 */
export async function runBrowserBookingAutomation(
  automationJobId: string,
  attempt: number,
  payload: AppointmentBookingPayload & { patientMrn: string },
): Promise<{ appointmentId: string }> {
  const jobDir = path.join(STORAGE_DIR, automationJobId);
  await mkdir(jobDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext().then((ctx) => ctx.newPage());

  try {
    await runStep(automationJobId, attempt, "login", async () => {
      await page.goto(`${PORTAL_BASE_URL}/legacy-portal/login`);
      await page.fill("#username", LEGACY_PORTAL_USERNAME);
      await page.fill("#password", LEGACY_PORTAL_PASSWORD);
      await page.click("input[type=submit]");
      await page.waitForURL(/\/legacy-portal\/search$/);
      const screenshotPath = path.join(jobDir, "01-login.png");
      await page.screenshot({ path: screenshotPath });
      return {
        screenshotUrl: toPublicUrl(automationJobId, "01-login.png"),
        logs: "Signed in as front-desk staff",
      };
    });

    await runStep(automationJobId, attempt, "search_patient", async () => {
      // Simulated transient flakiness on the first attempt — the whole
      // point of this workflow is to demonstrate retry/backoff visibly.
      if (attempt === 1 && Math.random() < 0.4) {
        throw new Error("Legacy portal search timed out (simulated transient failure)");
      }

      await page.goto(
        `${PORTAL_BASE_URL}/legacy-portal/search-results?q=${encodeURIComponent(payload.patientMrn)}`,
      );
      const screenshotPath = path.join(jobDir, "02-search.png");
      await page.screenshot({ path: screenshotPath });
      return {
        screenshotUrl: toPublicUrl(automationJobId, "02-search.png"),
        logs: "Located patient record",
      };
    });

    await runStep(automationJobId, attempt, "book_slot", async () => {
      const idempotencyKey = `${automationJobId}-book`;
      await page.goto(
        `${PORTAL_BASE_URL}/legacy-portal/book?patientId=${payload.patientId}&doctorId=${payload.doctorId}&idempotencyKey=${idempotencyKey}`,
      );
      await page.fill("#startsAt", payload.startsAt);
      await page.fill("#endsAt", payload.endsAt);
      await page.click("input[type=submit]");
      await page.waitForURL(/\/legacy-portal\/confirmation\//);
      const screenshotPath = path.join(jobDir, "03-book.png");
      await page.screenshot({ path: screenshotPath });
      const url = page.url();
      const appointmentId = url.split("/confirmation/")[1];
      return {
        screenshotUrl: toPublicUrl(automationJobId, "03-book.png"),
        logs: `Booking submitted, confirmation ${appointmentId}`,
      };
    });

    const appointmentId = page.url().split("/confirmation/")[1];

    await runStep(automationJobId, attempt, "download_confirmation", async () => {
      const confirmationText = await page.locator("#confirmation-number").innerText();
      const screenshotPath = path.join(jobDir, "04-confirmation.png");
      await page.screenshot({ path: screenshotPath });
      return {
        screenshotUrl: toPublicUrl(automationJobId, "04-confirmation.png"),
        logs: `Confirmation number captured: ${confirmationText}`,
      };
    });

    return { appointmentId };
  } finally {
    await browser.close();
  }
}

function toPublicUrl(automationJobId: string, filename: string): string {
  return `/storage/screenshots/${automationJobId}/${filename}`;
}
