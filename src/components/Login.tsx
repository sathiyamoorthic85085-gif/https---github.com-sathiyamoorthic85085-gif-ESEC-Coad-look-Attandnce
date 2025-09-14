"use client";

import { SignIn } from "@stackframe/stack";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Welcome to ChromaGrade</CardTitle>
        <CardDescription>
          Please use the authentication mechanism provided by Stack to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn />
      </CardContent>
    </Card>
  );
}
