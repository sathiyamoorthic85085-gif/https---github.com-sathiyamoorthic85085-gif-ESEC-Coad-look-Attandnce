import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function StudentsPage() {
  const students = mockUsers.filter(u => u.role === 'Student');

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
         <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>
              A list of all students in the institution.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Class</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(student => (
                        <TableRow key={student.id}>
                           <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image src={student.imageUrl!} alt={student.name} width={40} height={40} className="rounded-full" />
                                    <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{student.department}</TableCell>
                            <TableCell><Badge variant="outline">{student.rollNumber}</Badge></TableCell>
                            <TableCell>{student.classId === 'CLS01' ? 'II Year, Section A' : 'III Year, Section B'}</TableCell>
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
