"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Building, GraduationCap, Users, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from './AddUserDialog';
import { mockUsers, mockDepartments, mockClasses } from '@/lib/mock-data';
import type { User, Department, Class } from '@/lib/types';


export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [classes, setClasses] = useState<Class[]>(mockClasses);

  const [newClassName, setNewClassName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleAddClass = () => {
    if (!newClassName || !selectedDepartment) {
      toast({
        title: 'Error',
        description: 'Please enter a class name and select a department.',
        variant: 'destructive',
      });
      return;
    }
    const newClass: Class = {
      id: `CLS${(classes.length + 1).toString().padStart(2, '0')}`,
      name: newClassName,
      departmentId: selectedDepartment,
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    setSelectedDepartment('');
    toast({
      title: 'Class Added',
      description: `Successfully added class "${newClassName}".`,
    });
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'imageUrl'>) => {
    const finalNewUser: User = {
        ...newUser,
        id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
        imageUrl: `https://picsum.photos/seed/USR${(users.length + 1).toString().padStart(3, '0')}/100/100`,
    };
    setUsers([...users, finalNewUser]);
};

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
                <AddUserDialog onUserAdd={handleAddUser} departments={departments} />
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">Total registered users in the system</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Departments</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{departments.length}</div>
                    <p className="text-xs text-muted-foreground">Total configured departments</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Classes</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{classes.length}</div>
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
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                           <ul className="space-y-2">
                            {departments.map(dep => <li key={dep.id} className="font-medium">{dep.name}</li>)}
                           </ul>
                        </div>
                    </TabsContent>
                    <TabsContent value="classes" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold mb-2">Existing Classes</h3>
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                                    {classes.length > 0 ? (
                                        <ul className="space-y-2">
                                            {classes.map((c) => (
                                                <li key={c.id} className="flex justify-between items-center">
                                                    <span>{c.name}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {departments.find(d => d.id === c.departmentId)?.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center">No classes found.</p>
                                    )}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Add New Class</h3>
                                <div className="space-y-4">
                                     <div>
                                        <label htmlFor="department" className="text-sm font-medium block mb-2">Department</label>
                                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map(dep => <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label htmlFor="className" className="text-sm font-medium block mb-2">Class Name</label>
                                        <Input id="className" placeholder="e.g. IV Year, Section A" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} />
                                    </div>
                                    <Button onClick={handleAddClass} className="w-full">Add Class</Button>
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
