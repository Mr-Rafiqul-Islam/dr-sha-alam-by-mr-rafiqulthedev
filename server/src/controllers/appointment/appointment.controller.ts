import { AppointmentStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../config/db.js";
import {
  getPreferredTimeSmsLabel,
  parsePreferredTimeCode,
  toPublicAppointment,
  toPublicAppointments,
} from "../../modules/appointment/appointment.mapper.js";
import { routeParamString } from "../../utils/express-params.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDayRange(date: Date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return { dayStart, dayEnd };
}

function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function createAppointment(req: Request, res: Response) {
  const {
    fullName,
    phoneNumber,
    email,
    homeAddress,
    problem,
    preferredDate,
    preferredTime,
  } = req.body;

  try {
    if (!fullName?.trim()) {
      return res.status(400).json({ success: false, message: "fullName is required" });
    }
    if (!phoneNumber?.trim()) {
      return res.status(400).json({ success: false, message: "phoneNumber is required" });
    }
    if (!homeAddress?.trim()) {
      return res.status(400).json({ success: false, message: "homeAddress is required" });
    }
    if (!preferredDate) {
      return res.status(400).json({ success: false, message: "preferredDate is required" });
    }

    const slotCode = parsePreferredTimeCode(preferredTime);
    if (!slotCode) {
      return res.status(400).json({
        success: false,
        message: "preferredTime must be one of: P-9, OP-4, G-5",
      });
    }

    const emailText = parseOptionalString(email);
    if (emailText && !EMAIL_REGEX.test(emailText)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    const selectedDate = new Date(preferredDate);
    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid preferredDate" });
    }

    const { dayStart, dayEnd } = getDayRange(selectedDate);
    const smsLabel = getPreferredTimeSmsLabel(slotCode);
    const problemText = parseOptionalString(problem);
    const name = fullName.trim();
    const phone = phoneNumber.trim();

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        phone,
        name,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment already exists for this patient on the selected date",
      });
    }

    const slotCount = await prisma.appointment.count({
      where: {
        preferredTime: slotCode,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
    });

    const serialNumber = slotCount + 1;

    const newAppointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email: emailText,
        homeAddress: homeAddress.trim(),
        problem: problemText,
        preferredTime: slotCode,
        appointmentDate: selectedDate,
        serialNumber,
      },
    });

    try {
      const apiKey = process.env.NOVOCOM_API_KEY;
      const clientId = process.env.NOVOCOM_CLIENT_ID;
      const senderId = process.env.NOVOCOM_SENDER_ID;

      if (apiKey && clientId && senderId) {
        const message = encodeURIComponent(
          `চেম্বার: TruCare Healing Centre
        সিদ্দিক টাওয়ার (৫ম তলা, লিফট এর- ৪), ৪৯ মহাখালী, ঢাকা।
        (স্কয়ার ফার্মাসিউটিক্যালস হেড অফিসের পাশের ভবন)
        
        রোগীর নাম: ${name}
        আপনার সিরিয়াল নং: ${serialNumber}
        উপস্থিতি সময়ঃ ${smsLabel}
        
        যোগাযোগ: ০৯৬১৩-৬৬৮৮৬৬, ০১৭০১ ৩১৩০০১-০২`,
        );

        const url =
          `https://sms.novocom-bd.com/api/v2/SendSMS?` +
          `ApiKey=${apiKey}&ClientId=${clientId}&SenderId=${senderId}` +
          `&Message=${message}&MobileNumbers=${phone}&Is_Unicode=True`;

        await fetch(url);
      }
    } catch (smsError) {
      console.error("Failed to send appointment SMS:", smsError);
    }

    return res.status(200).json({
      success: true,
      message: "Appointment created successfully",
      appointment: toPublicAppointment(newAppointment),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: req.body.status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function cancelAppointment(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCEL,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function rescheduleAppointment(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.RESCHEDULED,
        appointmentDate: new Date(req.body.appointmentDate),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getAllAppointments(_req: Request, res: Response) {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: [{ appointmentDate: "desc" }, { preferredTime: "asc" }, { serialNumber: "asc" }],
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: toPublicAppointments(appointments),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}

export async function getAppointmentsByDay(req: Request, res: Response) {
  try {
    const date = routeParamString(req.params.date);
    if (!date) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const { dayStart, dayEnd } = getDayRange(selectedDate);
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
      orderBy: [{ preferredTime: "asc" }, { serialNumber: "asc" }],
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: toPublicAppointments(appointments),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}

export async function getAppointmentsByMonth(req: Request, res: Response) {
  try {
    const month = routeParamString(req.params.month);
    const year = routeParamString(req.params.year);
    const monthNum = month ? Number(month) : NaN;
    const yearNum = year ? Number(year) : NaN;

    if (!monthNum || !yearNum) {
      return res.status(400).json({ success: false, message: "Invalid month or year" });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: startDate, lte: endDate },
      },
      orderBy: { appointmentDate: "asc" },
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for the specified month",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: toPublicAppointments(appointments),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}

export async function getAppointmentsByMonthForCalendar(req: Request, res: Response) {
  try {
    const month = routeParamString(req.params.month);
    const year = routeParamString(req.params.year);
    const monthNum = month ? Number(month) : NaN;
    const yearNum = year ? Number(year) : NaN;

    if (!monthNum || !yearNum) {
      return res.status(400).json({ success: false, message: "Invalid month or year" });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: startDate, lte: endDate },
      },
      orderBy: { appointmentDate: "asc" },
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for the specified month",
      });
    }

    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      name: appointment.name,
      appointmentDate: new Date(appointment.appointmentDate),
      preferredTime: toPublicAppointment(appointment).preferredTime,
    }));

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}

export async function getAppointmentsById(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        appointmentDate: true,
        homeAddress: true,
        name: true,
        phone: true,
        email: true,
        problem: true,
        preferredTime: true,
        serialNumber: true,
        gender: true,
        status: true,
        transactionId: true,
      },
    });

    if (appointment) {
      const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString("en-GB");
      return res.status(200).json({
        success: true,
        message: "Appointments fetched successfully",
        appointment: toPublicAppointment({
          ...appointment,
          appointmentDate: formattedDate,
        }),
      });
    }

    return res.status(404).json({
      success: false,
      message: "No appointment found",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}

export async function getAppointmentsByPhone(req: Request, res: Response) {
  try {
    const phone = routeParamString(req.params.phone);
    if (!phone) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { phone },
      orderBy: { appointmentDate: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: toPublicAppointments(appointments),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to get appointments" });
  }
}
