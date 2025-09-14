export type UserRole = 'admin' | 'hod' | 'faculty' | 'student' | 'advisor';

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash?: string;
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
    period: number;
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
    substitutionAssignedTo?: string;
}

export interface TimetableEntry {
    period: number;
    subject: string;
    faculty: string;
    time: string;
}
export interface Timetable {
    id: string;
    schedule: TimetableEntry[];
    imageUrl: string;
    departmentId?: string;
    classId?: string;
}

    
