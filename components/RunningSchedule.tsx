"use client";

import { useState, useEffect } from "react";

// Run types based on Pfitzinger Advanced Marathoning
// Paces calculated for 3:00 goal
const runTypes = {
  rest: { label: "Rest", abbrev: "Rest", defaultMiles: 0, pace: "—", color: "bg-[#F5F3EE]", textColor: "text-[#8B8780]" },
  recovery: { label: "Recovery", abbrev: "R", defaultMiles: 4, pace: "8:56", color: "bg-[#97A97C]/20", textColor: "text-[#546E40]" },
  ga: { label: "General Aerobic", abbrev: "GA", defaultMiles: 6, pace: "7:54-8:35", color: "bg-[#97A97C]/30", textColor: "text-[#3B412D]" },
  lt: { label: "Lactate Threshold", abbrev: "LT", defaultMiles: 8, pace: "6:15-6:27", color: "bg-[#FABF34]/20", textColor: "text-[#8B7355]" },
  vo2: { label: "VO2 Max", abbrev: "VO2", defaultMiles: 6, pace: "AFAP", color: "bg-[#FABF34]/30", textColor: "text-[#6B5B35]" },
  mlr: { label: "Medium Long Run", abbrev: "MLR", defaultMiles: 12, pace: "7:33-8:14", color: "bg-[#CBAD8C]/30", textColor: "text-[#6B5B45]" },
  lr: { label: "Long Run", abbrev: "LR", defaultMiles: 16, pace: "7:33-8:14", color: "bg-[#546E40]/20", textColor: "text-[#3B412D]" },
  mp: { label: "Marathon Pace", abbrev: "MP", defaultMiles: 10, pace: "6:52", color: "bg-[#546E40]/30", textColor: "text-[#2D3D20]" },
  hmp: { label: "Half Marathon Pace", abbrev: "HM", defaultMiles: 8, pace: "6:31-6:44", color: "bg-[#CBAD8C]/40", textColor: "text-[#5B4B35]" },
  race: { label: "Tune-up Race", abbrev: "Race", defaultMiles: 10, pace: "Race effort", color: "bg-[#d4ed39]/40", textColor: "text-[#2D3D20]" },
};

type RunType = keyof typeof runTypes;

interface DaySchedule {
  type: RunType;
  miles: number;
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Boston Marathon: April 20, 2026
const RACE_DATE = new Date("2026-04-20");

// Training plan - Boston Marathon 2026 (Actuals)
const trainingPlan: Record<string, string> = {
  "2025-12-03": "GA 5",
  "2025-12-04": "Rec 3",
  "2025-12-06": "Rest",
  "2025-12-07": "GA 5",
  "2025-12-08": "GA 7",
  "2025-12-09": "Rest",
  "2025-12-10": "VO2 5",
  "2025-12-11": "Rec 3",
  "2025-12-12": "GA 5",
  "2025-12-13": "Rest",
  "2025-12-14": "GA 5",
  "2025-12-15": "MLR 8",
  "2025-12-16": "LT 8",
  "2025-12-17": "Rec 5",
  "2025-12-18": "Rest",
  "2025-12-19": "GA 9",
  "2025-12-20": "Rec 4",
  "2025-12-21": "MLR 15",
  "2025-12-22": "Rest",
  "2025-12-23": "GA 8",
  "2025-12-24": "Rec 5",
  "2025-12-25": "Rest",
  "2025-12-26": "GA 10",
  "2025-12-27": "Rec 5",
  "2025-12-28": "MP 16",
  "2025-12-29": "MP 13",
  "2025-12-30": "Rec 5",
  "2025-12-31": "Rec 4",
  "2026-01-01": "Rest",
  "2026-01-02": "Rest",
  "2026-01-03": "GA 10",
  "2026-01-04": "MLR 15",
  "2026-01-05": "Rest",
  "2026-01-06": "GA 8",
  "2026-01-07": "LT 8",
  "2026-01-08": "Rec 4",
  "2026-01-09": "MLR 18",
  "2026-01-10": "Rec 5",
  "2026-01-11": "GA 10",
  "2026-01-12": "Rec 5",
  "2026-01-13": "Rest",
  "2026-01-14": "Rec 5",
  "2026-01-15": "LT 9",
  "2026-01-16": "Rec 5",
  "2026-01-17": "Rec 5",
  "2026-01-18": "Rec 5",
  "2026-01-19": "MP 18",
  "2026-01-20": "GA 8",
  "2026-01-21": "Rec 5",
  "2026-01-22": "Rec 5",
  "2026-01-23": "GA 8",
  "2026-01-24": "Rec 4",
  "2026-01-25": "MLR 15",
  "2026-01-26": "Rest",
  "2026-01-27": "LT 10",
  "2026-01-28": "GA 7",
  "2026-01-29": "Rec 4",
  "2026-01-30": "MLR 11",
  "2026-01-31": "Rec 5",
  "2026-02-01": "LR 21",
  "2026-02-02": "Rest",
  "2026-02-03": "Rec 7",
  "2026-02-04": "MLR 12",
  "2026-02-05": "Rec 5",
  "2026-02-06": "LT 10",
  "2026-02-07": "Rec 5",
  "2026-02-08": "LR 20",
  "2026-02-09": "Rest",
  "2026-02-10": "Rec 6",
  "2026-02-11": "MLR 14",
  "2026-02-12": "Rec 6",
  "2026-02-13": "Rec 5",
  "2026-02-14": "Rec 6",
  "2026-02-15": "MP 16",
  "2026-02-16": "Rest",
  "2026-02-17": "GA 8",
  "2026-02-18": "VO2 8",
  "2026-02-19": "Rec 5",
  "2026-02-20": "GA 8",
  "2026-02-21": "Rec 5",
  "2026-02-22": "MLR 15",
  "2026-02-23": "Rest",
  "2026-02-24": "Rec 7",
  "2026-02-25": "LT 11",
  "2026-02-26": "Rec 5",
  "2026-02-27": "MLR 12",
  "2026-02-28": "Rec 5",
  "2026-03-01": "LR 22",
  "2026-03-02": "Rest",
  "2026-03-03": "VO2 8",
  "2026-03-04": "MLR 12",
  "2026-03-05": "Rec 5",
  "2026-03-06": "Rec 5",
  "2026-03-07": "Rest",
  "2026-03-08": "Race 10",
  "2026-03-09": "LR 18",
  "2026-03-10": "GA 8",
  "2026-03-11": "VO2 9",
  "2026-03-12": "Rec 5",
  "2026-03-13": "MLR 12",
  "2026-03-14": "Rec 5",
  "2026-03-15": "MP 18",
  "2026-03-16": "Rest",
  "2026-03-17": "VO2 8",
  "2026-03-18": "MLR 11",
  "2026-03-19": "Rec 5",
  "2026-03-20": "Rec 4",
  "2026-03-21": "Rest",
  "2026-03-22": "LR 17",
  "2026-03-23": "Race 10",
  "2026-03-24": "Rec 7",
  "2026-03-25": "VO2 10",
  "2026-03-26": "Rec 5",
  "2026-03-27": "MLR 11",
  "2026-03-28": "Rec 4",
  "2026-03-29": "LR 20",
  "2026-03-30": "Rest",
  "2026-03-31": "VO2 8",
  "2026-04-01": "Rec 6",
  "2026-04-02": "Rec 5",
  "2026-04-03": "Rec 4",
  "2026-04-04": "Race 10",
  "2026-04-05": "LR 17",
  "2026-04-06": "Rest",
  "2026-04-07": "GA 7",
  "2026-04-08": "VO2 8",
  "2026-04-09": "Rec 4",
  "2026-04-10": "Rec 5",
  "2026-04-11": "Rest",
  "2026-04-12": "MLR 13",
  "2026-04-13": "Rest",
  "2026-04-14": "Rest",
  "2026-04-15": "Rec 6",
  "2026-04-16": "MP 7",
  "2026-04-17": "Rest",
  "2026-04-18": "Rec 5",
  "2026-04-19": "Rec 4",
  "2026-04-20": "Marathon",
};

function parseWorkout(workout: string): { type: RunType; miles: number } {
  const lower = workout.toLowerCase().trim();

  if (lower === "rest") {
    return { type: "rest", miles: 0 };
  }

  if (lower === "marathon") {
    return { type: "race", miles: 26 };
  }

  // Extract miles from workout string (e.g., "GA 10" -> 10)
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
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  return new Date(d.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeeksUntilRace(fromDate: Date): number {
  const diffTime = RACE_DATE.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
}

function getWeekSchedule(weekStart: Date): WeekSchedule {
  const schedule: WeekSchedule = {};
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const workout = trainingPlan[dateStr];

    if (workout) {
      schedule[dayKeys[i]] = parseWorkout(workout);
    } else {
      schedule[dayKeys[i]] = { type: "rest", miles: 0 };
    }
  }

  return schedule;
}

function getDefaultWeek(weekStart: Date): WeekSchedule {
  return getWeekSchedule(weekStart);
}

export default function RunningSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [schedule, setSchedule] = useState<WeekSchedule>(() => getDefaultWeek(getWeekStart(new Date())));
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [userOverrides, setUserOverrides] = useState<Record<string, WeekSchedule>>({});

  // Load user overrides from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('training-overrides');
    if (saved) {
      setUserOverrides(JSON.parse(saved));
    }
  }, []);

  // Update schedule when week changes
  useEffect(() => {
    const weekKey = currentWeekStart.toISOString().split('T')[0];
    const baseSchedule = getDefaultWeek(currentWeekStart);

    // Apply user overrides if any exist for this week
    if (userOverrides[weekKey]) {
      setSchedule(userOverrides[weekKey]);
    } else {
      setSchedule(baseSchedule);
    }
  }, [currentWeekStart, userOverrides]);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
    setEditingDay(null);
  };

  const saveOverride = (newSchedule: WeekSchedule) => {
    const weekKey = currentWeekStart.toISOString().split('T')[0];
    const newOverrides = { ...userOverrides, [weekKey]: newSchedule };
    setUserOverrides(newOverrides);
    localStorage.setItem('training-overrides', JSON.stringify(newOverrides));
  };

  const updateDayType = (day: string, type: RunType) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        type,
        miles: runTypes[type].defaultMiles
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);
    setEditingDay(null);
  };

  const updateDayMiles = (day: string, miles: number) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        miles: Math.max(0, miles)
      }
    };
    setSchedule(newSchedule);
    saveOverride(newSchedule);
  };

  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const weeksUntil = getWeeksUntilRace(currentWeekStart);
  const totalMiles = Object.values(schedule).reduce((sum, day) => sum + day.miles, 0);

  const isToday = (dayIndex: number): boolean => {
    const today = new Date();
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(dayDate.getDate() + dayIndex);
    return today.toDateString() === dayDate.toDateString();
  };

  return (
    <div className="bg-[#FAF7F2] rounded-lg p-6 border border-[#E8E4DC]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="w-8 h-8 rounded-full border border-[#D4D0C8] flex items-center justify-center hover:bg-[#EFEBE4] transition-colors"
          >
            <svg className="w-4 h-4 text-[#6B6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3
              className="text-lg text-[#3B412D]"
              style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}
            >
              Week of {formatDate(currentWeekStart)}
            </h3>
            <p className="text-xs text-[#8B8780]">
              {formatDate(currentWeekStart)} – {formatDate(weekEndDate)}
            </p>
          </div>
          <button
            onClick={() => navigateWeek(1)}
            className="w-8 h-8 rounded-full border border-[#D4D0C8] flex items-center justify-center hover:bg-[#EFEBE4] transition-colors"
          >
            <svg className="w-4 h-4 text-[#6B6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-right">
          <p className="text-xs text-[#8B8780]">
            {weeksUntil > 0 ? `${weeksUntil} weeks to Boston` : "Race week!"}
          </p>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day, index) => {
          const dayData = schedule[day];
          const runType = runTypes[dayData.type];
          const today = isToday(index);

          return (
            <div
              key={day}
              className={`relative rounded-lg p-3 transition-all ${runType.color} ${
                today ? "ring-2 ring-[#97A97C]" : ""
              } ${editingDay === day ? "ring-2 ring-[#FABF34]" : ""}`}
            >
              {/* Day name */}
              <p className="text-[10px] text-[#8B8780] uppercase tracking-wider mb-1">
                {day}
              </p>

              {/* Run type (clickable) */}
              <button
                onClick={() => setEditingDay(editingDay === day ? null : day)}
                className={`text-sm font-medium ${runType.textColor} hover:opacity-70 transition-opacity text-left w-full`}
              >
                {runType.abbrev}
              </button>

              {/* Miles (editable) */}
              {dayData.type !== "rest" && (
                <div className="mt-1">
                  <input
                    type="number"
                    value={dayData.miles}
                    onChange={(e) => updateDayMiles(day, parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-xs text-[#6B6860] border-b border-[#D4D0C8] focus:border-[#97A97C] outline-none py-0.5"
                    min="0"
                    step="0.5"
                  />
                  <span className="text-[10px] text-[#A09A90]">mi</span>
                </div>
              )}

              {/* Pace (read-only) */}
              <p className="text-[10px] text-[#A09A90] mt-1">
                {runType.pace}
              </p>

              {/* Type selector dropdown */}
              {editingDay === day && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-lg shadow-lg border border-[#E8E4DC] py-1 min-w-[140px]">
                  {Object.entries(runTypes).map(([key, type]) => (
                    <button
                      key={key}
                      onClick={() => updateDayType(day, key as RunType)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F5F3EE] transition-colors ${
                        dayData.type === key ? "bg-[#F5F3EE]" : ""
                      }`}
                    >
                      <span className="font-medium">{type.abbrev}</span>
                      <span className="text-[#8B8780] ml-2">{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Total */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DC]">
        <p className="text-xs text-[#8B8780]">Weekly total</p>
        <p
          className="text-lg text-[#3B412D]"
          style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}
        >
          {totalMiles} miles
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-[#E8E4DC]">
        <p className="text-[10px] text-[#A09A90] uppercase tracking-wider mb-2">Pace guide</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(runTypes).filter(([key]) => key !== "rest").map(([key, type]) => (
            <div key={key} className={`text-[10px] px-2 py-1 rounded ${type.color} ${type.textColor}`}>
              {type.abbrev}: {type.pace}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
