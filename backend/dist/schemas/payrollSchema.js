"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollRunSchema = void 0;
const zod_1 = require("zod");
exports.payrollRunSchema = zod_1.z.object({
    periodStart: zod_1.z.string().datetime(),
    periodEnd: zod_1.z.string().datetime(),
    employeeId: zod_1.z.number().int().positive().optional(),
    allowances: zod_1.z.number().nonnegative().default(0),
    deductions: zod_1.z.number().nonnegative().default(0),
});
//# sourceMappingURL=payrollSchema.js.map