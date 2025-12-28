import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { kv } from '@vercel/kv';

// Initialize Resend lazily to avoid build-time errors
const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

interface Suggestion {
  id: string;
  type: string;
  suggestion: string;
  timestamp: string;
}

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

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const suggestionData: Suggestion = {
      id,
      type,
      suggestion,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Store in Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        // Add to list of all suggestions
        await kv.lpush('suggestions', JSON.stringify(suggestionData));
        // Also store by type for easy filtering
        await kv.lpush(`suggestions:${type}`, JSON.stringify(suggestionData));
        console.log('Stored suggestion in Vercel KV:', id);
      } catch (kvError) {
        console.error('Vercel KV error:', kvError);
      }
    } else {
      console.log('Vercel KV not configured, skipping storage');
    }

    // Send email notification via Resend
    const resend = getResend();
    if (resend && process.env.NOTIFICATION_EMAIL) {
      try {
        await resend.emails.send({
          from: 'Jenn Site <onboarding@resend.dev>',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `New ${type} suggestion`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2a3c24;">New Suggestion Received</h2>
              <div style="background: #f7e5da; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${type}</p>
                <p style="margin: 0 0 8px 0;"><strong>Suggestion:</strong></p>
                <p style="margin: 0; padding: 12px; background: white; border-radius: 8px;">${suggestion}</p>
                <p style="margin: 16px 0 0 0; font-size: 12px; color: #666;">
                  Received: ${new Date(suggestionData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          `,
        });
        console.log('Sent email notification for suggestion:', id);
      } catch (emailError) {
        console.error('Resend email error:', emailError);
      }
    } else {
      console.log('Resend not configured, skipping email');
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion received',
      id,
    });
  } catch (error) {
    console.error('Error processing suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion' },
      { status: 500 }
    );
  }
}

// GET all suggestions (for admin use)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({
      message: 'Vercel KV not configured',
      suggestions: [],
    });
  }

  try {
    const key = type ? `suggestions:${type}` : 'suggestions';
    const rawSuggestions = await kv.lrange(key, 0, limit - 1);

    const suggestions = rawSuggestions.map((item) => {
      if (typeof item === 'string') {
        return JSON.parse(item);
      }
      return item;
    });

    return NextResponse.json({
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
