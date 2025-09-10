import HodDashboard from "@/components/HodDashboard";
import DashboardLayout from "@/components/DashboardLayout";

export default function HodViewPage() {
  return (
    <DashboardLayout>
      <HodDashboard isPreview={true} />
    </DashboardLayout>
  );
}
