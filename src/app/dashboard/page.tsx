"use client";
import AdminDashboard from "@/components/AdminDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);


    const renderDashboard = () => {
        if (!user) {
            return (
                 <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                    <p>Redirecting to login...</p>
                 </div>
            );
        }
        switch (user.role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'HOD':
                return <HodDashboard />;
            case 'Faculty':
                return <FacultyDashboard />;
            case 'Student':
                return <StudentDashboard />;
            default:
                 router.push('/login');
                 return null;
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            {renderDashboard()}
        </div>
    )
}
