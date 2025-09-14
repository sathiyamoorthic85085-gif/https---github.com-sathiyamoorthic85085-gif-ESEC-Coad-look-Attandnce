import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
    }

    let user: any = null;
    if (role === 'Student') {
      user = await prisma.student.findUnique({
        where: { email },
      });
    } else { // Handles Faculty, HOD, Admin, Advisor
      user = await prisma.faculty.findUnique({
        where: { email },
      });
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const userRole = role === 'Student' ? 'Student' : user.role;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );
    
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({ token, user: { ...userWithoutPassword, role: userRole } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
