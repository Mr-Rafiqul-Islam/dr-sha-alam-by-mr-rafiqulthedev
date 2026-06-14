import { Router } from "express";
import {
  paymentCancel,
  paymentFail,
  paymentIPN,
  paymentSuccess,
  startPayment,
} from "../../controllers/payment/payment.controller.js";

export const paymentRouter = Router();

paymentRouter.post("/start", startPayment);
paymentRouter.post("/success", paymentSuccess);
paymentRouter.post("/fail", paymentFail);
paymentRouter.post("/cancel", paymentCancel);
paymentRouter.post("/ipn", paymentIPN);
