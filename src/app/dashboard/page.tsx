
"use client";

import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";
import AdvisorDashboard from "@/components/AdvisorDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user: authUser, isLoading } = useAuth();

  if (isLoading) {
    return (
       <DashboardLayout>
            <div className="flex h-full items-center justify-center">
                <p>Loading...</p>
            </div>
      </DashboardLayout>
    );
  }

  if (!authUser) {
    redirect("/login");
    return null;
  }

  const renderDashboard = () => {
    switch (authUser?.role) {
      case "Admin":
        return <AdminDashboard />;
      case "HOD":
        return <HodDashboard />;
      case "Faculty":
        return <FacultyDashboard />;
      case "Student":
        return <StudentDashboard />;
      case "Advisor":
        return <AdvisorDashboard />;
      default:
        return <p>No dashboard assigned for your role.</p>;
    }
  };

  return (
    <DashboardLayout>
        {renderDashboard()}
    </DashboardLayout>
  )
}
