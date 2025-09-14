
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { UserRole } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, role, department, rollNumber, registerNumber, classId } = body;
        
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
                    imageUrl: `https://picsum.photos/seed/${rollNumber}/100/100`,
                }
            });
        } else { // Faculty, HOD, Admin, Advisor
            // No password needed for non-student roles as it's standardized
            newUser = await prisma.faculty.create({
                data: {
                    name,
                    email,
                    role: role as Exclude<UserRole, 'Student'>,
                    department,
                    imageUrl: `https://picsum.photos/seed/${email}/100/100`,
                }
            });
        }
        
        return NextResponse.json({ ...newUser, role }, { status: 201 });

    } catch (error) {
        console.error(error);
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
