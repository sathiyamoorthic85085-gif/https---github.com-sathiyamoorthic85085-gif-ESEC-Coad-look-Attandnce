import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const api = process.env.NEON_DATA_API;
    const apiKey = process.env.NEON_API_KEY;

    if (!api || !apiKey) {
      return NextResponse.json({ error: 'Database API configuration is missing' }, { status: 500 });
    }

    // Find user by email
    const findUserResponse = await fetch(`${api}/User?select=*&email=eq.${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Neon-Raw-Array-Result': 'false',
      },
    });

    if (!findUserResponse.ok) {
        return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }
    
    const users = await findUserResponse.json();
    const user: User = users[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash!);

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
