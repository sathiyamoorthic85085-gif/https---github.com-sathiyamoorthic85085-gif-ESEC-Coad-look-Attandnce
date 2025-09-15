
import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, department, rollNumber, registerNumber } = body;
        
        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        
        // In a real application, you might use Stack to create the user.
        // const stackUser = await stackServerApp.users.create({
        //     email: email,
        //     password: password,
        //     displayName: name,
        // });

        const newUser: User = {
            id: `USR${Math.floor(Math.random() * 1000)}`, // Or use stackUser.id
            name,
            email,
            role,
            department: role === 'Admin' ? 'Administration' : department,
            imageUrl: `https://picsum.photos/seed/USR${Math.floor(Math.random() * 1000)}/100/100`,
            rollNumber: role === 'Student' ? rollNumber : undefined,
            registerNumber: role === 'Student' ? registerNumber : undefined,
            classId: role === 'Student' ? 'CLS01' : undefined, // Assign a default class for simplicity
        };

        mockUsers.push(newUser);

        return NextResponse.json({ user: newUser }, { status: 201 });

    } catch (error: any) {
        console.error('Failed to create user:', error);
        return NextResponse.json({ message: 'Failed to create user', error: error.message }, { status: 500 });
    }
}
