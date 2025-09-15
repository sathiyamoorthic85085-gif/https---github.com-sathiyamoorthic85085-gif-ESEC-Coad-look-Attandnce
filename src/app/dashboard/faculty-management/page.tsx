
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function FacultyManagementPage() {
  const faculty = mockUsers.filter(u => u.role === 'Faculty' || u.role === 'HOD' || u.role === 'Advisor');

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
         <h2 className="text-3xl font-bold tracking-tight">Faculty Management</h2>
        <Card>
          <CardHeader>
            <CardTitle>All Faculty</CardTitle>
            <CardDescription>
              A list of all faculty members in the institution.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Faculty Member</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {faculty.map(member => (
                        <TableRow key={member.id}>
                           <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={member.imageUrl!} alt={member.name} width={40} height={40} className="rounded-full" />
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell><Badge variant="secondary">{member.role}</Badge></TableCell>
                            <TableCell>{member.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
