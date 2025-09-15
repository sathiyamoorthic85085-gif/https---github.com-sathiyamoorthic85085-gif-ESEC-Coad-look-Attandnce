"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to ChromaGrade</CardTitle>
          <CardDescription>
            Please contact an administrator to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-sm text-muted-foreground">
                Registration is currently handled by the administration to ensure proper role and department assignment.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
