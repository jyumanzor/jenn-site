"use client";

import { useState, useEffect } from "react";

// Run types based on Pfitzinger Advanced Marathoning
// Paces calculated for 3:30 goal (can be adjusted)
const runTypes = {
  rest: { label: "Rest", abbrev: "Rest", defaultMiles: 0, pace: "—", color: "bg-[#F5F3EE]", textColor: "text-[#8B8780]" },
  recovery: { label: "Recovery", abbrev: "Rec", defaultMiles: 4, pace: ">10:25", color: "bg-[#97A97C]/20", textColor: "text-[#546E40]" },
  ga: { label: "General Aerobic", abbrev: "GA", defaultMiles: 6, pace: "9:13-10:01", color: "bg-[#97A97C]/30", textColor: "text-[#3B412D]" },
  lt: { label: "Lactate Threshold", abbrev: "LT", defaultMiles: 8, pace: "7:18-7:32", color: "bg-[#FABF34]/20", textColor: "text-[#8B7355]" },
  vo2: { label: "VO2 Max", abbrev: "VO2", defaultMiles: 6, pace: "AFAP", color: "bg-[#FABF34]/30", textColor: "text-[#6B5B35]" },
  mlr: { label: "Medium Long Run", abbrev: "MLR", defaultMiles: 12, pace: "8:49-9:37", color: "bg-[#CBAD8C]/30", textColor: "text-[#6B5B45]" },
  lr: { label: "Long Run", abbrev: "LR", defaultMiles: 16, pace: "8:49-9:37", color: "bg-[#546E40]/20", textColor: "text-[#3B412D]" },
  mp: { label: "Marathon Pace", abbrev: "MP", defaultMiles: 10, pace: "8:01", color: "bg-[#546E40]/30", textColor: "text-[#2D3D20]" },
  hmp: { label: "Half Marathon Pace", abbrev: "HMP", defaultMiles: 8, pace: "7:37-7:51", color: "bg-[#CBAD8C]/40", textColor: "text-[#5B4B35]" },
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

function getDefaultWeek(): WeekSchedule {
  return {
    Mon: { type: "rest", miles: 0 },
    Tue: { type: "ga", miles: 6 },
    Wed: { type: "recovery", miles: 4 },
    Thu: { type: "lt", miles: 8 },
    Fri: { type: "rest", miles: 0 },
    Sat: { type: "ga", miles: 5 },
    Sun: { type: "lr", miles: 16 },
  };
}

export default function RunningSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [schedule, setSchedule] = useState<WeekSchedule>(getDefaultWeek());
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`schedule-${currentWeekStart.toISOString().split('T')[0]}`);
    if (saved) {
      setSchedule(JSON.parse(saved));
    } else {
      setSchedule(getDefaultWeek());
    }
  }, [currentWeekStart]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(`schedule-${currentWeekStart.toISOString().split('T')[0]}`, JSON.stringify(schedule));
  }, [schedule, currentWeekStart]);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
    setEditingDay(null);
  };

  const updateDayType = (day: string, type: RunType) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        type,
        miles: runTypes[type].defaultMiles
      }
    }));
    setEditingDay(null);
  };

  const updateDayMiles = (day: string, miles: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        miles: Math.max(0, miles)
      }
    }));
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
