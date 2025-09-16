
"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, Bell, Shield, CalendarDays, X, AlertCircle } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { mockTimetables, mockAttendanceData } from "@/lib/mock-data";
import { PeriodAttendance } from "@/lib/types";
import { Badge } from "./ui/badge";

interface StudentDashboardProps {
    isPreview?: boolean;
}

export default function StudentDashboard({ isPreview = false }: StudentDashboardProps) {
    const { user } = useAuth();
    
    const currentUser = isPreview ? { name: 'Admin Preview', imageUrl: '', role: 'Student', classId: 'CLS01', id: 'STU001' } : user;

    if (!currentUser || (currentUser.role !== 'Student' && currentUser.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const userName = currentUser ? currentUser.name.split(' ')[0] : 'Student';
    const userImage = currentUser ? currentUser.imageUrl : '';
    const timetable = mockTimetables.find(t => t.classId === currentUser.classId);
    
    const studentAttendance = mockAttendanceData.find(att => att.userId === currentUser.id);

    const overallAttendance = studentAttendance ? 
        (studentAttendance.periods.filter(p => p.status !== 'Absent').length / studentAttendance.periods.length) * 100 
        : 0;
        
    const overallCompliance = studentAttendance ?
        (studentAttendance.periods.filter(p => p.status === 'Compliant').length / studentAttendance.periods.filter(p => p.status !== 'Absent').length) * 100
        : 0;

    const getStatusIcon = (status: PeriodAttendance['status']) => {
        switch(status) {
            case 'Compliant': return <Check className="h-5 w-5 text-green-400" />;
            case 'Non-Compliant': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
            case 'Absent': return <X className="h-5 w-5 text-red-500" />;
            default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
        }
    }


    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 pt-6">
             {isPreview && (
                <Alert className="mb-4 border-accent">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Admin Preview</AlertTitle>
                    <AlertDescription>
                        You are currently viewing the Student Dashboard as an administrator.
                    </AlertDescription>
                </Alert>
            )}
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
             <Alert variant="default" className="bg-primary/10 border-primary/20">
                <Bell className="h-4 w-4" />
                <AlertTitle>Class Notification</AlertTitle>
                <AlertDescription>
                    Prof. Peter Jones will be on leave for the Data Structures class today. Prof. Michael Wilson will be taking the class as substitution.
                </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>⏳ My Attendance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={overallAttendance} label={`${Math.round(overallAttendance)}%`} />
                        <div className="space-y-1 text-center">
                            <p className="text-4xl font-bold">{Math.round(overallAttendance)}%</p>
                            <p className="text-sm text-muted-foreground">Overall Present</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle>👕 Style Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={overallCompliance} label={`${Math.round(overallCompliance)}%`} />
                        <div className="space-y-1 text-center">
                           <p className="text-4xl font-bold">{Math.round(overallCompliance)}%</p>
                            <p className="text-sm text-muted-foreground">Compliance</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                         <CardDescription>Latest alerts and updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                         <Bell className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(255,255,0,0.7)]"/>
                         <div>
                            <p className="font-semibold text-foreground/80">Assignment Due</p>
                            <p className="text-xs text-muted-foreground">Your "Data Structures" assignment is due tomorrow.</p>
                         </div>
                       </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                       {timetable && timetable.schedule ? (
                           <div className="w-full space-y-2">
                               {timetable.schedule.slice(0, 4).map(period => {
                                   const attendancePeriod = studentAttendance?.periods.find(p => p.period === period.period);
                                   const status = attendancePeriod?.status || 'Pending';
                                   return (
                                     <div key={period.period} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                                       <div className="flex items-center gap-4">
                                            {getStatusIcon(status)}
                                            <div>
                                                <p className="font-semibold">{period.subject}</p>
                                                <p className="text-xs text-muted-foreground">{period.faculty} • {period.time}</p>
                                            </div>
                                       </div>
                                       <Badge variant={status === 'Compliant' ? 'default' : 'secondary'}>
                                            {status}
                                       </Badge>
                                   </div>
                                )})}
                           </div>
                       ) : (
                           <p className="text-muted-foreground text-center py-8">Your advisor has not uploaded the timetable yet.</p>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
