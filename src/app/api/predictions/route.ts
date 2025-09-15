import { NextResponse } from 'next/server';

const DATA_API_ENDPOINT = process.env.NEON_DATA_API_ENDPOINT;
const API_KEY = process.env.NEON_API_KEY;

if (!DATA_API_ENDPOINT || !API_KEY) {
  // This will not throw during build time, but at runtime if the vars are not set.
  // It's better to handle this gracefully in the request.
  console.error("Neon Data API endpoint or API key is not defined. Please check environment variables.");
}

export async function GET(request: Request) {
  if (!DATA_API_ENDPOINT || !API_KEY) {
    return NextResponse.json({ message: 'Database is not configured.' }, { status: 500 });
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
        return NextResponse.json({ message: 'Failed to fetch predictions', error: errorText }, { status: res.status });
    }

    const records = await res.json();
    return NextResponse.json(records);

  } catch (error: any) {
    console.error('Failed to fetch predictions:', error);
    return NextResponse.json({ message: 'Failed to fetch predictions', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!DATA_API_ENDPOINT || !API_KEY) {
        return NextResponse.json({ message: 'Database is not configured.' }, { status: 500 });
    }

  try {
    const { userId, label, confidence, imageId } = await request.json();

    if (!userId || !label || confidence === undefined || !imageId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newPrediction = {
        user_id: userId,
        label,
        confidence,
        imageId, // This could be an ID from an image storage service
    };
    
    // Neon's API expects an array of objects for bulk insertion, so we wrap our object in an array.
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
    
    const createdPrediction = (await res.json())[0];

    return NextResponse.json(createdPrediction, { status: 201 });

  } catch (error: any) {
    console.error('Failed to save prediction:', error);
    return NextResponse.json({ message: 'Failed to save prediction', error: error.message }, { status: 500 });
  }
}
