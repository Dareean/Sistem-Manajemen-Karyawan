import { z } from "zod";

export const attendanceSchema = z.object({
  employeeId: z.number().int().positive().optional(),
  attendanceDate: z.string().datetime(),
  checkIn: z.string().datetime().optional().or(z.literal("")),
  checkOut: z.string().datetime().optional().or(z.literal("")),
  workHours: z.number().nonnegative().max(24).default(0),
  overtimeHours: z.number().nonnegative().max(24).default(0),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "SICK"]).default("PRESENT"),
  notes: z.string().optional().or(z.literal("")),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;
