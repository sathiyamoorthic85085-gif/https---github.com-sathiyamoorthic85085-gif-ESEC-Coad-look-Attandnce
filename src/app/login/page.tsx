"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        const foundUser = mockUsers.find(
            (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );

        if (foundUser) {
            toast({
                title: 'Login Successful',
                description: `Welcome back, ${foundUser.name}!`,
            });
            // In a real app, you would set a session token here.
            // For this mock, we'll just redirect to the dashboard.
            // The AuthContext will pick up the user based on a simulated "logged in" state.
             router.push('/dashboard');
        } else {
             toast({
                title: 'Login Failed',
                description: 'Invalid email or password. Please try again.',
                variant: 'destructive',
            });
        }
    };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to ChromaGrade</CardTitle>
          <CardDescription>
            Please sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="user@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
