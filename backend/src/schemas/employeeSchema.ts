import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z.string().min(3, "Kode minimal 3 karakter"),
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8).optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  baseSalary: z.number().nonnegative().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  hireDate: z.string().datetime().optional(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
