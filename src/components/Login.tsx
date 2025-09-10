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
import { mockDepartments, mockUsers } from "@/lib/mock-data";
import type { Department, User, UserRole } from "@/lib/types";

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole | "">("");
  const [signupDepartment, setSignupDepartment] = useState("");
  const [signupRollNumber, setSignupRollNumber] = useState("");
  const [signupRegisterNumber, setSignupRegisterNumber] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    setTimeout(() => {
        const success = login(loginEmail, loginPassword);
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
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    let isFormValid = signupName && signupEmail && signupRole;
    if (signupRole === 'Student') {
        isFormValid = isFormValid && signupRollNumber && signupRegisterNumber;
    } else {
        isFormValid = isFormValid && signupPassword;
    }

    if (signupRole && signupRole !== 'Admin' && !signupDepartment) {
        isFormValid = false;
    }

    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      setIsSigningUp(false);
      return;
    }

    const newUser: User = {
        id: `USR${(mockUsers.length + 1).toString().padStart(3, '0')}`,
        name: signupName,
        email: signupEmail,
        password: signupRole === 'Student' ? signupRollNumber : signupPassword,
        role: signupRole as UserRole,
        department: signupRole === 'Admin' ? 'Administration' : signupDepartment,
        rollNumber: signupRole === 'Student' ? signupRollNumber : undefined,
        registerNumber: signupRole === 'Student' ? signupRegisterNumber : undefined,
        imageUrl: `https://picsum.photos/seed/USR${(mockUsers.length + 1).toString().padStart(3, '0')}/100/100`,
    };

    mockUsers.push(newUser);
    
    setTimeout(() => {
        setIsSigningUp(false);
        toast({
            title: "Registration Complete",
            description: "You can now log in with your credentials.",
        });
    }, 1500);
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
                <Label htmlFor="login-password">Password or Roll Number</Label>
                <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                <LogIn className="mr-2" />
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
                <Label htmlFor="register-role">Role</Label>
                <Select required value={signupRole} onValueChange={(value) => setSignupRole(value as UserRole)}>
                    <SelectTrigger id="register-role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Advisor">Advisor</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               {signupRole && signupRole !== 'Admin' && (
                <div className="space-y-2">
                    <Label htmlFor="register-department">Department</Label>
                    <Select required value={signupDepartment} onValueChange={setSignupDepartment}>
                        <SelectTrigger id="register-department">
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                        {mockDepartments.map((dep: Department) => (
                            <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
              )}
                {signupRole === 'Student' ? (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="register-roll">Roll Number (Password)</Label>
                        <Input id="register-roll" placeholder="Your Roll Number" required value={signupRollNumber} onChange={e => setSignupRollNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="register-reg">Register Number</Label>
                        <Input id="register-reg" placeholder="Your Register Number" required value={signupRegisterNumber} onChange={e => setSignupRegisterNumber(e.target.value)} />
                    </div>
                </>
              ) : (
                <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input id="register-password" type="password" required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                </div>
              )}
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
