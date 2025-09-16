
"use client";

import React, { useState, useMemo } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import TimetableGrid from "@/components/TimetableGrid";
import { mockTimetables, mockDepartments } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Timetable } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function DepartmentTimetablePage() {
    const { user } = useAuth();
    // Default to user's department if HOD, otherwise the first department
    const initialDepartmentId = useMemo(() => {
        if (user?.role === 'HOD' && user.department) {
            return mockDepartments.find(d => d.name === user.department)?.id || mockDepartments[0].id;
        }
        return mockDepartments[0].id;
    }, [user]);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(initialDepartmentId);

    const timetableForDepartment = useMemo<Timetable | undefined>(() => {
        return mockTimetables.find(t => t.departmentId === selectedDepartmentId);
    }, [selectedDepartmentId]);
    
    const departmentName = mockDepartments.find(d => d.id === selectedDepartmentId)?.name;

    return (
        <DashboardLayout>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Department Timetable</h2>
                        <p className="text-muted-foreground">View and manage timetables for different departments.</p>
                    </div>
                    {(user?.role === 'Admin' || user?.role === 'HOD') && (
                         <div className="w-full md:w-64">
                            <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDepartments.map(dep => (
                                        <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Timetable for {departmentName}</CardTitle>
                        <CardDescription>
                            Weekly schedule for the selected department.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {timetableForDepartment ? (
                            <TimetableGrid schedule={timetableForDepartment.schedule} />
                        ) : (
                            <div className="flex items-center justify-center h-48">
                                <p className="text-muted-foreground">No timetable found for this department.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
