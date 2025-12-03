"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceSchema = void 0;
const zod_1 = require("zod");
exports.attendanceSchema = zod_1.z.object({
    employeeId: zod_1.z.number().int().positive().optional(),
    attendanceDate: zod_1.z.string().datetime(),
    checkIn: zod_1.z.string().datetime().optional().or(zod_1.z.literal("")),
    checkOut: zod_1.z.string().datetime().optional().or(zod_1.z.literal("")),
    workHours: zod_1.z.number().nonnegative().max(24).default(0),
    overtimeHours: zod_1.z.number().nonnegative().max(24).default(0),
    status: zod_1.z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]).default("PRESENT"),
    notes: zod_1.z.string().optional().or(zod_1.z.literal("")),
});
//# sourceMappingURL=attendanceSchema.js.map