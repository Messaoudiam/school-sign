import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { createToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { loginSchoolSchema } from "@/lib/schemas/login.school.schema";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = loginSchoolSchema.parse(req.body);

      const user = await prisma.school.findUnique({
        where: { email },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = await createToken({ userId: user.id });

        const cookie = serialize("session", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          path: "/",
        });

        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
