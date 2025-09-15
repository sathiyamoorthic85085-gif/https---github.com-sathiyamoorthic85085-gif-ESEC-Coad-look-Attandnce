
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, department, rollNumber, registerNumber } = body;
        
        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }
        

        const newUser: User = {
            id: `USR${Math.floor(Math.random() * 1000)}`,
            name,
            email,
            password, // In a real app, this should be hashed. Storing for local auth simulation.
            role,
            department: role === 'Admin' ? 'Administration' : department,
            imageUrl: `https://picsum.photos/seed/USR${Math.floor(Math.random() * 1000)}/100/100`,
            rollNumber: role === 'Student' ? rollNumber : undefined,
            registerNumber: role === 'Student' ? registerNumber : undefined,
            classId: role === 'Student' ? 'CLS01' : undefined, // Assign a default class for simplicity
        };

        // Note: This only adds to the in-memory array for the purpose of the API.
        // The frontend state in AuthContext also needs to be updated.
        mockUsers.push(newUser);

        return NextResponse.json({ user: newUser }, { status: 201 });

    } catch (error: any) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ message: 'Failed to create user', error: error.message }, { status: 500 });
    }
}
