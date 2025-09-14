import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
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

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role,
            },
        });

        const { passwordHash: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword, message: "✅ Registered successfully" }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: '❌ Registration failed' }, { status: 500 });
    }
}
