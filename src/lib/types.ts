
export type UserRole = 'Admin' | 'HOD' | 'Faculty' | 'Student' | 'Advisor';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Keep password optional for security reasons in real apps
    role: UserRole;
    department?: string;
    imageUrl?: string;
    classId?: string;
    rollNumber?: string;
    registerNumber?: string;
    mobileNumber?: string;
}

export type PeriodStatus = 'Compliant' | 'Non-Compliant' | 'Pending' | 'Absent';

export interface PeriodAttendance {
    period: number; // e.g., 1, 2, 3
    subject: string;
    status: PeriodStatus;
    violation?: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  userId: string;
  imageUrl: string;
  // This is now an array to hold the status for each period.
  periods: PeriodAttendance[]; 
}


export interface Department {
    id: string;
    name: string;
}

export interface Class {
    id: string;
    name: string;
    departmentId: string;
}

export type LeaveType = 'Leave' | 'OD';
export type LeaveRequestStatus = 'Pending Advisor' | 'Pending HOD' | 'Pending Admin' | 'Approved' | 'Rejected';

export interface LeaveRequest {
    id:string;
    userId: string;
    userName: string;
    userRole: UserRole;
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveRequestStatus;
    aiSummary?: string;
    substitutionAssignedTo?: string; // User ID of the substitute faculty
}

export interface TimetableEntry {
    period: number;
    subject: string;
    faculty: string;
    time: string;
}
export interface Timetable {
    id: string;
    // We can use a structured format instead of just an image URL
    schedule: TimetableEntry[];
    imageUrl: string;
    departmentId?: string;
    classId?: string;
}
