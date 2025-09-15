"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(identifier, password);
      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        router.push('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
       toast({
          title: "An Error Occurred",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
       <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <CardTitle>Welcome to ChromaGrade</CardTitle>
            <CardDescription>Please sign in to access your dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Roll Number</Label>
                    <Input 
                        id="identifier" 
                        placeholder="your@email.com or ES24EI01" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/register" className="underline hover:text-primary">Register here</Link>
                </p>
            </CardFooter>
        </form>
       </Card>
    </div>
  );
}
