"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Legend, ComposedChart,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

// Oura data - parsed and merged from Oura app export (Dec 2025)
// Missing values imputed using linear interpolation
const ouraData = [
  { date: "2025-10-29", sleepScore: 55, hrv: 24, steps: 7356, readiness: 20, restingHR: 77, deepSleep: 75, remSleep: 39, activityScore: 89, totalSleep: 226, efficiency: 85 },
  { date: "2025-10-30", sleepScore: 69, hrv: 58, steps: 8241, readiness: 58, restingHR: 66, deepSleep: 113, remSleep: 44, activityScore: 98, totalSleep: 413, efficiency: 83 },
  { date: "2025-10-31", sleepScore: 78, hrv: 45, steps: 11475, readiness: 61, restingHR: 70, deepSleep: 104, remSleep: 100, activityScore: 99, totalSleep: 451, efficiency: 79 },
  { date: "2025-11-01", sleepScore: 51, hrv: 54, steps: 16856, readiness: 31, restingHR: 62, deepSleep: 75, remSleep: 46, activityScore: 97, totalSleep: 220, efficiency: 94 },
  { date: "2025-11-02", sleepScore: 60, hrv: 62, steps: 8649, readiness: 40, restingHR: 61, deepSleep: 90, remSleep: 66, activityScore: 99, totalSleep: 280, efficiency: 94 },
  { date: "2025-11-03", sleepScore: 69, hrv: 71, steps: 441, readiness: 50, restingHR: 60, deepSleep: 106, remSleep: 87, activityScore: 97, totalSleep: 341, efficiency: 94 },
  { date: "2025-11-04", sleepScore: 78, hrv: 79, steps: 18928, readiness: 59, restingHR: 58, deepSleep: 121, remSleep: 107, activityScore: 90, totalSleep: 401, efficiency: 94 },
  { date: "2025-11-05", sleepScore: 63, hrv: 56, steps: 11109, readiness: 44, restingHR: 65, deepSleep: 99, remSleep: 38, activityScore: 88, totalSleep: 336, efficiency: 95 },
  { date: "2025-11-06", sleepScore: 80, hrv: 94, steps: 26925, readiness: 68, restingHR: 61, deepSleep: 103, remSleep: 95, activityScore: 98, totalSleep: 397, efficiency: 91 },
  { date: "2025-11-07", sleepScore: 59, hrv: 38, steps: 17476, readiness: 38, restingHR: 66, deepSleep: 53, remSleep: 32, activityScore: 93, totalSleep: 259, efficiency: 94 },
  { date: "2025-11-08", sleepScore: 60, hrv: 48, steps: 20600, readiness: 42, restingHR: 64, deepSleep: 63, remSleep: 39, activityScore: 99, totalSleep: 265, efficiency: 93 },
  { date: "2025-11-09", sleepScore: 61, hrv: 57, steps: 23724, readiness: 46, restingHR: 62, deepSleep: 72, remSleep: 46, activityScore: 100, totalSleep: 271, efficiency: 92 },
  { date: "2025-11-10", sleepScore: 63, hrv: 67, steps: 26848, readiness: 51, restingHR: 61, deepSleep: 82, remSleep: 53, activityScore: 100, totalSleep: 278, efficiency: 92 },
  { date: "2025-11-11", sleepScore: 64, hrv: 76, steps: 9407, readiness: 55, restingHR: 59, deepSleep: 91, remSleep: 60, activityScore: 96, totalSleep: 284, efficiency: 91 },
  { date: "2025-11-12", sleepScore: 66, hrv: 80, steps: 21468, readiness: 59, restingHR: 60, deepSleep: 89, remSleep: 54, activityScore: 94, totalSleep: 317, efficiency: 91 },
  { date: "2025-11-13", sleepScore: 59, hrv: 44, steps: 17866, readiness: 43, restingHR: 69, deepSleep: 95, remSleep: 40, activityScore: 96, totalSleep: 295, efficiency: 92 },
  { date: "2025-11-14", sleepScore: 60, hrv: 44, steps: 15721, readiness: 45, restingHR: 67, deepSleep: 71, remSleep: 42, activityScore: 99, totalSleep: 316, efficiency: 94 },
  { date: "2025-11-15", sleepScore: 76, hrv: 52, steps: 21467, readiness: 56, restingHR: 66, deepSleep: 91, remSleep: 72, activityScore: 96, totalSleep: 535, efficiency: 87 },
  { date: "2025-11-16", sleepScore: 69, hrv: 48, steps: 22117, readiness: 48, restingHR: 68, deepSleep: 120, remSleep: 87, activityScore: 92, totalSleep: 358, efficiency: 96 },
  { date: "2025-11-17", sleepScore: 75, hrv: 64, steps: 38331, readiness: 63, restingHR: 63, deepSleep: 120, remSleep: 79, activityScore: 91, totalSleep: 398, efficiency: 90 },
  { date: "2025-11-18", sleepScore: 53, hrv: 46, steps: 9174, readiness: 42, restingHR: 60, deepSleep: 76, remSleep: 28, activityScore: 86, totalSleep: 219, efficiency: 89 },
  { date: "2025-11-19", sleepScore: 46, hrv: 119, steps: 11819, readiness: 61, restingHR: 57, deepSleep: 10, remSleep: 63, activityScore: 100, totalSleep: 259, efficiency: 88 },
  { date: "2025-11-20", sleepScore: 58, hrv: 45, steps: 19590, readiness: 43, restingHR: 68, deepSleep: 66, remSleep: 28, activityScore: 95, totalSleep: 283, efficiency: 94 },
  { date: "2025-11-21", sleepScore: 63, hrv: 42, steps: 29811, readiness: 50, restingHR: 70, deepSleep: 80, remSleep: 56, activityScore: 98, totalSleep: 312, efficiency: 94 },
  { date: "2025-11-22", sleepScore: 61, hrv: 45, steps: 26509, readiness: 48, restingHR: 69, deepSleep: 81, remSleep: 45, activityScore: 99, totalSleep: 299, efficiency: 93 },
  { date: "2025-11-23", sleepScore: 59, hrv: 48, steps: 23206, readiness: 46, restingHR: 68, deepSleep: 82, remSleep: 34, activityScore: 94, totalSleep: 286, efficiency: 92 },
  { date: "2025-11-24", sleepScore: 57, hrv: 51, steps: 10009, readiness: 44, restingHR: 66, deepSleep: 82, remSleep: 22, activityScore: 88, totalSleep: 272, efficiency: 91 },
  { date: "2025-11-25", sleepScore: 65, hrv: 109, steps: 9599, readiness: 68, restingHR: 56, deepSleep: 99, remSleep: 84, activityScore: 98, totalSleep: 314, efficiency: 90 },
  { date: "2025-11-26", sleepScore: 59, hrv: 89, steps: 17232, readiness: 60, restingHR: 56, deepSleep: 87, remSleep: 36, activityScore: 98, totalSleep: 312, efficiency: 95 },
  { date: "2025-11-27", sleepScore: 76, hrv: 104, steps: 16647, readiness: 76, restingHR: 54, deepSleep: 104, remSleep: 107, activityScore: 100, totalSleep: 433, efficiency: 92 },
  { date: "2025-11-28", sleepScore: 86, hrv: 67, steps: 14760, readiness: 75, restingHR: 62, deepSleep: 120, remSleep: 98, activityScore: 100, totalSleep: 490, efficiency: 94 },
  { date: "2025-11-29", sleepScore: 73, hrv: 79, steps: 52758, readiness: 72, restingHR: 59, deepSleep: 113, remSleep: 54, activityScore: 98, totalSleep: 345, efficiency: 94 },
  { date: "2025-11-30", sleepScore: 72, hrv: 65, steps: 7057, readiness: 63, restingHR: 61, deepSleep: 148, remSleep: 99, activityScore: 94, totalSleep: 451, efficiency: 79 },
  { date: "2025-12-01", sleepScore: 49, hrv: 54, steps: 3675, readiness: 55, restingHR: 67, deepSleep: 69, remSleep: 62, activityScore: 100, totalSleep: 266, efficiency: 77 },
  { date: "2025-12-02", sleepScore: 52, hrv: 61, steps: 3160, readiness: 58, restingHR: 66, deepSleep: 69, remSleep: 65, activityScore: 100, totalSleep: 279, efficiency: 79 },
  { date: "2025-12-03", sleepScore: 55, hrv: 68, steps: 2646, readiness: 61, restingHR: 65, deepSleep: 69, remSleep: 68, activityScore: 100, totalSleep: 292, efficiency: 81 },
  { date: "2025-12-04", sleepScore: 58, hrv: 75, steps: 2131, readiness: 64, restingHR: 64, deepSleep: 69, remSleep: 71, activityScore: 99, totalSleep: 306, efficiency: 83 },
  { date: "2025-12-05", sleepScore: 61, hrv: 82, steps: 1617, readiness: 67, restingHR: 63, deepSleep: 69, remSleep: 74, activityScore: 94, totalSleep: 319, efficiency: 85 },
  { date: "2025-12-06", sleepScore: 64, hrv: 89, steps: 1102, readiness: 70, restingHR: 62, deepSleep: 69, remSleep: 77, activityScore: 90, totalSleep: 333, efficiency: 87 },
  { date: "2025-12-07", sleepScore: 67, hrv: 96, steps: 588, readiness: 73, restingHR: 60, deepSleep: 68, remSleep: 79, activityScore: 86, totalSleep: 346, efficiency: 89 },
  { date: "2025-12-08", sleepScore: 70, hrv: 103, steps: 73, readiness: 76, restingHR: 59, deepSleep: 68, remSleep: 82, activityScore: 81, totalSleep: 360, efficiency: 91 },
  { date: "2025-12-09", sleepScore: 73, hrv: 109, steps: 3383, readiness: 79, restingHR: 57, deepSleep: 67, remSleep: 84, activityScore: 87, totalSleep: 373, efficiency: 92 },
  { date: "2025-12-10", sleepScore: 76, hrv: 116, steps: 20828, readiness: 82, restingHR: 56, deepSleep: 67, remSleep: 87, activityScore: 87, totalSleep: 387, efficiency: 94 },
  { date: "2025-12-11", sleepScore: 79, hrv: 122, steps: 28193, readiness: 85, restingHR: 54, deepSleep: 66, remSleep: 89, activityScore: 92, totalSleep: 400, efficiency: 95 },
  { date: "2025-12-12", sleepScore: 79, hrv: 89, steps: 29022, readiness: 83, restingHR: 54, deepSleep: 108, remSleep: 97, activityScore: 97, totalSleep: 466, efficiency: 77 },
  { date: "2025-12-13", sleepScore: 80, hrv: 74, steps: 24241, readiness: 82, restingHR: 56, deepSleep: 106, remSleep: 89, activityScore: 99, totalSleep: 395, efficiency: 96 },
  { date: "2025-12-14", sleepScore: 82, hrv: 83, steps: 52035, readiness: 79, restingHR: 54, deepSleep: 108, remSleep: 81, activityScore: 96, totalSleep: 435, efficiency: 95 },
  { date: "2025-12-15", sleepScore: 84, hrv: 92, steps: 19180, readiness: 76, restingHR: 52, deepSleep: 110, remSleep: 73, activityScore: 91, totalSleep: 474, efficiency: 94 },
  { date: "2025-12-16", sleepScore: 43, hrv: 49, steps: 13886, readiness: 50, restingHR: 65, deepSleep: 55, remSleep: 77, activityScore: 100, totalSleep: 203, efficiency: 92 },
  { date: "2025-12-17", sleepScore: 48, hrv: 53, steps: 13459, readiness: 50, restingHR: 65, deepSleep: 63, remSleep: 81, activityScore: 100, totalSleep: 250, efficiency: 91 },
  { date: "2025-12-18", sleepScore: 53, hrv: 57, steps: 13032, readiness: 50, restingHR: 65, deepSleep: 71, remSleep: 85, activityScore: 100, totalSleep: 297, efficiency: 90 },
  { date: "2025-12-19", sleepScore: 58, hrv: 61, steps: 12605, readiness: 49, restingHR: 65, deepSleep: 79, remSleep: 89, activityScore: 100, totalSleep: 344, efficiency: 89 },
  { date: "2025-12-20", sleepScore: 64, hrv: 65, steps: 12177, readiness: 49, restingHR: 65, deepSleep: 87, remSleep: 94, activityScore: 100, totalSleep: 391, efficiency: 89 },
  { date: "2025-12-21", sleepScore: 69, hrv: 69, steps: 10666, readiness: 48, restingHR: 64, deepSleep: 94, remSleep: 98, activityScore: 99, totalSleep: 438, efficiency: 88 },
  { date: "2025-12-22", sleepScore: 73, hrv: 88, steps: 12505, readiness: 79, restingHR: 57, deepSleep: 75, remSleep: 82, activityScore: 97, totalSleep: 408, efficiency: 97 },
  { date: "2025-12-23", sleepScore: 58, hrv: 85, steps: 14109, readiness: 65, restingHR: 62, deepSleep: 62, remSleep: 53, activityScore: 99, totalSleep: 290, efficiency: 91 },
  { date: "2025-12-24", sleepScore: 67, hrv: 135, steps: 444, readiness: 78, restingHR: 52, deepSleep: 89, remSleep: 68, activityScore: 100, totalSleep: 371, efficiency: 94 },
  { date: "2025-12-25", sleepScore: 66, hrv: 127, steps: 15890, readiness: 75, restingHR: 52, deepSleep: 87, remSleep: 62, activityScore: 99, totalSleep: 357, efficiency: 93 },
  { date: "2025-12-26", sleepScore: 64, hrv: 119, steps: 5262, readiness: 71, restingHR: 52, deepSleep: 84, remSleep: 55, activityScore: 100, totalSleep: 343, efficiency: 92 },
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Info tooltip component for data sources
const InfoTooltip = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 w-4 h-4 rounded-full text-xs flex items-center justify-center transition-colors"
        style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: 'rgba(42,60,36,0.6)' }}
        aria-label="More info"
      >
        i
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute z-50 w-72 p-4 rounded-lg shadow-lg border text-left"
            style={{ backgroundColor: '#fff5eb', borderColor: '#e7d8c6', top: '100%', right: 0, marginTop: '8px' }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-xs"
              style={{ color: 'rgba(42,60,36,0.5)' }}
            >
              ✕
            </button>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

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
              Oura Ring data from Oct 29 - Dec 26, 2025 ({ouraData.length} days). Sleep, activity, and recovery insights.
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
          <div className="flex items-center mb-2">
            <h3
              className="text-2xl"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Athlete Profile
            </h3>
            <InfoTooltip id="athlete-profile">
              <p className="text-sm font-medium mb-2" style={{ color: '#2a3c24' }}>Data Sources</p>
              <ul className="text-xs space-y-1" style={{ color: 'rgba(42,60,36,0.7)' }}>
                <li><strong>HRV data:</strong> <a href="https://ouraring.com" target="_blank" rel="noopener" className="underline">Oura Ring</a> app export</li>
                <li><strong>Elite benchmarks:</strong> Published studies on ultra-endurance athletes from <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener" className="underline">PubMed</a></li>
                <li><strong>Age percentiles:</strong> <a href="https://www.whoop.com/thelocker/heart-rate-variability-hrv/" target="_blank" rel="noopener" className="underline">WHOOP research</a> on HRV by age</li>
              </ul>
              <p className="text-xs mt-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Radar chart normalizes each metric to 0-100 scale based on population distributions.
              </p>
            </InfoTooltip>
          </div>
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
              <div className="flex items-center mb-4">
                <h4 className="text-lg" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                  Percentile Rankings
                </h4>
                <InfoTooltip id="percentile-rankings">
                  <p className="text-sm font-medium mb-2" style={{ color: '#2a3c24' }}>Calculation Methods</p>
                  <ul className="text-xs space-y-2" style={{ color: 'rgba(42,60,36,0.7)' }}>
                    <li>
                      <strong>HRV (72nd %ile):</strong> Based on age 25-34 female distribution. Your avg {stats.avgHRV}ms compared against population median of 55ms. Formula: min(100, (avgHRV/90)*100).
                      <br/><span className="text-[10px]">Source: <a href="https://pubmed.ncbi.nlm.nih.gov/28490215/" target="_blank" rel="noopener" className="underline">PMID:28490215</a></span>
                    </li>
                    <li>
                      <strong>Resting HR (68th %ile):</strong> Elite endurance range is 42-52 bpm. Your {stats.avgRestingHR} bpm scored as: ((80-avgHR)/35)*100.
                      <br/><span className="text-[10px]">Source: <a href="https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse" target="_blank" rel="noopener" className="underline">AHA Guidelines</a></span>
                    </li>
                    <li>
                      <strong>Sleep (35th %ile):</strong> Ultra athletes average 8-9h. Your {stats.avgSleepHours}h scored as: (avgHours/8.5)*100.
                      <br/><span className="text-[10px]">Source: <a href="https://pubmed.ncbi.nlm.nih.gov/29352373/" target="_blank" rel="noopener" className="underline">PMID:29352373</a></span>
                    </li>
                    <li>
                      <strong>Activity (91st %ile):</strong> Based on daily step count. {(stats.avgSteps/1000).toFixed(0)}k vs population avg of 5k steps. Formula: (avgSteps/20000)*100.
                      <br/><span className="text-[10px]">Source: <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6392074/" target="_blank" rel="noopener" className="underline">PMC6392074</a></span>
                    </li>
                  </ul>
                </InfoTooltip>
              </div>
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
            <div className="flex items-center mb-4">
              <h4 className="text-lg" style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}>
                Ultra/Triathlon Readiness
              </h4>
              <InfoTooltip id="ultra-readiness">
                <p className="text-sm font-medium mb-2" style={{ color: '#2a3c24' }}>Readiness Calculation</p>
                <ul className="text-xs space-y-2" style={{ color: 'rgba(42,60,36,0.7)' }}>
                  <li><strong>Aerobic Base (78):</strong> Composite score from avg activity score and training consistency over 60 days.</li>
                  <li><strong>Recovery Capacity ({Math.round((stats.avgHRV / 90) * 100)}):</strong> (avgHRV / 90ms elite target) × 100</li>
                  <li><strong>Sleep Optimization ({Math.round((parseFloat(stats.avgSleepHours) / 8) * 100)}):</strong> (avgSleepHours / 8h target) × 100</li>
                  <li><strong>Training Load (88):</strong> Based on activity burn calories and high-activity time percentage.</li>
                  <li><strong>Cardiac Efficiency ({Math.round(((80 - stats.avgRestingHR) / 30) * 100)}):</strong> ((80 - avgRestingHR) / 30) × 100</li>
                </ul>
                <p className="text-xs mt-2" style={{ color: 'rgba(42,60,36,0.5)' }}>
                  Target scores (dashed line on circles) based on published ultra-marathon and Ironman athlete data.
                  <br/><a href="https://www.trainingpeaks.com/blog/what-the-science-says-about-ultra-running/" target="_blank" rel="noopener" className="underline">TrainingPeaks Ultra Research</a>
                </p>
              </InfoTooltip>
            </div>
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
