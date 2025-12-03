import { z } from "zod";
export declare const employeeSchema: z.ZodObject<{
    employeeCode: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    department: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    jobTitle: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    baseSalary: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
    hireDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
//# sourceMappingURL=employeeSchema.d.ts.map