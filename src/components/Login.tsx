"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export default function Login() {
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const [loginEmail, setLoginEmail] = useState("sathiyamoorthi.c85085@gmail.com");
  const [loginPassword, setLoginPassword] = useState("1234567890");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("Admin");

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Login Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    if (!regName || !regEmail || !regPassword || !regRole) {
        toast({ title: 'Missing fields', description: 'Please fill all fields', variant: 'destructive'})
        setIsRegistering(false);
        return;
    }

    try {
        const success = await register({
            name: regName,
            email: regEmail,
            password: regPassword,
            role: regRole,
            department: regRole === 'Student' ? 'Computer Science' : 'Administration',
        });

        if (success) {
            toast({ title: 'Registration Successful', description: 'You can now log in.'});
        } else {
             toast({ title: 'Registration Failed', description: 'A user with this email may already exist.', variant: 'destructive'});
        }

    } catch (error) {
        toast({ title: 'Registration Error', description: 'An unexpected error occurred.', variant: 'destructive'});
    } finally {
        setIsRegistering(false);
    }
  }


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to ChromaGrade</CardTitle>
        <CardDescription>
          Login or Register to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input id="reg-name" placeholder="John Doe" required value={regName} onChange={e => setRegName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="m@example.com" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input id="reg-password" type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reg-role">Role</Label>
                    <Select value={regRole} onValueChange={(v) => setRegRole(v as UserRole)}>
                        <SelectTrigger id="reg-role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="HOD">HOD</SelectItem>
                            <SelectItem value="Faculty">Faculty</SelectItem>
                            <SelectItem value="Advisor">Advisor</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
