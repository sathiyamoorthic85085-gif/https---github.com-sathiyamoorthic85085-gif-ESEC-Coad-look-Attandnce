"use server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/lib/types';
import AdminDashboard from "@/components/AdminDashboard";
import AdvisorDashboard from "@/components/AdvisorDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import DashboardLayout from "@/components/DashboardLayout";

// This is a server component that will redirect based on role
export default async function DashboardPage() {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');

    if (!userCookie) {
        redirect('/login');
    }

    try {
        const user: User = JSON.parse(userCookie.value);

        switch (user.role) {
            case 'Admin':
                redirect('/dashboard/admin');
            case 'HOD':
                redirect('/dashboard/hod');
            case 'Faculty':
                redirect('/dashboard/faculty');
            case 'Student':
                redirect('/dashboard/student');
            case 'Advisor':
                redirect('/dashboard/advisor');
            default:
                redirect('/login');
        }
    } catch (error) {
        console.error("Failed to parse user cookie:", error);
        redirect('/login');
    }

}
