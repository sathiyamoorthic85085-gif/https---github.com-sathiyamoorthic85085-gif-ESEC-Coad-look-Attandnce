"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, Bell } from "lucide-react";
import { ProgressRing } from "./ProgressRing";


export default function StudentDashboard() {
    const { user } = useAuth();

    if (!user || (user.role !== 'Student' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const userName = user ? user.name.split(' ')[0] : 'Student';
    const userImage = user ? user.imageUrl : '';


    const attendanceStats = {
        present: 92,
        absent: 5,
        late: 3,
    };

    const complianceStats = {
        compliant: 95,
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">👋 Hey {userName}, ready for class today?</h1>
                    <p className="text-muted-foreground">Here is your status summary.</p>
                </div>
                <Avatar className="h-12 w-12 border-2 border-primary-orange shadow-neon-orange">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback>{userName?.[0]}</AvatarFallback>
                </Avatar>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>⏳ My Check-ins</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={attendanceStats.present} label="Present" />
                        <div className="space-y-2 text-center">
                            <p className="text-4xl font-bold">{attendanceStats.present}%</p>
                            <p className="text-sm text-muted-foreground">Present</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>👕 Style Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={complianceStats.compliant} label="Compliant" />
                        <div className="space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <Check className="h-8 w-8 text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.7)]" />
                                <p className="text-4xl font-bold">{complianceStats.compliant}%</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Compliance</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                         <Bell className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(255,255,0,0.7)]"/>
                         <div>
                            <p className="font-semibold text-white/80">Assignment Due</p>
                            <p className="text-xs text-muted-foreground">Your "Data Structures" assignment is due tomorrow.</p>
                         </div>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
