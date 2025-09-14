"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function Login() {
  return (
     <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
                Login and Registration
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Under Construction</AlertTitle>
                <AlertDescription>
                    The authentication system needs to be integrated with your external provider (e.g., Stack Auth, Firebase Auth, Clerk). Please use the provider's frontend SDKs and JWT verification methods to complete the implementation. The previous custom authentication code has been removed.
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
  );
}
