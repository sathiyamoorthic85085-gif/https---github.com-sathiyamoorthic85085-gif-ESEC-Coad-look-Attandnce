
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

export async function DELETE(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const userIndex = mockUsers.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        mockUsers.splice(userIndex, 1);

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
    }
}
