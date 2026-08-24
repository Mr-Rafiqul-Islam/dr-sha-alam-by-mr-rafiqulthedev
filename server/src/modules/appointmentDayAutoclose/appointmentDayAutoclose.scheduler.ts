import {
  msUntilNextSixAmDhaka,
  runAppointmentDayAutoclose,
} from "./appointmentDayAutoclose.service.js";

const LOG_PREFIX = "[appointment-day-autoclose]";

let started = false;
let scheduled: ReturnType<typeof setTimeout> | undefined;

async function runCatchUpAndReschedule(): Promise<void> {
  try {
    await runAppointmentDayAutoclose();
  } catch (error) {
    console.error(`${LOG_PREFIX} close failed:`, error);
  }

  const delayMs = msUntilNextSixAmDhaka(new Date());
  scheduled = setTimeout(() => {
    void runCatchUpAndReschedule();
  }, delayMs);
}

export function startAppointmentDayAutocloseScheduler(): void {
  if (started) {
    return;
  }
  started = true;
  void runCatchUpAndReschedule();
}

export function stopAppointmentDayAutocloseScheduler(): void {
  started = false;
  if (scheduled) {
    clearTimeout(scheduled);
    scheduled = undefined;
  }
}
