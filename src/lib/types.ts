export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  attendance: 'Present' | 'Absent';
  imageUrl: string;
  violation?: string;
}
