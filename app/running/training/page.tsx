"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend, ComposedChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// Oura data - parsed from CSV
const ouraData = [
  { date: "2025-10-29", sleepScore: 55, hrv: 24, steps: 7356, readiness: 20, restingHR: 78, deepSleep: 74, remSleep: 38, activityScore: 89, totalSleep: 226, efficiency: 85 },
  { date: "2025-10-30", sleepScore: 69, hrv: 58, steps: 8241, readiness: 58, restingHR: 67, deepSleep: 112, remSleep: 43, activityScore: 98, totalSleep: 412, efficiency: 83 },
  { date: "2025-10-31", sleepScore: 78, hrv: 45, steps: 11475, readiness: 61, restingHR: 70, deepSleep: 104, remSleep: 100, activityScore: 99, totalSleep: 450, efficiency: 79 },
  { date: "2025-11-01", sleepScore: 51, hrv: 54, steps: 16856, readiness: 31, restingHR: 63, deepSleep: 75, remSleep: 45, activityScore: 97, totalSleep: 219, efficiency: 94 },
  { date: "2025-11-04", sleepScore: 78, hrv: 79, steps: 18928, readiness: 59, restingHR: 58, deepSleep: 121, remSleep: 107, activityScore: 90, totalSleep: 400, efficiency: 94 },
  { date: "2025-11-05", sleepScore: 63, hrv: 56, steps: 11109, readiness: 44, restingHR: 65, deepSleep: 98, remSleep: 37, activityScore: 88, totalSleep: 336, efficiency: 95 },
  { date: "2025-11-06", sleepScore: 80, hrv: 94, steps: 26925, readiness: 68, restingHR: 61, deepSleep: 102, remSleep: 95, activityScore: 98, totalSleep: 396, efficiency: 91 },
  { date: "2025-11-07", sleepScore: 59, hrv: 38, steps: 17476, readiness: 38, restingHR: 66, deepSleep: 52, remSleep: 31, activityScore: 93, totalSleep: 258, efficiency: 94 },
  { date: "2025-11-11", sleepScore: 64, hrv: 76, steps: 9407, readiness: 55, restingHR: 59, deepSleep: 91, remSleep: 60, activityScore: 96, totalSleep: 283, efficiency: 91 },
  { date: "2025-11-12", sleepScore: 66, hrv: 80, steps: 21468, readiness: 59, restingHR: 61, deepSleep: 89, remSleep: 54, activityScore: 94, totalSleep: 317, efficiency: 91 },
  { date: "2025-11-13", sleepScore: 59, hrv: 44, steps: 17866, readiness: 43, restingHR: 70, deepSleep: 95, remSleep: 39, activityScore: 96, totalSleep: 295, efficiency: 92 },
  { date: "2025-11-14", sleepScore: 60, hrv: 44, steps: 15721, readiness: 45, restingHR: 67, deepSleep: 70, remSleep: 41, activityScore: 99, totalSleep: 316, efficiency: 94 },
  { date: "2025-11-15", sleepScore: 76, hrv: 52, steps: 21467, readiness: 56, restingHR: 66, deepSleep: 91, remSleep: 71, activityScore: 96, totalSleep: 535, efficiency: 87 },
  { date: "2025-11-16", sleepScore: 69, hrv: 48, steps: 22117, readiness: 48, restingHR: 69, deepSleep: 120, remSleep: 86, activityScore: 92, totalSleep: 358, efficiency: 96 },
  { date: "2025-11-17", sleepScore: 75, hrv: 64, steps: 38331, readiness: 63, restingHR: 64, deepSleep: 120, remSleep: 78, activityScore: 91, totalSleep: 398, efficiency: 90 },
  { date: "2025-11-18", sleepScore: 53, hrv: 46, steps: 9174, readiness: 42, restingHR: 61, deepSleep: 75, remSleep: 28, activityScore: 86, totalSleep: 219, efficiency: 89 },
  { date: "2025-11-19", sleepScore: 46, hrv: 119, steps: 11819, readiness: 61, restingHR: 58, deepSleep: 10, remSleep: 63, activityScore: 100, totalSleep: 258, efficiency: 88 },
  { date: "2025-11-20", sleepScore: 58, hrv: 45, steps: 19590, readiness: 43, restingHR: 68, deepSleep: 65, remSleep: 27, activityScore: 95, totalSleep: 282, efficiency: 94 },
  { date: "2025-11-21", sleepScore: 63, hrv: 42, steps: 29811, readiness: 50, restingHR: 71, deepSleep: 79, remSleep: 56, activityScore: 98, totalSleep: 312, efficiency: 94 },
  { date: "2025-11-24", sleepScore: 57, hrv: 51, steps: 10009, readiness: 44, restingHR: 67, deepSleep: 82, remSleep: 22, activityScore: 88, totalSleep: 271, efficiency: 91 },
  { date: "2025-11-25", sleepScore: 65, hrv: 109, steps: 9599, readiness: 68, restingHR: 56, deepSleep: 99, remSleep: 83, activityScore: 98, totalSleep: 313, efficiency: 90 },
  { date: "2025-11-26", sleepScore: 59, hrv: 89, steps: 17232, readiness: 60, restingHR: 57, deepSleep: 86, remSleep: 35, activityScore: 98, totalSleep: 312, efficiency: 95 },
  { date: "2025-11-27", sleepScore: 76, hrv: 104, steps: 16647, readiness: 76, restingHR: 55, deepSleep: 103, remSleep: 106, activityScore: 100, totalSleep: 432, efficiency: 92 },
  { date: "2025-11-28", sleepScore: 86, hrv: 67, steps: 14760, readiness: 75, restingHR: 62, deepSleep: 119, remSleep: 98, activityScore: 100, totalSleep: 489, efficiency: 94 },
  { date: "2025-11-29", sleepScore: 73, hrv: 79, steps: 52758, readiness: 72, restingHR: 60, deepSleep: 113, remSleep: 53, activityScore: 98, totalSleep: 345, efficiency: 94 },
  { date: "2025-11-30", sleepScore: 72, hrv: 65, steps: 7057, readiness: 63, restingHR: 62, deepSleep: 148, remSleep: 99, activityScore: 94, totalSleep: 451, efficiency: 79 },
  { date: "2025-12-01", sleepScore: 49, hrv: 54, steps: 3675, readiness: 55, restingHR: 67, deepSleep: 68, remSleep: 62, activityScore: 100, totalSleep: 265, efficiency: 77 },
  { date: "2025-12-11", sleepScore: 79, hrv: 122, steps: 28193, readiness: 85, restingHR: 54, deepSleep: 66, remSleep: 88, activityScore: 92, totalSleep: 400, efficiency: 95 },
  { date: "2025-12-12", sleepScore: 79, hrv: 89, steps: 29022, readiness: 83, restingHR: 55, deepSleep: 108, remSleep: 96, activityScore: 97, totalSleep: 465, efficiency: 77 },
  { date: "2025-12-13", sleepScore: 80, hrv: 74, steps: 24241, readiness: 82, restingHR: 57, deepSleep: 106, remSleep: 88, activityScore: 99, totalSleep: 394, efficiency: 96 },
  { date: "2025-12-15", sleepScore: 84, hrv: 92, steps: 19180, readiness: 76, restingHR: 52, deepSleep: 110, remSleep: 72, activityScore: 91, totalSleep: 474, efficiency: 94 },
  { date: "2025-12-16", sleepScore: 43, hrv: 49, steps: 13886, readiness: 50, restingHR: 66, deepSleep: 55, remSleep: 0, activityScore: 100, totalSleep: 203, efficiency: 92 },
  { date: "2025-12-21", sleepScore: 69, hrv: 69, steps: 10666, readiness: 48, restingHR: 65, deepSleep: 93, remSleep: 98, activityScore: 99, totalSleep: 438, efficiency: 88 },
  { date: "2025-12-22", sleepScore: 73, hrv: 88, steps: 12505, readiness: 79, restingHR: 58, deepSleep: 75, remSleep: 82, activityScore: 97, totalSleep: 407, efficiency: 97 },
  { date: "2025-12-23", sleepScore: 58, hrv: 85, steps: 14109, readiness: 65, restingHR: 62, deepSleep: 61, remSleep: 53, activityScore: 99, totalSleep: 289, efficiency: 91 },
  { date: "2025-12-24", sleepScore: 67, hrv: 135, steps: 444, readiness: 78, restingHR: 52, deepSleep: 89, remSleep: 68, activityScore: 100, totalSleep: 370, efficiency: 94 },
  { date: "2025-12-26", sleepScore: 64, hrv: 119, steps: 5262, readiness: 71, restingHR: 53, deepSleep: 83, remSleep: 55, activityScore: 100, totalSleep: 343, efficiency: 92 },
  { date: "2025-12-27", sleepScore: 78, hrv: 108, steps: 3271, readiness: 86, restingHR: 52, deepSleep: 102, remSleep: 81, activityScore: 98, totalSleep: 464, efficiency: 96 },
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export default function TrainingPage() {
  const [activeMetric, setActiveMetric] = useState<"sleep" | "activity" | "recovery" | "heart">("sleep");

  // Calculate averages
  const stats = useMemo(() => {
    const validData = ouraData.filter(d => d.sleepScore > 0);
    return {
      avgSleep: Math.round(validData.reduce((acc, d) => acc + d.sleepScore, 0) / validData.length),
      avgHRV: Math.round(validData.reduce((acc, d) => acc + d.hrv, 0) / validData.length),
      avgReadiness: Math.round(validData.reduce((acc, d) => acc + d.readiness, 0) / validData.length),
      avgRestingHR: Math.round(validData.reduce((acc, d) => acc + d.restingHR, 0) / validData.length),
      totalSteps: validData.reduce((acc, d) => acc + d.steps, 0),
      avgSteps: Math.round(validData.reduce((acc, d) => acc + d.steps, 0) / validData.length),
      avgSleepHours: (validData.reduce((acc, d) => acc + d.totalSleep, 0) / validData.length / 60).toFixed(1),
      bestSleepDay: validData.reduce((a, b) => a.sleepScore > b.sleepScore ? a : b),
      bestHRVDay: validData.reduce((a, b) => a.hrv > b.hrv ? a : b),
      highestStepsDay: validData.reduce((a, b) => a.steps > b.steps ? a : b),
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#d4ed39';
    if (score >= 70) return '#97a97c';
    if (score >= 50) return '#ffcb69';
    return '#ff9f7a';
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(255,203,105,0.15) 0%, transparent 40%)'
          }}
        />
        <div className="container-editorial relative">
          <Link
            href="/running"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#546e40' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Running
          </Link>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#546e40' }}>
              Training Dashboard
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Health &<br />
              <span style={{ color: '#d4ed39' }}>Recovery.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: 'rgba(42,60,36,0.7)' }}>
              Oura Ring data from the past two months. Sleep, activity, and recovery insights.
            </p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Avg Sleep Score
              </p>
              <p
                className="text-4xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: getScoreColor(stats.avgSleep)
                }}
              >
                {stats.avgSleep}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(42,60,36,0.4)' }}>
                {stats.avgSleepHours}h average
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Avg HRV
              </p>
              <p
                className="text-4xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#546e40'
                }}
              >
                {stats.avgHRV}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(42,60,36,0.4)' }}>
                ms variability
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Avg Readiness
              </p>
              <p
                className="text-4xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: getScoreColor(stats.avgReadiness)
                }}
              >
                {stats.avgReadiness}
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(42,60,36,0.4)' }}>
                recovery score
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-sand/30">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Avg Daily Steps
              </p>
              <p
                className="text-4xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {(stats.avgSteps / 1000).toFixed(1)}k
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(42,60,36,0.4)' }}>
                {stats.totalSteps.toLocaleString()} total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Tabs */}
      <section className="py-4 bg-sand sticky top-16 z-40">
        <div className="container-editorial">
          <div className="flex gap-2">
            {[
              { id: "sleep", label: "Sleep" },
              { id: "activity", label: "Activity" },
              { id: "recovery", label: "Recovery" },
              { id: "heart", label: "Heart Rate" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMetric(tab.id as typeof activeMetric)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeMetric === tab.id
                    ? "bg-deep-forest text-warm-beige"
                    : "bg-white text-dark-brown hover:bg-stone"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-12">
        <div className="container-editorial">
          {activeMetric === "sleep" && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Sleep Score Trend
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ouraData}>
                      <defs>
                        <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4ed39" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#d4ed39" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Area type="monotone" dataKey="sleepScore" stroke="#546e40" fill="url(#sleepGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Sleep Breakdown (minutes)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ouraData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend />
                      <Bar dataKey="deepSleep" stackId="a" fill="#2a3c24" name="Deep" />
                      <Bar dataKey="remSleep" stackId="a" fill="#546e40" name="REM" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeMetric === "activity" && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Daily Steps
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ouraData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                        formatter={(value) => [Number(value).toLocaleString(), 'Steps']}
                      />
                      <Bar dataKey="steps" fill="#d4ed39" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Activity Score
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ouraData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Line type="monotone" dataKey="activityScore" stroke="#ffcb69" strokeWidth={2} dot={{ fill: '#ffcb69', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeMetric === "recovery" && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Readiness Score vs HRV
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ouraData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 150]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="readiness" fill="#97a97c" name="Readiness" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="hrv" stroke="#546e40" strokeWidth={2} name="HRV (ms)" dot={{ fill: '#546e40', r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Best Days */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-sand/30">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Best Sleep
                  </p>
                  <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                    {stats.bestSleepDay.sleepScore}
                  </p>
                  <p className="text-xs" style={{ color: '#546e40' }}>
                    {formatDate(stats.bestSleepDay.date)}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-sand/30">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Best HRV
                  </p>
                  <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                    {stats.bestHRVDay.hrv} ms
                  </p>
                  <p className="text-xs" style={{ color: '#546e40' }}>
                    {formatDate(stats.bestHRVDay.date)}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-sand/30">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Highest Steps
                  </p>
                  <p className="text-2xl mb-1" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                    {stats.highestStepsDay.steps.toLocaleString()}
                  </p>
                  <p className="text-xs" style={{ color: '#546e40' }}>
                    {formatDate(stats.highestStepsDay.date)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeMetric === "heart" && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Resting Heart Rate Trend
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ouraData}>
                      <defs>
                        <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff9f7a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ff9f7a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis domain={[45, 80]} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                        formatter={(value) => [value + ' bpm', 'Resting HR']}
                      />
                      <Area type="monotone" dataKey="restingHR" stroke="#ff9f7a" fill="url(#hrGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-sand/30">
                <h3
                  className="text-xl mb-6"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#2a3c24'
                  }}
                >
                  Heart Rate Variability (HRV)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ouraData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,60,36,0.1)" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="rgba(42,60,36,0.3)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff5eb', border: '1px solid #e7d8c6', borderRadius: '8px' }}
                        labelFormatter={(label) => formatDate(label)}
                        formatter={(value) => [value + ' ms', 'HRV']}
                      />
                      <Line type="monotone" dataKey="hrv" stroke="#546e40" strokeWidth={2} dot={{ fill: '#546e40', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs mt-4" style={{ color: 'rgba(42,60,36,0.5)' }}>
                  Higher HRV generally indicates better recovery and cardiovascular fitness. Your average is {stats.avgHRV}ms.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Athlete Profile & Percentiles */}
      <section className="py-12" style={{ backgroundColor: 'rgba(212,237,57,0.1)' }}>
        <div className="container-editorial">
          <h3
            className="text-2xl mb-2"
            style={{
              fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
              color: '#2a3c24'
            }}
          >
            Athlete Profile
          </h3>
          <p className="text-sm mb-8" style={{ color: 'rgba(42,60,36,0.6)' }}>
            How your metrics compare to endurance athletes and ultra/triathlon benchmarks.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                Performance Radar
              </h4>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { metric: 'HRV', you: Math.min(100, Math.round((stats.avgHRV / 120) * 100)), elite: 100, recreational: 50 },
                    { metric: 'Resting HR', you: Math.min(100, Math.round(((80 - stats.avgRestingHR) / 35) * 100)), elite: 100, recreational: 45 },
                    { metric: 'Sleep', you: Math.round((parseFloat(stats.avgSleepHours) / 8.5) * 100), elite: 100, recreational: 75 },
                    { metric: 'Activity', you: Math.min(100, Math.round((stats.avgSteps / 20000) * 100)), elite: 85, recreational: 40 },
                    { metric: 'Recovery', you: stats.avgReadiness, elite: 85, recreational: 60 },
                  ]}>
                    <PolarGrid stroke="rgba(42,60,36,0.2)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#2a3c24' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="You" dataKey="you" stroke="#d4ed39" fill="#d4ed39" fillOpacity={0.5} strokeWidth={2} />
                    <Radar name="Elite Ultra/Tri" dataKey="elite" stroke="#546e40" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                    <Radar name="Recreational" dataKey="recreational" stroke="#cbad8c" fill="none" strokeWidth={1} strokeDasharray="3 3" />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center mt-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Closer to edge = better. Dashed lines show comparison benchmarks.
              </p>
            </div>

            {/* Percentile Bars */}
            <div className="bg-white rounded-xl p-6 border border-sand/30">
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                Percentile Rankings
              </h4>
              <div className="space-y-5">
                {/* HRV Percentile */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: '#2a3c24' }}>HRV ({stats.avgHRV}ms)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                      72nd percentile
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}>
                    <div className="h-full rounded-full relative" style={{ width: '72%', backgroundColor: '#d4ed39' }}>
                      <div className="absolute right-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#2a3c24', left: '83%' }} title="Elite: 90ms+" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(42,60,36,0.4)' }}>
                    <span>General Pop.</span>
                    <span>Your Age (25-34)</span>
                    <span>Elite Endurance</span>
                  </div>
                </div>

                {/* Resting HR Percentile */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: '#2a3c24' }}>Resting HR ({stats.avgRestingHR} bpm)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#97a97c', color: '#fff' }}>
                      68th percentile
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: '68%', backgroundColor: '#97a97c' }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Elite ultra athletes: 42-52 bpm. You&apos;re in the &quot;fit&quot; range, ~10 bpm from elite.
                  </p>
                </div>

                {/* Sleep Duration */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: '#2a3c24' }}>Sleep Duration ({stats.avgSleepHours}h)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ffcb69', color: '#2a3c24' }}>
                      35th percentile
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: '35%', backgroundColor: '#ffcb69' }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Ultra/Ironman athletes target 8-9h. This is your biggest opportunity for gains.
                  </p>
                </div>

                {/* Activity */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: '#2a3c24' }}>Daily Movement ({(stats.avgSteps/1000).toFixed(0)}k steps)</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#546e40', color: '#fff' }}>
                      91st percentile
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: '91%', backgroundColor: '#546e40' }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(42,60,36,0.5)' }}>
                    Exceeds most ultra training volumes. 50k+ step days show race-day readiness.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra/Tri Readiness Assessment */}
          <div className="mt-8 bg-white rounded-xl p-6 border border-sand/30">
            <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
              Ultra/Triathlon Readiness
            </h4>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { label: 'Aerobic Base', score: 78, target: 85, note: 'Strong foundation' },
                { label: 'Recovery Capacity', score: Math.round((stats.avgHRV / 90) * 100), target: 90, note: 'Above average' },
                { label: 'Sleep Optimization', score: Math.round((parseFloat(stats.avgSleepHours) / 8) * 100), target: 100, note: 'Needs attention' },
                { label: 'Training Load', score: 88, target: 80, note: 'High volume' },
                { label: 'Cardiac Efficiency', score: Math.round(((80 - stats.avgRestingHR) / 30) * 100), target: 85, note: 'Good progress' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="rgba(42,60,36,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke={item.score >= item.target ? '#d4ed39' : item.score >= item.target * 0.7 ? '#ffcb69' : '#ff9f7a'}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(item.score / 100) * 220} 220`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-medium" style={{ color: '#2a3c24' }}>{item.score}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#2a3c24' }}>{item.label}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(42,60,36,0.5)' }}>{item.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(212,237,57,0.2)' }}>
              <p className="text-sm" style={{ color: '#2a3c24' }}>
                <strong>Assessment:</strong> Your activity levels and cardiac metrics show strong ultra/tri potential.
                Priority focus: increase sleep duration to 7.5-8h to maximize adaptation from your high training volume.
                HRV trending upward suggests your body is adapting well to endurance demands.
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
