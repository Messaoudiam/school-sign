"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// zod
import { loginSchoolSchema } from "@/lib/schemas/login.school.schema";
import { z } from "zod";

// ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginSchoolForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchoolSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err: z.ZodIssue) => err.message)
        .join(", ");
      alert(errorMessage);
      return;
    }

    try {
      const res = await fetch("/api/login.school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Connexion réussie");
        router.push("/");
      } else {
        alert("Email ou mot de passe invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <div className=" w-96 flex flex-col p-4">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your school account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
