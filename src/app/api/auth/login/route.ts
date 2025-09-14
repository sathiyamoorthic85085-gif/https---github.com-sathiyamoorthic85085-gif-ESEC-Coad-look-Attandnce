import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.STACK_SECRET_SERVER_KEY || 'your_super_secret_key_here',
      { expiresIn: '1d' }
    );
    
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '❌ Login failed' }, { status: 500 });
  }
}
