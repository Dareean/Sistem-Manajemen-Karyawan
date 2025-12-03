import { z } from "zod";

export const payrollRunSchema = z.object({
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  employeeId: z.number().int().positive().optional(),
  allowances: z.number().nonnegative().default(0),
  deductions: z.number().nonnegative().default(0),
});

export type PayrollRunInput = z.infer<typeof payrollRunSchema>;
