
"use client";

import { useState, useTransition, useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, BarChart2, MessageSquare, Loader2, FileText, Shield, Download, Upload } from "lucide-react";
import { mockAttendanceData, mockTimetables } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { summarizeAttendanceReport } from '@/ai/flows/summarize-attendance-report';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/report-utils";
import { AttendanceRecord, Timetable } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';


interface AdvisorDashboardProps {
    isPreview?: boolean;
}

export default function AdvisorDashboard({ isPreview = false }: AdvisorDashboardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const timetableInputRef = useRef<HTMLInputElement>(null);

    const [report, setReport] = useState<string>('');
    const [reportData, setReportData] = useState<AttendanceRecord[]>([]);
    const [isPending, startTransition] = useTransition();
    const [timetable, setTimetable] = useState<Timetable | null>(mockTimetables.find(t => t.classId === (user?.classId || 'CLS01')) || null);

    const handleGenerateReport = () => {
        startTransition(async () => {
            try {
                // In a real app, you would filter based on the advisor's assigned class.
                // For this mock, we'll just pass a subset of data to the AI.
                const relevantAttendance = mockAttendanceData.slice(0, 5); 
                setReportData(relevantAttendance);
                const reportJson = JSON.stringify(relevantAttendance, null, 2);

                const result = await summarizeAttendanceReport({ attendanceData: reportJson });
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

    const handleTimetableUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && timetable) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImageUrl = e.target?.result as string;
                const updatedTimetable = { ...timetable, imageUrl: newImageUrl };
                setTimetable(updatedTimetable);

                // Update the mock data source for this session
                const ttIndex = mockTimetables.findIndex(t => t.id === timetable.id);
                if (ttIndex !== -1) {
                    mockTimetables[ttIndex].imageUrl = newImageUrl;
                }

                toast({
                    title: 'Timetable Updated',
                    description: 'The class timetable has been successfully updated.',
                });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user && !isPreview) {
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
                        <Button className="mt-4" asChild>
                            <Link href="/dashboard/students">View Students</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare /> Send Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Send messages to your students or parents.</p>
                         <Button className="mt-4" asChild>
                            <Link href="/dashboard/messages">Send Message</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Upload /> Manage Timetable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Upload and update the class timetable.</p>
                         {timetable && <Image src={timetable.imageUrl} alt="Class timetable" width={200} height={100} className="rounded-md my-2" />}
                         <input type="file" ref={timetableInputRef} onChange={handleTimetableUpload} className="hidden" accept="image/*" />
                         <Button className="mt-4 w-full" onClick={() => timetableInputRef.current?.click()}>Upload Timetable</Button>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Attendance Analysis</CardTitle>
                        <CardDescription>Generate an AI-powered summary for your assigned class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <Button className="w-full max-w-xs" onClick={handleGenerateReport} disabled={isPending}>
                                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : <><BarChart2 className="mr-2 h-4 w-4" /> Generate AI Report</>}
                            </Button>
                        </div>
                       
                        {report && (
                            <Card className="bg-background/50 mt-6">
                                <CardHeader>
                                    <CardTitle>AI Summary Report</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report}</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => exportToPDF(reportData, `Attendance Report - ${advisorClass}`)}>
                                            <Download className="mr-2 h-3 w-3" />
                                            PDF
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => exportToExcel(reportData, `Attendance Report - ${advisorClass}`)}>
                                            <Download className="mr-2 h-3 w-3" />
                                            Excel
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => exportToCSV(reportData, `Attendance Report - ${advisorClass}`)}>
                                            <Download className="mr-2 h-3 w-3" />
                                            CSV
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
