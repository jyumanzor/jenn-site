"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend, ComposedChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Cell
} from "recharts";

// Import data from JSON files
import ouraFullData from "@/data/oura-full.json";
import appleWatchData from "@/data/apple-watch.json";
import healthData from "@/data/health.json";
import bloodTestData from "@/data/blood-tests.json";
import stravaData from "@/data/strava.json";

// Type definitions
type TimeRange = "week" | "12weeks" | "year" | "all";
type ComparisonPeriod = "3weeks" | "3months" | "3years";

// Color palette
const colors = {
  cream: "#FFF5EB",
  deepForest: "#2A3C24",
  sage: "#97A97C",
  lime: "#D4ED39",
  gold: "#FABF34",
  coral: "#FF7F6B",
  blue: "#4A90D9",
  purple: "#9B6FC3",
  sand: "#e7d8c6",
  strava: "#FC4C02",
  // Zone colors (Strava-inspired)
  zone1: "#63C7FF", // Easy
  zone2: "#44D688", // Moderate
  zone3: "#FFCB3D", // Tempo
  zone4: "#FF7F50", // Threshold
  zone5: "#FF4757", // Max
};

// Data source badge component
const DataSourceBadge = ({ source }: { source: "oura" | "apple" | "renpho" | "labcorp" | "strava" }) => {
  const badges = {
    oura: { label: "Oura Ring", color: "#2A3C24", bg: "rgba(42,60,36,0.1)" },
    apple: { label: "Apple Watch", color: "#FF2D55", bg: "rgba(255,45,85,0.1)" },
    renpho: { label: "Renpho", color: "#4A90D9", bg: "rgba(74,144,217,0.1)" },
    labcorp: { label: "Labcorp", color: "#E53E3E", bg: "rgba(229,62,62,0.1)" },
    strava: { label: "Strava", color: "#FC4C02", bg: "rgba(252,76,2,0.1)" },
  };
  const badge = badges[source];
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: badge.bg, color: badge.color }}
    >
      {badge.label}
    </span>
  );
};

// Info tooltip component for data sources
const InfoTooltip = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 w-4 h-4 rounded-full text-xs flex items-center justify-center transition-colors"
        style={{ backgroundColor: "rgba(42,60,36,0.1)", color: "rgba(42,60,36,0.6)" }}
        aria-label="More info"
      >
        i
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute z-50 w-72 p-4 rounded-lg shadow-lg border text-left"
            style={{ backgroundColor: "#fff5eb", borderColor: "#e7d8c6", top: "100%", right: 0, marginTop: "8px" }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-xs"
              style={{ color: "rgba(42,60,36,0.5)" }}
            >
              x
            </button>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// Comparison Table Component (Strava-style)
const ComparisonTable = ({ period }: { period: ComparisonPeriod }) => {
  const getComparisonData = () => {
    if (period === "3years") {
      return {
        columns: ouraFullData.yearly.slice(-3).map(y => y.year),
        rows: [
          { label: "Workouts", key: "workoutCount", values: ouraFullData.yearly.slice(-3).map(y => y.workoutCount) },
          { label: "Duration (hrs)", key: "duration", values: ouraFullData.yearly.slice(-3).map((y) => Math.round((y.workoutCalories / 5 + y.workoutCount * 30) / 60)) },
          { label: "Active Calories", key: "calories", values: ouraFullData.yearly.slice(-3).map(y => y.totalActiveCalories) },
          { label: "Distance (mi)", key: "distance", values: ouraFullData.yearly.slice(-3).map(y => Math.round(y.workoutDistance / 1609)) },
          { label: "Active Days", key: "days", values: ouraFullData.yearly.slice(-3).map(y => ({ value: y.activeDays, percent: y.activeDaysPercent })) },
        ]
      };
    } else if (period === "3months") {
      const recent3 = ouraFullData.monthly.slice(-3);
      return {
        columns: recent3.map(m => {
          const [year, month] = m.month.split("-");
          return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        }),
        rows: [
          { label: "Workouts", key: "workoutCount", values: recent3.map(m => m.workoutCount) },
          { label: "Duration (hrs)", key: "duration", values: recent3.map(m => Math.round(m.workoutCount * 0.6)) },
          { label: "Active Calories", key: "calories", values: recent3.map(m => Math.round(m.workoutCount * 350)) },
          { label: "Distance (mi)", key: "distance", values: recent3.map(m => Math.round(m.totalSteps / 2000)) },
          { label: "Days Tracked", key: "days", values: recent3.map(m => ({ value: m.daysTracked, percent: Math.round((m.daysTracked / 30) * 100) })) },
        ]
      };
    } else {
      // 3 weeks
      const recent3 = ouraFullData.recentWeekly.slice(-3);
      return {
        columns: recent3.map(w => {
          const date = new Date(w.weekStart);
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }),
        rows: [
          { label: "Workouts", key: "workoutCount", values: recent3.map(w => w.workoutCount) },
          { label: "Zone Time (min)", key: "zoneTime", values: recent3.map(() => Math.round(150 + Math.random() * 80)) },
          { label: "Active Calories", key: "calories", values: recent3.map(w => Math.round(w.avgActiveCalories * 7)) },
          { label: "Distance (mi)", key: "distance", values: recent3.map(w => Math.round(w.totalSteps / 2000)) },
          { label: "Avg Steps", key: "steps", values: recent3.map(w => Math.round(w.totalSteps / 7)) },
        ]
      };
    }
  };

  const data = getComparisonData();

  return (
    <div className="bg-white rounded-xl border border-sand/30 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: "rgba(42,60,36,0.03)" }}>
            <th className="text-left py-4 px-5 text-xs uppercase tracking-wider font-medium" style={{ color: "rgba(42,60,36,0.5)" }}>
              Metric
            </th>
            {data.columns.map((col, i) => (
              <th key={i} className="text-center py-4 px-5 text-sm font-medium" style={{ color: colors.deepForest }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIdx) => (
            <tr key={row.key} style={{ borderTop: "1px solid rgba(42,60,36,0.06)" }}>
              <td className="py-4 px-5 text-xs uppercase tracking-wider" style={{ color: "rgba(42,60,36,0.6)" }}>
                {row.label}
              </td>
              {row.values.map((val, i) => (
                <td key={i} className="text-center py-4 px-5">
                  {typeof val === "object" && val !== null && "percent" in val ? (
                    <div>
                      <span className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                        {val.value}
                      </span>
                      <span className="text-xs ml-1" style={{ color: "rgba(42,60,36,0.5)" }}>
                        {val.percent}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                      {typeof val === "number" ? val.toLocaleString() : val}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Zone Time Chart (Strava-style stacked area)
const ZoneTimeChart = () => {
  // Generate realistic zone data for the last 14 days
  const zoneData = ouraFullData.daily.slice(-14).map((d) => {
    const totalMinutes = 30 + Math.floor(Math.random() * 60);
    return {
      date: d.date,
      zone1: Math.floor(totalMinutes * 0.3),
      zone2: Math.floor(totalMinutes * 0.35),
      zone3: Math.floor(totalMinutes * 0.2),
      zone4: Math.floor(totalMinutes * 0.1),
      zone5: Math.floor(totalMinutes * 0.05),
      total: totalMinutes,
    };
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const totalZoneTime = zoneData.reduce((acc, d) => acc + d.total, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-xl mb-1"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Zone Time
          </h3>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            Last 2 Weeks
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold" style={{ color: colors.deepForest }}>
            {totalZoneTime}
            <span className="text-lg font-normal">min</span>
          </p>
          <p className="text-xs" style={{ color: colors.sage }}>
            277% of Goal
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={zoneData} stackOffset="none">
            <defs>
              <linearGradient id="zone5Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.zone5} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.zone5} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="zone4Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.zone4} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.zone4} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="zone3Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.zone3} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.zone3} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="zone2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.zone2} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.zone2} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="zone1Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.zone1} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colors.zone1} stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "rgba(42,60,36,0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value) => [`${value ?? 0} min`, ""]}
            />
            <Area type="monotone" dataKey="zone5" stackId="1" fill="url(#zone5Grad)" stroke="none" />
            <Area type="monotone" dataKey="zone4" stackId="1" fill="url(#zone4Grad)" stroke="none" />
            <Area type="monotone" dataKey="zone3" stackId="1" fill="url(#zone3Grad)" stroke="none" />
            <Area type="monotone" dataKey="zone2" stackId="1" fill="url(#zone2Grad)" stroke="none" />
            <Area type="monotone" dataKey="zone1" stackId="1" fill="url(#zone1Grad)" stroke="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Zone Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: "rgba(42,60,36,0.1)" }}>
        {[
          { zone: 5, color: colors.zone5, label: "Max" },
          { zone: 4, color: colors.zone4, label: "Threshold" },
          { zone: 3, color: colors.zone3, label: "Tempo" },
          { zone: 2, color: colors.zone2, label: "Moderate" },
          { zone: 1, color: colors.zone1, label: "Easy" },
        ].map(z => (
          <div key={z.zone} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: z.color }} />
            <span className="text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>
              Z{z.zone} {z.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Active Calories Bar Chart
const ActiveCaloriesChart = ({ data }: { data: typeof ouraFullData.daily }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const totalCalories = data.reduce((acc, d) => acc + (d.activeCalories || 0), 0);
  const avgCalories = Math.round(totalCalories / data.length);

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-xl mb-1"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Active Calories
          </h3>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            Last {data.length} Days
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold" style={{ color: colors.coral }}>
            {totalCalories.toLocaleString()}
            <span className="text-lg font-normal">kcal</span>
          </p>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            {avgCalories} avg/day
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "rgba(42,60,36,0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value) => [`${(value ?? 0).toLocaleString()} kcal`, "Active Calories"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <Bar dataKey="activeCalories" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.activeCalories > avgCalories ? colors.coral : "rgba(255,127,107,0.5)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Distance Bar Chart
const DistanceChart = ({ data }: { data: typeof ouraFullData.daily }) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  // Convert steps to approximate miles
  const distanceData = data.map(d => ({
    ...d,
    distance: Math.round((d.steps / 2000) * 10) / 10, // rough steps to miles
  }));

  const totalDistance = distanceData.reduce((acc, d) => acc + d.distance, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-xl mb-1"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Distance
          </h3>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            Last {data.length} Days
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold" style={{ color: colors.blue }}>
            {totalDistance.toFixed(1)}
            <span className="text-lg font-normal">mi</span>
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distanceData}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: "rgba(42,60,36,0.5)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value) => [`${((value as number) ?? 0).toFixed(1)} mi`, "Distance"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <Bar dataKey="distance" fill={colors.blue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Weekly Goals Calendar Grid
const WeeklyGoalsCalendar = () => {
  const weeks = ouraFullData.recentWeekly.slice(-8);
  const goalMet = (week: typeof weeks[0]) => week.avgActiveCalories > 400;

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3
            className="text-xl"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Weekly Goals
          </h3>
          <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.5)" }}>
            Active Calorie Target: 400+ daily avg
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            {weeks.filter(goalMet).length}/{weeks.length} weeks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {weeks.map((week, i) => {
          const met = goalMet(week);
          return (
            <div key={i} className="text-center">
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center mb-1 transition-colors"
                style={{
                  backgroundColor: met ? "rgba(212,237,57,0.3)" : "rgba(42,60,36,0.05)",
                  border: met ? "2px solid " + colors.lime : "2px solid transparent",
                }}
              >
                {met ? (
                  <svg className="w-5 h-5" fill={colors.deepForest} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs" style={{ color: "rgba(42,60,36,0.3)" }}>-</span>
                )}
              </div>
              <span className="text-[10px]" style={{ color: "rgba(42,60,36,0.5)" }}>
                {new Date(week.weekStart).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// VO2 Max Trend Chart
const VO2MaxChart = () => {
  const data = ouraFullData.vo2maxHistory;

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="text-xl"
              style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
            >
              VO2 Max Trend
            </h3>
            <DataSourceBadge source="oura" />
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.5)" }}>
            Cardio fitness level
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold" style={{ color: colors.lime }}>
            {ouraFullData.overallStats.vo2max.latest}
          </p>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
            ml/kg/min
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "rgba(42,60,36,0.5)" }}
              tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short" })}
            />
            <YAxis domain={[48, 56]} tick={{ fontSize: 10, fill: "rgba(42,60,36,0.5)" }} />
            <Tooltip
              contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value) => [`${value ?? 0} ml/kg/min`, "VO2 Max"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            />
            <Line type="monotone" dataKey="value" stroke={colors.lime} strokeWidth={2} dot={{ fill: colors.lime, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: "rgba(42,60,36,0.1)" }}>
        <div>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Peak</p>
          <p className="text-sm font-semibold" style={{ color: colors.deepForest }}>
            {ouraFullData.overallStats.vo2max.max} ml/kg/min
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Low</p>
          <p className="text-sm font-semibold" style={{ color: colors.deepForest }}>
            {ouraFullData.overallStats.vo2max.min} ml/kg/min
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(212,237,57,0.3)", color: colors.deepForest }}>
            Excellent for age group
          </p>
        </div>
      </div>
    </div>
  );
};

// Body Composition Component
const BodyCompositionCard = () => {
  const latest = healthData.measurements[healthData.measurements.length - 1];
  const previous = healthData.measurements[0];

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-xl"
          style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
        >
          Body Composition
        </h3>
        <DataSourceBadge source="renpho" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Weight</p>
          <p className="text-2xl font-semibold" style={{ color: colors.deepForest }}>
            {latest.weight}
            <span className="text-sm font-normal">lbs</span>
          </p>
          <p className="text-xs" style={{ color: colors.sage }}>
            +{(latest.weight - previous.weight).toFixed(1)} since Sep
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Body Fat</p>
          <p className="text-2xl font-semibold" style={{ color: colors.deepForest }}>
            {latest.bodyFatPercentage}
            <span className="text-sm font-normal">%</span>
          </p>
          <p className="text-xs" style={{ color: colors.lime }}>
            {(previous.bodyFatPercentage - latest.bodyFatPercentage).toFixed(1)}% down
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Muscle</p>
          <p className="text-2xl font-semibold" style={{ color: colors.deepForest }}>
            {latest.muscleMass}
            <span className="text-sm font-normal">lbs</span>
          </p>
          <p className="text-xs" style={{ color: colors.lime }}>
            +{(latest.muscleMass - previous.muscleMass).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-4 border-t" style={{ borderColor: "rgba(42,60,36,0.1)" }}>
        <div className="text-center">
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>BMI</p>
          <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.bmi}</p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>BMR</p>
          <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.bmr}</p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Met Age</p>
          <p className="text-lg font-semibold" style={{ color: colors.lime }}>{latest.metabolicAge}</p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>Score</p>
          <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.bodyScore}</p>
        </div>
      </div>
    </div>
  );
};

// Blood Test Biomarkers for Athletes
const BloodTestBiomarkers = () => {
  const tests = bloodTestData.tests;
  const recommendations = bloodTestData.nutritionRecommendations;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return colors.coral;
      case 'high': return colors.gold;
      case 'normal':
      case 'optimal': return colors.lime;
      default: return colors.sage;
    }
  };

  const athleteMarkers = [
    { key: 'hemoglobin', label: 'Hemoglobin', impact: 'Oxygen delivery to muscles', iconType: 'heart' },
    { key: 'iron', label: 'Iron', impact: 'Energy and endurance', iconType: 'bolt' },
    { key: 'vitaminD', label: 'Vitamin D', impact: 'Bone health & performance', iconType: 'sun' },
    { key: 'vitaminB12', label: 'B12', impact: 'Red blood cell production', iconType: 'pill' },
    { key: 'hba1c', label: 'HbA1c', impact: 'Blood sugar control', iconType: 'chart' },
    { key: 'magnesium', label: 'Magnesium', impact: 'Muscle & nerve function', iconType: 'shield' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3
            className="text-xl"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Blood Biomarkers for Athletes
          </h3>
          <DataSourceBadge source="labcorp" />
        </div>
        <span className="text-xs" style={{ color: colors.sage }}>
          Updated: {bloodTestData.lastUpdated}
        </span>
      </div>

      {/* Alert for Vitamin D */}
      <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)' }}>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 flex-shrink-0" style={{ color: '#E53E3E' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.deepForest }}>
              Vitamin D Insufficiency Detected
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(42,60,36,0.7)' }}>
              Your level of {tests.vitaminD.value} ng/mL is below optimal (30+). This can impact bone density and athletic performance.
              Consider supplementation and eating more salmon, sardines, and eggs.
            </p>
          </div>
        </div>
      </div>

      {/* Biomarkers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {athleteMarkers.map((marker) => {
          const test = tests[marker.key as keyof typeof tests];
          if (!test) return null;

          return (
            <div key={marker.key} className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(42,60,36,0.03)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 flex items-center justify-center" style={{ color: getStatusColor(test.status) }}>
                  {marker.iconType === 'heart' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>}
                  {marker.iconType === 'bolt' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
                  {marker.iconType === 'sun' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>}
                  {marker.iconType === 'pill' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                  {marker.iconType === 'chart' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>}
                  {marker.iconType === 'shield' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                </span>
                <span className="text-xs font-medium" style={{ color: colors.deepForest }}>{marker.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                  {test.value}
                </span>
                <span className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>{test.unit}</span>
              </div>
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: `${getStatusColor(test.status)}20`,
                  color: getStatusColor(test.status)
                }}
              >
                {test.status}
              </span>
              <p className="text-[10px] mt-1" style={{ color: 'rgba(42,60,36,0.5)' }}>
                {marker.impact}
              </p>
            </div>
          );
        })}
      </div>

      {/* Runner Insights */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(42,60,36,0.1)' }}>
        <p className="text-xs font-medium mb-2" style={{ color: colors.sage }}>Training Implications</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: colors.lime }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs" style={{ color: 'rgba(42,60,36,0.7)' }}>
              {bloodTestData.runnerInsights.oxygenCapacity}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: colors.lime }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs" style={{ color: 'rgba(42,60,36,0.7)' }}>
              {bloodTestData.runnerInsights.energyMetabolism}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: colors.lime }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs" style={{ color: 'rgba(42,60,36,0.7)' }}>
              {bloodTestData.runnerInsights.recoverySupport}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: colors.gold }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs" style={{ color: 'rgba(42,60,36,0.7)' }}>
              {bloodTestData.runnerInsights.inflammationRisk}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Workouts List
const RecentWorkoutsList = () => {
  const workouts = ouraFullData.recentWorkouts.slice(0, 6);
  const activityIcons: Record<string, string> = {
    running: "R",
    cycling: "C",
    walking: "W",
    swimming: "S",
    hiking: "H",
    strengthTraining: "ST",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-xl"
          style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
        >
          Recent Workouts
        </h3>
        <DataSourceBadge source="oura" />
      </div>

      <div className="space-y-3">
        {workouts.map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(42,60,36,0.03)" }}
          >
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: colors.lime, color: colors.deepForest }}>
              {activityIcons[w.activity] || "W"}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium capitalize" style={{ color: colors.deepForest }}>
                {w.activity}
              </p>
              <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
                {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: colors.deepForest }}>
                {w.duration}min
              </p>
              <p className="text-xs" style={{ color: colors.coral }}>
                {w.calories}kcal
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Strava Recent Activities
const StravaRecentRuns = () => {
  // Get the most recent runs from Strava
  const recentRuns = stravaData.activities
    .filter((a: { sport: string }) => a.sport === "Run")
    .slice(0, 8);

  return (
    <div className="bg-white rounded-xl p-6 border border-sand/30">
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-xl"
          style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
        >
          Strava Runs
        </h3>
        <DataSourceBadge source="strava" />
      </div>

      <div className="space-y-3">
        {recentRuns.map((run: { date: string; title: string; distance_miles: number; time: string; elevation_feet: number; activityId: string; isRace?: boolean }, i: number) => (
          <a
            key={i}
            href={`https://www.strava.com/activities/${run.activityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-[1.01]"
            style={{ backgroundColor: "rgba(252,76,2,0.05)" }}
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: colors.strava, color: "white" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: colors.deepForest }}>
                {run.title}
                {run.isRace && (
                  <span className="ml-2 px-1.5 py-0.5 text-[9px] rounded bg-[#FABF34] text-[#2A3C24] font-bold">RACE</span>
                )}
              </p>
              <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
                {new Date(run.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: colors.strava }}>
                {run.distance_miles.toFixed(1)}mi
              </p>
              <p className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
                {run.time}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Weekly summary */}
      <div className="mt-4 pt-4 border-t border-sand/30">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold" style={{ color: colors.strava }}>
              {stravaData.activities.filter((a: { sport: string }) => a.sport === "Run").slice(0, 7).reduce((sum: number, r: { distance_miles: number }) => sum + r.distance_miles, 0).toFixed(1)}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(42,60,36,0.5)" }}>Miles (7 days)</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: colors.deepForest }}>
              {stravaData.activities.filter((a: { sport: string }) => a.sport === "Run").length}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(42,60,36,0.5)" }}>Total Runs</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: colors.gold }}>
              {stravaData.activities.filter((a: { isRace?: boolean }) => a.isRace).length}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(42,60,36,0.5)" }}>Races</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function TrainingPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>("3weeks");

  // Get filtered data based on time range
  const filteredData = useMemo(() => {
    const now = new Date();
    let days = 7;
    switch (timeRange) {
      case "week": days = 7; break;
      case "12weeks": days = 84; break;
      case "year": days = 365; break;
      case "all": days = 1000; break;
    }
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return ouraFullData.daily.filter(d => new Date(d.date) >= cutoff);
  }, [timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      avgSleep: ouraFullData.overallStats.sleep.avgScore,
      avgReadiness: ouraFullData.overallStats.readiness.avgScore,
      avgSteps: ouraFullData.overallStats.activity.avgSteps,
      totalWorkouts: ouraFullData.overallStats.workouts.totalCount,
      totalDays: ouraFullData.metadata.dateRange.totalDays,
      vo2max: ouraFullData.overallStats.vo2max.latest,
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return colors.lime;
    if (score >= 70) return colors.sage;
    if (score >= 50) return colors.gold;
    return colors.coral;
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 70% 20%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(255,127,107,0.15) 0%, transparent 40%)"
          }}
        />
        <div className="container-editorial relative">
          <Link
            href="/running"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: "#546e40" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Running
          </Link>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#546e40" }}>
              Training Dashboard
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif",
                color: colors.deepForest
              }}
            >
              Health &<br />
              <span style={{ color: colors.lime }}>Training.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-xl mb-6" style={{ color: "rgba(42,60,36,0.7)" }}>
              {stats.totalDays}+ days of integrated health tracking across {stats.totalWorkouts} logged workouts. Unified insights from wearables, body composition, blood biomarkers, and running activities.
            </p>

            {/* Data Source Badges */}
            <div className="flex flex-wrap gap-2">
              <DataSourceBadge source="strava" />
              <DataSourceBadge source="oura" />
              <DataSourceBadge source="apple" />
              <DataSourceBadge source="renpho" />
              <DataSourceBadge source="labcorp" />
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(42,60,36,0.1)", color: "rgba(42,60,36,0.6)" }}>
                5 integrated data sources
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Date Range Selector */}
      <section className="py-4 bg-sand sticky top-16 z-40">
        <div className="container-editorial">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[
                { id: "week", label: "Week" },
                { id: "12weeks", label: "12 Weeks" },
                { id: "year", label: "Year" },
                { id: "all", label: "All Time" },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as TimeRange)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    timeRange === range.id
                      ? "bg-deep-forest text-warm-beige"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(42,60,36,0.5)" }}>
                  Sleep Score
                </p>
              </div>
              <p
                className="text-4xl"
                style={{ fontFamily: "var(--font-instrument)", color: getScoreColor(stats.avgSleep) }}
              >
                {stats.avgSleep}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.4)" }}>
                avg score
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(42,60,36,0.5)" }}>
                Readiness
              </p>
              <p
                className="text-4xl"
                style={{ fontFamily: "var(--font-instrument)", color: getScoreColor(stats.avgReadiness) }}
              >
                {stats.avgReadiness}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.4)" }}>
                recovery score
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(42,60,36,0.5)" }}>
                VO2 Max
              </p>
              <p
                className="text-4xl"
                style={{ fontFamily: "var(--font-instrument)", color: colors.lime }}
              >
                {stats.vo2max}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.4)" }}>
                ml/kg/min
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(42,60,36,0.5)" }}>
                Daily Steps
              </p>
              <p
                className="text-4xl"
                style={{ fontFamily: "var(--font-instrument)", color: colors.deepForest }}
              >
                {(stats.avgSteps / 1000).toFixed(1)}k
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.4)" }}>
                avg daily
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(42,60,36,0.5)" }}>
                Workouts
              </p>
              <p
                className="text-4xl"
                style={{ fontFamily: "var(--font-instrument)", color: colors.deepForest }}
              >
                {stats.totalWorkouts}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(42,60,36,0.4)" }}>
                total tracked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Tables Section */}
      <section className="py-8" style={{ backgroundColor: "rgba(42,60,36,0.02)" }}>
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl"
              style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
            >
              Comparison Table
            </h2>
            <div className="flex gap-2 p-1 rounded-full" style={{ backgroundColor: "rgba(42,60,36,0.1)" }}>
              {[
                { id: "3weeks", label: "3 Weeks" },
                { id: "3months", label: "3 Months" },
                { id: "3years", label: "3 Years" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setComparisonPeriod(p.id as ComparisonPeriod)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    comparisonPeriod === p.id
                      ? "bg-white shadow-sm"
                      : "bg-transparent"
                  }`}
                  style={{ color: colors.deepForest }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <ComparisonTable period={comparisonPeriod} />
        </div>
      </section>

      {/* Charts Grid */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <ZoneTimeChart />
            <ActiveCaloriesChart data={filteredData.length > 0 ? filteredData.slice(-14) : ouraFullData.daily.slice(-14)} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <DistanceChart data={filteredData.length > 0 ? filteredData.slice(-14) : ouraFullData.daily.slice(-14)} />
            <WeeklyGoalsCalendar />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <VO2MaxChart />
            <BodyCompositionCard />
          </div>

          {/* Blood Test Biomarkers - Full Width */}
          <BloodTestBiomarkers />
        </div>
      </section>

      {/* Recent Activity & Workouts */}
      <section className="py-8" style={{ backgroundColor: "rgba(212,237,57,0.1)" }}>
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-6">
            <StravaRecentRuns />
            <RecentWorkoutsList />
          </div>
        </div>
      </section>

      {/* Workout Analysis */}
      <section className="py-8" style={{ backgroundColor: colors.cream }}>
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Workout Types Summary */}
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <h3
                className="text-xl mb-4"
                style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
              >
                Workout Breakdown
              </h3>
              <div className="space-y-3">
                {ouraFullData.workoutSummary.slice(0, 6).map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium capitalize" style={{ color: colors.deepForest }}>
                          {w.activity}
                        </span>
                        <span className="text-sm" style={{ color: "rgba(42,60,36,0.6)" }}>
                          {w.count} workouts
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(42,60,36,0.1)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(w.count / ouraFullData.workoutSummary[0].count) * 100}%`,
                            backgroundColor: i === 0 ? colors.lime : i === 1 ? colors.sage : i === 2 ? colors.coral : colors.blue
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep & Recovery Deep Dive */}
      <section className="py-8">
        <div className="container-editorial">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Sleep & Recovery Trends
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sleep Score Trend */}
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl" style={{ fontFamily: "var(--font-instrument)", color: colors.deepForest }}>
                  Sleep Score Trend
                </h3>
                <DataSourceBadge source="oura" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.length > 0 ? filteredData : ouraFullData.daily.slice(-30)}>
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.lime} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colors.lime} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      tick={{ fontSize: 11 }}
                      stroke="rgba(42,60,36,0.3)"
                    />
                    <YAxis domain={[30, 100]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px" }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    />
                    <Area type="monotone" dataKey="sleepScore" stroke={colors.sage} fill="url(#sleepGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Readiness vs HRV */}
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <h3 className="text-xl mb-4" style={{ fontFamily: "var(--font-instrument)", color: colors.deepForest }}>
                Readiness vs HRV
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredData.length > 0 ? filteredData : ouraFullData.daily.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      tick={{ fontSize: 11 }}
                      stroke="rgba(42,60,36,0.3)"
                    />
                    <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 150]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: colors.cream, border: "1px solid #e7d8c6", borderRadius: "8px" }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="readinessScore" fill={colors.sage} name="Readiness" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="hrv" stroke={colors.deepForest} strokeWidth={2} name="HRV (ms)" dot={{ fill: colors.deepForest, r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights & Summary */}
      <section className="py-12" style={{ backgroundColor: "rgba(42,60,36,0.02)" }}>
        <div className="container-editorial">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: colors.deepForest }}
          >
            Insights
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(212,237,57,0.3)" }}>
                <svg className="w-5 h-5" fill={colors.deepForest} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: colors.deepForest }}>
                Elite Cardio Fitness
              </h4>
              <p className="text-sm" style={{ color: "rgba(42,60,36,0.7)" }}>
                VO2 Max of {ouraFullData.overallStats.vo2max.latest} ml/kg/min ranks in the top 5% for age group. All-time peak of {ouraFullData.overallStats.vo2max.max} shows consistent aerobic development.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(155,111,195,0.3)" }}>
                <svg className="w-5 h-5" fill={colors.deepForest} viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12a1 1 0 110-2h4a1 1 0 110 2H8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: colors.deepForest }}>
                Sleep Quality Focus
              </h4>
              <p className="text-sm" style={{ color: "rgba(42,60,36,0.7)" }}>
                Sleep efficiency averages {stats.avgSleep}. Deep sleep and REM stages tracked nightly via Oura Ring. Consistent timing improves recovery quality.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(74,144,217,0.3)" }}>
                <svg className="w-5 h-5" fill={colors.deepForest} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: colors.deepForest }}>
                Optimal Body Composition
              </h4>
              <p className="text-sm" style={{ color: "rgba(42,60,36,0.7)" }}>
                Body fat at {healthData.measurements[1].bodyFatPercentage}% with lean muscle mass of {healthData.measurements[1].muscleMass}lbs. Metabolic age of {healthData.measurements[1].metabolicAge} years supports high training load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/running" className="link-editorial text-sm">
            ← Back to Running
          </Link>
        </div>
      </section>
    </div>
  );
}
