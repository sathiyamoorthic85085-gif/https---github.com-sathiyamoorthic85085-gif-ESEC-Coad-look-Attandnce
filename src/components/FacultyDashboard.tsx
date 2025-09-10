"use client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, BellRing, FilePen } from "lucide-react";

export default function FacultyDashboard() {
    const { user } = useAuth();

    if (!user || (user.role !== 'Faculty' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const department = user.role === 'Admin' ? 'All Departments' : user.department;


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
            </div>
        </div>
    );
}
