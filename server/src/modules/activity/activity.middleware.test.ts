import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import { UserRole } from "@prisma/client";
import { adminActivityTracing, recordActivity } from "./activity.middleware.js";
import {
  ActivityAction,
  ActivityEntityType,
} from "./activity.service.js";
import { buildActivitySummary } from "./activity.serializer.js";

const supportActor = {
  id: "support-1",
  name: "Support User",
  email: "support@test.com",
  phone: null,
  image: null,
  provider: null,
  providerId: null,
  doctorId: null,
  role: UserRole.SUPPORT,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("adminActivityTracing", () => {
  it("marks activityLogged after res.json so a follow-up send cannot log again", async () => {
    const app = express();
    app.use((req, res, next) => {
      req.admin = supportActor;
      next();
    });
    app.patch(
      "/appointments/:id/status",
      adminActivityTracing(),
      (_req, res) => {
        recordActivity(res, {
          action: ActivityAction.APPOINTMENT_STATUS_CHANGED,
          entityType: ActivityEntityType.Appointment,
          entityId: "appt-1",
          metadata: { patientName: "John", from: "PENDING", to: "CONFIRMED" },
        });
        res.status(200).json({ success: true, appointment: { id: "appt-1" } });
        assert.equal(res.locals.activityLogged, true);
      },
    );

    const server = app.listen(0);
    const { port } = server.address() as { port: number };

    try {
      const response = await fetch(
        `http://127.0.0.1:${port}/appointments/appt-1/status`,
        { method: "PATCH" },
      );
      assert.equal(response.status, 200);
    } finally {
      server.close();
    }
  });

  it("does not mark activityLogged when response body has pending: true", async () => {
    const app = express();
    app.use((req, res, next) => {
      req.admin = supportActor;
      next();
    });
    app.delete(
      "/appointments/:id",
      adminActivityTracing(),
      (_req, res) => {
        res.status(200).json({
          success: true,
          pending: true,
          message: "Delete request submitted and is pending confirmation.",
        });
        assert.equal(res.locals.activityLogged, false);
      },
    );

    const server = app.listen(0);
    const { port } = server.address() as { port: number };

    try {
      const response = await fetch(
        `http://127.0.0.1:${port}/appointments/appt-1`,
        { method: "DELETE" },
      );
      assert.equal(response.status, 200);
    } finally {
      server.close();
    }
  });
});

describe("buildActivitySummary", () => {
  it("includes approver name for approved delete actions", () => {
    const summary = buildActivitySummary(
      ActivityAction.APPOINTMENT_DELETED,
      "Support User",
      "support@test.com",
      { patientName: "John Doe", approvedByName: "Admin User" },
    );

    assert.match(summary, /Support User deleted appointment for John Doe \(approved by Admin User\)/);
  });
});
