# Data Schemas — Jenn's Personal Site

> TypeScript interfaces for all JSON data files in `/data/`

---

## travel.json

```typescript
interface Location {
  id: string;                           // e.g., "washington-dc"
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'home' | 'roots' | 'visited' | 'future';
  visits: string;                       // e.g., "2019-present"
  notes: string;
  highlights: string[];
  images?: string[];                    // relative paths
}

// Root: { locations: Location[] }
```

---

## races.json

```typescript
interface Marathon {
  id: string;                           // e.g., "geneva-2025"
  name: string;
  date: string;                         // ISO date "2025-09-06"
  location: string;
  time: string;                         // "3:09:26"
  pace: string;                         // "7:14/mi"
  bostonQualifier: boolean;
  isPR: boolean;
  temp: string;                         // "55°F"
  conditions: string;
  placement: string;
  ageGroupPercentile: string;
  notes: string;
  splits?: {
    mile: number;
    time: string;
  }[];
}

// Root: { marathons: Marathon[] }
```

---

## playlists.json

```typescript
interface Track {
  title: string;
  artist: string;
  album: string;
  plays: number;
  isHighlighted: boolean;
}

interface Playlist {
  id: string;                           // e.g., "joy-aligned"
  name: string;
  description: string;
  vibe: string;
  isHighFrequency: boolean;
  tracks: Track[];
}

// Root: { playlists: Playlist[] }
```

---

## health.json

```typescript
interface Measurement {
  date: string;                         // ISO date
  weight: number;                       // lbs
  bodyFatMass: number;
  boneMass: number;
  proteinMass: number;
  bodyWaterMass: number;
  muscleMass: number;
  skeletalMuscleMass: number;
  bmi: number;
  bodyFatPercentage: number;
  visceralFat: number;
  bmr: number;                          // Basal Metabolic Rate
  fatFreeMass: number;
  subcutaneousFat: number;
  smi: number;                          // Skeletal Muscle Index
  metabolicAge: number;
  whr: number;                          // Waist-to-Hip Ratio
  bodyScore: number;
}

interface HealthProfile {
  gender: string;
  age: number;
  height: string;                       // e.g., "5'6\""
  heightCm: number;
}

// Root: { profile: HealthProfile; measurements: Measurement[] }
```

---

## dining.json

```typescript
interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;                       // 1-5
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  visited: string;                      // ISO date
  notes: string;
  favorites?: string[];                 // dish names
  coordinates?: { lat: number; lng: number };
}
```

---

## journal.json

```typescript
interface JournalEntry {
  id: string;
  date: string;                         // ISO date
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}
```

---

## culture.json / oscars.json / pulitzers.json

```typescript
interface CultureItem {
  id: string;
  year: number;
  title: string;
  category: string;
  winner: string;
  notes?: string;
  watched?: boolean;                    // for oscars
  read?: boolean;                       // for pulitzers
}
```

---

## strava.json

```typescript
interface StravaActivity {
  id: number;
  name: string;
  type: 'Run' | 'Ride' | 'Walk' | 'Workout';
  date: string;
  distance: number;                     // meters
  movingTime: number;                   // seconds
  elevationGain: number;                // meters
  averageHeartrate?: number;
  maxHeartrate?: number;
  averagePace?: string;
}
```

---

## session-learnings.json

```typescript
interface SessionLearning {
  id: string;
  date: string;
  session: string;                      // session identifier
  learnings: string[];
  tools?: string[];
  nextSteps?: string[];
}
```

---

## workflow-questions.json / captured-questions.json

```typescript
interface Question {
  id: string;
  question: string;
  context?: string;
  status: 'open' | 'answered' | 'deferred';
  answer?: string;
  tags?: string[];
  createdAt: string;
}
```

---

## voice-memos.json

```typescript
interface VoiceMemo {
  id: string;
  filename: string;
  transcript: string;
  date: string;
  duration: number;                     // seconds
  tags?: string[];
  summary?: string;
}
```

---

## project-configs.json

```typescript
interface ProjectConfig {
  id: string;
  name: string;
  path: string;
  type: 'personal' | 'work';
  stack: string[];
  lastAccessed: string;
}
```
