import { NextResponse } from 'next/server';

// In production, you'd want to store these in a database
// For now, we log them (visible in Vercel function logs)
// and return success

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, suggestion, timestamp } = body;

    // Validate
    if (!type || !suggestion) {
      return NextResponse.json(
        { error: 'Missing type or suggestion' },
        { status: 400 }
      );
    }

    // Log for Vercel function logs (you can see these in Vercel dashboard)
    console.log('New suggestion received:', {
      type,
      suggestion,
      timestamp: timestamp || new Date().toISOString(),
    });

    // TODO: Add storage here when ready
    // Options:
    // 1. Vercel KV (free tier available)
    // 2. Supabase (free tier)
    // 3. Send email via Resend
    // 4. Airtable API

    return NextResponse.json({
      success: true,
      message: 'Suggestion received',
    });
  } catch (error) {
    console.error('Error processing suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Suggestions API. POST to submit a suggestion.',
  });
}
