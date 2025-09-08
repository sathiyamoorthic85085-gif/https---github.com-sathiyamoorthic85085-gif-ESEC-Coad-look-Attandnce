"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Building, GraduationCap, Users, UserPlus, FileText, Bell, Settings, LogOut, Shield, User, FolderKanban, MessageSquare, Calendar, Shirt, FileUp, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [departments] = useState([]); // Mock data
  const [classes] = useState([]); // Mock data

  if (!user || user.role !== 'Admin') {
    return (
        <div className="flex h-full items-center justify-center">
            <p>You do not have access to this page.</p>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Full control over user and application management.</p>
            </div>
            <div className="flex items-center space-x-2">
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Total registered users in the system</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Departments</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Total configured departments</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Classes</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Total configured classes</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Academic Structure Management</CardTitle>
                <CardDescription>Manage departments and classes for the entire college.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="classes">
                    <TabsList>
                        <TabsTrigger value="departments">Departments</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="departments" className="mt-4">
                        <p className="text-muted-foreground">Department management coming soon.</p>
                    </TabsContent>
                    <TabsContent value="classes" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold mb-2">Existing Classes</h3>
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 text-center">
                                    <p className="text-sm text-muted-foreground">No classes found.</p>
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Add New Class</h3>
                                <div className="space-y-4">
                                     <div>
                                        <label htmlFor="department" className="text-sm font-medium">Department</label>
                                        <Select>
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cse">Computer Science</SelectItem>
                                                <SelectItem value="eee">Electrical Engineering</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
