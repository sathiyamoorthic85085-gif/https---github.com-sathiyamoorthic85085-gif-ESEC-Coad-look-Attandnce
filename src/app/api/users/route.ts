
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, department, rollNumber, registerNumber } = body;
        
        let passwordHash;
        if (role !== 'Student' && password) {
          passwordHash = await bcrypt.hash(password, 10);
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash, // This will be undefined for students, which is correct
                role,
                department,
                rollNumber,
                registerNumber,
                imageUrl: `https://picsum.photos/seed/${rollNumber || email}/100/100`,
            }
        });
        
        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error) {
        console.error(error);
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
             return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
