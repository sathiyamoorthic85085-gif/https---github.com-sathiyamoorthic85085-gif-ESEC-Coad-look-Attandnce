import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AttendanceReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Attendance Reports</h2>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This section for generating and viewing attendance reports is under construction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>AI-powered reporting features will be available here shortly.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
