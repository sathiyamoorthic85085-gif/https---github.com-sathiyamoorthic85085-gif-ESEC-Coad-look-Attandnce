
export interface ChatGroup {
    id: string;
    name: string;
    type: 'class' | 'faculty';
    department: string;
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
    { id: 'CLS01', name: 'II Year, Section A', type: 'class', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/CLS01/100/100' },
    { id: 'CLS02', name: 'III Year, Section B', type: 'class', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/CLS02/100/100' },
    { id: 'FAC01', name: 'CS Faculty', type: 'faculty', department: 'Computer Science', imageUrl: 'https://picsum.photos/seed/FAC01/100/100' },
    { id: 'FAC02', name: 'EE Faculty', type: 'faculty', department: 'Electrical Engineering', imageUrl: 'https://picsum.photos/seed/FAC02/100/100' },
];

export const mockMessages: Record<string, Message[]> = {
    'CLS01': [
        { id: 'msg1', groupId: 'CLS01', senderId: 'USR008', content: 'Hello everyone, please submit your assignments by this Friday.', timestamp: '2024-08-01T10:00:00Z' },
        { id: 'msg2', groupId: 'CLS01', senderId: 'STU001', content: 'Okay, noted. Thanks for the reminder!', timestamp: '2024-08-01T10:05:00Z' },
    ],
    'FAC01': [
        { id: 'msg3', groupId: 'FAC01', senderId: 'USR004', content: 'Faculty meeting at 3 PM today to discuss the curriculum.', timestamp: '2024-08-01T09:30:00Z' },
    ]
};
