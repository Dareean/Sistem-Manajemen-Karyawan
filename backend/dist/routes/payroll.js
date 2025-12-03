"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const payrollSchema_1 = require("../schemas/payrollSchema");
const payrollService_1 = require("../services/payrollService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", async (req, res, next) => {
    try {
        const { employeeId, status } = req.query;
        const where = {};
        const isAdmin = req.user?.role === "ADMIN";
        if (employeeId) {
            if (!isAdmin) {
                return res.status(403).json({ message: "Anda tidak memiliki akses" });
            }
            where.employeeId = Number(employeeId);
        }
        else if (!isAdmin) {
            if (!req.user?.employeeId) {
                return res
                    .status(403)
                    .json({ message: "Profil karyawan tidak ditemukan" });
            }
            where.employeeId = req.user.employeeId;
        }
        if (status) {
            where.status = status.toUpperCase();
        }
        const payrolls = await prisma_1.default.payrollRun.findMany({
            where,
            include: { employee: true },
            orderBy: { generatedAt: "desc" },
        });
        res.json(payrolls);
    }
    catch (error) {
        next(error);
    }
});
router.post("/run", (0, auth_1.requireRole)(["ADMIN"]), async (req, res, next) => {
    try {
        const payload = payrollSchema_1.payrollRunSchema.parse(req.body);
        const result = await (0, payrollService_1.runPayroll)(payload);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id/status", (0, auth_1.requireRole)(["ADMIN"]), async (req, res, next) => {
    try {
        const payrollId = Number(req.params.id);
        const { status } = req.body;
        const allowed = ["PENDING", "APPROVED", "PAID"];
        if (!allowed.includes(status?.toUpperCase())) {
            return res.status(400).json({ message: "Status tidak valid" });
        }
        const payroll = await prisma_1.default.payrollRun.update({
            where: { id: payrollId },
            data: { status: status.toUpperCase() },
        });
        res.json(payroll);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=payroll.js.map