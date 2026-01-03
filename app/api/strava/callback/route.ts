import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/strava';
import { promises as fs } from 'fs';
import path from 'path';

// GET /api/strava/callback - Handle OAuth callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/io/running?error=auth_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/io/running?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens securely (in a JSON file for now - in production use a database)
    const tokensPath = path.join(process.cwd(), 'data', 'strava-tokens.json');
    await fs.writeFile(tokensPath, JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      updated_at: new Date().toISOString(),
    }, null, 2));

    // Redirect to success page
    return NextResponse.redirect(new URL('/io/running?strava=connected', request.url));
  } catch (err) {
    console.error('Strava auth error:', err);
    return NextResponse.redirect(new URL('/io/running?error=auth_failed', request.url));
  }
}
