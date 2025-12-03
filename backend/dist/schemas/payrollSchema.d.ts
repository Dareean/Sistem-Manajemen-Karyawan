import { z } from "zod";
export declare const payrollRunSchema: z.ZodObject<{
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    employeeId: z.ZodOptional<z.ZodNumber>;
    allowances: z.ZodDefault<z.ZodNumber>;
    deductions: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type PayrollRunInput = z.infer<typeof payrollRunSchema>;
//# sourceMappingURL=payrollSchema.d.ts.map