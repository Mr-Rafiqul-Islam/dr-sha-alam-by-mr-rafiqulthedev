import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port: number | string = process.env.PORT || 5000;

const allowedOrigins: string[] = [
  "http://localhost:3000",
  "https://doctorshahalam.com",
  "https://www.doctorshahalam.com",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
