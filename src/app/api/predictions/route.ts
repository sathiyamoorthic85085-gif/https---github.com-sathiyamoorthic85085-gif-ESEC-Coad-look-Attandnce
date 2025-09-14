import { NextResponse } from 'next/server';

const DATA_API_ENDPOINT = process.env.NEON_DATA_API_ENDPOINT;
const API_KEY = process.env.NEON_API_KEY;

if (!DATA_API_ENDPOINT || !API_KEY) {
  throw new Error("Neon Data API endpoint or API key is not defined");
}

export async function GET(request: Request) {
  try {
    const res = await fetch(`${DATA_API_ENDPOINT}/prediction?select=*,user:user_id(*)&order=created_at.desc&limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Neon-Raw-Array-Result': 'false',
      },
      next: {
        revalidate: 0 // Do not cache
      }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch predictions:', errorText);
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
  try {
    const { userId, label, confidence, imageId } = await request.json();

    if (!userId || !label || confidence === undefined || !imageId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newPrediction = {
        user_id: userId,
        label,
        confidence,
        imageId,
    };
    
    const res = await fetch(`${DATA_API_ENDPOINT}/prediction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify([newPrediction]) // Neon API expects an array of objects
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to save prediction:', errorText);
        return NextResponse.json({ message: 'Failed to save prediction', error: errorText }, { status: res.status });
    }
    
    // The Neon Data API returns the created records in the body on success
    const createdPrediction = (await res.json())[0];

    return NextResponse.json(createdPrediction, { status: 201 });

  } catch (error: any) {
    console.error('Failed to save prediction:', error);
    return NextResponse.json({ message: 'Failed to save prediction', error: error.message }, { status: 500 });
  }
}
