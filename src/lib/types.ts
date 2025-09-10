
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
    id: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveRequestStatus;
    aiSummary?: string;
}

export interface Timetable {
    id: string;
    imageUrl: string;
    departmentId?: string;
    classId?: string;
}
