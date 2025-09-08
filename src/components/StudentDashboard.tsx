"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Check, User, X, Bell, Shirt, Settings } from "lucide-react";
import { ProgressRing } from "./ProgressRing";


export default function StudentDashboard() {
    const { user } = useAuth();

    if (!user || user.role !== 'Student') {
        return <p>You do not have access to this page.</p>;
    }

    const attendanceStats = {
        present: 92,
        absent: 5,
        late: 3,
    };

    const complianceStats = {
        compliant: 95,
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">👋 Hey {user.name.split(' ')[0]} ✨ Ready to shine today?</h1>
                    <p className="text-muted-foreground">Here is your status summary.</p>
                </div>
                <Avatar className="h-12 w-12 border-2 border-primary-pink shadow-neon-pink">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white/90">⏳ My Check-ins</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={attendanceStats.present} label="Present" />
                        <div className="space-y-2 text-center">
                            <p className="text-4xl font-bold text-white">{attendanceStats.present}%</p>
                            <p className="text-sm text-muted-foreground">Present</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white/90">👕 Style Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around gap-4">
                        <ProgressRing value={complianceStats.compliant} label="Compliant" />
                        <div className="space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <Check className="h-8 w-8 text-green-400 drop-shadow-[0_0_5px_rgba(0,255,0,0.7)]" />
                                <p className="text-4xl font-bold text-white">{complianceStats.compliant}%</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Compliance</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-white/90">Notifications</CardTitle>
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

            {/* Bottom Nav Placeholder */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/80 backdrop-blur-xl border-t border-white/10 p-2">
                <div className="container mx-auto flex justify-around">
                    <button className="flex flex-col items-center gap-1 text-primary-pink">
                        <User className="h-6 w-6 drop-shadow-[0_0_5px_hsl(var(--primary-pink))]"/>
                        <span className="text-xs">My Status</span>
                    </button>
                     <button className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Check className="h-6 w-6"/>
                        <span className="text-xs">Check-ins</span>
                    </button>
                     <button className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Shirt className="h-6 w-6"/>
                        <span className="text-xs">Style</span>
                    </button>
                     <button className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Settings className="h-6 w-6"/>
                        <span className="text-xs">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
