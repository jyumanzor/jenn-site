import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, syncAllActivities } from '@/lib/strava';
import { promises as fs } from 'fs';
import path from 'path';

// POST /api/strava/sync - Sync activities from Strava
export async function POST(request: NextRequest) {
  try {
    // Read stored tokens
    const tokensPath = path.join(process.cwd(), 'data', 'strava-tokens.json');
    let tokensData;

    try {
      const tokensFile = await fs.readFile(tokensPath, 'utf-8');
      tokensData = JSON.parse(tokensFile);
    } catch {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect Strava first.' },
        { status: 401 }
      );
    }

    // Get valid access token (refresh if needed)
    const validTokens = await getValidAccessToken(tokensData);

    // Save refreshed tokens if they changed
    if (validTokens.access_token !== tokensData.access_token) {
      await fs.writeFile(tokensPath, JSON.stringify({
        ...validTokens,
        updated_at: new Date().toISOString(),
      }, null, 2));
    }

    // Get request body for options
    const body = await request.json().catch(() => ({}));
    const afterDate = body.after ? new Date(body.after) : undefined;

    // Fetch activities
    const activities = await syncAllActivities(validTokens.access_token, afterDate);

    // Read existing strava data
    const stravaPath = path.join(process.cwd(), 'data', 'strava.json');
    let existingData = { activities: [], lastSync: null };

    try {
      const existingFile = await fs.readFile(stravaPath, 'utf-8');
      existingData = JSON.parse(existingFile);
    } catch {
      // File doesn't exist yet
    }

    // Merge new activities with existing (avoid duplicates)
    const existingIds = new Set(existingData.activities.map((a: { activityId: string }) => a.activityId));
    const newActivities = activities.filter(a => !existingIds.has(a.activityId));
    const mergedActivities = [...newActivities, ...existingData.activities];

    // Sort by date descending
    mergedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Save updated data
    const updatedData = {
      activities: mergedActivities,
      lastSync: new Date().toISOString(),
      totalActivities: mergedActivities.length,
    };

    await fs.writeFile(stravaPath, JSON.stringify(updatedData, null, 2));

    return NextResponse.json({
      success: true,
      newActivities: newActivities.length,
      totalActivities: mergedActivities.length,
      lastSync: updatedData.lastSync,
    });
  } catch (err) {
    console.error('Strava sync error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    );
  }
}

// GET /api/strava/sync - Get sync status
export async function GET() {
  try {
    const stravaPath = path.join(process.cwd(), 'data', 'strava.json');
    const tokensPath = path.join(process.cwd(), 'data', 'strava-tokens.json');

    let isConnected = false;
    let lastSync = null;
    let totalActivities = 0;

    try {
      await fs.access(tokensPath);
      isConnected = true;
    } catch {
      isConnected = false;
    }

    try {
      const stravaFile = await fs.readFile(stravaPath, 'utf-8');
      const data = JSON.parse(stravaFile);
      lastSync = data.lastSync;
      totalActivities = data.activities?.length || 0;
    } catch {
      // No data yet
    }

    return NextResponse.json({
      isConnected,
      lastSync,
      totalActivities,
    });
  } catch (err) {
    console.error('Strava status error:', err);
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}
