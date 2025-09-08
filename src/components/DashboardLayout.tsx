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
import { Shield, Users, User, BookUser, FolderKanban, MessageSquare, Calendar, Shirt, FileUp, Settings, LogOut, GraduationCap, Building } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const menuItems = [
      { href: '/dashboard', label: 'Admin Dashboard', icon: <Shield />, role: 'Admin' },
      { href: '/dashboard', label: 'HOD View', icon: <Building />, role: 'Admin' },
      { href: '/dashboard', label: 'Advisor View', icon: <BookUser />, role: 'Admin' },
      { href: '/dashboard', label: 'Faculty View', icon: <User />, role: 'Admin' },
      { href: '/dashboard', label: 'Student View', icon: <GraduationCap />, role: 'Admin' },
      { href: '/dashboard', label: 'Students', icon: <Users />, role: 'Admin' },
      { href: '/dashboard', label: 'Faculty', icon: <User />, role: 'Admin' },
      { href: '/dashboard', label: 'Attendance', icon: <UserCheck />, role: 'Admin' },
      { href: '/dashboard', label: 'Assignments', icon: <FolderKanban />, role: 'Admin' },
      { href: '/dashboard', label: 'Messages', icon: <MessageSquare />, role: 'Admin' },
      { href: '/dashboard', label: 'Timetable & Circulars', icon: <Calendar />, role: 'Admin' },
      { href: '/', label: 'Dress Checker', icon: <Shirt />, role: 'Admin' },
      { href: '/dashboard', label: 'Leave/OD Forms', icon: <FileUp />, role: 'Admin' },
      { href: '/dashboard', label: 'Profile & Settings', icon: <Settings />, role: 'Admin' },
    ];

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
                         <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
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
