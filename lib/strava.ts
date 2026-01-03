// Strava API Integration
// Docs: https://developers.strava.com/docs/reference/

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_BASE = 'https://www.strava.com/oauth';

interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  workout_type?: number;
}

// Get OAuth URL to redirect user for authorization
export function getStravaAuthUrl(): string {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/strava/callback`;

  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read,activity:read_all',
    approval_prompt: 'auto',
  });

  return `${STRAVA_AUTH_BASE}/authorize?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<StravaTokens> {
  const response = await fetch(`${STRAVA_AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  return response.json();
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
  const response = await fetch(`${STRAVA_AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(tokens: StravaTokens): Promise<StravaTokens> {
  const now = Math.floor(Date.now() / 1000);

  // If token expires in less than 5 minutes, refresh it
  if (tokens.expires_at < now + 300) {
    return refreshAccessToken(tokens.refresh_token);
  }

  return tokens;
}

// Fetch athlete activities
export async function fetchActivities(
  accessToken: string,
  options: {
    after?: number; // Unix timestamp
    before?: number;
    page?: number;
    per_page?: number;
  } = {}
): Promise<StravaActivity[]> {
  const params = new URLSearchParams();

  if (options.after) params.set('after', options.after.toString());
  if (options.before) params.set('before', options.before.toString());
  if (options.page) params.set('page', options.page.toString());
  params.set('per_page', (options.per_page || 50).toString());

  const response = await fetch(`${STRAVA_API_BASE}/athlete/activities?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch activities: ${error}`);
  }

  return response.json();
}

// Fetch a single activity with more details
export async function fetchActivity(accessToken: string, activityId: number): Promise<StravaActivity> {
  const response = await fetch(`${STRAVA_API_BASE}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch activity: ${error}`);
  }

  return response.json();
}

// Fetch athlete profile
export async function fetchAthlete(accessToken: string) {
  const response = await fetch(`${STRAVA_API_BASE}/athlete`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch athlete: ${error}`);
  }

  return response.json();
}

// Convert Strava activity to our format
export function formatActivity(activity: StravaActivity) {
  const distanceMiles = activity.distance / 1609.34;
  const movingTimeMinutes = activity.moving_time / 60;
  const paceMinPerMile = movingTimeMinutes / distanceMiles;
  const paceMin = Math.floor(paceMinPerMile);
  const paceSec = Math.round((paceMinPerMile - paceMin) * 60);

  const hours = Math.floor(activity.moving_time / 3600);
  const mins = Math.floor((activity.moving_time % 3600) / 60);
  const secs = activity.moving_time % 60;
  const timeStr = hours > 0
    ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${mins}:${secs.toString().padStart(2, '0')}`;

  return {
    activityId: activity.id.toString(),
    date: activity.start_date_local.split('T')[0],
    title: activity.name,
    sport: activity.sport_type === 'Run' ? 'Run' : activity.sport_type,
    distance_miles: Math.round(distanceMiles * 100) / 100,
    time: timeStr,
    pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
    elevation_feet: Math.round(activity.total_elevation_gain * 3.28084),
    avg_hr: activity.average_heartrate,
    max_hr: activity.max_heartrate,
    suffer_score: activity.suffer_score,
    isRace: activity.workout_type === 1,
  };
}

// Fetch all activities and format them
export async function syncAllActivities(accessToken: string, afterDate?: Date) {
  const activities: StravaActivity[] = [];
  let page = 1;
  const perPage = 100;

  const after = afterDate ? Math.floor(afterDate.getTime() / 1000) : undefined;

  while (true) {
    const batch = await fetchActivities(accessToken, {
      after,
      page,
      per_page: perPage,
    });

    if (batch.length === 0) break;

    activities.push(...batch);

    if (batch.length < perPage) break;
    page++;
  }

  return activities.map(formatActivity);
}
