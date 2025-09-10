"use client";

import { useState, useTransition } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, BarChart2, MessageSquare, Loader2, FileText, Building, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockAttendanceData, mockClasses, mockDepartments } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { summarizeAttendanceReport } from '@/ai/flows/summarize-attendance-report';
import type { Department, Class } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Shield } from 'lucide-react';

interface AdvisorDashboardProps {
    isPreview?: boolean;
}

export default function AdvisorDashboard({ isPreview = false }: AdvisorDashboardProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [report, setReport] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const handleDepartmentChange = (departmentId: string) => {
        setSelectedDepartment(departmentId);
        setSelectedClass('');
        setReport('');
        const classesForDept = mockClasses.filter(c => c.departmentId === departmentId);
        setFilteredClasses(classesForDept);
    };

    const handleGenerateReport = () => {
        if (!selectedClass) {
            toast({
                title: 'Selection Required',
                description: 'Please select a department and a class to generate a report.',
                variant: 'destructive',
            });
            return;
        }

        startTransition(async () => {
            try {
                // In a real app, you would filter based on classId associated with users in mockAttendanceData
                // For this mock, we'll just pass a subset of data to the AI.
                const relevantAttendance = mockAttendanceData.slice(0, 5); 
                const reportData = JSON.stringify(relevantAttendance, null, 2);

                const result = await summarizeAttendanceReport({ attendanceData: reportData });
                setReport(result.summary);
                toast({
                    title: 'Report Generated',
                    description: 'The attendance summary has been successfully created.',
                });
            } catch (error) {
                console.error("Failed to generate report:", error);
                toast({
                    title: 'Generation Failed',
                    description: 'There was an error generating the report.',
                    variant: 'destructive',
                });
            }
        });
    };

    if (!user || (!isPreview && user.role !== 'Advisor' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const advisorUser = isPreview ? { name: 'Admin Preview', department: 'Computer Science' } : user;
    const advisorClass = isPreview ? 'II Year, Section A' : 'Your Assigned Class';


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
             {isPreview && (
                <Alert className="mb-4 border-accent">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Admin Preview</AlertTitle>
                    <AlertDescription>
                        You are currently viewing the Advisor Dashboard as an administrator.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Advisor Dashboard</h1>
                    <p className="text-muted-foreground">Class: {advisorClass}</p>
                </div>
                 {advisorUser && <p className="text-muted-foreground">Welcome, {advisorUser.name}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Manage Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">View and manage students in your class.</p>
                        <Button className="mt-4">View Students</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Send Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Send messages to your students or parents.</p>
                         <Button className="mt-4" variant="outline">Send Message</Button>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Generate Attendance Report</CardTitle>
                        <CardDescription>Select a department and class to generate an AI-powered summary.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block"><Building className="inline-block mr-2 h-4 w-4" />Department</label>
                                <Select onValueChange={handleDepartmentChange} value={selectedDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockDepartments.map(dep => <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block"><GraduationCap className="inline-block mr-2 h-4 w-4" />Class</label>
                                <Select onValueChange={setSelectedClass} value={selectedClass} disabled={!selectedDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:self-end">
                                <Button className="w-full" onClick={handleGenerateReport} disabled={isPending || !selectedClass}>
                                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <><BarChart2 className="mr-2 h-4 w-4" /> Generate Report</>}
                                </Button>
                            </div>
                        </div>

                        {report && (
                            <Card className="bg-background/50 mt-6">
                                <CardHeader>
                                    <CardTitle>AI Summary Report</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report}</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
