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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole, Department } from '@/lib/types';
import { mockDepartments } from '@/lib/mock-data';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole | "">("");
    const [department, setDepartment] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [registerNumber, setRegisterNumber] = useState("");
    
    const { addUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = (value: UserRole | "") => {
        setRole(value);
        if (value !== 'Student') {
            setRollNumber("");
            setRegisterNumber("");
        } else {
            setPassword(rollNumber);
        }
    }

    const handleRollNumberChange = (value: string) => {
        setRollNumber(value);
        if (role === 'Student') {
            setPassword(value);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isFormValid = name && email && role && password;
        if (role === 'Student') {
            isFormValid = isFormValid && rollNumber && registerNumber;
        }
        if (role !== 'Admin' && !department) {
            isFormValid = false;
        }

        if (!isFormValid) {
            toast({
                title: "Missing Information",
                description: "Please fill out all required fields.",
                variant: "destructive",
            });
            return;
        }
        
        setIsLoading(true);

        const newUser = {
            name,
            email,
            password,
            role: role as UserRole,
            department: role === 'Admin' ? 'Administration' : department,
            rollNumber: role === 'Student' ? rollNumber : undefined,
            registerNumber: role === 'Student' ? registerNumber : undefined,
        };

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        setIsLoading(false);

        if (response.ok) {
            const { user: addedUser } = await response.json();
            addUser(addedUser); // Update context state
            toast({ title: 'Registration Successful', description: 'Please log in with your new credentials.' });
            router.push('/login');
        } else {
            const error = await response.json();
            toast({ title: 'Registration Failed', description: error.message, variant: 'destructive'})
        }
    };

    return (
        <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Join ChromaGrade by filling out the form below.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value) => handleRoleChange(value as UserRole | "")}>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Faculty">Faculty</SelectItem>
                                    <SelectItem value="HOD">HOD</SelectItem>
                                    <SelectItem value="Advisor">Advisor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {role === 'Student' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rollNumber">Roll Number</Label>
                                    <Input id="rollNumber" value={rollNumber} onChange={e => handleRollNumberChange(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registerNumber">Register Number</Label>
                                    <Input id="registerNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {role && role !== 'Student' && (
                             <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        )}

                        {role && role !== 'Admin' && (
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select value={department} onValueChange={setDepartment} required>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {mockDepartments.map((dep) => (
                                        <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground pt-2">
                            {role === 'Student' ? 'Your password will be your Roll Number.' : 'Please choose a secure password.'}
                        </p>

                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Register'}
                        </Button>
                         <p className="text-xs text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="underline hover:text-primary">Login here</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
