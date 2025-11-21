"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/Button";

export function LoginButton() {
  return (
    <Button 
      variant="secondary" 
      onClick={() => signIn("google", { callbackUrl: "/gym" })}
    >
      Sign In
    </Button>
  );
}
