import { z } from "zod";
export declare const profileUpdateSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    department: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    jobTitle: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
//# sourceMappingURL=profileSchema.d.ts.map