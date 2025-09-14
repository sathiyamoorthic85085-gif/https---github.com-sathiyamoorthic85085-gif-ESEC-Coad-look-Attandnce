"use client";

import { useUser } from "@stackframe/stack";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import AdvisorDashboard from "@/components/AdvisorDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const stackAuth = useUser();
  const isLoading = stackAuth?.isLoading;
  const stackUser = stackAuth?.user;
  const { user: authUser, setUser } = useAuth();

  useEffect(() => {
    if (!isLoading && stackUser) {
      const userRole = (stackUser.publicMetadata as any)?.role;
      if (userRole && (!authUser || authUser.id !== stackUser.id || authUser.role !== userRole)) {
        setUser({
          id: stackUser.id,
          name: stackUser.displayName || stackUser.primaryEmail?.email || "User",
          email: stackUser.primaryEmail?.email || "",
          role: userRole,
          imageUrl: stackUser.avatarUrl || `https://picsum.photos/seed/${stackUser.id}/100/100`,
          // The following are mock values and should be populated from your DB
          department: (stackUser.publicMetadata as any)?.department || "Computer Science",
          classId: (stackUser.publicMetadata as any)?.classId || "CLS01",
          rollNumber: (stackUser.publicMetadata as any)?.rollNumber || "ES24EIXX",
        });
      }
    }
  }, [stackUser, isLoading, authUser, setUser]);

  if (isLoading || !authUser) {
    return (
       <DashboardLayout>
            <div className="flex h-full items-center justify-center">
                <p>Loading...</p>
            </div>
      </DashboardLayout>
    );
  }

  if (!stackUser) {
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
