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


interface ResultsTableProps {
  attendanceData: AttendanceRecord[];
}

export default function ResultsTable({ attendanceData }: ResultsTableProps) {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">User</TableHead>
              <TableHead className="text-center">Period 1</TableHead>
              <TableHead className="text-center">Period 2</TableHead>
              <TableHead className="text-center">Period 3</TableHead>
              <TableHead className="text-center">Period 4</TableHead>
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
