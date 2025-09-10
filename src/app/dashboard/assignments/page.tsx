import DashboardLayout from "@/components/DashboardLayout";
import ResultsTable from "@/components/ResultsTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockAssignments = [
    { id: 'ASG01', title: 'Data Structures - Lab 1', subject: 'Data Structures', dueDate: '2024-09-15', status: 'Submitted' },
    { id: 'ASG02', title: 'Algorithms - Problem Set 2', subject: 'Algorithms', dueDate: '2024-09-20', status: 'Pending' },
    { id: 'ASG03', title: 'Operating Systems - Reading', subject: 'Operating Systems', dueDate: '2024-09-18', status: 'Late' },
    { id: 'ASG04', title: 'Database Systems - ER Diagram', subject: 'Database Systems', dueDate: '2024-09-22', status: 'Pending' },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Submitted': return 'default';
        case 'Pending': return 'secondary';
        case 'Late': return 'destructive';
        default: return 'outline';
    }
}

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <Card>
          <CardHeader>
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>
              An overview of your current and past assignments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockAssignments.map(assignment => (
                        <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.subject}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge></TableCell>
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
