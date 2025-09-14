
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Remove password hash from the user object before creating the token and sending the response
    const { passwordHash, ...userWithoutPassword } = user;

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your_default_secret', {
      expiresIn: '1h',
    });
    
    cookies().set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 });
    cookies().set('user', JSON.stringify(userWithoutPassword), { path: '/', maxAge: 60 * 60 });

    return NextResponse.json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
