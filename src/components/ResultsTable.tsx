
"use client";

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AttendanceRecord, PeriodAttendance } from '@/lib/types';
import { Check, X, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMemo } from 'react';
import { mockTimetables } from '@/lib/mock-data';


interface ResultsTableProps {
  attendanceData: AttendanceRecord[];
}

export default function ResultsTable({ attendanceData }: ResultsTableProps) {

    const timetableForClass = useMemo(() => {
        // In a real app with more complex logic, this might be passed as a prop
        // or fetched based on the user's role and context. For now, we'll find
        // a relevant timetable from the mock data.
        return mockTimetables.find(t => t.classId === 'CLS01' || t.departmentId === 'DPT01');
    }, []);

    const periodHeaders = useMemo(() => {
        if (timetableForClass?.schedule) {
            return timetableForClass.schedule.slice(0, 4).map(p => ({
                period: p.period,
                subject: p.subject
            }));
        }
        return [
            { period: 1, subject: 'Period 1' },
            { period: 2, subject: 'Period 2' },
            { period: 3, subject: 'Period 3' },
            { period: 4, subject: 'Period 4' },
        ]
    }, [timetableForClass]);


    const getStatusVariant = (status: PeriodAttendance['status']): "default" | "destructive" | "secondary" | "outline" => {
        switch (status) {
        case 'Compliant':
            return 'default';
        case 'Non-Compliant':
            return 'destructive';
        case 'Absent':
            return 'secondary';
        default:
            return 'outline';
        }
    };

    const getStatusIcon = (status: PeriodAttendance['status']) => {
        switch(status) {
            case 'Compliant': return <Check className="h-4 w-4 text-green-400" />;
            case 'Non-Compliant': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
            case 'Absent': return <X className="h-4 w-4 text-red-500" />;
            default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="max-h-[60vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="w-[30%]">User</TableHead>
              {periodHeaders.map(h => <TableHead key={h.period} className="text-center">{h.subject}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={record.imageUrl}
                      alt={record.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      data-ai-hint="person photo"
                    />
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-sm text-muted-foreground">{record.userId}</div>
                    </div>
                  </div>
                </TableCell>
                {record.periods.map(period => (
                    <TableCell key={period.period} className="text-center">
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant={getStatusVariant(period.status)} className="cursor-pointer">
                                        <span className="flex items-center gap-1.5">
                                            {getStatusIcon(period.status)}
                                            {period.status}
                                        </span>
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{period.subject}</p>
                                    {period.violation && <p className="text-xs text-destructive">{period.violation}</p>}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                ))}
              </TableRow>
            ))}
             {attendanceData.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No attendance records found for today.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
