// This file is no longer needed and will be replaced by the unified /dashboard route.
// You can delete this file. We are keeping it here to avoid breaking navigation for now.
// We will remove it in a future step.

import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <AdminDashboard />
        </div>
    );
}
