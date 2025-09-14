
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import type { UserRole } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, department, rollNumber, registerNumber, classId } = body;
        
        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        
        const passwordHash = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
                department: department || (role === 'Admin' ? 'Administration' : undefined),
                rollNumber,
                registerNumber,
                classId,
                imageUrl: `https://picsum.photos/seed/${email}/100/100`,
            }
        });
        
        const { passwordHash: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error) {
        console.error(error);
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
        }
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('rollNumber')) {
             return NextResponse.json({ message: 'An account with this roll number already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
