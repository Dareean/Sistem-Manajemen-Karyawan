import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import employeesRouter from "./routes/employees";
import attendanceRouter from "./routes/attendance";
import payrollRouter from "./routes/payroll";
import dashboardRouter from "./routes/dashboard";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import { authenticate } from "./middleware/auth";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use(authenticate);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res
    .status(500)
    .json({ message: err.message || "Terjadi kesalahan pada server" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
