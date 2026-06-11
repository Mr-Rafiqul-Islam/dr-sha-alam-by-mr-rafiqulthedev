import "./config/env.js";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import { mountRoutes } from "./routes/index.js";
import { muxWebhookRouter } from "./routes/webhooks/mux.routes.js";

const app = express();
const port: number | string = process.env.PORT || 5007;

app.use(cors(corsOptions));
app.use(cookieParser());
// Mux webhooks require raw body for signature verification (before JSON parser).
app.use("/webhooks/mux", muxWebhookRouter);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

mountRoutes(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
