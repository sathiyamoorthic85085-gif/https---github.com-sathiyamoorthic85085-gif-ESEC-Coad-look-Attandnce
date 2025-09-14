
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/types";


export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("abhiruben2402@gmail.com");
  const [loginPassword, setLoginPassword] = useState("123456");
  
  // Signup State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole | "">("");

  
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing fields",
        description: "Please provide email and password.",
        variant: "destructive",
      });
      return;
    }
    setIsLoggingIn(true);

    const success = await login(loginEmail, loginPassword);
    
    if (success) {
        toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
        });
        router.push("/dashboard");
    } else {
        toast({
            title: "Login Failed",
            description: "Invalid email or password.",
            variant: "destructive",
        });
    }
    setIsLoggingIn(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsSigningUp(false);
      return;
    }

    const newUser = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
    };

    try {
      const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
          toast({
              title: "Registration Complete",
              description: "You can now log in with your credentials.",
          });
          // Optionally, switch to the login tab
      } else {
          toast({
              title: "Registration Failed",
              description: data.message || "Could not create user.",
              variant: 'destructive',
          });
      }
    } catch (error) {
       toast({
            title: "Registration Failed",
            description: "An unexpected error occurred.",
            variant: 'destructive',
        });
    }
    
    setIsSigningUp(false);
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="m@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                <LogIn className="mr-2 h-4 w-4" />
                {isLoggingIn ? "Logging In..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new account to get started.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input id="register-name" placeholder="John Doe" required value={signupName} onChange={(e) => setSignupName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="register-role">Role</Label>
                <Select required value={signupRole} onValueChange={(value) => setSignupRole(value as UserRole | "")}>
                    <SelectTrigger id="register-role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="Advisor">Advisor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
