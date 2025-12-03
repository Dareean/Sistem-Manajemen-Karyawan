"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, (0, auth_1.requireRole)(["ADMIN"]));
router.get("/summary", async (_req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 6);
        const [employeeCount, activeEmployees, attendanceToday, payrollPending, weeklyAttendance,] = await Promise.all([
            prisma_1.default.employee.count(),
            prisma_1.default.employee.count({ where: { status: "ACTIVE" } }),
            prisma_1.default.attendanceLog.count({
                where: {
                    attendanceDate: { gte: today, lt: tomorrow },
                    status: "PRESENT",
                },
            }),
            prisma_1.default.payrollRun.count({
                where: { status: { in: ["PENDING", "APPROVED"] } },
            }),
            prisma_1.default.attendanceLog.groupBy({
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map