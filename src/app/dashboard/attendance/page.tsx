"use client";

import DashboardLayout from "@/components/DashboardLayout";
import ResultsTable from "@/components/ResultsTable";
import type { AttendanceRecord } from "@/lib/types";
import { useEffect, useState } from 'react';

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/predictions');
        if (response.ok) {
          const data = await response.json();
          // This is a temporary transform. In a real app, the backend should return the expected structure.
           const transformedData: AttendanceRecord[] = data.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                name: p.user?.name || 'Unknown User',
                date: new Date(p.created_at).toLocaleDateString(),
                imageUrl: p.user?.imageUrl || `https://picsum.photos/seed/${p.user_id}/40/40`,
                periods: [
                    { period: 1, subject: 'Data Structures', status: p.label === 'compliant' ? 'Compliant' : 'Non-Compliant', violation: p.label !== 'compliant' ? 'Violation detected' : undefined },
                    { period: 2, subject: 'Algorithms', status: 'Pending' },
                    { period: 3, subject: 'Database Systems', status: 'Pending' },
                    { period: 4, subject: 'Operating Systems', status: 'Pending' },
                ]
            }));
          setAttendanceData(transformedData);
        } else {
          console.error("Failed to fetch attendance records");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Today's Attendance Records</h2>
        <p className="text-muted-foreground">A live overview of attendance and uniform compliance for today.</p>
        <div className="mt-6">
            {isLoading ? <p>Loading attendance data...</p> : <ResultsTable attendanceData={attendanceData} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
