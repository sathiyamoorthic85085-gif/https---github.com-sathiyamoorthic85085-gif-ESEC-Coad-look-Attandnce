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

export default function HodDashboard() {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);

    if (!user || user.role !== 'HOD') {
        return <p>You do not have access to this page.</p>;
    }
    
    const departmentUsers = mockUsers.filter(u => u.department === user.department);
    const departmentAttendance = attendanceData.filter(a => departmentUsers.some(u => u.id === a.userId));


    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">HOD Dashboard</h1>
                    <p className="text-muted-foreground">Department: {user.department}</p>
                </div>
                <p className="text-muted-foreground">Welcome, {user.name}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><UserPlus /> Manage Faculty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Add or remove faculty from your department.</p>
                        <Button className="mt-4">Manage</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BookCopy /> Assign Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Assign subjects to faculty members.</p>
                         <Button className="mt-4" variant="secondary">Assign</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><FileText /> Department Circulars</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Post circulars for your department.</p>
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
