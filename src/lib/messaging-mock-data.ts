export interface ChatGroup {
    id: string;
    name: string;
    department: string;
    type: 'class' | 'faculty';
    imageUrl: string;
}

export interface Message {
    id: string;
    groupId: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export const mockMessageGroups: ChatGroup[] = [
    {
        id: 'CLS01',
        name: 'II Year, Section A',
        department: 'Computer Science',
        type: 'class',
        imageUrl: 'https://picsum.photos/seed/CLS01/100/100',
    },
    {
        id: 'CLS02',
        name: 'III Year, Section B',
        department: 'Electrical Engineering',
        type: 'class',
        imageUrl: 'https://picsum.photos/seed/CLS02/100/100',
    },
    {
        id: 'FAC01',
        name: 'CS Faculty',
        department: 'Computer Science',
        type: 'faculty',
        imageUrl: 'https://picsum.photos/seed/FAC01/100/100',
    },
     {
        id: 'FAC02',
        name: 'EE Faculty',
        department: 'Electrical Engineering',
        type: 'faculty',
        imageUrl: 'https://picsum.photos/seed/FAC02/100/100',
    }
];

export const mockMessages: Record<string, Message[]> = {
    'CLS01': [
        {
            id: 'msg1',
            groupId: 'CLS01',
            senderId: 'USR003', // Peter Jones (Faculty)
            content: "Hello everyone! Just a reminder that your assignments are due this Friday.",
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
        {
            id: 'msg2',
            groupId: 'CLS01',
            senderId: 'STU001', // ABHI RUBEN S
            content: "Okay sir, thank you for the reminder!",
            timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        },
         {
            id: 'msg3',
            groupId: 'CLS01',
            senderId: 'STU002', // ABINAYASRI V
            content: "Sir, can we get an extension?",
            timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        },
         {
            id: 'msg4',
            groupId: 'CLS01',
            senderId: 'USR003', // Peter Jones (Faculty)
            content: "I'm afraid not. Please ensure you submit it on time.",
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
    ],
    'FAC01': [
        {
            id: 'msg5',
            groupId: 'FAC01',
            senderId: 'USR004', // Mary Williams (HOD)
            content: "Team, the department meeting is scheduled for 3 PM tomorrow. Please be prepared with your reports.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: 'msg6',
            groupId: 'FAC01',
            senderId: 'USR003', // Peter Jones (Faculty)
            content: "Acknowledged. Thank you, Mary.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        }
    ]
};
