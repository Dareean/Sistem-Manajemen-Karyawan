import { z } from "zod";
export declare const attendanceSchema: z.ZodObject<{
    employeeId: z.ZodOptional<z.ZodNumber>;
    attendanceDate: z.ZodString;
    checkIn: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    checkOut: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    workHours: z.ZodDefault<z.ZodNumber>;
    overtimeHours: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LEAVE: "LEAVE";
        SICK: "SICK";
    }>>;
    notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
//# sourceMappingURL=attendanceSchema.d.ts.map