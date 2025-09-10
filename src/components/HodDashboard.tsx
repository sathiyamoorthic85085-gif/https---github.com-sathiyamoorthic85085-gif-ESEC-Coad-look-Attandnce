"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BookCopy, FileText, Trash2, Edit, UserPlus, Loader2, BarChart2 } from "lucide-react";
import { mockAttendanceData, mockClasses, mockDepartments, mockUsers } from "@/lib/mock-data";
import { useEffect, useState, useTransition } from "react";
import { AttendanceRecord, Class, User } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AddUserDialog } from "./AddUserDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { summarizeAttendanceReport } from "@/ai/flows/summarize-attendance-report";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function HodDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [users, setUsers] = useState<User[]>(mockUsers);
    const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
    const [departmentFaculty, setDepartmentFaculty] = useState<User[]>([]);
    const [departmentStudents, setDepartmentStudents] = useState<User[]>([]);
    const [departmentAttendance, setDepartmentAttendance] = useState<AttendanceRecord[]>([]);
    const [departmentClasses, setDepartmentClasses] = useState<Class[]>([]);
    
    // State for confirmation dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', description: '', onConfirm: () => {} });

    // Report generation state
    const [report, setReport] = useState<string>('');
    const [selectedFaculty, setSelectedFaculty] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isPending, startTransition] = useTransition();


    useEffect(() => {
        if (user && (user.role === 'HOD' || user.role === 'Admin')) {
            const hodDepartment = user.role === 'Admin' ? 'Computer Science' : user.department; // Mock for admin view
            
            const filteredUsers = users.filter(u => u.department === hodDepartment);
            setDepartmentUsers(filteredUsers);
            setDepartmentFaculty(filteredUsers.filter(u => u.role === 'Faculty'));
            setDepartmentStudents(filteredUsers.filter(u => u.role === 'Student'));

            const filteredAttendance = mockAttendanceData.filter(a => filteredUsers.some(u => u.id === a.userId));
            setDepartmentAttendance(filteredAttendance);

            const department = mockDepartments.find(d => d.name === hodDepartment);
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
        const hodDepartment = user?.department;
        if (!hodDepartment && user?.role !== 'Admin') return;

        const department = user?.role === 'Admin' ? newUser.department : hodDepartment;


        const finalNewUser: User = {
            ...newUser,
            id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
            department: department,
            imageUrl: `https://picsum.photos/seed/USR${(users.length + 1).toString().padStart(3, '0')}/100/100`,
        };
        const updatedUsers = [...users, finalNewUser];
        setUsers(updatedUsers);
        mockUsers.splice(0, mockUsers.length, ...updatedUsers); // a bit of a hack for mock data
        toast({ title: "User Added", description: `Successfully added ${newUser.name} to the department.`});
    };
  
    const handleRemoveUser = (userId: string) => {
        openConfirmationDialog('Are you sure?', `This will permanently delete the user. This action cannot be undone.`, () => {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            mockUsers.splice(0, mockUsers.length, ...updatedUsers);
            toast({ title: 'User Removed', description: 'The user has been successfully removed.' });
        });
    };

    const handleGenerateReport = () => {
        startTransition(async () => {
            try {
                let relevantData = departmentAttendance;
                let reportTitle = `Full Department Attendance Report`;

                if(selectedFaculty) {
                    // This is a simplified logic. In real app, you'd find students under a faculty.
                    // Here we will just use the faculty member's own attendance.
                     relevantData = departmentAttendance.filter(a => a.userId === selectedFaculty);
                     const facultyName = departmentFaculty.find(f => f.id === selectedFaculty)?.name;
                     reportTitle = `Attendance Report for Faculty: ${facultyName}`;
                } else if(selectedStudent) {
                    relevantData = departmentAttendance.filter(a => a.userId === selectedStudent);
                    const studentName = departmentStudents.find(s => s.id === selectedStudent)?.name;
                    reportTitle = `Attendance Report for Student: ${studentName}`;
                }

                if (relevantData.length === 0) {
                    toast({title: "No Data", description: "No attendance data found for the selected criteria.", variant: "destructive"});
                    return;
                }

                const reportData = JSON.stringify(relevantData, null, 2);

                const result = await summarizeAttendanceReport({ attendanceData: reportData });
                setReport(result.summary);
                toast({
                    title: 'Report Generated',
                    description: reportTitle,
                });
            } catch (error) {
                console.error("Failed to generate report:", error);
                toast({
                    title: 'Generation Failed',
                    description: 'There was an error generating the report.',
                    variant: 'destructive',
                });
            }
        });
    };

    if (!user || (user.role !== 'HOD' && user.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const departmentName = user.role === 'Admin' ? 'Computer Science' : user.department;
    const departmentForDialog = mockDepartments.find(d => d.name === departmentName);
    const departmentsForDialog = departmentForDialog ? [departmentForDialog] : [];


    return (
        <>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white/90">🏛️ Welcome, {user.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Managing the {departmentName} Department.</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <AddUserDialog onUserAdd={handleAddUser} departments={departmentsForDialog} />
                </div>
            </div>

            <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="attendance">Department Attendance</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="classes">Class Management</TabsTrigger>
                    <TabsTrigger value="reports">Attendance Reports</TabsTrigger>
                    <TabsTrigger value="circulars">Department Circulars</TabsTrigger>
                </TabsList>
                <TabsContent value="attendance" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Attendance</CardTitle>
                            <CardDescription>Attendance records for the {departmentName} department.</CardDescription>
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
                            <CardDescription>Manage Students and Faculty in the {departmentName} department.</CardDescription>
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
                            <CardDescription>Manage classes within the {departmentName} department.</CardDescription>
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
                 <TabsContent value="reports" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Attendance Reports</CardTitle>
                            <CardDescription>Generate AI-powered summaries for your department.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="faculty-select">Filter by Faculty</Label>
                                    <Select value={selectedFaculty} onValueChange={(value) => { setSelectedFaculty(value); setSelectedStudent(''); }}>
                                        <SelectTrigger id="faculty-select">
                                            <SelectValue placeholder="Select a faculty member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="student-select">Filter by Student</Label>
                                    <Select value={selectedStudent} onValueChange={(value) => { setSelectedStudent(value); setSelectedFaculty(''); }}>
                                        <SelectTrigger id="student-select">
                                            <SelectValue placeholder="Select a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <p className="text-xs text-center text-muted-foreground">Or leave blank to generate for the whole department.</p>

                             <div className="flex justify-center">
                                <Button className="w-full max-w-xs" onClick={handleGenerateReport} disabled={isPending}>
                                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : <><BarChart2 className="mr-2 h-4 w-4" /> Generate AI Report</>}
                                </Button>
                            </div>
                       
                            {report && (
                                <Card className="bg-background/50 mt-6">
                                    <CardHeader>
                                        <CardTitle>AI Summary Report</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report}</p>
                                    </CardContent>
                                </Card>
                            )}

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
