export type UserRole = 'Admin' | 'HOD' | 'Faculty' | 'Student';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Keep password optional for security reasons in real apps
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
