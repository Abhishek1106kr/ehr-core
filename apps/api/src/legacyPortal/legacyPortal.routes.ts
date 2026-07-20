import { Router, type Request, type Response, type NextFunction } from "express";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { createAppointment } from "../services/appointment.service";
import { legacyLayout } from "./layout";
import { escapeHtml } from "./escapeHtml";
import {
  createSession,
  isValidSession,
  LEGACY_PORTAL_COOKIE,
  LEGACY_PORTAL_USERNAME,
  LEGACY_PORTAL_PASSWORD,
} from "./session";

export const legacyPortalRouter = Router();

function requireLegacySession(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[LEGACY_PORTAL_COOKIE];
  if (!isValidSession(token)) {
    return res.redirect("/legacy-portal/login");
  }
  next();
}

legacyPortalRouter.get("/login", (req, res) => {
  const error = req.query.error ? '<p class="error">Invalid username or password.</p>' : "";
  res.send(
    legacyLayout(
      "Staff Login",
      `
      ${error}
      <form method="post" action="/legacy-portal/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" autocomplete="username" />
        <label for="password">Password</label>
        <input type="password" id="password" name="password" autocomplete="current-password" />
        <input type="submit" value="Log In" />
      </form>
      `,
    ),
  );
});

legacyPortalRouter.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (username !== LEGACY_PORTAL_USERNAME || password !== LEGACY_PORTAL_PASSWORD) {
    return res.redirect("/legacy-portal/login?error=1");
  }
  const token = createSession();
  res.cookie(LEGACY_PORTAL_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 60 * 1000,
  });
  res.redirect("/legacy-portal/search");
});

legacyPortalRouter.get("/search", requireLegacySession, (req, res) => {
  res.send(
    legacyLayout(
      "Patient Search",
      `
      <form method="get" action="/legacy-portal/search-results">
        <label for="q">Patient name or MRN</label>
        <input type="text" id="q" name="q" />
        <input type="submit" value="Search" />
      </form>
      `,
    ),
  );
});

legacyPortalRouter.get("/search-results", requireLegacySession, async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const patients = q
    ? await prisma.patient.findMany({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { mrn: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 10,
      })
    : [];

  const doctors = await prisma.doctor.findMany({ where: { isActive: true }, take: 20 });

  const rows = patients
    .map(
      (p) => `
      <tr>
        <td>${escapeHtml(p.mrn)}</td>
        <td>${escapeHtml(p.name)}</td>
        <td>
          <form method="get" action="/legacy-portal/book" style="margin:0">
            <input type="hidden" name="patientId" value="${escapeHtml(p.id)}" />
            <select name="doctorId">
              ${doctors.map((d) => `<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)} (${escapeHtml(d.specialty)})</option>`).join("")}
            </select>
            <input type="submit" value="Book" />
          </form>
        </td>
      </tr>`,
    )
    .join("");

  res.send(
    legacyLayout(
      "Search Results",
      `
      <table>
        <tr><th>MRN</th><th>Name</th><th>Action</th></tr>
        ${rows || '<tr><td colspan="3">No matching patients.</td></tr>'}
      </table>
      <p><a href="/legacy-portal/search">&laquo; New search</a></p>
      `,
    ),
  );
});

legacyPortalRouter.get("/book", requireLegacySession, async (req, res) => {
  const { patientId, doctorId } = req.query as { patientId?: string; doctorId?: string };
  const patient = patientId ? await prisma.patient.findUnique({ where: { id: patientId } }) : null;
  const doctor = doctorId ? await prisma.doctor.findUnique({ where: { id: doctorId } }) : null;

  if (!patient || !doctor) {
    return res
      .status(404)
      .send(legacyLayout("Error", '<p class="error">Patient or doctor not found.</p>'));
  }

  const defaultStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
  defaultStart.setMinutes(0, 0, 0);
  const defaultEnd = new Date(defaultStart.getTime() + 30 * 60 * 1000);

  res.send(
    legacyLayout(
      "Confirm Appointment",
      `
      <table>
        <tr><th>Patient</th><td>${escapeHtml(patient.name)} (${escapeHtml(patient.mrn)})</td></tr>
        <tr><th>Doctor</th><td>${escapeHtml(doctor.name)} — ${escapeHtml(doctor.specialty)}</td></tr>
      </table>
      <form method="post" action="/legacy-portal/book">
        <input type="hidden" name="patientId" value="${escapeHtml(patient.id)}" />
        <input type="hidden" name="doctorId" value="${escapeHtml(doctor.id)}" />
        <input type="hidden" name="idempotencyKey" value="${escapeHtml(String(req.query.idempotencyKey ?? randomUUID()))}" />
        <label for="startsAt">Start time</label>
        <input type="text" id="startsAt" name="startsAt" value="${defaultStart.toISOString()}" />
        <label for="endsAt">End time</label>
        <input type="text" id="endsAt" name="endsAt" value="${defaultEnd.toISOString()}" />
        <input type="submit" value="Confirm Booking" />
      </form>
      `,
    ),
  );
});

legacyPortalRouter.post("/book", requireLegacySession, async (req, res) => {
  const { patientId, doctorId, startsAt, endsAt, idempotencyKey } = req.body ?? {};

  try {
    const appointment = await createAppointment({
      patientId,
      doctorId,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      isUrgent: false,
      integrationMode: "BROWSER_AUTOMATION",
      idempotencyKey: idempotencyKey || randomUUID(),
    });
    res.redirect(`/legacy-portal/confirmation/${appointment.id}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    res
      .status(409)
      .send(legacyLayout("Booking Failed", `<p class="error">${escapeHtml(message)}</p>`));
  }
});

legacyPortalRouter.get("/confirmation/:appointmentId", requireLegacySession, async (req, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.appointmentId },
    include: { patient: true, doctor: true },
  });

  if (!appointment) {
    return res
      .status(404)
      .send(legacyLayout("Error", '<p class="error">Appointment not found.</p>'));
  }

  res.send(
    legacyLayout(
      "Booking Confirmed",
      `
      <p>Appointment confirmed for <strong>${escapeHtml(appointment.patient.name)}</strong> with
      <strong>${escapeHtml(appointment.doctor.name)}</strong> on
      ${new Date(appointment.startsAt).toUTCString()}.</p>
      <p>Confirmation number:</p>
      <p class="confirmation-number" id="confirmation-number">${escapeHtml(appointment.id)}</p>
      `,
    ),
  );
});
