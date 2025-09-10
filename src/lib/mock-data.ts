import type { AttendanceRecord, User, Department, Class, Timetable, TimetableEntry } from './types';

const staticDate = new Date().toLocaleDateString('en-CA');

export const mockUsers: User[] = [
    { id: 'USR003', name: 'Peter Jones', email: 'peter.jones@example.com', password: 'password', role: 'Faculty', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR003/100/100' },
    { id: 'USR004', name: 'Mary Williams', email: 'mary.williams@example.com', password: 'password', role: 'HOD', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/USR004/100/100' },
    { id: 'USR005', name: 'Admin User', email: 'sathiyamoorthi.c85085@gmail.com', password: '1234567890', role: 'Admin', department: 'Administration', imageUrl: 'https://picsum.photos/seed/USR005/100/100' },
    { id: 'USR007', name: 'Michael Wilson', email: 'michael.wilson@example.com', password: 'password', role: 'Faculty', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR007/100/100' },
    { id: 'USR008', name: 'Sarah Martinez', email: 'sarah.martinez@example.com', password: 'password', role: 'HOD', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/USR008/100/100' },
    { id: 'USR009', name: 'David Lee', email: 'david.lee@example.com', password: 'password', role: 'Advisor', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/USR009/100/100' },
    
    { id: 'STU001', name: 'ABHI RUBEN S', email: 'abhiruben2402@gmail.com', password: 'ES24EI01', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU001/100/100', rollNumber: 'ES24EI01', registerNumber: '2403730410721001' },
    { id: 'STU002', name: 'ABINAYASRI V', email: 'abinayasree0207@gmail.com', password: 'ES24EI02', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU002/100/100', rollNumber: 'ES24EI02', registerNumber: '2403730410722002' },
    { id: 'STU003', name: 'BANNARI SANKAR M', email: 'bannarisankar7@gmail.com', password: 'ES24EI03', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU003/100/100', rollNumber: 'ES24EI03', registerNumber: '2403730410721003' },
    { id: 'STU004', name: 'CIBIVARSHAN K', email: 'cibibharani@gmail.com', password: 'ES24EI04', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU004/100/100', rollNumber: 'ES24EI04', registerNumber: '2403730410721004' },
    { id: 'STU005', name: 'DAYALAN S', email: 'knassvd@gmail.com', password: 'ES24EI05', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU005/100/100', rollNumber: 'ES24EI05', registerNumber: '2403730410721005' },
    { id: 'STU006', name: 'DHANUSH V', email: 'romandhanush79@gmail.com', password: 'ES24EI06', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU006/100/100', rollNumber: 'ES24EI06', registerNumber: '2403730410721006' },
    { id: 'STU007', name: 'DHARUNSANJAY K', email: 'dharunsanjay681@gmail.com', password: 'ES24EI07', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU007/100/100', rollNumber: 'ES24EI07', registerNumber: '2403730410721007' },
    { id: 'STU008', name: 'DINESHKUMAR B', email: 'dineshmsd2007@gmail.com', password: 'ES24EI08', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU008/100/100', rollNumber: 'ES24EI08', registerNumber: '2403730410721008' },
    { id: 'STU009', name: 'GLORY CAMRYN JULIYA S', email: 'nithya9944426857@gamil.com', password: 'ES24EI09', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU009/100/100', rollNumber: 'ES24EI09', registerNumber: '2403730410722009' },
    { id: 'STU010', name: 'GOWTHAM T', email: 'gowthamt6977@gmail.com', password: 'ES24EI10', role: 'Student', department: 'Computer Science', classId: 'CLS01', imageUrl: 'https://picsum.photos/seed/STU010/100/100', rollNumber: 'ES24EI10', registerNumber: '2403730410721010' },
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

const csTimetable: TimetableEntry[] = [
    { period: 1, subject: 'Data Structures', faculty: 'Peter Jones', time: '9:00 - 10:00 AM' },
    { period: 2, subject: 'Algorithms', faculty: 'Peter Jones', time: '10:00 - 11:00 AM' },
    { period: 3, subject: 'Database Systems', faculty: 'Mary Williams', time: '11:00 - 12:00 PM' },
    { period: 4, subject: 'Operating Systems', faculty: 'Michael Wilson', time: '1:00 - 2:00 PM' },
];


export const mockAttendanceData: AttendanceRecord[] = mockUsers
    .filter(u => u.role === 'Student')
    .map(student => ({
        id: `ATT${student.id}`,
        userId: student.id,
        name: student.name,
        date: staticDate,
        imageUrl: student.imageUrl!,
        periods: csTimetable.map(entry => ({
            period: entry.period,
            subject: entry.subject,
            status: Math.random() > 0.1 ? 'Compliant' : (Math.random() > 0.5 ? 'Non-Compliant' : 'Absent'),
            violation: Math.random() > 0.9 ? 'Not wearing a tie' : undefined,
        })),
    }));

export const mockViolations: string[] = [
    "Not wearing a tie",
    "Informal footwear (sneakers)",
    "Wearing a t-shirt instead of a collared shirt",
    "Unkempt hair",
    "Jeans instead of formal trousers"
];

export const mockTimetables: Timetable[] = [
    {
        id: 'TT01',
        departmentId: 'DPT01',
        schedule: csTimetable,
        imageUrl: 'https://picsum.photos/seed/TT01/1200/600',
    },
    {
        id: 'TT02',
        classId: 'CLS01',
        schedule: csTimetable,
        imageUrl: 'https://picsum.photos/seed/TT02/1200/600',
    },
];
