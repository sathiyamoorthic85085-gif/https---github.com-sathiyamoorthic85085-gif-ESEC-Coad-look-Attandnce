import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const records = await prisma.prediction.findMany({
      include: { user: true },
      orderBy: { created_at: 'desc' },
      take: 10, // Limit to the last 10 predictions for the live feed
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    return NextResponse.json({ message: 'Failed to fetch predictions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, label, confidence, imageId } = await request.json();

    if (!userId || !label || confidence === undefined || !imageId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const prediction = await prisma.prediction.create({
      data: {
        user_id: userId,
        label,
        confidence,
        imageId,
      },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error('Failed to save prediction:', error);
    return NextResponse.json({ message: 'Failed to save prediction' }, { status: 500 });
  }
}
