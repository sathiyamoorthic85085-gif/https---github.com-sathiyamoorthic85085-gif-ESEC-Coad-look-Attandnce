
import type { User, AttendanceRecord, Timetable, Department, Class } from './types';

export const mockUsers: User[] = [
    // Students
    { id: 'STU001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', role: 'Student', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/STU001/100/100', classId: 'CLS01', rollNumber: 'CS101', registerNumber: 'CS2023001' },
    { id: 'STU002', name: 'Diya Patel', email: 'diya.patel@example.com', role: 'Student', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/STU002/100/100', classId: 'CLS01', rollNumber: 'CS102', registerNumber: 'CS2023002' },
    { id: 'STU003', name: 'Rohan Joshi', email: 'rohan.joshi@example.com', role: 'Student', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/STU003/100/100', classId: 'CLS02', rollNumber: 'EE101', registerNumber: 'EE2023001' },
    { id: 'STU004', name: 'Priya Singh', email: 'priya.singh@example.com', role: 'Student', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/STU004/100/100', classId: 'CLS02', rollNumber: 'EE102', registerNumber: 'EE2023002' },

    // Faculty & Staff
    { id: 'USR003', name: 'Dr. Sameer Verma', email: 'sameer.verma@example.com', role: 'Faculty', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR003/100/100' },
    { id: 'USR004', name: 'Dr. Ananya Gupta', email: 'ananya.gupta@example.com', role: 'HOD', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR004/100/100' },
    { id: 'USR005', name: 'Mr. Rajesh Kumar', email: 'rajesh.kumar@example.com', role: 'Admin', department: 'Administration', imageUrl: 'https://picsum.photos/seed/USR005/100/100' },
    { id: 'USR006', name: 'Ms. Sunita Reddy', email: 'sunita.reddy@example.com', role: 'Faculty', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR006/100/100' },
    { id: 'USR007', name: 'Prof. Vikram Rao', email: 'vikram.rao@example.com', role: 'HOD', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR007/100/100' },
    { id: 'USR008', name: 'Dr. Nisha Iyer', email: 'nisha.iyer@example.com', role: 'Advisor', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR008/100/100', classId: 'CLS01' },
    { id: 'USR009', name: 'Mr. Alok Verma', email: 'alok.verma@example.com', role: 'Advisor', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR009/100/100', classId: 'CLS02' },
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


export const mockViolations = [
  "Improper hairstyle",
  "No ID card",
  "Shoes not polished",
  "Incorrect uniform color",
  "Missing tie",
];

export const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 'ATT001',
    name: 'Aarav Sharma',
    userId: 'STU001',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU001/40/40',
    periods: [
        { period: 1, subject: 'Data Structures', status: 'Compliant' },
        { period: 2, subject: 'Algorithms', status: 'Compliant' },
        { period: 3, subject: 'Database Systems', status: 'Non-Compliant', violation: 'No ID card' },
        { period: 4, subject: 'Operating Systems', status: 'Compliant' },
    ]
  },
  {
    id: 'ATT002',
    name: 'Diya Patel',
    userId: 'STU002',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU002/40/40',
    periods: [
        { period: 1, subject: 'Data Structures', status: 'Compliant' },
        { period: 2, subject: 'Algorithms', status: 'Compliant' },
        { period: 3, subject: 'Database Systems', status: 'Compliant' },
        { period: 4, subject: 'Operating Systems', status: 'Absent' },
    ]
  },
   {
    id: 'ATT003',
    name: 'Rohan Joshi',
    userId: 'STU003',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU003/40/40',
    periods: [
        { period: 1, subject: 'Circuit Theory', status: 'Non-Compliant', violation: 'Improper hairstyle' },
        { period: 2, subject: 'Digital Electronics', status: 'Compliant' },
        { period: 3, subject: 'Signal Processing', status: 'Compliant' },
        { period: 4, subject: 'Control Systems', status: 'Compliant' },
    ]
  },
   {
    id: 'ATT004',
    name: 'Priya Singh',
    userId: 'STU004',
    date: '2024-08-01',
    imageUrl: 'https://picsum.photos/seed/STU004/40/40',
    periods: [
        { period: 1, subject: 'Circuit Theory', status: 'Absent' },
        { period: 2, subject: 'Digital Electronics', status: 'Absent' },
        { period: 3, subject: 'Signal Processing', status: 'Compliant' },
        { period: 4, subject: 'Control Systems', status: 'Non-Compliant', violation: 'Shoes not polished' },
    ]
  },
];


export const mockTimetables: Timetable[] = [
    {
        id: 'TT01',
        departmentId: 'DPT01',
        imageUrl: 'https://picsum.photos/seed/TT01/1200/600',
        schedule: [
            { period: 1, subject: 'Data Structures', faculty: 'Dr. Sameer Verma', time: '09:00 - 10:00' },
            { period: 2, subject: 'Algorithms', faculty: 'Dr. Sameer Verma', time: '10:00 - 11:00' },
            { period: 3, subject: 'Database Systems', faculty: 'Guest Lecturer', time: '11:15 - 12:15' },
            { period: 4, subject: 'Operating Systems', faculty: 'Prof. Aditi Rao', time: '01:00 - 02:00' },
        ]
    },
    {
        id: 'TT02',
        classId: 'CLS01',
        imageUrl: 'https://picsum.photos/seed/TT02/1200/600',
         schedule: [
            { period: 1, subject: 'Data Structures', faculty: 'Dr. Sameer Verma', time: '09:00 - 10:00' },
            { period: 2, subject: 'Algorithms', faculty: 'Dr. Sameer Verma', time: '10:00 - 11:00' },
            { period: 3, subject: 'Database Systems', faculty: 'Guest Lecturer', time: '11:15 - 12:15' },
            { period: 4, subject: 'Operating Systems', faculty: 'Prof. Aditi Rao', time: '01:00 - 02:00' },
        ]
    },
     {
        id: 'TT03',
        classId: 'CLS02',
        imageUrl: 'https://picsum.photos/seed/TT03/1200/600',
         schedule: [
            { period: 1, subject: 'Circuit Theory', faculty: 'Ms. Sunita Reddy', time: '09:00 - 10:00' },
            { period: 2, subject: 'Digital Electronics', faculty: 'Ms. Sunita Reddy', time: '10:00 - 11:00' },
            { period: 3, subject: 'Signal Processing', faculty: 'Prof. Vikram Rao', time: '11:15 - 12:15' },
            { period: 4, subject: 'Control Systems', faculty: 'Guest Lecturer', time: '01:00 - 02:00' },
        ]
    }
];
