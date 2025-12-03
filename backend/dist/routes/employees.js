"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const employeeSchema_1 = require("../schemas/employeeSchema");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, (0, auth_1.requireRole)(["ADMIN"]));
router.get("/", async (req, res, next) => {
    try {
        const search = req.query.search?.trim();
        const filters = search
            ? {
                OR: [
                    { fullName: { contains: search, mode: "insensitive" } },
                    { employeeCode: { contains: search, mode: "insensitive" } },
                    { department: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const employees = await prisma_1.default.employee.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
        });
        res.json(employees);
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const parsed = employeeSchema_1.employeeSchema.parse(req.body);
        const employee = await prisma_1.default.employee.create({
            data: {
                ...parsed,
                baseSalary: new client_1.Prisma.Decimal(parsed.baseSalary ?? 0),
                hireDate: parsed.hireDate ? new Date(parsed.hireDate) : new Date(),
                phone: parsed.phone || null,
                department: parsed.department || null,
                jobTitle: parsed.jobTitle || null,
                status: parsed.status ?? "ACTIVE",
            },
        });
        res.status(201).json(employee);
    }
    catch (error) {
        next(error);
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const employeeId = Number(req.params.id);
        const parsed = employeeSchema_1.employeeSchema.partial().parse(req.body);
        const data = {};
        if (parsed.employeeCode !== undefined)
            data.employeeCode = parsed.employeeCode;
        if (parsed.fullName !== undefined)
            data.fullName = parsed.fullName;
        if (parsed.email !== undefined)
            data.email = parsed.email;
        if (parsed.department !== undefined)
            data.department = parsed.department || null;
        if (parsed.jobTitle !== undefined)
            data.jobTitle = parsed.jobTitle || null;
        if (parsed.phone !== undefined)
            data.phone = parsed.phone || null;
        if (parsed.status !== undefined)
            data.status = parsed.status;
        if (parsed.baseSalary !== undefined) {
            data.baseSalary = new client_1.Prisma.Decimal(parsed.baseSalary);
        }
        if (parsed.hireDate) {
            data.hireDate = new Date(parsed.hireDate);
        }
        const employee = await prisma_1.default.employee.update({
            where: { id: employeeId },
            data,
        });
        res.json(employee);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        const employeeId = Number(req.params.id);
        await prisma_1.default.payrollRun.deleteMany({ where: { employeeId } });
        await prisma_1.default.attendanceLog.deleteMany({ where: { employeeId } });
        await prisma_1.default.employee.delete({ where: { id: employeeId } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=employees.js.map