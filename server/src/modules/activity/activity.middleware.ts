import type { NextFunction, Request, Response } from "express";
import { inferActivityFromRequest } from "./activity.infer.js";
import type { LogActivityInput } from "./activity.types.js";
import { logActivitySafe, shouldLogActivity } from "./activity.service.js";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export type ActivityRecordInput = Omit<LogActivityInput, "actor">;

export function recordActivity(res: Response, input: ActivityRecordInput): void {
  res.locals.activityLog = input;
}

function finalizeActivity(req: Request, res: Response, body: unknown): void {
  if (res.statusCode < 200 || res.statusCode >= 300 || !shouldLogActivity(req.admin)) {
    return;
  }

  const explicit = res.locals.activityLog as ActivityRecordInput | null | undefined;
  if (explicit) {
    logActivitySafe({ actor: req.admin!, ...explicit });
    return;
  }

  const inferred = inferActivityFromRequest(req, body);
  if (inferred) {
    logActivitySafe({ actor: req.admin!, ...inferred });
  }
}

export function adminActivityTracing() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!MUTATION_METHODS.has(req.method.toUpperCase())) {
      next();
      return;
    }

    res.locals.activityLog = null;

    const originalJson = res.json.bind(res);
    res.json = function jsonWithActivity(body: unknown) {
      finalizeActivity(req, res, body);
      return originalJson(body);
    };

    const originalSend = res.send.bind(res);
    res.send = function sendWithActivity(body?: unknown) {
      finalizeActivity(req, res, body);
      return originalSend(body);
    };

    next();
  };
}
