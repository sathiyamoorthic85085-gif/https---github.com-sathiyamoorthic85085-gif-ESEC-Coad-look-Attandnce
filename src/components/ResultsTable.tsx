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
import type { AttendanceRecord } from '@/lib/types';

interface ResultsTableProps {
  attendanceData: AttendanceRecord[];
}

export default function ResultsTable({ attendanceData }: ResultsTableProps) {
  const getStatusVariant = (status: AttendanceRecord['status']): "default" | "destructive" | "secondary" => {
    switch (status) {
      case 'Compliant':
        return 'default';
      case 'Non-Compliant':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getAttendanceVariant = (attendance: AttendanceRecord['attendance']): "default" | "secondary" => {
    return attendance === 'Present' ? 'default' : 'secondary';
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Violation</TableHead>
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
                      <div className="text-sm text-muted-foreground">{record.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={getAttendanceVariant(record.attendance)}>{record.attendance}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    {record.violation ?? 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
