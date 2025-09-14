"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Login() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to ChromaGrade</CardTitle>
        <CardDescription>
          Please use the authentication mechanism provided by Stack to log in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Authentication is managed by Stack Auth.
        </p>
        <Button asChild className="w-full mt-4">
          <Link href="/dashboard">Proceed to Dashboard (Authenticated)</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
