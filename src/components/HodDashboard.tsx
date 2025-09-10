

"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LineChart, Upload, Shield, Users, UserCheck, CalendarClock, Newspaper, Files } from "lucide-react";
import { mockDepartments } from "@/lib/mock-data";
import React, { useMemo } from "react";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { DashboardActionCard } from "./DashboardActionCard";

interface HodDashboardProps {
    isPreview?: boolean;
}

export default function HodDashboard({ isPreview = false }: HodDashboardProps) {
    const { user } = useAuth();
    
    const currentUser = isPreview ? { name: 'Admin Preview', department: 'Computer Science', role: 'HOD' } : user;
    const hodDepartmentName = currentUser?.department;
    
    const departmentForDialog = useMemo(() => 
        mockDepartments.find(d => d.name === hodDepartmentName),
        [hodDepartmentName]
    );

    if (!currentUser || (currentUser.role !== 'HOD' && !isPreview)) {
        return <p>You do not have access to this page.</p>;
    }
    
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {isPreview && (
                <Alert className="mb-4 border-accent">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Admin Preview</AlertTitle>
                    <AlertDescription>
                        You are currently viewing the HOD Dashboard as an administrator.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">🏛️ Welcome, {currentUser.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Managing the {hodDepartmentName} Department.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <DashboardActionCard 
                    title="Student Management"
                    description="View and manage all students in your department."
                    icon={<Users />}
                    href="/dashboard/students"
                />
                <DashboardActionCard 
                    title="Faculty Management"
                    description="View and manage all faculty members."
                    icon={<UserCheck />}
                    href="#"
                />
                 <DashboardActionCard 
                    title="Department Attendance"
                    description="Live overview of today's attendance records."
                    icon={<CalendarClock />}
                    href="/dashboard/attendance"
                />
                 <DashboardActionCard 
                    title="Attendance Reports"
                    description="Generate and view AI-powered attendance summaries."
                    icon={<LineChart />}
                    href="#"
                />
                <DashboardActionCard 
                    title="Department Timetable"
                    description="Manage schedules for all classes."
                    icon={<Newspaper />}
                    href="#"
                />
                <DashboardActionCard 
                    title="Department Circulars"
                    description="Post circulars and announcements for the department."
                    icon={<Newspaper />}
                    href="#"
                />
                <DashboardActionCard 
                    title="Data Upload"
                    description="Bulk upload student or faculty information."
                    icon={<Files />}
                    href="#"
                />
            </div>
        </div>
    );
}
