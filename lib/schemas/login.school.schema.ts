import { z } from "zod";

export const loginSchoolSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginSchoolSchema = z.infer<typeof loginSchoolSchema>;
