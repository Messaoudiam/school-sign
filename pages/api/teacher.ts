import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { registerSchemaUser } from "@/lib/schemas/registerSchemaUser";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGet(req, res);
    case "POST":
      return handlePost(req, res);
    case "PUT":
      return handlePut(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// Handle GET request - Retrieve all teachers or teachers by classId
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    const payload = await verifyToken(tokenCookie);
    const schoolId = payload.schoolId;
    const role = payload.role;
    const classIdQuery = req.query.classid;
    let classId: number | undefined = undefined;

    if (typeof classIdQuery === "string") {
      classId = parseInt(classIdQuery, 10);
      if (isNaN(classId)) {
        return res.status(400).json({ error: "Invalid class ID format" });
      }
    } else if (Array.isArray(classIdQuery)) {
      classId = parseInt(classIdQuery[0], 10);
    }

    if (!schoolId) {
      return res.status(400).json({ error: "School ID missing from token" });
    }

    if (role !== "SCHOOL") {
      return res.status(403).json({
        error: "Access denied. You do not have the required permissions.",
      });
    }

    if (classId !== undefined) {
      const users = await prisma.user.findMany({
        where: {
          classId: classId,
          role: Role.TEACHER,
        },
      });
      return res.status(200).json({ users });
    } else {
      // Query all teachers if no classId is provided
      const users = await prisma.user.findMany({
        where: {
          role: Role.TEACHER,
          schoolId: schoolId,
        },
      });

      return res.status(200).json({ users });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle POST request - Add a new teacher
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the incoming request body
    const data = registerSchemaUser.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Check for authorization token
    const tokenCookie = req.cookies.session;
    if (!tokenCookie) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Verify the token
    const payload = await verifyToken(tokenCookie);
    const schoolId = payload.schoolId;

    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (!schoolId) {
      return res.status(400).json({ error: "School ID is required" });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
        school: { connect: { id: schoolId } },
        role: Role.TEACHER,
      },
    });

    // Send response
    res.status(201).json({ user });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

// Handle PUT request - Update an existing teacher
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10);
  const { classId } = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (typeof classId === "undefined") {
      return res.status(400).json({ error: "classId is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        classId: classId,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
