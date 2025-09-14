"use client";
import { SignIn } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
       <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <CardTitle>Welcome to ChromaGrade</CardTitle>
            <CardDescription>Please sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
            <SignIn />
        </CardContent>
       </Card>
    </div>
  );
}
