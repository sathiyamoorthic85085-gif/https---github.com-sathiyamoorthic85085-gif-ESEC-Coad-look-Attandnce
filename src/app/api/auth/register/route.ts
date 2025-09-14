
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { User, UserRole } from '@/lib/types';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, role, department, rollNumber, registerNumber } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const lowercasedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: lowercasedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: lowercasedEmail,
        passwordHash,
        role,
        department: department || 'N/A',
        rollNumber,
        registerNumber,
        imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/100/100`,
        classId: role === 'Student' ? 'CLS01' : undefined,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // @ts-ignore
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
