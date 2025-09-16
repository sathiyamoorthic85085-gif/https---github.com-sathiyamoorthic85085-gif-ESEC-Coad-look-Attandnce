
import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

const DATA_API_ENDPOINT = process.env.NEON_DATA_API_ENDPOINT;
const API_KEY = process.env.NEON_API_KEY;

export async function GET(request: Request) {
  // If the database isn't configured, return an empty array to prevent crashing.
  if (!DATA_API_ENDPOINT || !API_KEY) {
    return NextResponse.json([]);
  }

  try {
    // Fetch latest 10 predictions, joining with the user table to get user names
    const res = await fetch(`${DATA_API_ENDPOINT}/prediction?select=*,user:user_id(*)&order=created_at.desc&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Neon-Raw-Array-Result': 'false',
      },
      // Ensure we always get the latest data
      next: {
        revalidate: 0 
      }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch predictions from Neon:', errorText);
        // Return empty array on fetch failure to avoid breaking the UI
        return NextResponse.json([]);
    }

    const records = await res.json();
    return NextResponse.json(records);

  } catch (error: any) {
    console.error('Failed to fetch predictions:', error);
     // Return empty array on general error
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
    if (!DATA_API_ENDPOINT || !API_KEY) {
        // Return a clear error if the database is not configured for POST requests
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

    const newPrediction = {
        user_id: userId,
        label,
        confidence,
        imageId, // This could be an ID from an image storage service
    };
    
    const res = await fetch(`${DATA_API_ENDPOINT}/prediction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify([newPrediction]) 
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to save prediction to Neon:', errorText);
        return NextResponse.json({ message: 'Failed to save prediction', error: errorText }, { status: res.status });
    }
    
    // The response from Neon for an insert is an array of the inserted records.
    const createdPredictionArray = await res.json();
    const createdPrediction = createdPredictionArray[0];

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
