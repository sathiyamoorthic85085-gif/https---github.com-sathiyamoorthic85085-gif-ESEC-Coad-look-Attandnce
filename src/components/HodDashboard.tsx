"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookCopy, FileText, Trash2, Edit, UserPlus } from "lucide-react";
import { mockAttendanceData, mockClasses, mockDepartments, mockUsers } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { AttendanceRecord, Class, User } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AddUserDialog } from "./AddUserDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "./ConfirmationDialog";

export default function HodDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [users, setUsers] = useState<User[]>(mockUsers);
    const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
    const [departmentAttendance, setDepartmentAttendance] = useState<AttendanceRecord[]>([]);
    const [departmentClasses, setDepartmentClasses] = useState<Class[]>([]);
    
    // State for confirmation dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', description: '', onConfirm: () => {} });

    useEffect(() => {
        if (user && user.role === 'HOD' && user.department) {
            const filteredUsers = users.filter(u => u.department === user.department);
            setDepartmentUsers(filteredUsers);

            const filteredAttendance = mockAttendanceData.filter(a => filteredUsers.some(u => u.id === a.userId));
            setDepartmentAttendance(filteredAttendance);

            const department = mockDepartments.find(d => d.name === user.department);
            if (department) {
                const filteredClasses = mockClasses.filter(c => c.departmentId === department.id);
                setDepartmentClasses(filteredClasses);
            }
        }
    }, [user, users]);

    const openConfirmationDialog = (title: string, description: string, onConfirm: () => void) => {
        setDialogContent({ title, description, onConfirm });
        setDialogOpen(true);
    };

    const handleAddUser = (newUser: Omit<User, 'id' | 'imageUrl'>) => {
        if (!user?.department) return;
        const finalNewUser: User = {
            ...newUser,
            id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
            department: user.department,
            imageUrl: `https://picsum.photos/seed/USR${(users.length + 1).toString().padStart(3, '0')}/100/100`,
        };
        const updatedUsers = [...users, finalNewUser];
        setUsers(updatedUsers);
        mockUsers.splice(0, mockUsers.length, ...updatedUsers); // a bit of a hack for mock data
        toast({ title: "User Added", description: `Successfully added ${newUser.name} to your department.`});
    };
  
    const handleRemoveUser = (userId: string) => {
        openConfirmationDialog('Are you sure?', `This will permanently delete the user. This action cannot be undone.`, () => {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            mockUsers.splice(0, mockUsers.length, ...updatedUsers);
            toast({ title: 'User Removed', description: 'The user has been successfully removed.' });
        });
    };


    if (!user || user.role !== 'HOD') {
        return <p>You do not have access to this page.</p>;
    }
    
    const department = mockDepartments.find(d => d.name === user.department);
    const departmentForDialog = department ? [department] : [];


    return (
        <>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">🏛️ Welcome, {user.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Managing the {user.department} Department.</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <AddUserDialog onUserAdd={handleAddUser} departments={departmentForDialog} />
                </div>
            </div>

            <Tabs defaultValue="attendance">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="attendance">Department Attendance</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="classes">Class Management</TabsTrigger>
                    <TabsTrigger value="circulars">Department Circulars</TabsTrigger>
                </TabsList>
                <TabsContent value="attendance" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Attendance</CardTitle>
                            <CardDescription>Attendance records for the {user.department} department.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Status</TableHead>
                                     <TableHead>Role</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {departmentAttendance.map((record) => {
                                    const userRecord = departmentUsers.find(u => u.id === record.userId);
                                    return (
                                        <TableRow key={record.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                            <Image
                                                src={record.imageUrl}
                                                alt={record.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                                data-ai-hint="person photo"
                                            />
                                            <div>
                                                <div className="font-medium">{record.name}</div>
                                                <div className="text-sm text-muted-foreground">{record.userId}</div>
                                            </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={record.status === 'Compliant' ? 'default' : 'destructive'}>{record.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                             <Badge variant="secondary">{userRecord?.role}</Badge>
                                        </TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Department Users</CardTitle>
                            <CardDescription>Manage Students and Faculty in the {user.department} department.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departmentUsers.map((u) => (
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
                 <TabsContent value="classes" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Classes</CardTitle>
                            <CardDescription>Manage classes within the {user.department} department.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class Name</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departmentClasses.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="circulars" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText /> Department Circulars</CardTitle>
                             <CardDescription>Post circulars for your department.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           
                           <p className="text-muted-foreground py-4 text-center">No circulars posted yet.</p>
                             <Button className="mt-4 w-full">Create New Circular</Button>
                        </CardContent>
                    </Card>
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
