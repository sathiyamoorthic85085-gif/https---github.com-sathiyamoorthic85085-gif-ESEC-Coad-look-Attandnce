import FacultyDashboard from "@/components/FacultyDashboard";
import DashboardLayout from "@/components/DashboardLayout";

export default function FacultyViewPage() {
  return (
    <DashboardLayout>
      <FacultyDashboard isPreview={true} />
    </DashboardLayout>
  );
}
