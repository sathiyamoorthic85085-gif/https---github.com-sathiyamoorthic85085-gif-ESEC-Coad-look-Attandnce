
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { UserRole } from '@/lib/types';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
    }

    let user: any = null;
    let isPasswordCorrect = false;

    if (role === 'Student') {
      user = await prisma.student.findUnique({ where: { email } });
      if (user && user.rollNumber === password) {
        isPasswordCorrect = true;
      }
    } else { // Handles Faculty, HOD, Admin, Advisor
      user = await prisma.faculty.findUnique({ where: { email } });
      // Standard password for all non-student roles
      if (user && password === 'Welcome@123') {
        isPasswordCorrect = true;
      }
    }

    if (!user || !isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const userRole = role === 'Student' ? 'Student' : user.role;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );
    
    // Omit password hash if it exists
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({ token, user: { ...userWithoutPassword, role: userRole } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
