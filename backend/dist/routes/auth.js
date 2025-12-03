"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authSchema_1 = require("../schemas/authSchema");
const auth_1 = require("../middleware/auth");
const userMapper_1 = require("../utils/userMapper");
const router = (0, express_1.Router)();
const generateEmployeeCode = async () => {
    const attempt = () => `KRY-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 999)}`;
    let code = attempt();
    let exists = await prisma_1.default.employee.findUnique({
        where: { employeeCode: code },
    });
    while (exists) {
        code = attempt();
        exists = await prisma_1.default.employee.findUnique({
            where: { employeeCode: code },
        });
    }
    return code;
};
router.post("/register", async (req, res, next) => {
    try {
        const payload = authSchema_1.registerSchema.parse(req.body);
        const existing = await prisma_1.default.user.findUnique({
            where: { email: payload.email },
        });
        if (existing) {
            return res.status(409).json({ message: "Email sudah terdaftar" });
        }
        const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
        const employeeCode = await generateEmployeeCode();
        const user = await prisma_1.default.user.create({
            data: {
                email: payload.email,
                passwordHash,
                role: "EMPLOYEE",
                employee: {
                    create: {
                        employeeCode,
                        fullName: payload.fullName,
                        email: payload.email,
                        phone: payload.phone || null,
                        department: payload.department || null,
                        jobTitle: payload.jobTitle || null,
                        baseSalary: 0,
                        status: "ACTIVE",
                    },
                },
            },
            include: { employee: true },
        });
        const token = (0, auth_1.createToken)({
            userId: user.id,
            role: user.role,
            employeeId: user.employee?.id ?? null,
        });
        return res.status(201).json({ token, user: (0, userMapper_1.mapUserResponse)(user) });
    }
    catch (error) {
        return next(error);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const payload = authSchema_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: { email: payload.email },
            include: { employee: true },
        });
        if (!user) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const valid = await bcryptjs_1.default.compare(payload.password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const token = (0, auth_1.createToken)({
            userId: user.id,
            role: user.role,
            employeeId: user.employee?.id ?? null,
        });
        return res.json({ token, user: (0, userMapper_1.mapUserResponse)(user) });
    }
    catch (error) {
        return next(error);
    }
});
router.get("/me", auth_1.requireAuth, async (req, res, next) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.userId },
            include: { employee: true },
        });
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }
        return res.json({ user: (0, userMapper_1.mapUserResponse)(user) });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map