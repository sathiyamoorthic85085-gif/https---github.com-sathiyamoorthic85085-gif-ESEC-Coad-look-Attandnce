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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome, {user.name}</p>
            </div>
            <p>Department: <span className="font-semibold">{user.department}</span></p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Calendar /> View Timetable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Check your weekly class schedule.</p>
                        <Button className="mt-4">View Timetable</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Book /> Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>View and submit your assignments.</p>
                        <Button className="mt-4" variant="secondary"><Upload className="mr-2"/> Upload Assignment</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Circulars</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>View the latest circulars from the college.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
