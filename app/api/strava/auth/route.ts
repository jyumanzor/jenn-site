import { NextResponse } from 'next/server';
import { getStravaAuthUrl } from '@/lib/strava';

// GET /api/strava/auth - Redirect to Strava OAuth
export async function GET() {
  const authUrl = getStravaAuthUrl();
  return NextResponse.redirect(authUrl);
}
