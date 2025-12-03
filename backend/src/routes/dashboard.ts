import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/summary", async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const [
      employeeCount,
      activeEmployees,
      attendanceToday,
      payrollPending,
      weeklyAttendance,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.attendanceLog.count({
        where: {
          attendanceDate: { gte: today, lt: tomorrow },
          status: "PRESENT",
        },
      }),
      prisma.payrollRun.count({
        where: { status: { in: ["PENDING", "APPROVED"] } },
      }),
      prisma.attendanceLog.groupBy({
        by: ["attendanceDate"],
        where: { attendanceDate: { gte: weekStart, lte: tomorrow } },
        _count: { _all: true },
        orderBy: { attendanceDate: "asc" },
      }),
    ]);

    res.json({
      employeeCount,
      activeEmployees,
      attendanceToday,
      payrollPending,
      weeklyAttendance,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
