import AdvisorDashboard from "@/components/AdvisorDashboard";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdvisorViewPage() {
  return (
    <DashboardLayout>
      <AdvisorDashboard isPreview={true} />
    </DashboardLayout>
  );
}
