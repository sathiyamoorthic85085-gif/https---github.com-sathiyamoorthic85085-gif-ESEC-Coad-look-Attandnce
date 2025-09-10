
"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { FileText, Trash2, Edit, Loader2, BarChart2, Download, Shield } from "lucide-react";
import { mockAttendanceData, mockClasses, mockDepartments, mockUsers } from "@/lib/mock-data";
import { useEffect, useState, useTransition, useMemo } from "react";
import { AttendanceRecord, Class, User } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AddUserDialog } from "./AddUserDialog";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { summarizeAttendanceReport } from "@/ai/flows/summarize-attendance-report";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/report-utils";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface HodDashboardProps {
    isPreview?: boolean;
}

export default function HodDashboard({ isPreview = false }: HodDashboardProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const [users, setUsers] = useState<User[]>(mockUsers);
    const [departmentClasses, setDepartmentClasses] = useState<Class[]>([]);
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', description: '', onConfirm: () => {} });

    const [report, setReport] = useState<string>('');
    const [reportData, setReportData] = useState<AttendanceRecord[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const currentUser = isPreview ? { name: 'Admin Preview', department: 'Computer Science', role: 'HOD' } : user;
    const hodDepartmentName = currentUser?.department;

    // Derive state directly instead of using useEffect to prevent infinite loops
    const departmentUsers = useMemo(() => 
        users.filter(u => u.department === hodDepartmentName),
        [users, hodDepartmentName]
    );

    const departmentStudents = useMemo(() => 
        departmentUsers.filter(u => u.role === 'Student'),
        [departmentUsers]
    );

    const departmentAttendance = useMemo(() => {
        const studentIdsInDept = departmentStudents.map(s => s.id);
        return mockAttendanceData.filter(a => studentIdsInDept.includes(a.userId));
    }, [departmentStudents]);

    useEffect(() => {
        if (hodDepartmentName) {
            const department = mockDepartments.find(d => d.name === hodDepartmentName);
            if (department) {
                const filteredClasses = mockClasses.filter(c => c.departmentId === department.id);
                setDepartmentClasses(filteredClasses);
            }
        }
    }, [hodDepartmentName]);


    const openConfirmationDialog = (title: string, description: string, onConfirm: () => void) => {
        setDialogContent({ title, description, onConfirm });
        setDialogOpen(true);
    };

    const handleAddUser = (newUser: Omit<User, 'id' | 'imageUrl'>) => {
        if (!hodDepartmentName) return;

        const department = currentUser?.role === 'Admin' ? newUser.department : hodDepartmentName;

        const finalNewUser: User = {
            ...newUser,
            id: `USR${(users.length + 1).toString().padStart(3, '0')}`,
            department: department,
            imageUrl: `https://picsum.photos/seed/USR${(users.length + 1).toString().padStart(3, '0')}/100/100`,
        };
        setUsers(currentUsers => [...currentUsers, finalNewUser]);
        toast({ title: "User Added", description: `Successfully added ${newUser.name} to the department.`});
    };
  
    const handleRemoveUser = (userId: string) => {
        openConfirmationDialog('Are you sure?', `This will permanently delete the user. This action cannot be undone.`, () => {
            setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
            toast({ title: 'User Removed', description: 'The user has been successfully removed.' });
        });
    };

    const handleGenerateReport = () => {
        startTransition(async () => {
            setReport('');
            setReportData([]);
            if (!selectedClass) {
                toast({title: "No Class Selected", description: "Please select a class to generate a report.", variant: "destructive"});
                return;
            }
            try {
                // This logic assumes students have a `classId`. Make sure your data model supports this.
                const studentsInClass = departmentStudents.filter(s => s.classId === selectedClass);
                const studentIdsInClass = studentsInClass.map(s => s.id);
                const relevantData = departmentAttendance.filter(a => studentIdsInClass.includes(a.userId));
                
                const selectedClassName = departmentClasses.find(c => c.id === selectedClass)?.name || 'the selected class';
                const reportTitle = `Attendance Report for ${selectedClassName}`;

                if (relevantData.length === 0) {
                    toast({title: "No Data", description: `No attendance data found for ${selectedClassName}.`, variant: "destructive"});
                    return;
                }
                
                setReportData(relevantData);
                const reportJson = JSON.stringify(relevantData, null, 2);
                const result = await summarizeAttendanceReport({ attendanceData: reportJson });
                
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

    if (!currentUser || (currentUser.role !== 'HOD' && currentUser.role !== 'Admin')) {
        return <p>You do not have access to this page.</p>;
    }
    
    const departmentForDialog = mockDepartments.find(d => d.name === hodDepartmentName);
    const departmentsForDialog = departmentForDialog ? [departmentForDialog] : [];

    return (
        <>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {isPreview && (
                <Alert className="mb-4 border-accent">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Admin Preview</AlertTitle>
                    <AlertDescription>
                        You are currently viewing the HOD Dashboard as an administrator.
                    </AlertDescription>
                </Alert>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">🏛️ Welcome, {currentUser.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground">Managing the {hodDepartmentName} Department.</p>
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
                            <CardDescription>Attendance records for the {hodDepartmentName} department.</CardDescription>
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
                            <CardDescription>Manage Students and Faculty in the {hodDepartmentName} department.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Contact</TableHead>
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
                                            <TableCell>
                                                {u.role === 'Student' && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <p>R.No: {u.rollNumber}</p>
                                                    </div>
                                                )}
                                            </TableCell>
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
                            <CardDescription>Manage classes within the {hodDepartmentName} department.</CardDescription>
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
                            <CardDescription>Generate AI-powered summaries for a specific class in your department.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                                <Label htmlFor="class-select">Select a Class</Label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger id="class-select">
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                           
                             <div className="flex justify-center">
                                <Button className="w-full max-w-xs" onClick={handleGenerateReport} disabled={isPending}>
                                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : <><BarChart2 className="mr-2 h-4 w-4" /> Generate AI Report</>}
                                </Button>
                            </div>
                       
                            {report && (
                                <Card className="bg-background/50 mt-6">
                                    <CardHeader>
                                        <CardTitle>AI Summary Report for {departmentClasses.find(c => c.id === selectedClass)?.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report}</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => exportToPDF(reportData, `Attendance Report - ${departmentClasses.find(c => c.id === selectedClass)?.name}`)}>
                                                <Download className="mr-2 h-3 w-3" />
                                                PDF
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => exportToExcel(reportData, `Attendance Report - ${departmentClasses.find(c => c.id === selectedClass)?.name}`)}>
                                                <Download className="mr-2 h-3 w-3" />
                                                Excel
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => exportToCSV(reportData, `Attendance Report - ${departmentClasses.find(c => c.id === selectedClass)?.name}`)}>
                                                <Download className="mr-2 h-3 w-3" />
                                                CSV
                                            </Button>
                                        </div>
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
