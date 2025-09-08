"use client";
import AdminDashboard from "@/components/AdminDashboard";
import FacultyDashboard from "@/components/FacultyDashboard";
import HodDashboard from "@/components/HodDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/lib/mock-data";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


export default function DashboardPage() {
    const { user, setUser } = useAuth();

    const handleUserChange = (userId: string) => {
        const selectedUser = mockUsers.find(u => u.id === userId);
        if (selectedUser) {
            setUser(selectedUser);
        }
    }

    const renderDashboard = () => {
        if (!user) {
            return <p>Please select a user to view the dashboard.</p>
        }
        switch (user.role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'HOD':
                return <HodDashboard />;
            case 'Faculty':
                return <FacultyDashboard />;
            case 'Student':
                return <StudentDashboard />;
            default:
                return <p>Invalid user role.</p>
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <Card className="max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle>User Role Simulator</CardTitle>
                    <CardDescription>Switch between users to see different dashboard views.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="user-select">Select User (Role)</Label>
                        <Select onValueChange={handleUserChange} value={user?.id}>
                            <SelectTrigger id="user-select">
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockUsers.map(u => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.name} ({u.role})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            <div className="mt-8">
              {renderDashboard()}
            </div>
        </div>
    )
}
