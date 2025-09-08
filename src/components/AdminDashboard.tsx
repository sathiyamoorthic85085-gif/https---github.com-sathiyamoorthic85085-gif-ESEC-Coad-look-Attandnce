"use client";

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { summarizeAttendanceReport } from '@/ai/flows/summarize-attendance-report';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockAttendanceData } from '@/lib/mock-data';
import type { AttendanceRecord } from '@/lib/types';
import { FileText, Loader2, Users, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();
  const { toast } = useToast();

  const unauthorizedMembers = attendanceData.filter(
    (record) => record.status === 'Non-Compliant'
  );

  const handleGenerateSummary = () => {
    startSummaryTransition(async () => {
      try {
        const report = JSON.stringify(attendanceData, null, 2);
        const result = await summarizeAttendanceReport({ attendanceData: report });
        setSummary(result.summary);
      } catch (error) {
        console.error("AI summary failed:", error);
        toast({
          title: "Error",
          description: "Failed to generate attendance summary.",
          variant: "destructive",
        });
      }
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.filter(r => r.status === 'Compliant').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{unauthorizedMembers.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Unauthorized / Non-Compliant</CardTitle>
            <CardDescription>
              List of members with dress code violations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unauthorizedMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Violation</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unauthorizedMembers.map((record) => (
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
                        <Badge variant="destructive">{record.violation ?? 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center">No violations recorded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">AI Attendance Summary</CardTitle>
                <CardDescription>Generate an AI-powered summary of today's attendance trends and issues.</CardDescription>
            </CardHeader>
            <CardContent>
                {summary && (
                    <div className="mb-4 rounded-lg border bg-muted/50 p-4 text-sm">
                        {summary}
                    </div>
                )}
                <Button onClick={handleGenerateSummary} disabled={isSummarizing} className="w-full">
                    {isSummarizing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Summary
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
