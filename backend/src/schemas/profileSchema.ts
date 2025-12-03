import { z } from "zod";

export const profileUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: z.string().min(6).optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
