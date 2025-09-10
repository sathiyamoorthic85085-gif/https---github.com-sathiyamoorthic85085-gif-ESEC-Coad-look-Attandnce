import DashboardLayout from "@/components/DashboardLayout";
import ResultsTable from "@/components/ResultsTable";
import { mockAttendanceData } from "@/lib/mock-data";


export default function AttendancePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Today's Attendance Records</h2>
        <p className="text-muted-foreground">A live overview of attendance and uniform compliance for today.</p>
        <div className="mt-6">
            <ResultsTable attendanceData={mockAttendanceData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
