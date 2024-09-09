import { z } from "zod";

// Password regex example for more complex validation (minimum 8 characters, at least 1 letter, 1 number)

export const registerSchoolSchema = z.object({
  name: z.string().min(1, { message: "School name is required." }),
  directorFirstName: z.string().min(1, { message: "Director first name is required." }),
  directorLastName: z.string().min(1, { message: "Director last name is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  zipCode: z
    .string()
    .min(5, { message: "Zip Code must be at least 5 characters." })
    .max(10, { message: "Zip Code cannot be more than 10 characters." }),
  city: z.string().min(1, { message: "City is required." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number cannot exceed 15 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    ,
  confirmPassword: z.string(),
  website: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type RegisterSchoolSchema = z.infer<typeof registerSchoolSchema>;
