"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeSchema = void 0;
const zod_1 = require("zod");
exports.employeeSchema = zod_1.z.object({
    employeeCode: zod_1.z.string().min(3, "Kode minimal 3 karakter"),
    fullName: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8).optional().or(zod_1.z.literal("")),
    department: zod_1.z.string().optional().or(zod_1.z.literal("")),
    jobTitle: zod_1.z.string().optional().or(zod_1.z.literal("")),
    baseSalary: zod_1.z.number().nonnegative().default(0),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
    hireDate: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=employeeSchema.js.map