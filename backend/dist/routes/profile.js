"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const profileSchema_1 = require("../schemas/profileSchema");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, auth_1.ensureEmployeeContext);
router.get("/me", async (req, res, next) => {
    try {
        const employee = await prisma_1.default.employee.findUnique({
            where: { id: req.user.employeeId },
        });
        if (!employee) {
            return res
                .status(404)
                .json({ message: "Profil karyawan tidak ditemukan" });
        }
        return res.json(employee);
    }
    catch (error) {
        return next(error);
    }
});
router.put("/me", async (req, res, next) => {
    try {
        const payload = profileSchema_1.profileUpdateSchema.parse(req.body);
        const data = {};
        if (payload.fullName !== undefined) {
            data.fullName = payload.fullName;
        }
        if (payload.phone !== undefined) {
            data.phone = payload.phone || null;
        }
        if (payload.department !== undefined) {
            data.department = payload.department || null;
        }
        if (payload.jobTitle !== undefined) {
            data.jobTitle = payload.jobTitle || null;
        }
        const employee = await prisma_1.default.employee.update({
            where: { id: req.user.employeeId },
            data,
        });
        return res.json(employee);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map