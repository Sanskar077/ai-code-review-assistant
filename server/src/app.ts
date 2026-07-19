import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { HttpStatus } from "./constants/httpStatus";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import routes from "./routes";

const app = express();

// Render (and most PaaS hosts) put the app behind a reverse proxy. Without
// this, express-rate-limit throws (it can't trust X-Forwarded-For) and
// req.secure / cookie "secure" detection can misbehave.
app.set("trust proxy", 1);

app.use(helmet());
// Trim any trailing slash so a Render env var like ".../vercel.app/"
// still matches the browser's Origin header (".../vercel.app", no slash).
const allowedOrigin = env.CLIENT_URL.replace(/\/+$/, "");
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(HttpStatus.OK).json({ success: true, data: { status: "ok" } });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
