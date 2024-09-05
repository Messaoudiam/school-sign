import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { registerSchoolSchema } from "@/lib/schemas/register.school.schema";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Parse and validate the request body
  const result = registerSchoolSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: result.error.issues });
  }

  const {
    name,
    directorFirstName,
    directorLastName,
    address,
    zipCode,
    city,
    phone,
    email,
    password,
    website,
  } = result.data;

  if (password !== result.data.confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the school entry in the database
    const school = await prisma.school.create({
      data: {
        name,
        directorFirstName,
        directorLastName,
        address,
        zipCode,
        city,
        phone,
        email,
        password: hashedPassword,
        website,
        role: "SCHOOL", // Assuming "SCHOOL" is a valid role in your Role enum
      },
    });

    return res.status(201).json(school);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
