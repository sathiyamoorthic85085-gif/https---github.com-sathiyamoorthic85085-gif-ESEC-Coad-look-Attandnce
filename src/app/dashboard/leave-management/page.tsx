"use client";

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LeaveApplicationForm } from '@/components/LeaveApplicationForm';
import { mockLeaveRequests } from '@/lib/leave-mock-data';
import type { LeaveRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';

export default function LeaveManagementPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

    const handleAddLeaveRequest = (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'userId' | 'userName' | 'userRole'>) => {
        if (!user) return;

        const request: LeaveRequest = {
            id: `LR${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            status: 'Pending Advisor',
            ...newRequest,
        };

        if (user.role === 'Faculty') {
            request.status = 'Pending HOD';
        }

        setLeaveRequests(prev => [request, ...prev]);
        toast({
            title: "Request Submitted",
            description: "Your leave request has been submitted for approval.",
        });
    };

    const handleApprove = (requestId: string) => {
        setLeaveRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                let newStatus: LeaveRequest['status'] = 'Approved';
                if (req.status === 'Pending Advisor') newStatus = 'Pending HOD';
                if (req.status === 'Pending HOD' && req.userRole === 'Faculty') newStatus = 'Pending Admin';
                
                toast({ title: "Request Approved", description: `The request has been forwarded for the next approval.`});
                if (newStatus === 'Approved') {
                     toast({ title: "Request Approved", description: `The leave request for ${req.userName} has been fully approved.`});
                }
                return { ...req, status: newStatus };
            }
            return req;
        }));
    };

    const handleReject = (requestId: string) => {
        setLeaveRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                toast({ title: "Request Rejected", variant: 'destructive'});
                return { ...req, status: 'Rejected' };
            }
            return req;
        }));
    };

    const userLeaveRequests = useMemo(() => 
        leaveRequests.filter(req => req.userId === user?.id),
    [leaveRequests, user]);

    const pendingRequests = useMemo(() => {
        if (!user) return [];
        switch (user.role) {
            case 'Advisor':
                return leaveRequests.filter(req => req.status === 'Pending Advisor' && mockUsers.find(u => u.id === req.userId)?.classId === user.classId);
            case 'HOD':
                return leaveRequests.filter(req => req.status === 'Pending HOD' && mockUsers.find(u => u.id === req.userId)?.department === user.department);
            case 'Admin':
                return leaveRequests.filter(req => req.status === 'Pending Admin');
            default:
                return [];
        }
    }, [leaveRequests, user]);
    
    const allDepartmentRequests = useMemo(() => {
        if (!user || user.role !== 'HOD') return [];
         return leaveRequests.filter(req => mockUsers.find(u => u.id === req.userId)?.department === user.department);

    }, [leaveRequests, user])

    const getStatusVariant = (status: LeaveRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
        if (status === 'Approved') return 'default';
        if (status === 'Rejected') return 'destructive';
        if (status.startsWith('Pending')) return 'secondary';
        return 'outline';
    }

    const renderRequesterView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <LeaveApplicationForm onSubmit={handleAddLeaveRequest} />
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>My Leave History</CardTitle>
                        <CardDescription>An overview of all your leave and OD requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userLeaveRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.type}</TableCell>
                                        <TableCell>{req.startDate} to {req.endDate}</TableCell>
                                        <TableCell className="max-w-xs truncate hidden md:table-cell">{req.reason}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderApproverView = () => (
        <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending My Approval ({pendingRequests.length})</TabsTrigger>
                <TabsTrigger value="history">Full History</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                        <CardDescription>Leave and OD requests that require your review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden lg:table-cell">Dates</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.userName}</TableCell>
                                        <TableCell className="hidden md:table-cell">{req.userRole}</TableCell>
                                        <TableCell>{req.type}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{req.startDate} to {req.endDate}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size="sm" onClick={() => handleApprove(req.id)}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(req.id)}>Reject</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {pendingRequests.length === 0 && <p className="text-center text-muted-foreground py-8">No pending requests.</p>}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader>
                        <CardTitle>Historical Requests</CardTitle>
                        <CardDescription>All leave requests within your scope.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(user?.role === 'Admin' ? leaveRequests : user?.role === 'HOD' ? allDepartmentRequests : []).map(req => (
                                     <TableRow key={req.id}>
                                        <TableCell>{req.userName}</TableCell>
                                        <TableCell>{req.type}</TableCell>
                                        <TableCell>{req.startDate} to {req.endDate}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );

    const renderContent = () => {
        if (!user) return <p>Loading...</p>
        
        const isApprover = ['Admin', 'HOD', 'Advisor'].includes(user.role);

        if (isApprover) {
            return renderApproverView();
        } else {
            return renderRequesterView();
        }
    };

    return (
        <DashboardLayout>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Leave & OD Management</h2>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
}
