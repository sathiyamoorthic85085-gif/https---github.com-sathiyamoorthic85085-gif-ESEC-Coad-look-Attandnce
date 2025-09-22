import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  // If the database isn't configured, return an empty array to prevent crashing.
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set.');
    return NextResponse.json([]);
  }

  try {
    // Fetch latest 10 predictions, joining with the user table to get user names
    // Note: The neon serverless driver does not support JOINs in this format.
    // We will fetch predictions and then enrich them with user data.
    const predictions = await sql`
        SELECT id, user_id, label, confidence, "imageId", created_at
        FROM prediction
        ORDER BY created_at DESC
        LIMIT 10;
    `;
    
    // Enrich predictions with user data from mockUsers
    const enrichedPredictions = predictions.map(p => {
        const user = mockUsers.find(u => u.id === p.user_id);
        return {
            ...p,
            user: user ? { name: user.name, imageUrl: user.imageUrl } : { name: 'Unknown User', imageUrl: '' }
        };
    });

    return NextResponse.json(enrichedPredictions);

  } catch (error: any) {
    console.error('Failed to fetch predictions:', error);
    // Return empty array on general error
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ message: 'Database is not configured.' }, { status: 500 });
    }

  try {
    const { userId, label, confidence, imageId } = await request.json();

    if (!userId || !label || confidence === undefined || !imageId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the user in mock data to associate with the prediction
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
         return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Insert the new prediction and return it
    const newPrediction = await sql`
        INSERT INTO prediction (user_id, label, confidence, "imageId")
        VALUES (${userId}, ${label}, ${confidence}, ${imageId})
        RETURNING id, user_id, label, confidence, "imageId", created_at;
    `;

    const createdPrediction = newPrediction[0];

    // To make the response useful for the client, let's include the user details.
    const responsePayload = {
      ...createdPrediction,
      user: {
        name: user.name,
        imageUrl: user.imageUrl,
      }
    };

    return NextResponse.json(responsePayload, { status: 201 });

  } catch (error: any) {
    console.error('Failed to save prediction:', error);
    return NextResponse.json({ message: 'Failed to save prediction', error: error.message }, { status: 500 });
  }
}
