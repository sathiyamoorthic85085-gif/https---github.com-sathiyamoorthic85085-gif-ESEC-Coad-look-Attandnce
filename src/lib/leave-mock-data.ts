import type { LeaveRequest } from './types';

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 'LR001',
        userId: 'STU001',
        userName: 'ABHI RUBEN S',
        userRole: 'Student',
        type: 'Leave',
        startDate: '2024-08-01',
        endDate: '2024-08-02',
        reason: 'Family function in another city. Need to travel for two days.',
        status: 'Approved',
        aiSummary: 'Requesting 2 days leave for a family function requiring travel.'
    },
    {
        id: 'LR002',
        userId: 'STU002',
        userName: 'ABINAYASRI V',
        userRole: 'Student',
        type: 'Leave',
        startDate: '2024-08-05',
        endDate: '2024-08-05',
        reason: 'Not feeling well, suffering from fever and headache.',
        status: 'Pending HOD',
        aiSummary: 'Requesting 1 day sick leave due to fever and headache.'
    },
    {
        id: 'LR003',
        userId: 'USR003',
        userName: 'Peter Jones',
        userRole: 'Faculty',
        type: 'Leave',
        startDate: '2024-08-10',
        endDate: '2024-08-11',
        reason: 'Attending a national conference on computer science education.',
        status: 'Pending Admin',
        aiSummary: 'Requesting 2 days leave to attend a national CS conference.'
    },
     {
        id: 'LR004',
        userId: 'STU004',
        userName: 'CIBIVARSHAN K',
        userRole: 'Student',
        type: 'OD',
        startDate: '2024-08-12',
        endDate: '2024-08-12',
        reason: 'Representing the college in the state-level hackathon event.',
        status: 'Pending Advisor',
        aiSummary: 'Requesting 1 day On-Duty to participate in a state-level hackathon for the college.'
    },
];
