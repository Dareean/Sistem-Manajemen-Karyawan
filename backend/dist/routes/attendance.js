"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const attendanceSchema_1 = require("../schemas/attendanceSchema");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const toDate = (value) => (value ? new Date(value) : null);
const computeWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut)
        return 0;
    const diffMs = checkOut.getTime() - checkIn.getTime();
    return diffMs > 0 ? +(diffMs / (1000 * 60 * 60)).toFixed(2) : 0;
};
router.get("/", async (req, res, next) => {
    try {
        const { date, employeeId } = req.query;
        const filters = {};
        const isAdmin = req.user?.role === "ADMIN";
        if (date) {
            const day = new Date(date);
            const start = new Date(day);
            start.setHours(0, 0, 0, 0);
            const end = new Date(day);
            end.setHours(23, 59, 59, 999);
            filters.attendanceDate = { gte: start, lte: end };
        }
        if (employeeId && isAdmin) {
            filters.employeeId = Number(employeeId);
        }
        else if (!isAdmin) {
            filters.employeeId = req.user?.employeeId ?? -1;
        }
        const logs = await prisma_1.default.attendanceLog.findMany({
            where: filters,
            include: { employee: true },
            orderBy: { attendanceDate: "desc" },
        });
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const parsed = attendanceSchema_1.attendanceSchema.parse(req.body);
        const isAdmin = req.user?.role === "ADMIN";
        const checkIn = toDate(parsed.checkIn ?? null);
        const checkOut = toDate(parsed.checkOut ?? null);
        const workHours = parsed.workHours ?? computeWorkHours(checkIn, checkOut);
        const targetEmployeeId = isAdmin ? parsed.employeeId : req.user?.employeeId;
        if (isAdmin && !parsed.employeeId) {
            return res.status(400).json({ message: "employeeId wajib diisi" });
        }
        if (!targetEmployeeId) {
            return res.status(403).json({ message: "Akses karyawan diperlukan" });
        }
        const log = await prisma_1.default.attendanceLog.create({
            data: {
                employeeId: targetEmployeeId,
                attendanceDate: new Date(parsed.attendanceDate),
                checkIn,
                checkOut,
                workHours,
                overtimeHours: parsed.overtimeHours ?? 0,
                status: parsed.status,
                notes: parsed.notes || null,
            },
            include: { employee: true },
        });
        res.status(201).json(log);
    }
    catch (error) {
        next(error);
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const logId = Number(req.params.id);
        const existing = await prisma_1.default.attendanceLog.findUnique({
            where: { id: logId },
        });
        if (!existing) {
            return res.status(404).json({ message: "Data absensi tidak ditemukan" });
        }
        const isAdmin = req.user?.role === "ADMIN";
        if (!isAdmin) {
            if (!req.user?.employeeId) {
                return res.status(403).json({ message: "Akses karyawan diperlukan" });
            }
            if (existing.employeeId !== req.user.employeeId) {
                return res.status(403).json({ message: "Anda tidak memiliki akses" });
            }
        }
        const parsed = attendanceSchema_1.attendanceSchema.partial().parse(req.body);
        const checkInValue = parsed.checkIn === undefined
            ? undefined
            : parsed.checkIn
                ? new Date(parsed.checkIn)
                : null;
        const checkOutValue = parsed.checkOut === undefined
            ? undefined
            : parsed.checkOut
                ? new Date(parsed.checkOut)
                : null;
        const data = {};
        if (parsed.attendanceDate) {
            data.attendanceDate = new Date(parsed.attendanceDate);
        }
        if (checkInValue !== undefined) {
            data.checkIn = checkInValue;
        }
        if (checkOutValue !== undefined) {
            data.checkOut = checkOutValue;
        }
        if (parsed.workHours !== undefined) {
            data.workHours = parsed.workHours;
        }
        else if (checkInValue instanceof Date && checkOutValue instanceof Date) {
            data.workHours = computeWorkHours(checkInValue, checkOutValue);
        }
        if (parsed.overtimeHours !== undefined) {
            data.overtimeHours = parsed.overtimeHours;
        }
        if (parsed.status) {
            data.status = parsed.status;
        }
        if (parsed.notes !== undefined) {
            data.notes = parsed.notes || null;
        }
        const log = await prisma_1.default.attendanceLog.update({
            where: { id: logId },
            data,
            include: { employee: true },
        });
        res.json(log);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=attendance.js.map