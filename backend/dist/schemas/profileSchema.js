"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateSchema = void 0;
const zod_1 = require("zod");
exports.profileUpdateSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).optional(),
    phone: zod_1.z.string().min(6).optional().or(zod_1.z.literal("")),
    department: zod_1.z.string().optional().or(zod_1.z.literal("")),
    jobTitle: zod_1.z.string().optional().or(zod_1.z.literal("")),
});
//# sourceMappingURL=profileSchema.js.map