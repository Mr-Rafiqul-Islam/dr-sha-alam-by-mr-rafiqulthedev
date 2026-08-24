import type { Request, Response } from "express";
import { prisma } from "../../config/db.js";
import { APPOINTMENT_ACTOR_INCLUDE, toAdminAppointment } from "../../modules/appointment/appointment.mapper.js";
import {
  applyBkashConfirm,
  assertAdminPaymentActor,
  resolveStaffCollectionDue,
} from "../../modules/appointment/appointment.payment.js";
import {
  AppointmentValidationError,
  handleAppointmentError,
} from "../../modules/appointment/appointment.utils.js";
import { withConsultationFees } from "../../modules/appointmentRevenue/appointmentRevenue.service.js";
import { startAdminSslSession } from "../../modules/payment/payment.service.js";
import { routeParamString } from "../../utils/express-params.js";

export async function startAdminSslPayment(req: Request, res: Response) {
  try {
    assertAdminPaymentActor(req.admin);
    const appointmentId = routeParamString(req.params.id);
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const result = await startAdminSslSession(appointmentId);
    return res.status(200).json({
      success: true,
      message: "SSL payment session started",
      ...result,
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to start SSL payment");
  }
}

export async function confirmAdminBkashPayment(req: Request, res: Response) {
  try {
    assertAdminPaymentActor(req.admin);
    const appointmentId = routeParamString(req.params.id);
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { ...APPOINTMENT_ACTOR_INCLUDE, feesDiscount: true },
    });

    if (!appointment) {
      throw new AppointmentValidationError("Appointment not found", 404);
    }

    const due = await resolveStaffCollectionDue({
      preferredTime: appointment.preferredTime,
      feeCategory: appointment.feeCategory,
      siteRef: appointment.siteRef,
      discounts: appointment.feesDiscount,
    });
    const confirmFields = applyBkashConfirm({
      paymentMethod: appointment.paymentMethod,
      paymentStatus: appointment.paymentStatus,
      due,
    });

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: confirmFields,
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    const [withFee] = await withConsultationFees([updated]);

    return res.status(200).json({
      success: true,
      message: "bKash payment confirmed",
      appointment: toAdminAppointment(withFee),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to confirm bKash payment");
  }
}
