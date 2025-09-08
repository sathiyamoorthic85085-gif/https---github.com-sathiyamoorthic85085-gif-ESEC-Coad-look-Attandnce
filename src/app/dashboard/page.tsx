"use client";
import AdminDashboard from "@/components/AdminDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";


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
                 <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
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

    if (!user) {
        return renderDashboard();
    }

    return (
        <DashboardLayout>
            {renderDashboard()}
        </DashboardLayout>
    )
}
