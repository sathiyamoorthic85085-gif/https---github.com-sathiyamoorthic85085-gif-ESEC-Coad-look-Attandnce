"use client";

import * as React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, User, BookUser, FolderKanban, MessageSquare, Calendar, Shirt, FileUp, Settings, LogOut, GraduationCap, Building, Bell, LayoutDashboard } from "lucide-react";
import type { UserRole } from "@/lib/types";

const menuConfig = {
    Admin: [
        { href: '/dashboard', label: 'Admin Dashboard', icon: <Shield /> },
        { href: '/uniform-check', label: 'Uniform Check', icon: <Shirt /> },
        { href: '/dashboard/students', label: 'Manage Students', icon: <Users /> },
        { href: '/dashboard/assignments', label: 'Assignments', icon: <FolderKanban /> },
        { href: '/dashboard/attendance', label: 'Attendance', icon: <Calendar /> },
        { href: '/dashboard-settings', label: 'Profile & Settings', icon: <Settings /> },
        { href: '/dashboard/hod-view', label: 'HOD View', icon: <Building /> },
        { href: '/dashboard/faculty-view', label: 'Faculty View', icon: <User /> },
        { href: '/dashboard/student-view', label: 'Student View', icon: <LayoutDashboard /> },
        { href: '/dashboard/advisor-view', label: 'Advisor View', icon: <BookUser /> },
    ],
    HOD: [
        { href: '/dashboard', label: 'HOD Dashboard', icon: <Building /> },
        { href: '/uniform-check', label: 'Uniform Check', icon: <Shirt /> },
        { href: '/dashboard-settings', label: 'Profile & Settings', icon: <Settings /> },
    ],
    Faculty: [
        { href: '/dashboard', label: 'Mentor Dashboard', icon: <User /> },
        { href: '/dashboard/assignments', label: 'Assignments', icon: <FolderKanban /> },
        { href: '/uniform-check', label: 'Uniform Check', icon: <Shirt /> },
        { href: '/dashboard-settings', label: 'Profile & Settings', icon: <Settings /> },
    ],
    Student: [
        { href: '/dashboard', label: 'My Status', icon: <LayoutDashboard /> },
        { href: '/uniform-check', label: 'Uniform Check', icon: <Shirt /> },
        { href: '/dashboard/attendance', label: 'My Attendance', icon: <Calendar /> },
        { href: '/dashboard-settings', label: 'Profile & Settings', icon: <Settings /> },
    ],
    Advisor: [
        { href: '/dashboard', label: 'Advisor Dashboard', icon: <BookUser /> },
        { href: '/dashboard/students', label: 'Manage Students', icon: <Users /> },
        { href: '/uniform-check', label: 'Uniform Check', icon: <Shirt /> },
        { href: '/dashboard-settings', label: 'Profile & Settings', icon: <Settings /> },
    ]
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const getMenuItems = (role: UserRole) => {
        return menuConfig[role] || [];
    }
    
    const menuItems = user ? getMenuItems(user.role) : [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground dark">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarContent>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                 <h1 className="font-semibold text-xl group-data-[collapsible=icon]:hidden">ESEC DCA</h1>
              </div>
            </SidebarHeader>
            <SidebarMenu className="flex-1 px-2">
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                         <Link href={item.href || "#"}>
                            <SidebarMenuButton isActive={pathname === item.href}>
                                {item.icon}
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarFooter>
                <div className="flex items-center gap-2 p-2">
                     <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-sm">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout}>
                        <LogOut />
                        <span className="">Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col">
            <header className="flex items-center justify-between p-4 border-b">
                 <SidebarTrigger />
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon"><Settings /></Button>
                    <Button variant="ghost" size="icon"><Bell /></Button>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                 </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
