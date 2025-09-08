export type UserRole = 'Admin' | 'HOD' | 'Faculty' | 'Student';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    department?: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  attendance: 'Present' | 'Absent';
  imageUrl: string;
  violation?: string;
  userId: string;
}
