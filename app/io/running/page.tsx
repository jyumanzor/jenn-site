"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import IOAuthGate from "@/components/IOAuthGate";
import stravaData from "@/data/strava.json";

// Color palette
const colors = {
  cream: "#FFF5EB",
  deepForest: "#2A3C24",
  sage: "#97A97C",
  lime: "#D4ED39",
  gold: "#FABF34",
  terracotta: "#C76B4A",
  strava: "#FC4C02",
};

// Helper to get Strava runs for a specific date
interface StravaActivity {
  sport: string;
  date: string;
  title: string;
  activityId: string;
  time: string;
  distance_miles: number;
  elevation_feet: number;
  relativeEffort: number;
  isRace?: boolean;
}

function getStravaRunsForDate(dateStr: string): StravaActivity[] {
  return stravaData.activities.filter(
    (activity: StravaActivity) => activity.date === dateStr && activity.sport === "Run"
  );
}

function getTotalStravaMilesForDate(dateStr: string): number {
  const runs = getStravaRunsForDate(dateStr);
  return runs.reduce((sum: number, run: StravaActivity) => sum + (run.distance_miles || 0), 0);
}

function getStravaWeekSummary(weekStart: Date): { totalMiles: number; runCount: number; activities: StravaActivity[] } {
  const activities: StravaActivity[] = [];
  let totalMiles = 0;
  let runCount = 0;

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayRuns = getStravaRunsForDate(dateStr);
    activities.push(...dayRuns);
    totalMiles += dayRuns.reduce((sum: number, r: StravaActivity) => sum + (r.distance_miles || 0), 0);
    runCount += dayRuns.length;
  }

  return { totalMiles, runCount, activities };
}

// Pfitzinger run types with colors and paces (sub-3:00 goal)
const runTypes = {
  rest: { label: "Rest Day", abbrev: "REST", defaultMiles: 0, pace: "-", color: "bg-[#F5F3EE]", textColor: "text-[#8B8780]", borderColor: "border-[#E8E4DC]" },
  recovery: { label: "Recovery", abbrev: "REC", defaultMiles: 4, pace: "8:56/mi", color: "bg-[#97A97C]/20", textColor: "text-[#546E40]", borderColor: "border-[#97A97C]/30" },
  ga: { label: "General Aerobic", abbrev: "GA", defaultMiles: 6, pace: "7:54-8:35/mi", color: "bg-[#97A97C]/30", textColor: "text-[#3B412D]", borderColor: "border-[#97A97C]/40" },
  lt: { label: "Lactate Threshold", abbrev: "LT", defaultMiles: 8, pace: "6:15-6:27/mi", color: "bg-[#FABF34]/20", textColor: "text-[#8B7355]", borderColor: "border-[#FABF34]/30" },
  vo2: { label: "VO2 Max", abbrev: "VO2", defaultMiles: 6, pace: "5:45-6:00/mi", color: "bg-[#FABF34]/30", textColor: "text-[#6B5B35]", borderColor: "border-[#FABF34]/40" },
  mlr: { label: "Medium Long Run", abbrev: "MLR", defaultMiles: 12, pace: "7:33-8:14/mi", color: "bg-[#CBAD8C]/30", textColor: "text-[#6B5B45]", borderColor: "border-[#CBAD8C]/40" },
  lr: { label: "Long Run", abbrev: "LR", defaultMiles: 16, pace: "7:33-8:14/mi", color: "bg-[#546E40]/20", textColor: "text-[#3B412D]", borderColor: "border-[#546E40]/30" },
  mp: { label: "Marathon Pace", abbrev: "MP", defaultMiles: 10, pace: "6:52/mi", color: "bg-[#546E40]/30", textColor: "text-[#2D3D20]", borderColor: "border-[#546E40]/40" },
  hmp: { label: "Half Marathon Pace", abbrev: "HMP", defaultMiles: 8, pace: "6:31-6:44/mi", color: "bg-[#CBAD8C]/40", textColor: "text-[#5B4B35]", borderColor: "border-[#CBAD8C]/50" },
  race: { label: "Race / Tune-up", abbrev: "RACE", defaultMiles: 10, pace: "Race Effort", color: "bg-[#d4ed39]/40", textColor: "text-[#2D3D20]", borderColor: "border-[#d4ed39]/50" },
};

type RunType = keyof typeof runTypes;

interface DaySchedule {
  type: RunType;
  plannedMiles: number;
  actualMiles?: number;
  notes?: string;
  completed?: boolean;
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

interface ActualRun {
  date: string;
  actualMiles: number;
  notes: string;
  feeling: "great" | "good" | "okay" | "tough" | "bad";
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayFullNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Race dates
const BOSTON_DATE = new Date("2026-04-20");
const CHICAGO_DATE = new Date("2026-10-11");

// Pfitzinger 18/70 Training Plan for Boston 2026
const bostonTrainingPlan: Record<string, string> = {
  "2025-12-03": "GA 5", "2025-12-04": "Rec 3", "2025-12-06": "Rest", "2025-12-07": "GA 5",
  "2025-12-08": "GA 7", "2025-12-09": "Rest", "2025-12-10": "VO2 5", "2025-12-11": "Rec 3",
  "2025-12-12": "GA 5", "2025-12-13": "Rest", "2025-12-14": "GA 5", "2025-12-15": "MLR 8",
  "2025-12-16": "LT 8", "2025-12-17": "Rec 5", "2025-12-18": "Rest", "2025-12-19": "GA 9",
  "2025-12-20": "Rec 4", "2025-12-21": "MLR 15", "2025-12-22": "Rest", "2025-12-23": "GA 8",
  "2025-12-24": "Rec 5", "2025-12-25": "Rest", "2025-12-26": "GA 10", "2025-12-27": "Rec 5",
  "2025-12-28": "MP 16", "2025-12-29": "MP 13", "2025-12-30": "Rec 5", "2025-12-31": "Rec 4",
  "2026-01-01": "Rest", "2026-01-02": "Rest", "2026-01-03": "GA 10", "2026-01-04": "MLR 15",
  "2026-01-05": "Rest", "2026-01-06": "GA 8", "2026-01-07": "LT 8", "2026-01-08": "Rec 4",
  "2026-01-09": "MLR 18", "2026-01-10": "Rec 5", "2026-01-11": "GA 10", "2026-01-12": "Rec 5",
  "2026-01-13": "Rest", "2026-01-14": "Rec 5", "2026-01-15": "LT 9", "2026-01-16": "Rec 5",
  "2026-01-17": "Rec 5", "2026-01-18": "Rec 5", "2026-01-19": "MP 18", "2026-01-20": "GA 8",
  "2026-01-21": "Rec 5", "2026-01-22": "Rec 5", "2026-01-23": "GA 8", "2026-01-24": "Rec 4",
  "2026-01-25": "MLR 15", "2026-01-26": "Rest", "2026-01-27": "LT 10", "2026-01-28": "GA 7",
  "2026-01-29": "Rec 4", "2026-01-30": "MLR 11", "2026-01-31": "Rec 5", "2026-02-01": "LR 21",
  "2026-02-02": "Rest", "2026-02-03": "Rec 7", "2026-02-04": "MLR 12", "2026-02-05": "Rec 5",
  "2026-02-06": "LT 10", "2026-02-07": "Rec 5", "2026-02-08": "LR 20", "2026-02-09": "Rest",
  "2026-02-10": "Rec 6", "2026-02-11": "MLR 14", "2026-02-12": "Rec 6", "2026-02-13": "Rec 5",
  "2026-02-14": "Rec 6", "2026-02-15": "MP 16", "2026-02-16": "Rest", "2026-02-17": "GA 8",
  "2026-02-18": "VO2 8", "2026-02-19": "Rec 5", "2026-02-20": "GA 8", "2026-02-21": "Rec 5",
  "2026-02-22": "MLR 15", "2026-02-23": "Rest", "2026-02-24": "Rec 7", "2026-02-25": "LT 11",
  "2026-02-26": "Rec 5", "2026-02-27": "MLR 12", "2026-02-28": "Rec 5", "2026-03-01": "LR 22",
  "2026-03-02": "Rest", "2026-03-03": "VO2 8", "2026-03-04": "MLR 12", "2026-03-05": "Rec 5",
  "2026-03-06": "Rec 5", "2026-03-07": "Rest", "2026-03-08": "Race 10", "2026-03-09": "LR 18",
  "2026-03-10": "GA 8", "2026-03-11": "VO2 9", "2026-03-12": "Rec 5", "2026-03-13": "MLR 12",
  "2026-03-14": "Rec 5", "2026-03-15": "MP 18", "2026-03-16": "Rest", "2026-03-17": "VO2 8",
  "2026-03-18": "MLR 11", "2026-03-19": "Rec 5", "2026-03-20": "Rec 4", "2026-03-21": "Rest",
  "2026-03-22": "LR 17", "2026-03-23": "Race 10", "2026-03-24": "Rec 7", "2026-03-25": "VO2 10",
  "2026-03-26": "Rec 5", "2026-03-27": "MLR 11", "2026-03-28": "Rec 4", "2026-03-29": "LR 20",
  "2026-03-30": "Rest", "2026-03-31": "VO2 8", "2026-04-01": "Rec 6", "2026-04-02": "Rec 5",
  "2026-04-03": "Rec 4", "2026-04-04": "Race 10", "2026-04-05": "LR 17", "2026-04-06": "Rest",
  "2026-04-07": "GA 7", "2026-04-08": "VO2 8", "2026-04-09": "Rec 4", "2026-04-10": "Rec 5",
  "2026-04-11": "Rest", "2026-04-12": "MLR 13", "2026-04-13": "Rest", "2026-04-14": "Rest",
  "2026-04-15": "Rec 6", "2026-04-16": "MP 7", "2026-04-17": "Rest", "2026-04-18": "Rec 5",
  "2026-04-19": "Rec 4", "2026-04-20": "Marathon",
};

// Chicago 2026 training plan (starting after Boston recovery, ~May 2026)
const chicagoTrainingPlan: Record<string, string> = {
  // Recovery weeks after Boston (late April - May)
  "2026-04-27": "Rest", "2026-04-28": "Rec 3", "2026-04-29": "Rest", "2026-04-30": "Rec 4",
  "2026-05-01": "Rest", "2026-05-02": "Rec 4", "2026-05-03": "Rest",
  // Base building (May-June)
  "2026-05-04": "GA 5", "2026-05-05": "Rec 4", "2026-05-06": "Rest", "2026-05-07": "GA 6",
  "2026-05-08": "Rec 4", "2026-05-09": "GA 8", "2026-05-10": "Rest",
  // Continue base building...
  "2026-06-22": "GA 8", "2026-06-23": "Rec 5", "2026-06-24": "LT 6", "2026-06-25": "Rec 4",
  "2026-06-26": "GA 8", "2026-06-27": "MLR 12", "2026-06-28": "Rest",
  // Peak training (July-September)
  "2026-07-06": "LT 8", "2026-07-07": "Rec 5", "2026-07-08": "GA 10", "2026-07-09": "Rec 5",
  "2026-07-10": "MLR 14", "2026-07-11": "LR 18", "2026-07-12": "Rest",
  // More peak weeks...
  "2026-08-03": "VO2 8", "2026-08-04": "Rec 5", "2026-08-05": "GA 10", "2026-08-06": "Rec 5",
  "2026-08-07": "MLR 15", "2026-08-08": "LR 20", "2026-08-09": "Rest",
  "2026-09-07": "LT 10", "2026-09-08": "Rec 5", "2026-09-09": "GA 8", "2026-09-10": "Rec 5",
  "2026-09-11": "MLR 14", "2026-09-12": "MP 18", "2026-09-13": "Rest",
  // Taper
  "2026-09-28": "GA 8", "2026-09-29": "Rec 5", "2026-09-30": "LT 6", "2026-10-01": "Rec 4",
  "2026-10-02": "GA 6", "2026-10-03": "MLR 10", "2026-10-04": "Rest",
  "2026-10-05": "Rec 5", "2026-10-06": "MP 6", "2026-10-07": "Rec 4", "2026-10-08": "Rest",
  "2026-10-09": "Rec 4", "2026-10-10": "Rec 3", "2026-10-11": "Marathon",
};

function parseWorkout(workout: string): { type: RunType; miles: number } {
  const lower = workout.toLowerCase().trim();
  if (lower === "rest") return { type: "rest", miles: 0 };
  if (lower === "marathon") return { type: "race", miles: 26.2 };

  const milesMatch = workout.match(/\d+/);
  const miles = milesMatch ? parseInt(milesMatch[0]) : 0;

  if (lower.startsWith("rec")) return { type: "recovery", miles };
  if (lower.startsWith("ga")) return { type: "ga", miles };
  if (lower.startsWith("lt")) return { type: "lt", miles };
  if (lower.startsWith("vo2") || lower.startsWith("v")) return { type: "vo2", miles };
  if (lower.startsWith("mlr")) return { type: "mlr", miles };
  if (lower.startsWith("lr")) return { type: "lr", miles };
  if (lower.startsWith("mp")) return { type: "mp", miles };
  if (lower.startsWith("hm")) return { type: "hmp", miles };
  if (lower.startsWith("race")) return { type: "race", miles };

  return { type: "ga", miles };
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeeksUntilRace(fromDate: Date, raceDate: Date): number {
  const diffTime = raceDate.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
}

function getDaysUntilRace(fromDate: Date, raceDate: Date): number {
  const diffTime = raceDate.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getWeekSchedule(weekStart: Date, plan: Record<string, string>): WeekSchedule {
  const schedule: WeekSchedule = {};
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const workout = plan[dateStr];

    if (workout) {
      const parsed = parseWorkout(workout);
      schedule[dayKeys[i]] = { type: parsed.type, plannedMiles: parsed.miles };
    } else {
      schedule[dayKeys[i]] = { type: "rest", plannedMiles: 0 };
    }
  }

  return schedule;
}

// Toggle Switch Component
function Toggle({
  checked,
  onChange,
  size = "large"
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "small" | "medium" | "large";
}) {
  const sizes = {
    small: { track: "w-10 h-5", thumb: "w-4 h-4", translate: "translate-x-5" },
    medium: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
    large: { track: "w-20 h-10", thumb: "w-8 h-8", translate: "translate-x-10" },
  };

  const s = sizes[size];

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${s.track} relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#D4ED39]/30 ${
        checked
          ? "bg-gradient-to-r from-[#546E40] to-[#97A97C]"
          : "bg-[#E8E4DC] hover:bg-[#D4D0C8]"
      }`}
    >
      <span
        className={`${s.thumb} inline-block rounded-full shadow-lg transform transition-all duration-300 ease-in-out ${
          checked
            ? `${s.translate} bg-[#D4ED39]`
            : "translate-x-1 bg-white"
        }`}
      />
    </button>
  );
}

// Feeling selector
function FeelingSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (feeling: string) => void;
}) {
  const feelings = [
    { id: "great", emoji: "fire", label: "Great", color: "bg-[#D4ED39]" },
    { id: "good", emoji: "strong", label: "Good", color: "bg-[#97A97C]" },
    { id: "okay", emoji: "ok", label: "Okay", color: "bg-[#CBAD8C]" },
    { id: "tough", emoji: "hard", label: "Tough", color: "bg-[#FABF34]" },
    { id: "bad", emoji: "rough", label: "Bad", color: "bg-[#8B8780]" },
  ];

  return (
    <div className="flex gap-2">
      {feelings.map((feeling) => (
        <button
          key={feeling.id}
          onClick={() => onChange(feeling.id)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
            value === feeling.id
              ? `${feeling.color} scale-110 shadow-lg`
              : "bg-[#F5F3EE] hover:bg-[#E8E4DC] hover:scale-105"
          }`}
        >
          <span className="text-lg font-bold text-[#3B412D]">{feeling.emoji.toUpperCase().slice(0, 2)}</span>
          <span className="text-[10px] font-medium text-[#3B412D]">{feeling.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function RunningAdminPage() {
  const [activeRace, setActiveRace] = useState<"boston" | "chicago">("boston");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [schedule, setSchedule] = useState<WeekSchedule>({});
  const [userOverrides, setUserOverrides] = useState<Record<string, WeekSchedule>>({});
  const [actualRuns, setActualRuns] = useState<Record<string, ActualRun>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<{ day: string; date: Date } | null>(null);
  const [tempActualMiles, setTempActualMiles] = useState<string>("");
  const [tempNotes, setTempNotes] = useState<string>("");
  const [tempFeeling, setTempFeeling] = useState<string>("good");
  const [loaded, setLoaded] = useState(false);

  const activePlan = activeRace === "boston" ? bostonTrainingPlan : chicagoTrainingPlan;
  const activeRaceDate = activeRace === "boston" ? BOSTON_DATE : CHICAGO_DATE;

  // Load data from localStorage
  useEffect(() => {
    const savedOverrides = localStorage.getItem('training-overrides-v2');
    if (savedOverrides) {
      setUserOverrides(JSON.parse(savedOverrides));
    }
    const savedActuals = localStorage.getItem('actual-runs');
    if (savedActuals) {
      setActualRuns(JSON.parse(savedActuals));
    }
    setLoaded(true);
  }, []);

  // Update schedule when week or race changes
  useEffect(() => {
    const weekKey = `${activeRace}-${currentWeekStart.toISOString().split('T')[0]}`;
    const baseSchedule = getWeekSchedule(currentWeekStart, activePlan);

    if (userOverrides[weekKey]) {
      setSchedule(userOverrides[weekKey]);
    } else {
      setSchedule(baseSchedule);
    }
  }, [currentWeekStart, activeRace, userOverrides, activePlan]);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
    setEditingDay(null);
    setSelectedDay(null);
  };

  const saveOverride = (newSchedule: WeekSchedule) => {
    const weekKey = `${activeRace}-${currentWeekStart.toISOString().split('T')[0]}`;
    const newOverrides = { ...userOverrides, [weekKey]: newSchedule };
    setUserOverrides(newOverrides);
    localStorage.setItem('training-overrides-v2', JSON.stringify(newOverrides));
  };

  const updateDayType = (day: string, type: RunType) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        type,
        plannedMiles: runTypes[type].defaultMiles
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);
  };

  const updateDayMiles = (day: string, miles: number) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        plannedMiles: Math.max(0, miles)
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);
  };

  const toggleDayComplete = (day: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        completed: !schedule[day]?.completed
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);
  };

  const openDayEditor = (day: string, dayIndex: number) => {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(dayDate.getDate() + dayIndex);
    const dateStr = dayDate.toISOString().split('T')[0];

    setEditingDay({ day, date: dayDate });
    setTempActualMiles(actualRuns[dateStr]?.actualMiles?.toString() || "");
    setTempNotes(actualRuns[dateStr]?.notes || "");
    setTempFeeling(actualRuns[dateStr]?.feeling || "good");
  };

  const saveActualRun = () => {
    if (!editingDay) return;

    const dateStr = editingDay.date.toISOString().split('T')[0];
    const newActuals = {
      ...actualRuns,
      [dateStr]: {
        date: dateStr,
        actualMiles: parseFloat(tempActualMiles) || 0,
        notes: tempNotes,
        feeling: tempFeeling as ActualRun["feeling"]
      }
    };
    setActualRuns(newActuals);
    localStorage.setItem('actual-runs', JSON.stringify(newActuals));

    // Also mark as complete
    const newSchedule = {
      ...schedule,
      [editingDay.day]: {
        ...schedule[editingDay.day],
        completed: true
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);

    setEditingDay(null);
  };

  const resetWeek = () => {
    const weekKey = `${activeRace}-${currentWeekStart.toISOString().split('T')[0]}`;
    const newOverrides = { ...userOverrides };
    delete newOverrides[weekKey];
    setUserOverrides(newOverrides);
    localStorage.setItem('training-overrides-v2', JSON.stringify(newOverrides));
    setSchedule(getWeekSchedule(currentWeekStart, activePlan));
  };

  const isToday = (dayIndex: number): boolean => {
    const today = new Date();
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(dayDate.getDate() + dayIndex);
    return today.toDateString() === dayDate.toDateString();
  };

  const getDayDate = (dayIndex: number): Date => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + dayIndex);
    return d;
  };

  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const weeksUntilBoston = getWeeksUntilRace(new Date(), BOSTON_DATE);
  const weeksUntilChicago = getWeeksUntilRace(new Date(), CHICAGO_DATE);
  const daysUntilActive = getDaysUntilRace(new Date(), activeRaceDate);

  const totalPlannedMiles = Object.values(schedule).reduce((sum, day) => sum + (day?.plannedMiles || 0), 0);
  const completedRuns = Object.values(schedule).filter(day => day?.completed).length;

  // Get Strava data for the current week
  const stravaWeekData = getStravaWeekSummary(currentWeekStart);

  // Combine manual logs with Strava data (Strava takes priority)
  const totalActualMiles = Object.entries(schedule).reduce((sum, [day]) => {
    const dayIndex = dayNames.indexOf(day);
    const dateStr = getDayDate(dayIndex).toISOString().split('T')[0];
    const stravaMiles = getTotalStravaMilesForDate(dateStr);
    // Use Strava if available, otherwise use manual log
    return sum + (stravaMiles > 0 ? stravaMiles : (actualRuns[dateStr]?.actualMiles || 0));
  }, 0);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.cream }}>
        <div className="animate-pulse text-[#8B8780]">Loading training plan...</div>
      </div>
    );
  }

  return (
    <IOAuthGate>
    <div className="min-h-screen" style={{ backgroundColor: colors.cream }}>
      {/* Hero Header */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16" style={{ backgroundColor: colors.deepForest }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <Link href="/io" className="text-[#FFF5EB]/60 text-xs hover:text-[#FFF5EB] transition-colors mb-4 inline-block">
                ← Back to IO
              </Link>
              <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3" style={{ color: colors.lime }}>
                Training Command Center
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  style={{ backgroundColor: colors.terracotta, color: colors.cream }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
                  </svg>
                  Strava
                </span>
              </div>
              <p className="text-[#FFF5EB]/70 text-base leading-relaxed max-w-xl">
                Pfitzinger 18/70 for Sub-3:00. Boston (April 20, 2026) and Chicago (October 11, 2026).
              </p>
            </div>
            <div className="md:col-span-5">
              {/* Boston Marathon Feature Tile */}
              <div className="bg-gradient-to-br from-[#C76B4A] to-[#A85A3D] rounded-2xl p-5 mb-4 border border-[#FABF34]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#FFF5EB]/80 text-xs uppercase tracking-wider font-medium">Boston Marathon 2026</p>
                    <p className="font-display text-2xl text-[#FFF5EB] mt-1">April 20</p>
                    <p className="text-[#FFF5EB]/60 text-xs mt-1">{weeksUntilBoston} weeks to go</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-4xl" style={{ color: colors.lime }}>{getDaysUntilRace(new Date(), BOSTON_DATE)}</p>
                    <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">days</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.gold }}>3:09</p>
                  <p className="text-[#FFF5EB]/60 text-[11px] uppercase tracking-wider mt-1">Current PR</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.lime }}>Sub-3</p>
                  <p className="text-[#FFF5EB]/60 text-[11px] uppercase tracking-wider mt-1">Target</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="font-display text-3xl text-[#FFF5EB]">{daysUntilActive}</p>
                  <p className="text-[#FFF5EB]/60 text-[11px] uppercase tracking-wider mt-1">Days Out</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Selector */}
      <section className="py-6 bg-[#FAF7F2] border-b border-[#E8E4DC] sticky top-16 z-40">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-6">
              <span className="text-[11px] uppercase tracking-wider text-[#8B8780]">Training For:</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveRace("boston")}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeRace === "boston"
                      ? "bg-[#2A3C24] text-[#FFF5EB] shadow-lg scale-105"
                      : "bg-white text-[#3B412D] border border-[#E8E4DC] hover:border-[#97A97C] hover:bg-[#97A97C]/10"
                  }`}
                >
                  Boston 2026
                  <span className="ml-2 text-xs opacity-70">{weeksUntilBoston}w</span>
                </button>
                <button
                  onClick={() => setActiveRace("chicago")}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeRace === "chicago"
                      ? "bg-[#2A3C24] text-[#FFF5EB] shadow-lg scale-105"
                      : "bg-white text-[#3B412D] border border-[#E8E4DC] hover:border-[#97A97C] hover:bg-[#97A97C]/10"
                  }`}
                >
                  Chicago 2026
                  <span className="ml-2 text-xs opacity-70">{weeksUntilChicago}w</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/running"
                className="text-sm text-[#546E40] hover:text-[#2A3C24] transition-colors flex items-center gap-1"
              >
                View public page
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Week Navigation & Stats */}
      <section className="py-8 bg-[#FFF5EB]">
        <div className="container-editorial">
          <div className="bg-white rounded-3xl shadow-sm border border-[#E8E4DC] overflow-hidden">
            {/* Week Header */}
            <div className="p-6 border-b border-[#E8E4DC] bg-gradient-to-r from-[#FAF7F2] to-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateWeek(-1)}
                    className="w-12 h-12 rounded-full border-2 border-[#E8E4DC] flex items-center justify-center hover:bg-[#97A97C]/10 hover:border-[#97A97C] transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-[#6B6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="font-display text-2xl text-[#2A3C24]">
                      Week of {formatDate(currentWeekStart)}
                    </h2>
                    <p className="text-sm text-[#8B8780]">
                      {formatDate(currentWeekStart)} - {formatDate(weekEndDate)}
                      {getWeeksUntilRace(currentWeekStart, activeRaceDate) > 0
                        ? ` | ${getWeeksUntilRace(currentWeekStart, activeRaceDate)} weeks to ${activeRace === "boston" ? "Boston" : "Chicago"}`
                        : " | Race week!"}
                    </p>
                  </div>
                  <button
                    onClick={() => navigateWeek(1)}
                    className="w-12 h-12 rounded-full border-2 border-[#E8E4DC] flex items-center justify-center hover:bg-[#97A97C]/10 hover:border-[#97A97C] transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-[#6B6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-2xl text-[#2A3C24]">{totalPlannedMiles}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#8B8780]">Planned Mi</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl" style={{ color: colors.sage }}>{totalActualMiles.toFixed(1)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#8B8780]">Actual Mi</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl" style={{ color: colors.lime }}>{completedRuns}/7</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#8B8780]">Completed</p>
                  </div>
                  <button
                    onClick={resetWeek}
                    className="px-4 py-2 text-xs text-[#8B8780] hover:text-[#546E40] hover:bg-[#97A97C]/10 rounded-lg transition-colors"
                  >
                    Reset week
                  </button>
                </div>
              </div>
            </div>

            {/* Week Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-3">
                {dayNames.map((day, index) => {
                  const dayData = schedule[day];
                  const runType = runTypes[dayData?.type || "rest"];
                  const today = isToday(index);
                  const dayDate = getDayDate(index);
                  const dateStr = dayDate.toISOString().split('T')[0];
                  const actualRun = actualRuns[dateStr];
                  const stravaRuns = getStravaRunsForDate(dateStr);
                  const stravaMiles = getTotalStravaMilesForDate(dateStr);
                  const hasStravaData = stravaRuns.length > 0;
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border-2 ${runType.borderColor} ${runType.color} ${
                        today ? "ring-4 ring-[#D4ED39]/50" : ""
                      } ${isSelected ? "scale-105 shadow-xl z-10" : "hover:scale-102 hover:shadow-md"} ${
                        (dayData?.completed || hasStravaData) ? "opacity-90" : ""
                      }`}
                    >
                      {/* Strava badge - takes priority over manual complete */}
                      {hasStravaData ? (
                        <div
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                          style={{ backgroundColor: colors.strava }}
                        >
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
                          </svg>
                        </div>
                      ) : dayData?.completed && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4ED39] flex items-center justify-center shadow-md">
                          <svg className="w-4 h-4 text-[#2A3C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      {/* Today indicator */}
                      {today && (
                        <div className="absolute -top-2 left-3 px-2 py-0.5 rounded-full bg-[#D4ED39] text-[10px] font-bold text-[#2A3C24]">
                          TODAY
                        </div>
                      )}

                      {/* Day name */}
                      <p className="text-[11px] text-[#8B8780] uppercase tracking-wider mb-2 mt-1">
                        {day}
                      </p>

                      {/* Date */}
                      <p className="text-xs text-[#A09A90] mb-3">
                        {dayDate.getDate()}
                      </p>

                      {/* Run type */}
                      <p className={`text-lg font-bold ${runType.textColor} mb-1`}>
                        {runType.abbrev}
                      </p>

                      {/* Miles */}
                      {dayData?.type !== "rest" && (
                        <div className="mb-2">
                          <p className={`text-2xl font-display ${runType.textColor}`}>
                            {dayData?.plannedMiles || 0}
                          </p>
                          <p className="text-[10px] text-[#A09A90]">miles</p>
                        </div>
                      )}

                      {/* Strava data (priority) or manual actual miles */}
                      {hasStravaData ? (
                        <div className="mt-2 pt-2 border-t border-current/10">
                          <p className="text-xs font-bold flex items-center gap-1" style={{ color: colors.strava }}>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
                            </svg>
                            {stravaMiles.toFixed(1)}mi
                          </p>
                          {stravaRuns.length > 1 && (
                            <p className="text-[9px] text-[#8B8780]">{stravaRuns.length} runs</p>
                          )}
                        </div>
                      ) : actualRun && (
                        <div className="mt-2 pt-2 border-t border-current/10">
                          <p className="text-xs text-[#546E40] font-medium">
                            Actual: {actualRun.actualMiles}mi
                          </p>
                        </div>
                      )}

                      {/* Pace */}
                      <p className="text-[10px] text-[#A09A90] mt-2">
                        {runType.pace}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Panel */}
            {selectedDay && (
              <div className="border-t border-[#E8E4DC] bg-gradient-to-b from-[#FAF7F2] to-white">
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Planned workout controls */}
                    <div>
                      <h3 className="font-display text-xl text-[#2A3C24] mb-6 flex items-center gap-3">
                        <span>{dayFullNames[dayNames.indexOf(selectedDay)]}</span>
                        <span className="text-sm font-normal text-[#8B8780]">
                          {formatDate(getDayDate(dayNames.indexOf(selectedDay)))}
                        </span>
                      </h3>

                      {/* Run Type Toggles */}
                      <div className="space-y-4 mb-6">
                        <p className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-3">Workout Type</p>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(runTypes).map(([key, type]) => (
                            <button
                              key={key}
                              onClick={() => updateDayType(selectedDay, key as RunType)}
                              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                                schedule[selectedDay]?.type === key
                                  ? `${type.color} ${type.borderColor} border-2 shadow-md`
                                  : "bg-white border-2 border-[#E8E4DC] hover:border-[#97A97C]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-bold ${type.textColor}`}>{type.abbrev}</span>
                                <span className="text-xs text-[#8B8780]">{type.label}</span>
                              </div>
                              <Toggle
                                checked={schedule[selectedDay]?.type === key}
                                onChange={() => updateDayType(selectedDay, key as RunType)}
                                size="small"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Planned Miles */}
                      {schedule[selectedDay]?.type !== "rest" && (
                        <div className="mb-6">
                          <p className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-3">Planned Distance</p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateDayMiles(selectedDay, (schedule[selectedDay]?.plannedMiles || 0) - 1)}
                              className="w-14 h-14 rounded-full bg-white border-2 border-[#E8E4DC] flex items-center justify-center text-2xl text-[#6B6860] hover:border-[#97A97C] hover:bg-[#97A97C]/10 transition-all"
                            >
                              -
                            </button>
                            <div className="flex-1 text-center">
                              <input
                                type="number"
                                value={schedule[selectedDay]?.plannedMiles || 0}
                                onChange={(e) => updateDayMiles(selectedDay, parseFloat(e.target.value) || 0)}
                                className="w-full text-center text-4xl font-display text-[#2A3C24] bg-transparent border-b-2 border-[#E8E4DC] focus:border-[#D4ED39] outline-none py-2"
                              />
                              <p className="text-sm text-[#8B8780] mt-1">miles</p>
                            </div>
                            <button
                              onClick={() => updateDayMiles(selectedDay, (schedule[selectedDay]?.plannedMiles || 0) + 1)}
                              className="w-14 h-14 rounded-full bg-white border-2 border-[#E8E4DC] flex items-center justify-center text-2xl text-[#6B6860] hover:border-[#97A97C] hover:bg-[#97A97C]/10 transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Mark Complete Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border-2 border-[#E8E4DC]">
                        <div>
                          <p className="font-medium text-[#2A3C24]">Mark as Complete</p>
                          <p className="text-xs text-[#8B8780]">Toggle when workout is done</p>
                        </div>
                        <Toggle
                          checked={schedule[selectedDay]?.completed || false}
                          onChange={() => toggleDayComplete(selectedDay)}
                          size="large"
                        />
                      </div>
                    </div>

                    {/* Right: Strava data or Manual log */}
                    <div className="bg-white rounded-2xl border-2 border-[#E8E4DC] p-6">
                      {/* Strava Activities Section */}
                      {(() => {
                        const dateStr = getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0];
                        const stravaRuns = getStravaRunsForDate(dateStr);
                        if (stravaRuns.length > 0) {
                          return (
                            <div className="mb-6">
                              <h3 className="font-display text-xl text-[#2A3C24] mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6" style={{ color: colors.strava }} viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
                                </svg>
                                Strava Activities
                              </h3>
                              <div className="space-y-3">
                                {stravaRuns.map((run, idx) => (
                                  <a
                                    key={idx}
                                    href={`https://www.strava.com/activities/${run.activityId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                                    style={{ borderColor: colors.strava + '40', backgroundColor: colors.strava + '08' }}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-[#2A3C24] text-sm">{run.title}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                          <span className="text-lg font-bold" style={{ color: colors.strava }}>
                                            {run.distance_miles.toFixed(2)} mi
                                          </span>
                                          <span className="text-sm text-[#8B8780]">{run.time}</span>
                                          <span className="text-sm text-[#8B8780]">{run.elevation_feet} ft ↑</span>
                                        </div>
                                      </div>
                                      {run.isRace && (
                                        <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#FABF34] text-[#2A3C24]">
                                          Race
                                        </span>
                                      )}
                                    </div>
                                    {run.relativeEffort > 0 && (
                                      <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider text-[#8B8780]">Effort</span>
                                        <div className="flex-1 h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                                          <div
                                            className="h-full rounded-full"
                                            style={{
                                              width: `${Math.min(100, (run.relativeEffort / 300) * 100)}%`,
                                              backgroundColor: run.relativeEffort > 200 ? colors.strava : run.relativeEffort > 100 ? colors.gold : colors.sage
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs font-medium text-[#8B8780]">{run.relativeEffort}</span>
                                      </div>
                                    )}
                                  </a>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t border-[#E8E4DC]">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-[#8B8780]">Total from Strava:</span>
                                  <span className="font-bold" style={{ color: colors.strava }}>
                                    {stravaRuns.reduce((sum, r) => sum + r.distance_miles, 0).toFixed(2)} miles
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <h3 className="font-display text-xl text-[#2A3C24] mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-[#97A97C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {getStravaRunsForDate(getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0]).length > 0 ? 'Add Notes' : 'Log Actual Run'}
                      </h3>

                      {/* Actual Miles */}
                      <div className="mb-6">
                        <p className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-3">Actual Distance</p>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            step="0.1"
                            placeholder="0"
                            value={tempActualMiles}
                            onChange={(e) => setTempActualMiles(e.target.value)}
                            onClick={() => {
                              const dayIndex = dayNames.indexOf(selectedDay);
                              openDayEditor(selectedDay, dayIndex);
                            }}
                            className="flex-1 text-3xl font-display text-[#2A3C24] bg-[#FAF7F2] rounded-xl px-4 py-3 border-2 border-[#E8E4DC] focus:border-[#D4ED39] outline-none"
                          />
                          <span className="text-lg text-[#8B8780]">miles</span>
                        </div>
                      </div>

                      {/* How did it feel? */}
                      <div className="mb-6">
                        <p className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-3">How did it feel?</p>
                        <FeelingSelector
                          value={tempFeeling}
                          onChange={(f) => {
                            const dayIndex = dayNames.indexOf(selectedDay);
                            if (!editingDay) openDayEditor(selectedDay, dayIndex);
                            setTempFeeling(f);
                          }}
                        />
                      </div>

                      {/* Notes */}
                      <div className="mb-6">
                        <p className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-3">Run Notes</p>
                        <textarea
                          placeholder="Weather, pace splits, how you felt..."
                          value={tempNotes}
                          onChange={(e) => {
                            const dayIndex = dayNames.indexOf(selectedDay);
                            if (!editingDay) openDayEditor(selectedDay, dayIndex);
                            setTempNotes(e.target.value);
                          }}
                          className="w-full h-24 bg-[#FAF7F2] rounded-xl px-4 py-3 border-2 border-[#E8E4DC] focus:border-[#D4ED39] outline-none resize-none text-sm text-[#3B412D] placeholder:text-[#A09A90]"
                        />
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => {
                          const dayIndex = dayNames.indexOf(selectedDay);
                          if (!editingDay) openDayEditor(selectedDay, dayIndex);
                          saveActualRun();
                        }}
                        className="w-full py-4 rounded-xl font-medium text-[#2A3C24] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{ backgroundColor: colors.lime }}
                      >
                        Save Run Log
                      </button>

                      {/* Previous log display */}
                      {actualRuns[getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0]] && (
                        <div className="mt-4 p-4 rounded-xl bg-[#97A97C]/10 border border-[#97A97C]/20">
                          <p className="text-xs text-[#546E40] font-medium mb-2">Previously logged:</p>
                          <p className="text-sm text-[#3B412D]">
                            {actualRuns[getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0]].actualMiles} miles
                            {actualRuns[getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0]].notes && (
                              <span className="text-[#8B8780]"> - {actualRuns[getDayDate(dayNames.indexOf(selectedDay)).toISOString().split('T')[0]].notes}</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pace Guide Legend */}
      <section className="py-8 bg-[#FAF7F2]">
        <div className="container-editorial">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC]">
            <h3 className="text-[11px] uppercase tracking-wider text-[#8B8780] mb-4">
              Sub-3:00 Pace Guide (6:52/mi goal pace)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(runTypes).filter(([key]) => key !== "rest").map(([key, type]) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl ${type.color} border ${type.borderColor}`}
                >
                  <p className={`font-bold ${type.textColor}`}>{type.abbrev}</p>
                  <p className="text-xs text-[#8B8780] mt-1">{type.label}</p>
                  <p className={`text-sm font-medium ${type.textColor} mt-2`}>{type.pace}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Race Countdown Cards */}
      <section className="py-12 bg-[#FFF5EB]">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Boston Card */}
            <div
              className={`rounded-3xl p-8 transition-all duration-300 cursor-pointer ${
                activeRace === "boston"
                  ? "bg-gradient-to-br from-[#2A3C24] to-[#3B412D] shadow-2xl scale-[1.02]"
                  : "bg-gradient-to-br from-[#546E40] to-[#97A97C] hover:shadow-lg"
              }`}
              onClick={() => setActiveRace("boston")}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mb-1">130th Running</p>
                  <h3 className="font-display text-3xl text-[#FFF5EB]">Boston Marathon</h3>
                  <p className="text-[#FFF5EB]/70 text-sm mt-1">April 20, 2026</p>
                </div>
                {activeRace === "boston" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.lime, color: colors.deepForest }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl text-[#FFF5EB]">{weeksUntilBoston}</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Weeks</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.lime }}>Sub-3</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Goal</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.gold }}>18/70</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Plan</p>
                </div>
              </div>
            </div>

            {/* Chicago Card */}
            <div
              className={`rounded-3xl p-8 transition-all duration-300 cursor-pointer ${
                activeRace === "chicago"
                  ? "bg-gradient-to-br from-[#2A3C24] to-[#3B412D] shadow-2xl scale-[1.02]"
                  : "bg-gradient-to-br from-[#546E40] to-[#97A97C] hover:shadow-lg"
              }`}
              onClick={() => setActiveRace("chicago")}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mb-1">World Major</p>
                  <h3 className="font-display text-3xl text-[#FFF5EB]">Chicago Marathon</h3>
                  <p className="text-[#FFF5EB]/70 text-sm mt-1">October 11, 2026</p>
                </div>
                {activeRace === "chicago" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.lime, color: colors.deepForest }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl text-[#FFF5EB]">{weeksUntilChicago}</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Weeks</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.lime }}>Sub-3</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Goal</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="font-display text-3xl" style={{ color: colors.gold }}>18/70</p>
                  <p className="text-[#FFF5EB]/60 text-[10px] uppercase tracking-wider">Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12" style={{ backgroundColor: colors.deepForest }}>
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <p className="font-display text-4xl" style={{ color: colors.gold }}>3:09</p>
              <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mt-2">Current PR</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <p className="font-display text-4xl text-[#FFF5EB]">7</p>
              <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mt-2">Marathons</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <p className="font-display text-4xl" style={{ color: colors.sage }}>3</p>
              <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mt-2">BQ Races</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
              <p className="font-display text-4xl" style={{ color: colors.lime }}>0/7</p>
              <p className="text-[#FFF5EB]/60 text-xs uppercase tracking-wider mt-2">World Majors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <section className="py-8" style={{ backgroundColor: colors.cream }}>
        <div className="container-editorial">
          <div className="flex items-center justify-between">
            <Link
              href="/running"
              className="inline-flex items-center gap-2 text-[#546E40] hover:text-[#2A3C24] transition-colors text-sm font-medium"
            >
              <span>View public running page</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/io"
              className="inline-flex items-center gap-2 text-[#8B8780] hover:text-[#2A3C24] transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to IO</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </IOAuthGate>
  );
}
