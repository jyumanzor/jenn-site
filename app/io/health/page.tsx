"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import IOAuthGate from "@/components/IOAuthGate";

// Color palette - expanded for visual variety
const colors = {
  deepForest: "#2A3C24",
  darkOlive: "#3B412D",
  olive: "#546E40",
  sage: "#97A97C",
  cream: "#FFF5EB",
  ivory: "#FAF3E8",
  gold: "#FABF34",
  amber: "#FFCB69",
  lime: "#D4ED39",
  tan: "#CBAD8C",
  // Additional vibrant colors
  coral: "#FF7F6B",
  blue: "#4A90D9",
  purple: "#9B6FC3",
  teal: "#38B2AC",
  rose: "#F687B3",
  indigo: "#667EEA",
  orange: "#ED8936",
  cyan: "#00B5D8",
  // Zone colors for training
  zone1: "#63C7FF",
  zone2: "#44D688",
  zone3: "#FFCB3D",
  zone4: "#FF7F50",
  zone5: "#FF4757",
};

// Types
interface HealthMeasurement {
  date: string;
  weight: number;
  bodyFatMass: number;
  boneMass: number;
  proteinMass: number;
  bodyWaterMass: number;
  muscleMass: number;
  skeletalMuscleMass: number;
  bmi: number;
  bodyFatPercentage: number;
  visceralFat: number;
  bmr: number;
  fatFreeMass: number;
  subcutaneousFat: number;
  smi: number;
  metabolicAge: number;
  whr: number;
  bodyScore: number;
  segmentalFat?: {
    leftArm: { mass: number; percentage: number };
    rightArm: { mass: number; percentage: number };
    trunk: { mass: number; percentage: number };
    leftLeg: { mass: number; percentage: number };
    rightLeg: { mass: number; percentage: number };
  };
  muscleBalance?: {
    leftArm: { mass: number; percentage: number; rating: string };
    rightArm: { mass: number; percentage: number; rating: string };
    trunk: { mass: number; percentage: number; rating: string };
    leftLeg: { mass: number; percentage: number; rating: string };
    rightLeg: { mass: number; percentage: number; rating: string };
  };
}

interface OuraEntry {
  date: string;
  sleepScore: number | null;
  readinessScore: number | null;
  avgHRV: number | null;
  avgRestingHR: number | null;
  sleepEfficiency: number | null;
  deepSleepDuration: number | null;
  totalSleepDuration: number | null;
  tempDeviation: number | null;
  remSleepDuration: number | null;
  activityScore: number | null;
  steps: number | null;
}

interface HealthData {
  profile: {
    gender: string;
    age: number;
    height: string;
    heightCm: number;
  };
  measurements: HealthMeasurement[];
  targets: {
    optimalWeight: number;
    targetWeightDelta: number;
    targetFatMassDelta: number;
    targetMuscleMassDelta: number;
  };
  optimalRanges: {
    weight: { min: number; max: number };
    bodyFatMass: { min: number; max: number };
    muscleMass: { min: number; max: number };
  };
}

// Tab types
type TabType = "overview" | "body" | "sleep" | "running" | "recommendations";

// Race data
const worldMajors = [
  { name: "Boston", year: 2026, status: "registered", date: "Apr 2026" },
  { name: "Chicago", year: 2026, status: "registered", date: "Oct 2026" },
  { name: "Tokyo", year: null, status: "pending", date: "TBD" },
  { name: "London", year: null, status: "pending", date: "TBD" },
  { name: "Berlin", year: null, status: "pending", date: "TBD" },
  { name: "New York", year: null, status: "pending", date: "TBD" },
  { name: "Sydney", year: null, status: "pending", date: "TBD" },
];

const upcomingRaces = [
  { name: "Boston Marathon", date: "April 21, 2026", type: "Marathon", goal: "Sub-3:05" },
  { name: "Chicago Marathon", date: "October 11, 2026", type: "Marathon", goal: "Sub-3:00" },
];

// Parsed health data (from health.json)
const healthData: HealthData = {
  profile: {
    gender: "Female",
    age: 26,
    height: "5'6\"",
    heightCm: 167.6
  },
  measurements: [
    {
      date: "2024-09-28",
      weight: 112.8,
      bodyFatMass: 10.2,
      boneMass: 6.8,
      proteinMass: 20.4,
      bodyWaterMass: 75.4,
      muscleMass: 95.8,
      skeletalMuscleMass: 56.4,
      bmi: 18.2,
      bodyFatPercentage: 9.0,
      visceralFat: 1,
      bmr: 1385,
      fatFreeMass: 102.6,
      subcutaneousFat: 6.2,
      smi: 7.0,
      metabolicAge: 23,
      whr: 0.72,
      bodyScore: 69
    },
    {
      date: "2024-12-19",
      weight: 114.4,
      bodyFatMass: 9.4,
      boneMass: 7.0,
      proteinMass: 21.0,
      bodyWaterMass: 76.8,
      muscleMass: 97.8,
      skeletalMuscleMass: 58.2,
      bmi: 18.4,
      bodyFatPercentage: 8.2,
      visceralFat: 1,
      bmr: 1397,
      fatFreeMass: 105.0,
      subcutaneousFat: 5.9,
      smi: 7.2,
      metabolicAge: 23,
      whr: 0.71,
      bodyScore: 71,
      segmentalFat: {
        leftArm: { mass: 0.4, percentage: 13.1 },
        rightArm: { mass: 0.4, percentage: 13.1 },
        trunk: { mass: 5.6, percentage: 43.9 },
        leftLeg: { mass: 2.0, percentage: 34.8 },
        rightLeg: { mass: 1.8, percentage: 33.2 }
      },
      muscleBalance: {
        leftArm: { mass: 5.8, percentage: 131.2, rating: "High" },
        rightArm: { mass: 5.6, percentage: 128.7, rating: "High" },
        trunk: { mass: 45.6, percentage: 115.0, rating: "High" },
        leftLeg: { mass: 16.8, percentage: 121.1, rating: "High" },
        rightLeg: { mass: 16.6, percentage: 120.6, rating: "High" }
      }
    }
  ],
  targets: {
    optimalWeight: 133.8,
    targetWeightDelta: 21.4,
    targetFatMassDelta: 21.4,
    targetMuscleMassDelta: 0.0
  },
  optimalRanges: {
    weight: { min: 113.8, max: 153.8 },
    bodyFatMass: { min: 26.8, max: 43.0 },
    muscleMass: { min: 81.2, max: 103.4 }
  }
};

// Parse Oura CSV data
const parseOuraData = (): OuraEntry[] => {
  const rawData = `2025-10-29,55,20,24,77.69,85,4470,13560,1.41,2310,89,7356
2025-10-30,69,58,58,66.95,83,6750,24750,-0.07,2610,98,8241
2025-10-31,78,61,45,70.31,79,6240,27030,0.11,6000,99,11475
2025-11-01,51,31,54,62.89,94,4500,13170,-0.97,2730,97,16856
2025-11-04,78,59,79,58.48,94,7260,24030,-0.12,6420,90,18928
2025-11-05,63,44,56,65.48,95,5910,20160,-0.12,2250,88,11109
2025-11-06,80,68,94,61.34,91,6150,23790,-0.55,5700,98,26925
2025-11-07,59,38,38,66.48,94,3150,15510,-0.26,1890,93,17476
2025-11-11,64,55,76,59.23,91,5460,17010,-0.81,3600,96,9407
2025-11-12,66,59,80,60.52,91,5340,19020,-0.14,3240,94,21468
2025-11-13,59,43,44,69.61,92,5700,17700,0.0,2370,96,17866
2025-11-14,60,45,44,67.3,94,4230,18960,-0.45,2490,99,15721
2025-11-15,76,56,52,66.22,87,5460,32100,0.27,4290,96,21467
2025-11-16,69,48,48,68.89,96,7200,21450,0.19,5190,92,22117
2025-11-17,75,63,64,63.95,90,7200,23880,0.32,4710,91,38331
2025-11-18,53,42,46,60.73,89,4530,13140,-0.75,1680,86,9174
2025-11-19,46,61,119,57.56,88,600,15510,0.06,3780,100,11819
2025-11-20,58,43,45,68.34,94,3930,16950,0.41,1650,95,19590
2025-11-21,63,50,42,70.89,94,4770,18720,0.15,3360,98,29811
2025-11-24,57,44,51,66.83,91,4920,16290,0.49,1320,88,10009
2025-11-25,65,68,109,56.23,90,5940,18810,-0.13,5010,98,9599
2025-11-26,59,60,89,56.93,95,5190,18720,0.15,2130,98,17232
2025-11-27,76,76,104,54.72,92,6210,25950,-0.74,6390,100,16647
2025-11-28,86,75,67,62.09,94,7170,29370,0.23,5880,100,14760
2025-11-29,73,72,79,59.83,94,6780,20700,-0.5,3210,98,52758
2025-11-30,72,63,65,61.58,79,8880,27060,-0.01,5940,94,7057
2025-12-01,49,55,54,67.08,77,4110,15930,0.01,3720,100,3675
2025-12-11,79,85,122,54.09,95,3960,24000,-0.56,5310,92,28193
2025-12-12,79,83,89,54.78,77,6480,27930,-0.15,5790,97,29022
2025-12-13,80,82,74,56.87,96,6360,23670,0.17,5310,99,24241
2025-12-15,84,76,92,52.38,94,6600,28410,0.41,4350,91,19180
2025-12-16,43,50,49,65.75,92,3300,12180,0.31,0,100,13886
2025-12-21,69,48,69,64.81,88,5610,26280,0.65,5880,99,10666
2025-12-22,73,79,88,57.54,97,4500,24450,-0.8,4920,97,12505
2025-12-23,58,65,85,62.38,91,3690,17370,-0.05,3180,99,14109
2025-12-24,67,78,135,52.49,94,5340,22230,0.07,4080,100,444
2025-12-26,64,71,119,52.69,92,5010,20580,0.04,3300,100,5262
2025-12-27,78,86,108,51.83,96,6150,27870,-0.54,4860,98,3271`;

  return rawData.split('\n').map(line => {
    const parts = line.split(',');
    return {
      date: parts[0],
      sleepScore: parts[1] ? parseInt(parts[1]) : null,
      readinessScore: parts[2] ? parseInt(parts[2]) : null,
      avgHRV: parts[3] ? parseInt(parts[3]) : null,
      avgRestingHR: parts[4] ? parseFloat(parts[4]) : null,
      sleepEfficiency: parts[5] ? parseInt(parts[5]) : null,
      deepSleepDuration: parts[6] ? parseInt(parts[6]) : null,
      totalSleepDuration: parts[7] ? parseInt(parts[7]) : null,
      tempDeviation: parts[8] ? parseFloat(parts[8]) : null,
      remSleepDuration: parts[9] ? parseInt(parts[9]) : null,
      activityScore: parts[10] ? parseInt(parts[10]) : null,
      steps: parts[11] ? parseInt(parts[11]) : null,
    };
  }).filter(e => e.sleepScore !== null);
};

// Progress Ring Component with enhanced animation
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = colors.sage,
  bgColor = "rgba(151, 169, 124, 0.2)",
  children,
  animated = true,
  showGlow = false
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  animated?: boolean;
  showGlow?: boolean;
}) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentProgress / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div
      className="relative transition-transform duration-300"
      style={{
        width: size,
        height: size,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        filter: isHovered && showGlow ? `drop-shadow(0 0 12px ${color}50)` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300">
        {children}
      </div>
    </div>
  );
}

// Gauge Component
function Gauge({
  value,
  min,
  max,
  label,
  unit = "",
  optimalMin,
  optimalMax,
  color = colors.sage
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  optimalMin?: number;
  optimalMax?: number;
  color?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full border-8 -translate-x-1/2"
          style={{
            borderColor: `${colors.sage}30`,
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)"
          }}
        />
        {optimalMin !== undefined && optimalMax !== undefined && (
          <div
            className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full border-8 -translate-x-1/2"
            style={{
              borderColor: `${colors.lime}50`,
              clipPath: `polygon(${((optimalMin - min) / (max - min)) * 100}% 50%, ${((optimalMax - min) / (max - min)) * 100}% 50%, 100% 100%, 0 100%)`,
              transform: "translateX(-50%)"
            }}
          />
        )}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-14 origin-bottom transition-transform duration-1000"
          style={{
            backgroundColor: color,
            transform: `translateX(-50%) rotate(${angle}deg)`
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-xl font-semibold" style={{ color: colors.deepForest }}>
          {value.toFixed(1)}{unit}
        </p>
        <p className="text-xs uppercase tracking-wide" style={{ color: `${colors.deepForest}99` }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// Mini Trend Chart
function TrendChart({
  data,
  height = 60,
  color = colors.sage,
  showDots = true
}: {
  data: number[];
  height?: number;
  color?: string;
  showDots?: boolean;
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 10;
  const width = 200;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots && data.map((value, index) => {
        const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((value - min) / range) * (height - 2 * padding);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill={color}
          />
        );
      })}
    </svg>
  );
}

// Bar Chart Component
function BarChart({
  data,
  labels,
  color = colors.sage,
  height = 100
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((value, index) => {
        const barHeight = (value / max) * 100;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{
                height: `${barHeight}%`,
                backgroundColor: color,
                minHeight: 4
              }}
            />
            <p className="text-xs mt-1" style={{ color: `${colors.deepForest}80` }}>
              {labels[index]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Stat Card Component with enhanced interactions
function StatCard({
  label,
  value,
  unit = "",
  trend,
  icon,
  color = colors.sage,
  tooltip
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  color?: string;
  tooltip?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl p-4 transition-all duration-300 cursor-default relative group"
      style={{
        backgroundColor: isHovered ? `${color}25` : `${color}15`,
        transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? `0 8px 24px ${color}20` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <p
          className="text-xs uppercase tracking-wide transition-colors duration-300"
          style={{ color: isHovered ? colors.deepForest : `${colors.deepForest}70` }}
        >
          {label}
        </p>
        {icon && (
          <div
            className="transition-all duration-300"
            style={{
              color,
              transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-2xl font-semibold transition-all duration-300"
          style={{
            color: colors.deepForest,
            textShadow: isHovered ? `0 0 20px ${color}40` : 'none'
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm transition-colors duration-300" style={{ color: `${colors.deepForest}70` }}>
            {unit}
          </span>
        )}
        {trend && (
          <span
            className={`ml-2 text-xs transition-all duration-300 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}
            style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {tooltip && isHovered && (
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ backgroundColor: colors.deepForest, color: colors.cream }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

// Segmental Analysis Component
function SegmentalAnalysis({ muscleBalance }: { muscleBalance: NonNullable<HealthMeasurement['muscleBalance']> }) {
  const segments = [
    { key: 'leftArm', label: 'L Arm', data: muscleBalance.leftArm },
    { key: 'rightArm', label: 'R Arm', data: muscleBalance.rightArm },
    { key: 'trunk', label: 'Trunk', data: muscleBalance.trunk },
    { key: 'leftLeg', label: 'L Leg', data: muscleBalance.leftLeg },
    { key: 'rightLeg', label: 'R Leg', data: muscleBalance.rightLeg },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {segments.map(({ label, data }) => (
        <div key={label} className="text-center">
          <div
            className="w-full aspect-square rounded-lg flex items-center justify-center mb-2"
            style={{
              backgroundColor: data.rating === 'High' ? `${colors.lime}30` : `${colors.sage}20`
            }}
          >
            <span className="text-lg font-semibold" style={{ color: colors.deepForest }}>
              {data.mass.toFixed(1)}
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: colors.deepForest }}>{label}</p>
          <p className="text-xs" style={{ color: data.rating === 'High' ? colors.olive : `${colors.deepForest}70` }}>
            {data.percentage.toFixed(0)}%
          </p>
        </div>
      ))}
    </div>
  );
}

// Format duration from seconds
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Tab Navigation
function TabNav({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "body", label: "Body" },
    { id: "sleep", label: "Sleep" },
    { id: "running", label: "Running" },
    { id: "recommendations", label: "Recommendations" },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 rounded-xl" style={{ backgroundColor: `${colors.sage}15` }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === tab.id ? "shadow-md" : "hover:bg-white/50"
          }`}
          style={{
            backgroundColor: activeTab === tab.id ? colors.cream : "transparent",
            color: activeTab === tab.id ? colors.deepForest : `${colors.deepForest}80`,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Hero Section
function HeroSection({ latestHealth, latestOura }: { latestHealth: HealthMeasurement; latestOura: OuraEntry }) {
  const stats = [
    { label: "Weight", value: latestHealth.weight.toFixed(1), unit: "lbs" },
    { label: "Body Fat", value: latestHealth.bodyFatPercentage.toFixed(1), unit: "%" },
    { label: "Sleep Score", value: latestOura.sleepScore ?? "--", unit: "" },
    { label: "Readiness", value: latestOura.readinessScore ?? "--", unit: "" },
    { label: "HRV", value: latestOura.avgHRV ?? "--", unit: "ms" },
  ];

  return (
    <section
      className="pt-8 pb-16 md:pt-16 md:pb-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.deepForest} 0%, ${colors.darkOlive} 50%, ${colors.olive} 100%)`
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-10 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: colors.lime }}
        />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: colors.sage }}
        />
      </div>

      <div className="container-editorial relative z-10">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-widest mb-3" style={{ color: colors.lime }}>
            Health Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: colors.cream }}>
            Vitals & Performance
          </h1>
          <p className="text-lg mb-10 max-w-xl" style={{ color: `${colors.cream}CC` }}>
            Comprehensive health tracking from Renpho body composition, Oura Ring sleep & recovery metrics, and running performance data.
          </p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 backdrop-blur-sm"
                style={{ backgroundColor: `${colors.cream}10`, border: `1px solid ${colors.cream}20` }}
              >
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: `${colors.cream}80` }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-light" style={{ color: colors.cream }}>
                  {stat.value}
                  <span className="text-sm ml-1" style={{ color: `${colors.cream}80` }}>{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Overview Tab
function OverviewTab({ healthData, ouraData }: { healthData: HealthData; ouraData: OuraEntry[] }) {
  const latest = healthData.measurements[healthData.measurements.length - 1];
  const recentOura = ouraData.slice(-7);

  const avgSleepScore = recentOura.reduce((sum, d) => sum + (d.sleepScore || 0), 0) / recentOura.length;
  const avgHRV = recentOura.reduce((sum, d) => sum + (d.avgHRV || 0), 0) / recentOura.length;
  const avgReadiness = recentOura.reduce((sum, d) => sum + (d.readinessScore || 0), 0) / recentOura.length;

  return (
    <div className="space-y-8">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Body Score"
          value={latest.bodyScore}
          unit="/100"
          color={colors.lime}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Avg Sleep Score"
          value={avgSleepScore.toFixed(0)}
          unit="/100"
          color={colors.purple}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
        />
        <StatCard
          label="Avg HRV"
          value={avgHRV.toFixed(0)}
          unit="ms"
          color={colors.coral}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
        <StatCard
          label="Avg Readiness"
          value={avgReadiness.toFixed(0)}
          unit="/100"
          color={colors.teal}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Body Composition Summary */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: colors.ivory }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>
            Body Composition
          </h3>
          <div className="flex justify-around mb-6">
            <ProgressRing progress={latest.bodyScore} color={colors.lime}>
              <div className="text-center">
                <p className="text-2xl font-semibold" style={{ color: colors.deepForest }}>{latest.bodyScore}</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Score</p>
              </div>
            </ProgressRing>
            <ProgressRing
              progress={100 - latest.bodyFatPercentage * 5}
              color={colors.sage}
            >
              <div className="text-center">
                <p className="text-2xl font-semibold" style={{ color: colors.deepForest }}>{latest.bodyFatPercentage}%</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Body Fat</p>
              </div>
            </ProgressRing>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.weight}</p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Weight (lbs)</p>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.muscleMass}</p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Muscle (lbs)</p>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>{latest.bmi}</p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>BMI</p>
            </div>
          </div>
        </div>

        {/* Sleep Summary */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: colors.ivory }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>
            Sleep (Last 7 Days)
          </h3>
          <div className="mb-4">
            <TrendChart
              data={recentOura.map(d => d.sleepScore || 0)}
              color={colors.sage}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                {formatDuration(recentOura[recentOura.length - 1]?.totalSleepDuration || 0)}
              </p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Last Night</p>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                {recentOura[recentOura.length - 1]?.sleepEfficiency || "--"}%
              </p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Efficiency</p>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color: colors.deepForest }}>
                {recentOura[recentOura.length - 1]?.avgRestingHR?.toFixed(0) || "--"}
              </p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Resting HR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Running Goals Quick View */}
      <div
        className="rounded-2xl p-6"
        style={{ background: `linear-gradient(135deg, ${colors.deepForest} 0%, ${colors.olive} 100%)` }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.cream }}>
              World Majors Progress
            </h3>
            <p style={{ color: `${colors.cream}99` }}>
              0 of 7 completed • Boston & Chicago registered for 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing progress={0} size={80} color={colors.lime} bgColor={`${colors.cream}20`}>
              <span className="text-xl font-semibold" style={{ color: colors.cream }}>0/7</span>
            </ProgressRing>
            <div>
              <p className="text-sm" style={{ color: colors.lime }}>Current PR</p>
              <p className="text-2xl font-light" style={{ color: colors.cream }}>3:09</p>
              <p className="text-xs" style={{ color: `${colors.cream}70` }}>Marathon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Body Tab
function BodyTab({ healthData }: { healthData: HealthData }) {
  const latest = healthData.measurements[healthData.measurements.length - 1];
  const previous = healthData.measurements[0];

  const weightChange = latest.weight - previous.weight;
  const muscleChange = latest.muscleMass - previous.muscleMass;
  const fatChange = latest.bodyFatPercentage - previous.bodyFatPercentage;

  return (
    <div className="space-y-8">
      {/* Weight Trend */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium" style={{ color: colors.deepForest }}>Weight Trend</h3>
          <span
            className={`text-sm px-3 py-1 rounded-full ${weightChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <TrendChart
              data={healthData.measurements.map(m => m.weight)}
              height={100}
              color={colors.sage}
            />
          </div>
          <div className="text-right">
            <p className="text-4xl font-light" style={{ color: colors.deepForest }}>{latest.weight}</p>
            <p className="text-sm" style={{ color: `${colors.deepForest}70` }}>lbs</p>
            <p className="text-xs mt-2" style={{ color: colors.sage }}>
              Target: {healthData.targets.optimalWeight} lbs
            </p>
          </div>
        </div>
      </div>

      {/* Body Composition Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Body Fat Gauge */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Body Fat %</h4>
          <div className="flex justify-center">
            <Gauge
              value={latest.bodyFatPercentage}
              min={5}
              max={30}
              label="Body Fat"
              unit="%"
              optimalMin={15}
              optimalMax={25}
              color={colors.gold}
            />
          </div>
          <div className="mt-4 text-center">
            <span
              className={`text-xs px-2 py-1 rounded-full ${fatChange <= 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
            >
              {fatChange >= 0 ? '+' : ''}{fatChange.toFixed(1)}% from previous
            </span>
          </div>
        </div>

        {/* Muscle Mass */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Muscle Mass</h4>
          <div className="flex justify-center mb-4">
            <ProgressRing progress={(latest.muscleMass / 120) * 100} size={100} color={colors.olive}>
              <div className="text-center">
                <p className="text-xl font-semibold" style={{ color: colors.deepForest }}>{latest.muscleMass}</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>lbs</p>
              </div>
            </ProgressRing>
          </div>
          <div className="text-center">
            <span
              className={`text-xs px-2 py-1 rounded-full ${muscleChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {muscleChange >= 0 ? '+' : ''}{muscleChange.toFixed(1)} lbs from previous
            </span>
          </div>
          <div className="mt-3 text-xs text-center" style={{ color: `${colors.deepForest}70` }}>
            Range: {healthData.optimalRanges.muscleMass.min} - {healthData.optimalRanges.muscleMass.max} lbs
          </div>
        </div>

        {/* BMI */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>BMI</h4>
          <div className="flex justify-center">
            <Gauge
              value={latest.bmi}
              min={15}
              max={30}
              label="BMI"
              optimalMin={18.5}
              optimalMax={24.9}
              color={colors.sage}
            />
          </div>
          <div className="mt-4 text-center text-xs" style={{ color: `${colors.deepForest}70` }}>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: `${colors.lime}30` }}>
              Normal range: 18.5 - 24.9
            </span>
          </div>
        </div>
      </div>

      {/* Segmental Analysis */}
      {latest.muscleBalance && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h3 className="text-lg font-medium mb-6" style={{ color: colors.deepForest }}>
            Muscle Balance (Segmental Analysis)
          </h3>
          <SegmentalAnalysis muscleBalance={latest.muscleBalance} />
          <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: `${colors.deepForest}70` }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: `${colors.lime}30` }} />
              High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: `${colors.sage}20` }} />
              Normal
            </span>
          </div>
        </div>
      )}

      {/* Metabolic & Other Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Metabolic Age" value={latest.metabolicAge} unit="years" color={colors.lime} />
        <StatCard label="BMR" value={latest.bmr} unit="kcal" color={colors.orange} />
        <StatCard label="Visceral Fat" value={latest.visceralFat} unit="/15" color={colors.teal} />
        <StatCard label="Waist-Hip Ratio" value={latest.whr.toFixed(2)} color={colors.indigo} />
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Bone Mass" value={latest.boneMass} unit="lbs" color={colors.cyan} />
        <StatCard label="Protein Mass" value={latest.proteinMass} unit="lbs" color={colors.purple} />
        <StatCard label="Body Water" value={latest.bodyWaterMass} unit="%" color={colors.blue} />
      </div>
    </div>
  );
}

// Sleep Tab
function SleepTab({ ouraData }: { ouraData: OuraEntry[] }) {
  const last30 = ouraData.slice(-30);
  const last7 = ouraData.slice(-7);
  const latest = ouraData[ouraData.length - 1];

  const avg7DaySleep = last7.reduce((sum, d) => sum + (d.sleepScore || 0), 0) / last7.length;
  const avg7DayHRV = last7.reduce((sum, d) => sum + (d.avgHRV || 0), 0) / last7.length;
  const avg7DayReadiness = last7.reduce((sum, d) => sum + (d.readinessScore || 0), 0) / last7.length;

  return (
    <div className="space-y-8">
      {/* Sleep Score Trend */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium" style={{ color: colors.deepForest }}>Sleep Score (Last 30 Days)</h3>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.sage}20`, color: colors.deepForest }}>
            Avg: {avg7DaySleep.toFixed(0)}
          </span>
        </div>
        <div className="h-32">
          <TrendChart
            data={last30.map(d => d.sleepScore || 0)}
            height={120}
            color={colors.sage}
            showDots={false}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: `${colors.deepForest}60` }}>
          <span>{last30[0]?.date}</span>
          <span>{last30[last30.length - 1]?.date}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sleep Score */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Latest Sleep Score</h4>
          <div className="flex justify-center">
            <ProgressRing progress={latest.sleepScore || 0} size={140} strokeWidth={12} color={colors.sage}>
              <div className="text-center">
                <p className="text-3xl font-semibold" style={{ color: colors.deepForest }}>{latest.sleepScore}</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Last Night</p>
              </div>
            </ProgressRing>
          </div>
        </div>

        {/* Readiness */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Readiness Score</h4>
          <div className="flex justify-center">
            <ProgressRing
              progress={latest.readinessScore || 0}
              size={140}
              strokeWidth={12}
              color={latest.readinessScore && latest.readinessScore >= 70 ? colors.teal : colors.orange}
            >
              <div className="text-center">
                <p className="text-3xl font-semibold" style={{ color: colors.deepForest }}>{latest.readinessScore}</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>Today</p>
              </div>
            </ProgressRing>
          </div>
        </div>

        {/* HRV */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Heart Rate Variability</h4>
          <div className="flex justify-center">
            <ProgressRing
              progress={Math.min((latest.avgHRV || 0) / 1.5, 100)}
              size={140}
              strokeWidth={12}
              color={colors.coral}
            >
              <div className="text-center">
                <p className="text-3xl font-semibold" style={{ color: colors.deepForest }}>{latest.avgHRV}</p>
                <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>ms</p>
              </div>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* HRV Trend */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium" style={{ color: colors.deepForest }}>HRV Trend</h3>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${colors.gold}20`, color: colors.deepForest }}>
            7-day avg: {avg7DayHRV.toFixed(0)} ms
          </span>
        </div>
        <TrendChart
          data={last30.map(d => d.avgHRV || 0)}
          height={80}
          color={colors.gold}
          showDots={false}
        />
      </div>

      {/* Sleep Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sleep Duration Breakdown */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Sleep Duration (Last Night)</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: colors.deepForest }}>Total Sleep</span>
                <span className="text-sm font-medium" style={{ color: colors.deepForest }}>
                  {formatDuration(latest.totalSleepDuration || 0)}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: `${colors.sage}20` }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(((latest.totalSleepDuration || 0) / 28800) * 100, 100)}%`,
                    backgroundColor: colors.sage
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: colors.deepForest }}>Deep Sleep</span>
                <span className="text-sm font-medium" style={{ color: colors.deepForest }}>
                  {formatDuration(latest.deepSleepDuration || 0)}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: `${colors.olive}20` }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(((latest.deepSleepDuration || 0) / 7200) * 100, 100)}%`,
                    backgroundColor: colors.olive
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: colors.deepForest }}>REM Sleep</span>
                <span className="text-sm font-medium" style={{ color: colors.deepForest }}>
                  {formatDuration(latest.remSleepDuration || 0)}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: `${colors.gold}20` }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(((latest.remSleepDuration || 0) / 7200) * 100, 100)}%`,
                    backgroundColor: colors.gold
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Other Metrics */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Additional Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Sleep Efficiency"
              value={latest.sleepEfficiency || "--"}
              unit="%"
              color={colors.purple}
            />
            <StatCard
              label="Resting HR"
              value={latest.avgRestingHR?.toFixed(0) || "--"}
              unit="bpm"
              color={colors.coral}
            />
            <StatCard
              label="Temp Deviation"
              value={latest.tempDeviation?.toFixed(2) || "--"}
              unit="°C"
              color={latest.tempDeviation && latest.tempDeviation > 0.5 ? colors.zone5 : colors.teal}
            />
            <StatCard
              label="Activity Score"
              value={latest.activityScore || "--"}
              unit="/100"
              color={colors.lime}
            />
          </div>
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h4 className="text-sm font-medium mb-4" style={{ color: colors.deepForest }}>Weekly Sleep Scores</h4>
        <BarChart
          data={last7.map(d => d.sleepScore || 0)}
          labels={last7.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }))}
          color={colors.sage}
          height={120}
        />
      </div>
    </div>
  );
}

// Running Tab
function RunningTab() {
  const paces = {
    current: "7:13/mi",
    sub3Target: "6:52/mi",
    easy: "8:30-9:30/mi",
    tempo: "7:00-7:15/mi",
    interval: "6:15-6:30/mi",
  };

  return (
    <div className="space-y-8">
      {/* Current PR & Goals */}
      <div
        className="rounded-2xl p-8"
        style={{ background: `linear-gradient(135deg, ${colors.deepForest} 0%, ${colors.olive} 100%)` }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm uppercase tracking-wide mb-2" style={{ color: colors.lime }}>Current Marathon PR</p>
            <p className="text-5xl font-light mb-2" style={{ color: colors.cream }}>3:09:XX</p>
            <p className="text-sm" style={{ color: `${colors.cream}80` }}>
              Average pace: {paces.current}
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide mb-2" style={{ color: colors.lime }}>Target</p>
            <p className="text-5xl font-light mb-2" style={{ color: colors.cream }}>Sub-3:00</p>
            <p className="text-sm" style={{ color: `${colors.cream}80` }}>
              Required pace: {paces.sub3Target}
            </p>
          </div>
        </div>
      </div>

      {/* World Majors Progress */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium" style={{ color: colors.deepForest }}>World Marathon Majors</h3>
          <div className="flex items-center gap-2">
            <ProgressRing progress={0} size={50} strokeWidth={4} color={colors.lime}>
              <span className="text-sm font-semibold" style={{ color: colors.deepForest }}>0/7</span>
            </ProgressRing>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {worldMajors.map((race) => (
            <div
              key={race.name}
              className="rounded-xl p-4 text-center transition-all"
              style={{
                backgroundColor: race.status === 'registered' ? `${colors.lime}20` : `${colors.sage}10`,
                border: race.status === 'registered' ? `2px solid ${colors.lime}` : `1px solid ${colors.sage}30`
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: colors.deepForest }}>{race.name}</p>
              <p className="text-xs" style={{ color: `${colors.deepForest}70` }}>{race.date}</p>
              {race.status === 'registered' && (
                <span
                  className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.lime, color: colors.deepForest }}
                >
                  Registered
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Race Calendar */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Upcoming Races</h3>
        <div className="space-y-3">
          {upcomingRaces.map((race) => (
            <div
              key={race.name}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: `${colors.sage}10` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.lime }}
                >
                  <svg className="w-6 h-6" style={{ color: colors.deepForest }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: colors.deepForest }}>{race.name}</p>
                  <p className="text-sm" style={{ color: `${colors.deepForest}70` }}>{race.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: `${colors.deepForest}70` }}>Goal</p>
                <p className="font-medium" style={{ color: colors.olive }}>{race.goal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Paces */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Target Training Paces (Sub-3)</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.zone1}20` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: `${colors.deepForest}70` }}>Easy</p>
            <p className="text-xl font-semibold" style={{ color: colors.zone1 }}>{paces.easy}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.zone3}20` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: `${colors.deepForest}70` }}>Tempo</p>
            <p className="text-xl font-semibold" style={{ color: colors.zone3 }}>{paces.tempo}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.zone4}20` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: `${colors.deepForest}70` }}>Interval</p>
            <p className="text-xl font-semibold" style={{ color: colors.zone4 }}>{paces.interval}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.zone5}20` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: `${colors.deepForest}70` }}>Race Pace</p>
            <p className="text-xl font-semibold" style={{ color: colors.zone5 }}>{paces.sub3Target}</p>
          </div>
        </div>
      </div>

      {/* Triathlon & Ultra Goals */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Triathlon Goals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.sage}10` }}>
              <span style={{ color: colors.deepForest }}>Olympic Distance</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.sage}20`, color: colors.deepForest }}>Future</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.sage}10` }}>
              <span style={{ color: colors.deepForest }}>Half Ironman (70.3)</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.sage}20`, color: colors.deepForest }}>Future</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.sage}10` }}>
              <span style={{ color: colors.deepForest }}>Full Ironman</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.sage}20`, color: colors.deepForest }}>Dream</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
          <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Ultra Goals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.olive}10` }}>
              <span style={{ color: colors.deepForest }}>50K</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.olive}20`, color: colors.deepForest }}>Next Step</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.olive}10` }}>
              <span style={{ color: colors.deepForest }}>50 Mile</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.olive}20`, color: colors.deepForest }}>Future</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${colors.olive}10` }}>
              <span style={{ color: colors.deepForest }}>100 Mile</span>
              <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${colors.olive}20`, color: colors.deepForest }}>Dream</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recommendations Tab
function RecommendationsTab({ healthData, ouraData }: { healthData: HealthData; ouraData: OuraEntry[] }) {
  const latest = healthData.measurements[healthData.measurements.length - 1];
  const recentOura = ouraData.slice(-7);

  const avgSleepScore = recentOura.reduce((sum, d) => sum + (d.sleepScore || 0), 0) / recentOura.length;
  const avgReadiness = recentOura.reduce((sum, d) => sum + (d.readinessScore || 0), 0) / recentOura.length;
  const avgHRV = recentOura.reduce((sum, d) => sum + (d.avgHRV || 0), 0) / recentOura.length;
  const latestOura = ouraData[ouraData.length - 1];

  // Generate recommendations based on data
  const getTrainingRecommendations = () => {
    const recommendations = [];

    if (avgReadiness < 60) {
      recommendations.push({
        type: "recovery",
        priority: "high",
        title: "Prioritize Recovery",
        description: "Your readiness score has been low. Consider taking an easy day or rest day to allow your body to recover.",
        icon: "rest"
      });
    } else if (avgReadiness >= 80) {
      recommendations.push({
        type: "training",
        priority: "medium",
        title: "Great Time for Hard Training",
        description: "Your readiness is excellent! This is a good day for quality workouts like tempo runs or intervals.",
        icon: "run"
      });
    }

    if (avgSleepScore < 70) {
      recommendations.push({
        type: "sleep",
        priority: "high",
        title: "Improve Sleep Quality",
        description: "Your sleep scores have been suboptimal. Focus on sleep hygiene: consistent bedtime, cool room, no screens before bed.",
        icon: "sleep"
      });
    }

    if (avgHRV < 50) {
      recommendations.push({
        type: "stress",
        priority: "medium",
        title: "Monitor Stress Levels",
        description: "Lower HRV may indicate accumulated stress. Consider adding breathing exercises or meditation to your routine.",
        icon: "heart"
      });
    }

    if (latest.bodyFatPercentage < 10) {
      recommendations.push({
        type: "nutrition",
        priority: "medium",
        title: "Fuel Adequately",
        description: "Your body fat is quite low. Ensure you're eating enough to support training and recovery, especially carbohydrates around workouts.",
        icon: "nutrition"
      });
    }

    // Add default recommendations
    recommendations.push({
      type: "training",
      priority: "low",
      title: "Marathon Training Focus",
      description: "With Boston in April 2026, focus on building aerobic base now. Aim for 50-60 mile weeks with one long run and one quality session.",
      icon: "run"
    });

    recommendations.push({
      type: "nutrition",
      priority: "low",
      title: "Pre-Long Run Nutrition",
      description: "For runs over 90 minutes, consume 50-100g of carbs 2-3 hours before. Practice race-day nutrition during long runs.",
      icon: "nutrition"
    });

    return recommendations;
  };

  const recommendations = getTrainingRecommendations();

  const getIcon = (type: string) => {
    switch (type) {
      case 'rest':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
      case 'run':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'sleep':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
      case 'heart':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
      case 'nutrition':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      default:
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.coral;
      case 'medium': return colors.blue;
      default: return colors.teal;
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Status Summary */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Current Status</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${avgReadiness >= 70 ? colors.teal : colors.orange}20` }}>
            <p className="text-3xl font-semibold" style={{ color: avgReadiness >= 70 ? colors.teal : colors.orange }}>{avgReadiness.toFixed(0)}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: `${colors.deepForest}70` }}>7-Day Readiness</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${avgSleepScore >= 70 ? colors.purple : colors.gold}20` }}>
            <p className="text-3xl font-semibold" style={{ color: avgSleepScore >= 70 ? colors.purple : colors.gold }}>{avgSleepScore.toFixed(0)}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: `${colors.deepForest}70` }}>7-Day Sleep</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${avgHRV >= 60 ? colors.coral : colors.zone5}20` }}>
            <p className="text-3xl font-semibold" style={{ color: avgHRV >= 60 ? colors.coral : colors.zone5 }}>{avgHRV.toFixed(0)}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: `${colors.deepForest}70` }}>Avg HRV</p>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${colors.lime}20` }}>
            <p className="text-3xl font-semibold" style={{ color: colors.lime }}>{latest.bodyScore}</p>
            <p className="text-xs uppercase tracking-wide" style={{ color: `${colors.deepForest}70` }}>Body Score</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.lime} 0%, ${colors.sage} 100%)` }}
          >
            <svg className="w-5 h-5" style={{ color: colors.deepForest }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium" style={{ color: colors.deepForest }}>Training Recommendations</h3>
            <p className="text-sm" style={{ color: `${colors.deepForest}70` }}>Based on your current metrics</p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: `${getPriorityColor(rec.priority)}15`, border: `1px solid ${getPriorityColor(rec.priority)}30` }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${getPriorityColor(rec.priority)}25`, color: colors.deepForest }}
              >
                {getIcon(rec.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium" style={{ color: colors.deepForest }}>{rec.title}</h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: getPriorityColor(rec.priority),
                      color: rec.priority === 'high' ? colors.deepForest : colors.cream
                    }}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm" style={{ color: `${colors.deepForest}80` }}>{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Recommendations */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Recovery Protocol</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.purple}15` }}>
            <h4 className="font-medium mb-2" style={{ color: colors.purple }}>Sleep</h4>
            <ul className="text-sm space-y-1.5" style={{ color: `${colors.deepForest}80` }}>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.purple }} />Target 7-9 hours</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.purple }} />Consistent bedtime</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.purple }} />Cool, dark room</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.purple }} />No screens 1hr before</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.teal}15` }}>
            <h4 className="font-medium mb-2" style={{ color: colors.teal }}>Active Recovery</h4>
            <ul className="text-sm space-y-1.5" style={{ color: `${colors.deepForest}80` }}>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.teal }} />Easy 20-30 min walks</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.teal }} />Foam rolling</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.teal }} />Light stretching</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.teal }} />Yoga or mobility work</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${colors.indigo}15` }}>
            <h4 className="font-medium mb-2" style={{ color: colors.indigo }}>Stress Management</h4>
            <ul className="text-sm space-y-1.5" style={{ color: `${colors.deepForest}80` }}>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.indigo }} />5-10 min meditation</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.indigo }} />Box breathing</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.indigo }} />Nature exposure</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.indigo }} />Social connection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Nutrition Timing */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.ivory }}>
        <h3 className="text-lg font-medium mb-4" style={{ color: colors.deepForest }}>Nutrition Timing for Runners</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: `${colors.orange}10` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.orange}20` }}>
              <svg className="w-5 h-5" style={{ color: colors.orange }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: colors.orange }}>Pre-Run (2-3 hours before)</h4>
              <p className="text-sm" style={{ color: `${colors.deepForest}80` }}>
                Complex carbs + small protein. Example: Oatmeal with banana and nut butter, or toast with eggs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: `${colors.zone2}10` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.zone2}20` }}>
              <svg className="w-5 h-5" style={{ color: colors.zone2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: colors.zone2 }}>During (runs over 60 min)</h4>
              <p className="text-sm" style={{ color: `${colors.deepForest}80` }}>
                30-60g carbs per hour. Gels, chews, or sports drinks. Practice with what you will use on race day.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: `${colors.blue}10` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.blue}20` }}>
              <svg className="w-5 h-5" style={{ color: colors.blue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: colors.blue }}>Post-Run (within 30 min)</h4>
              <p className="text-sm" style={{ color: `${colors.deepForest}80` }}>
                3:1 or 4:1 carb to protein ratio. Example: Chocolate milk, protein smoothie, or recovery shake.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function HealthDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoaded, setIsLoaded] = useState(false);

  const ouraData = useMemo(() => parseOuraData(), []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const latestHealth = healthData.measurements[healthData.measurements.length - 1];
  const latestOura = ouraData[ouraData.length - 1];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab healthData={healthData} ouraData={ouraData} />;
      case "body":
        return <BodyTab healthData={healthData} />;
      case "sleep":
        return <SleepTab ouraData={ouraData} />;
      case "running":
        return <RunningTab />;
      case "recommendations":
        return <RecommendationsTab healthData={healthData} ouraData={ouraData} />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.cream }}>
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ backgroundColor: colors.sage }} />
          <p style={{ color: colors.deepForest }}>Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <IOAuthGate>
    <div style={{ backgroundColor: colors.cream }} className="min-h-screen">
      {/* Hero Section */}
      <HeroSection latestHealth={latestHealth} latestOura={latestOura} />

      {/* Tab Navigation */}
      <section className="py-6 sticky top-16 z-40" style={{ backgroundColor: colors.cream }}>
        <div className="container-editorial">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>

      {/* Tab Content */}
      <section className="pb-16">
        <div className="container-editorial">
          {renderTabContent()}
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8" style={{ backgroundColor: colors.ivory }}>
        <div className="container-editorial">
          <Link href="/io" className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-70" style={{ color: colors.olive }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to dashboard
          </Link>
        </div>
      </section>
    </div>
    </IOAuthGate>
  );
}
