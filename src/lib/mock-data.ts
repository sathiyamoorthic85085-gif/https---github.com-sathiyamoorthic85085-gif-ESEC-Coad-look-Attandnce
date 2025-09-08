import type { AttendanceRecord } from './types';

const staticDate = new Date().toLocaleDateString('en-CA');

export const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 'USR001',
    name: 'John Doe',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR001/100/100',
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR002/100/100',
  },
  {
    id: 'USR003',
    name: 'Peter Jones',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR003/100/100',
  },
  {
    id: 'USR004',
    name: 'Mary Williams',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR004/100/100',
  },
    {
    id: 'USR005',
    name: 'David Brown',
    date: staticDate,
    status: 'Pending',
    attendance: 'Absent',
    imageUrl: 'https://picsum.photos/seed/USR005/100/100',
  },
];

export const mockViolations: string[] = [
    "Not wearing a tie",
    "Informal footwear (sneakers)",
    "Wearing a t-shirt instead of a collared shirt",
    "Unkempt hair",
    "Jeans instead of formal trousers"
];
