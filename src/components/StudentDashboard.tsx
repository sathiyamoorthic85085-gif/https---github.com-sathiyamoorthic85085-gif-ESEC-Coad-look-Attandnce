"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Book, Calendar, Upload } from "lucide-react";
import { Button } from "./ui/button";

export default function StudentDashboard() {
    const { user } = useAuth();

    if (!user || user.role !== 'Student') {
        return <p>You do not have access to this page.</p>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user.name}</p>
            </div>
            <p>Department: <span className="font-semibold">{user.department}</span></p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar /> View Timetable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Check your weekly class schedule.</p>
                        <Button className="mt-4">View Timetable</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Book /> Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">View and submit your assignments.</p>
                        <Button className="mt-4" variant="secondary"><Upload className="mr-2 h-4 w-4"/> Upload Assignment</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Circulars</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">No new circulars.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
