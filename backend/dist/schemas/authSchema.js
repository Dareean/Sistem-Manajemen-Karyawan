"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional().or(zod_1.z.literal("")),
    department: zod_1.z.string().optional().or(zod_1.z.literal("")),
    jobTitle: zod_1.z.string().optional().or(zod_1.z.literal("")),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
//# sourceMappingURL=authSchema.js.map