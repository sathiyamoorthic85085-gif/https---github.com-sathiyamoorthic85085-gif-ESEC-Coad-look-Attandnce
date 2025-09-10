import StudentDashboard from "@/components/StudentDashboard";
import DashboardLayout from "@/components/DashboardLayout";

export default function StudentViewPage() {
  return (
    <DashboardLayout>
      <StudentDashboard isPreview={true} />
    </DashboardLayout>
  );
}
