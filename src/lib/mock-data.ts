import type { AttendanceRecord, User, Department, Class } from './types';

const staticDate = new Date().toLocaleDateString('en-CA');

export const mockUsers: User[] = [
    { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', password: 'password', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/USR001/100/100', rollNumber: 'STU001', registerNumber: 'REG001', mobileNumber: '123-456-7890' },
    { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/USR002/100/100', rollNumber: 'STU002', registerNumber: 'REG002', mobileNumber: '123-456-7891' },
    { id: 'USR003', name: 'Peter Jones', email: 'peter.jones@example.com', password: 'password', role: 'Faculty', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR003/100/100' },
    { id: 'USR004', name: 'Mary Williams', email: 'mary.williams@example.com', password: 'password', role: 'HOD', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR004/100/100' },
    { id: 'USR005', name: 'Admin User', email: 'sathiyamoorthi.c85085@gmail.com', password: '1234567890', role: 'Admin', department: 'Administration', imageUrl: 'https://picsum.photos/seed/USR005/100/100' },
    { id: 'USR006', name: 'Emily Davis', email: 'emily.davis@example.com', password: 'password', role: 'Student', department: 'Electrical Engineering', classId: 'CLS02', imageUrl: 'https://picsum.photos/seed/USR006/100/100', rollNumber: 'STU003', registerNumber: 'REG003', mobileNumber: '123-456-7892' },
    { id: 'USR007', name: 'Michael Wilson', email: 'michael.wilson@example.com', password: 'password', role: 'Faculty', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR007/100/100' },
    { id: 'USR008', name: 'Sarah Martinez', email: 'sarah.martinez@example.com', password: 'password', role: 'HOD', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR008/100/100' },
    { id: 'USR009', name: 'David Lee', email: 'david.lee@example.com', password: 'password', role: 'Advisor', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/USR009/100/100' },
];

export const mockDepartments: Department[] = [
    { id: 'DPT01', name: 'Computer Science' },
    { id: 'DPT02', name: 'Electrical Engineering' },
    { id: 'DPT03', name: 'Mechanical Engineering' },
    { id: 'DPT04', name: 'Civil Engineering' },
];

export const mockClasses: Class[] = [
    { id: 'CLS01', name: 'II Year, Section A', departmentId: 'DPT01' },
    { id: 'CLS02', name: 'III Year, Section B', departmentId: 'DPT02' },
];


export const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 'ATT001',
    userId: 'USR001',
    name: 'John Doe',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR001/100/100',
  },
  {
    id: 'ATT002',
    userId: 'USR002',
    name: 'Jane Smith',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR002/100/100',
  },
  {
    id: 'ATT003',
    userId: 'USR003',
    name: 'Peter Jones',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR003/100/100',
  },
  {
    id: 'ATT004',
    userId: 'USR004',
    name: 'Mary Williams',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR004/100/100',
  },
  {
    id: 'ATT005',
    userId: 'USR005',
    name: 'Admin User',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR005/100/100',
  },
  {
    id: 'ATT006',
    userId: 'USR006',
    name: 'Emily Davis',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR006/100/100',
  },
  {
    id: 'ATT007',
    userId: 'USR007',
    name: 'Michael Wilson',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR007/100/100',
  },
  {
    id: 'ATT008',
    userId: 'USR008',
    name: 'Sarah Martinez',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR008/100/100',
  },
  {
    id: 'ATT009',
    userId: 'USR009',
    name: 'David Lee',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR009/100/100',
  },
];


export const mockViolations: string[] = [
    "Not wearing a tie",
    "Informal footwear (sneakers)",
    "Wearing a t-shirt instead of a collared shirt",
    "Unkempt hair",
    "Jeans instead of formal trousers"
];
