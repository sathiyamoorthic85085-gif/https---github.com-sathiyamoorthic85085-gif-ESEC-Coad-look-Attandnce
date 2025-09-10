"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, BarChart2, MessageSquare } from "lucide-react";

export default function AdvisorDashboard() {
    const { user } = useAuth();

    if (!user || (user.role !== 'Advisor' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Advisor Dashboard</h1>
                    <p className="text-muted-foreground">Class: II Year, Section A</p>
                </div>
                 {user && <p className="text-muted-foreground">Welcome, {user.name}</p>}
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
                        <CardTitle className="flex items-center gap-2"><BarChart2 /> Attendance Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Review attendance for your class.</p>
                         <Button className="mt-4" variant="secondary">Generate Report</Button>
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
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Class Attendance Overview</CardTitle>
                    <CardDescription>A quick look at today's attendance.</CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">Class attendance details will be shown here.</p>
                </CardContent>
            </Card>

        </div>
    );
}
