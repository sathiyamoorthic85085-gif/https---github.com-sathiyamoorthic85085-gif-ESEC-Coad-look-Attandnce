
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import type { UserRole } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, department, rollNumber, registerNumber, classId } = body;
        
        let newUser;
        if (role === 'Student') {
            newUser = await prisma.student.create({
                data: {
                    name,
                    email,
                    department,
                    rollNumber,
                    registerNumber,
                    classId,
                    imageUrl: `https://picsum.photos/seed/${email}/100/100`,
                }
            });
        } else { // Faculty, HOD, Admin, Advisor
            if (!password) {
                return NextResponse.json({ message: 'Password is required for non-student roles.' }, { status: 400 });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            newUser = await prisma.faculty.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: role as Exclude<UserRole, 'Student'>,
                    department,
                    imageUrl: `https://picsum.photos/seed/${email}/100/100`,
                }
            });
        }
        
        const { passwordHash: _, ...userWithoutPassword } = newUser;
        return NextResponse.json({ ...userWithoutPassword, role }, { status: 201 });

    } catch (error) {
        console.error(error);
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
