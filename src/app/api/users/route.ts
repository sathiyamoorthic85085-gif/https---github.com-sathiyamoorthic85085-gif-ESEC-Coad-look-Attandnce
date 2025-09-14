import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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
        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // Note: In production, hash this password!
                role,
                department,
                rollNumber,
                registerNumber,
                imageUrl: `https://picsum.photos/seed/${rollNumber || email}/100/100`,
            }
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}
