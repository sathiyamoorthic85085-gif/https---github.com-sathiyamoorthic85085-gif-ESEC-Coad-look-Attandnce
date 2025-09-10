import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function DataUploadPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Data Upload</h2>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This section for bulk data uploading is under construction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Data upload utilities will be available here shortly.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
