import { z } from "zod";

export const registerSchoolSchema = z.object({
  name: z.string().min(1),
  directorFirstName: z.string().min(1),
  directorLastName: z.string().min(1),
  address: z.string().min(1),
  zipCode: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
  website: z.string().optional(),
  //   role: z.enum(["school", "teacher", "student"]).default("school").optional(),
});

export type RegisterSchoolSchema = z.infer<typeof registerSchoolSchema>;
