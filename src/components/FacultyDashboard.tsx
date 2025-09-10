"use client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, BellRing, FilePen, Loader2, BarChart2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { summarizeAttendanceReport } from "@/ai/flows/summarize-attendance-report";
import { mockAttendanceData } from "@/lib/mock-data";

export default function FacultyDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [report, setReport] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    if (!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const department = user.role === 'Admin' ? 'All Departments' : user.department;

    const handleGenerateReport = () => {
        startTransition(async () => {
            try {
                // In a real app, you'd filter by the faculty's students/classes
                const relevantData = mockAttendanceData.filter(d => 
                    user.role === 'Admin' || d.userId.startsWith('USR') // Simplified for mock
                ).slice(0, 10);
                
                const reportData = JSON.stringify(relevantData, null, 2);

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


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mentors Dashboard</h1>
                    <p className="text-muted-foreground">Department: {department}</p>
                </div>
                {user && <p className="text-muted-foreground">Welcome, {user.name}</p>}
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
                        <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">No new notifications.</p>
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
