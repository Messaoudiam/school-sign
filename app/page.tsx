"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Link href="/school-login">
        <Button>Login</Button>
      </Link>

      <Link href="/school-register">
        <Button>Register</Button>
      </Link>
    </div>
  );
}
