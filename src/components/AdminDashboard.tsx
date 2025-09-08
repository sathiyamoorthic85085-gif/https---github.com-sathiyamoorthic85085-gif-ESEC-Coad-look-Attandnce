"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Building, GraduationCap, Users, UserPlus, Trash2, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from './AddUserDialog';
import { mockUsers, mockDepartments, mockClasses } from '@/lib/mock-data';
import type { User, Department, Class } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ConfirmationDialog } from './ConfirmationDialog';


export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [classes, setClasses] = useState<Class[]>(mockClasses);

  // State for adding new entities
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [selectedDepartmentForClass, setSelectedDepartmentForClass] = useState('');
  
  // State for confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', description: '', onConfirm: () => {} });


  const openConfirmationDialog = (title: string, description: string, onConfirm: () => void) => {
    setDialogContent({ title, description, onConfirm });
    setDialogOpen(true);
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'imageUrl'>) => {
    const finalNewUser: User = {
        ...newUser,
        id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
        imageUrl: `https://picsum.photos/seed/USR${(users.length + 1).toString().padStart(3, '0')}/100/100`,
    };
    setUsers([...users, finalNewUser]);
  };
  
  const handleRemoveUser = (userId: string) => {
    openConfirmationDialog('Are you sure?', `This will permanently delete the user. This action cannot be undone.`, () => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: 'User Removed', description: 'The user has been successfully removed.' });
    });
  };

  const handleAddDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast({ title: 'Error', description: 'Department name cannot be empty.', variant: 'destructive' });
      return;
    }
    const newDepartment: Department = {
      id: `DPT${(departments.length + 1).toString().padStart(2, '0')}`,
      name: newDepartmentName,
    };
    setDepartments([...departments, newDepartment]);
    setNewDepartmentName('');
    toast({ title: 'Department Added', description: `Successfully added department "${newDepartmentName}".` });
  };

  const handleRemoveDepartment = (departmentId: string) => {
     openConfirmationDialog('Are you sure?', `This will permanently delete the department and all associated classes. This action cannot be undone.`, () => {
        setDepartments(departments.filter(d => d.id !== departmentId));
        setClasses(classes.filter(c => c.departmentId !== departmentId));
        toast({ title: 'Department Removed', description: 'The department has been successfully removed.' });
    });
  };


  const handleAddClass = () => {
    if (!newClassName || !selectedDepartmentForClass) {
      toast({ title: 'Error', description: 'Please enter a class name and select a department.', variant: 'destructive' });
      return;
    }
    const newClass: Class = {
      id: `CLS${(classes.length + 1).toString().padStart(2, '0')}`,
      name: newClassName,
      departmentId: selectedDepartmentForClass,
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    setSelectedDepartmentForClass('');
    toast({ title: 'Class Added', description: `Successfully added class "${newClassName}".` });
  };

  const handleRemoveClass = (classId: string) => {
    openConfirmationDialog('Are you sure?', `This will permanently delete the class. This action cannot be undone.`, () => {
        setClasses(classes.filter(c => c.id !== classId));
        toast({ title: 'Class Removed', description: 'The class has been successfully removed.' });
    });
  };


  if (!user || user.role !== 'Admin') {
    return (
        <div className="flex h-full items-center justify-center">
            <p>You do not have access to this page.</p>
        </div>
    );
  }

  return (
    <>
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
                    <CardTitle className="text-sm font-medium">My Attendance</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{classes.length}</div>
                    <p className="text-xs text-muted-foreground">Total configured classes</p>
                </CardContent>
            </Card>
        </div>
        
        <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="departments">Department Management</TabsTrigger>
                <TabsTrigger value="classes">Class Management</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>User Accounts</CardTitle>
                        <CardDescription>View, manage, and remove user accounts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image src={u.imageUrl!} alt={u.name} width={40} height={40} className="rounded-full" />
                                                <div>
                                                    <p className="font-medium">{u.name}</p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{u.role}</TableCell>
                                        <TableCell>{u.department}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(u.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
            </TabsContent>
            <TabsContent value="departments" className="mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Existing Departments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {departments.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Department Name</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {departments.map((dep) => (
                                                <TableRow key={dep.id}>
                                                    <TableCell className="font-medium">{dep.name}</TableCell>
                                                    <TableCell className="text-right">
                                                         <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDepartment(dep.id)}><Trash2 className="h-4 w-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No departments found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                         <Card>
                            <CardHeader>
                                <CardTitle>Add New Department</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="departmentName" className="text-sm font-medium block mb-2">Department Name</label>
                                    <Input id="departmentName" placeholder="e.g. Information Technology" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} />
                                </div>
                                <Button onClick={handleAddDepartment} className="w-full">Add Department</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="classes" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                         <Card>
                            <CardHeader>
                                <CardTitle>Existing Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {classes.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Class Name</TableHead>
                                                <TableHead>Department</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {classes.map((c) => (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-medium">{c.name}</TableCell>
                                                     <TableCell className="text-sm text-muted-foreground">
                                                        {departments.find(d => d.id === c.departmentId)?.name}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveClass(c.id)}><Trash2 className="h-4 w-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No classes found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                     <div>
                        <Card>
                            <CardHeader><CardTitle>Add New Class</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                 <div>
                                    <label htmlFor="department" className="text-sm font-medium block mb-2">Department</label>
                                    <Select value={selectedDepartmentForClass} onValueChange={setSelectedDepartmentForClass}>
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
    <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={() => {
            dialogContent.onConfirm();
            setDialogOpen(false);
        }}
    />
    </>
  );
}
