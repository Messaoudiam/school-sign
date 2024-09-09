"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Link href="/login">
        <Button>Login</Button>
      </Link>

      <Link href="/register">
        <Button>Register</Button>
      </Link>
    </div>
  );
}
