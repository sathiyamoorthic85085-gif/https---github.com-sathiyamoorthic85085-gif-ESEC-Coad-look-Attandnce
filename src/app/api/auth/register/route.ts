import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import type { UserRole } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Name, email, password, and role are required' }, { status: 400 });
        }

        const allowedRoles: UserRole[] = ['Admin', 'HOD', 'Faculty', 'Student', 'Advisor'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
        }

        const api = process.env.NEON_DATA_API;
        const apiKey = process.env.NEON_API_KEY;

        if (!api || !apiKey) {
          return NextResponse.json({ error: 'Database API configuration is missing' }, { status: 500 });
        }

        // Check if user exists
        const findUserResponse = await fetch(`${api}/User?select=email&email=eq.${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Neon-Raw-Array-Result': 'false',
          },
        });

        if (!findUserResponse.ok) {
            const errorBody = await findUserResponse.text();
            console.error('Neon user find failed on register:', errorBody);
            return NextResponse.json({ error: 'Database query failed when checking for user' }, { status: 500 });
        }

        const existingUsers = await findUserResponse.json();
        if (existingUsers && existingUsers.length > 0) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            passwordHash,
            role: role,
        };

        const createUserResponse = await fetch(`${api}/User`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Neon-Raw-Array-Result': 'false',
            },
            body: JSON.stringify([newUser]) // Neon API expects an array of objects
        });
        
        if (!createUserResponse.ok) {
            const errorBody = await createUserResponse.text();
            console.error('Neon user creation failed:', errorBody);
            return NextResponse.json({ message: 'Failed to create user in database', details: errorBody }, { status: 500 });
        }

        const createdUser = (await createUserResponse.json())[0];
        
        const { passwordHash: _, ...userWithoutPassword } = createdUser;

        return NextResponse.json({ user: userWithoutPassword, message: "✅ Registered successfully" }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: '❌ Registration failed' }, { status: 500 });
    }
}
