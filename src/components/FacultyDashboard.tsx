
"use client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, BellRing, FilePen, Loader2, BarChart2, Download, Shield, CalendarDays } from "lucide-react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { summarizeAttendanceReport } from "@/ai/flows/summarize-attendance-report";
import { mockAttendanceData, mockTimetables } from "@/lib/mock-data";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/report-utils";
import { AttendanceRecord, Timetable } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";

interface FacultyDashboardProps {
    isPreview?: boolean;
}


export default function FacultyDashboard({ isPreview = false }: FacultyDashboardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [report, setReport] = useState<string>('');
    const [reportData, setReportData] = useState<AttendanceRecord[]>([]);
    const [isPending, startTransition] = useTransition();

    const currentUser = isPreview ? { name: 'Admin Preview', department: 'Computer Science', role: 'Faculty' } : user;

    if (!currentUser || (currentUser.role !== 'Faculty' && currentUser.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const department = currentUser.department || 'All Departments';
    const timetable = mockTimetables.find(t => t.departmentId === currentUser?.department);


    const handleGenerateReport = () => {
        startTransition(async () => {
            try {
                // In a real app, you'd filter by the faculty's students/classes
                const relevantData = mockAttendanceData.filter(d => 
                    user?.role === 'Admin' || d.userId.startsWith('STU') // Simplified for mock
                ).slice(0, 10);
                
                setReportData(relevantData);
                const reportJson = JSON.stringify(relevantData, null, 2);

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


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {isPreview && (
                <Alert className="mb-4 border-accent">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Admin Preview</AlertTitle>
                    <AlertDescription>
                        You are currently viewing the Faculty Dashboard as an administrator.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mentors Dashboard</h1>
                    <p className="text-muted-foreground">Department: {department}</p>
                </div>
                {currentUser && <p className="text-muted-foreground">Welcome, {currentUser.name}</p>}
            </div>

             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FilePen /> Create Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Create and assign work to your classes.</p>
                        <Button className="mt-4">Create</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BellRing /> Upcoming Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border-l-4 border-primary pl-4">
                            <p className="font-semibold">CS101 - Intro to Programming</p>
                            <p className="text-sm text-muted-foreground">10:00 AM - Room 304</p>
                        </div>
                         <div className="mt-4 border-l-4 border-accent pl-4">
                            <p className="font-semibold">CS202 - Data Structures</p>
                            <p className="text-sm text-muted-foreground">1:00 PM - Room 210</p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {timetable ? (
                            <Image src={timetable.imageUrl} alt="Department timetable" width={250} height={150} className="rounded-lg" />
                        ) : (
                            <p className="text-sm text-muted-foreground">No timetable uploaded for this department yet.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Attendance Analysis</CardTitle>
                        <CardDescription>Generate an AI-powered summary for students in your department.</CardDescription>
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
                                        <Button variant="outline" size="sm" onClick={() => exportToPDF(reportData, `Attendance Report - ${department}`)}>
                                            <Download className="mr-2 h-3 w-3" />
                                            PDF
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => exportToExcel(reportData, `Attendance Report - ${department}`)}>
                                            <Download className="mr-2 h-3 w-3" />
                                            Excel
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => exportToCSV(reportData, `Attendance Report - ${department}`)}>
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
