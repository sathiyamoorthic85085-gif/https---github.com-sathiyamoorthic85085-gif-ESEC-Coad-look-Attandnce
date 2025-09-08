"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { UserPlus, BookCopy, FileText } from "lucide-react";
import { mockAttendanceData, mockUsers } from "@/lib/mock-data";
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function HodDashboard() {
    const { user } = useAuth();
    const [attendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);

    if (!user || user.role !== 'HOD') {
        return <p>You do not have access to this page.</p>;
    }
    
    const departmentUsers = mockUsers.filter(u => u.department === user.department);
    const departmentAttendance = attendanceData.filter(a => departmentUsers.some(u => u.id === a.userId));


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">🏛️ Welcome, {user.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Managing the {user.department} Department.</p>
                </div>
                 <Avatar className="h-12 w-12 border-2 border-primary-pink shadow-neon-pink">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserPlus /> Manage Mentors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Add or remove mentors from your department.</p>
                        <Button className="mt-4">Manage</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookCopy /> Assign Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Assign subjects to faculty members.</p>
                         <Button className="mt-4" variant="secondary">Assign</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Department Circulars</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Post circulars for your department.</p>
                         <Button className="mt-4" variant="outline">Create</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Department Attendance</CardTitle>
                    <CardDescription>Attendance records for the {user.department} department.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Status</TableHead>
                             <TableHead>Role</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {departmentAttendance.map((record) => {
                            const userRecord = departmentUsers.find(u => u.id === record.userId);
                            return (
                                <TableRow key={record.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                    <Image
                                        src={record.imageUrl}
                                        alt={record.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                        data-ai-hint="person photo"
                                    />
                                    <div>
                                        <div className="font-medium">{record.name}</div>
                                        <div className="text-sm text-muted-foreground">{record.userId}</div>
                                    </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={record.status === 'Compliant' ? 'default' : 'destructive'}>{record.status}</Badge>
                                </TableCell>
                                <TableCell>
                                     <Badge variant="secondary">{userRecord?.role}</Badge>
                                </TableCell>
                                <TableCell>{record.date}</TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
