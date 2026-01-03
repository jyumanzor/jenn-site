"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import IOAuthGate from "@/components/IOAuthGate";

// Color palette
const colors = {
  cream: "#FFF5EB",
  deepForest: "#2A3C24",
  forestDark: "#1E2A1A",
  sage: "#97A97C",
  gold: "#FABF34",
  lime: "#D4ED39",
  olive: "#546E40",
  amber: "#FFCB69",
  error: "#E85D5D",
  terminal: "#0F1A0C",
};

// Agent types
type AgentStatus = "active" | "idle" | "fallback" | "error";
type OutcomeType = "success" | "fail" | "pending";

interface AgentError {
  type: string;
  count: number;
  lastOccurred: string;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  currentTask: string | null;
  successProbability: number;
  errorLikelihood: number;
  lastOutcomes: OutcomeType[];
  historicalAccuracy: number;
  avgCompletionTime: string;
  errorPatterns: AgentError[];
  fallbackAgent: string | null;
  tasksCompleted: number;
}

interface ActivityLogItem {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  action: string;
  result: "success" | "fail" | "pending" | "info";
  confidence?: number;
  details?: string;
}

// Mock agents data
const initialAgents: Agent[] = [
  {
    id: "agent-explore",
    name: "Explorer",
    type: "Codebase Analysis",
    status: "active",
    currentTask: "Scanning /app/io/* for patterns",
    successProbability: 94,
    errorLikelihood: 6,
    lastOutcomes: ["success", "success", "success", "fail", "success"],
    historicalAccuracy: 91.2,
    avgCompletionTime: "2.3s",
    errorPatterns: [
      { type: "Path not found", count: 3, lastOccurred: "2h ago" },
      { type: "Timeout", count: 1, lastOccurred: "1d ago" },
    ],
    fallbackAgent: "agent-grep",
    tasksCompleted: 847,
  },
  {
    id: "agent-edit",
    name: "Editor",
    type: "Code Modification",
    status: "idle",
    currentTask: null,
    successProbability: 87,
    errorLikelihood: 13,
    lastOutcomes: ["success", "success", "fail", "success", "success"],
    historicalAccuracy: 88.5,
    avgCompletionTime: "1.8s",
    errorPatterns: [
      { type: "String not unique", count: 12, lastOccurred: "30m ago" },
      { type: "File locked", count: 2, lastOccurred: "4h ago" },
    ],
    fallbackAgent: "agent-write",
    tasksCompleted: 523,
  },
  {
    id: "agent-bash",
    name: "Terminal",
    type: "Shell Execution",
    status: "active",
    currentTask: "Running npm build...",
    successProbability: 78,
    errorLikelihood: 22,
    lastOutcomes: ["fail", "success", "success", "fail", "success"],
    historicalAccuracy: 76.3,
    avgCompletionTime: "8.4s",
    errorPatterns: [
      { type: "Command failed", count: 28, lastOccurred: "5m ago" },
      { type: "Timeout exceeded", count: 8, lastOccurred: "2h ago" },
      { type: "Permission denied", count: 4, lastOccurred: "1d ago" },
    ],
    fallbackAgent: null,
    tasksCompleted: 1204,
  },
  {
    id: "agent-grep",
    name: "Grep",
    type: "Content Search",
    status: "idle",
    currentTask: null,
    successProbability: 96,
    errorLikelihood: 4,
    lastOutcomes: ["success", "success", "success", "success", "success"],
    historicalAccuracy: 97.8,
    avgCompletionTime: "0.4s",
    errorPatterns: [
      { type: "No matches found", count: 156, lastOccurred: "10m ago" },
    ],
    fallbackAgent: null,
    tasksCompleted: 2341,
  },
  {
    id: "agent-write",
    name: "Writer",
    type: "File Creation",
    status: "fallback",
    currentTask: "Waiting for Editor fallback",
    successProbability: 92,
    errorLikelihood: 8,
    lastOutcomes: ["success", "success", "success", "success", "fail"],
    historicalAccuracy: 93.1,
    avgCompletionTime: "1.2s",
    errorPatterns: [
      { type: "Path invalid", count: 5, lastOccurred: "3h ago" },
    ],
    fallbackAgent: null,
    tasksCompleted: 312,
  },
  {
    id: "agent-web",
    name: "WebFetch",
    type: "External Data",
    status: "error",
    currentTask: "Failed: Rate limit exceeded",
    successProbability: 65,
    errorLikelihood: 35,
    lastOutcomes: ["fail", "fail", "success", "fail", "success"],
    historicalAccuracy: 71.4,
    avgCompletionTime: "3.2s",
    errorPatterns: [
      { type: "Rate limited", count: 23, lastOccurred: "1m ago" },
      { type: "DNS resolution", count: 7, lastOccurred: "6h ago" },
      { type: "SSL error", count: 3, lastOccurred: "2d ago" },
    ],
    fallbackAgent: "agent-cache",
    tasksCompleted: 456,
  },
];

// Confidence threshold for triggering redundancy
const CONFIDENCE_THRESHOLD = 85;

// Generate mock activity log
const generateInitialActivity = (): ActivityLogItem[] => {
  const actions = [
    { action: "Read file /app/io/running/page.tsx", result: "success" as const, agent: "Explorer" },
    { action: "Pattern match for 'colors'", result: "success" as const, agent: "Grep" },
    { action: "Edit: Replace hex color value", result: "success" as const, agent: "Editor" },
    { action: "Compile TypeScript", result: "pending" as const, agent: "Terminal" },
    { action: "Fetch external API data", result: "fail" as const, agent: "WebFetch", details: "Rate limit" },
    { action: "Fallback: Using cached response", result: "info" as const, agent: "Writer" },
  ];

  return actions.map((a, i) => ({
    id: `log-${i}`,
    timestamp: new Date(Date.now() - (actions.length - i) * 30000),
    agentId: `agent-${a.agent.toLowerCase()}`,
    agentName: a.agent,
    action: a.action,
    result: a.result,
    confidence: 75 + Math.random() * 25,
    details: a.details,
  }));
};

// Utility components
const ScanLines = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50"
    style={{
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    }}
  />
);

const GlowBorder = ({ color, children, className = "" }: { color: string; children: React.ReactNode; className?: string }) => (
  <div
    className={`relative ${className}`}
    style={{
      boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}10`,
      border: `1px solid ${color}40`,
    }}
  >
    {children}
  </div>
);

const ProbabilityBar = ({ value, threshold }: { value: number; threshold: number }) => {
  const isAboveThreshold = value >= threshold;
  const barColor = isAboveThreshold ? colors.lime : value >= 70 ? colors.gold : colors.error;

  return (
    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: colors.terminal }}>
      {/* Threshold marker */}
      <div
        className="absolute top-0 bottom-0 w-px z-10"
        style={{
          left: `${threshold}%`,
          background: colors.cream,
          boxShadow: `0 0 4px ${colors.cream}`,
        }}
      />
      {/* Progress bar */}
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${barColor}60, ${barColor})`,
          boxShadow: `0 0 10px ${barColor}60`,
        }}
      />
    </div>
  );
};

const OutcomeIndicators = ({ outcomes }: { outcomes: OutcomeType[] }) => (
  <div className="flex gap-1">
    {outcomes.map((outcome, i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full"
        style={{
          background: outcome === "success" ? colors.lime : outcome === "fail" ? colors.error : colors.gold,
          boxShadow: outcome === "success" ? `0 0 6px ${colors.lime}` : outcome === "fail" ? `0 0 6px ${colors.error}` : "none",
        }}
      />
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: AgentStatus }) => {
  const config = {
    active: { bg: colors.lime, text: colors.forestDark, glow: colors.lime },
    idle: { bg: colors.olive, text: colors.cream, glow: "transparent" },
    fallback: { bg: colors.gold, text: colors.forestDark, glow: colors.gold },
    error: { bg: colors.error, text: colors.cream, glow: colors.error },
  };
  const c = config[status];

  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: c.bg,
        color: c.text,
        boxShadow: c.glow !== "transparent" ? `0 0 8px ${c.glow}60` : "none",
      }}
    >
      {status === "fallback" ? "STANDBY" : status}
    </span>
  );
};

const CircularGauge = ({ value, size = 80, label }: { value: number; size?: number; label: string }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;
  const color = value >= 85 ? colors.lime : value >= 70 ? colors.gold : colors.error;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.terminal}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
              transition: "stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-lg font-bold"
            style={{ color, textShadow: `0 0 10px ${color}60` }}
          >
            {value}%
          </span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider mt-1" style={{ color: colors.sage }}>
        {label}
      </span>
    </div>
  );
};

export default function AgentCommandCenter() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [systemTime, setSystemTime] = useState(new Date());
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize activity log
  useEffect(() => {
    setActivityLog(generateInitialActivity());
  }, []);

  // Update system time
  useEffect(() => {
    const interval = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate agent activity
  const simulateActivity = useCallback(() => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const actions = [
      "Executing task...",
      "Analyzing code structure",
      "Pattern matching",
      "File operation",
      "API request",
      "Cache lookup",
    ];
    const results: ("success" | "fail" | "pending")[] = ["success", "success", "success", "fail", "pending"];

    const newActivity: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      agentId: randomAgent.id,
      agentName: randomAgent.name,
      action: actions[Math.floor(Math.random() * actions.length)],
      result: results[Math.floor(Math.random() * results.length)],
      confidence: randomAgent.successProbability + (Math.random() * 10 - 5),
    };

    setActivityLog(prev => [newActivity, ...prev].slice(0, 50));

    // Update agent outcomes occasionally
    if (Math.random() > 0.7) {
      setAgents(prev => prev.map(a => {
        if (a.id === randomAgent.id) {
          const newOutcome = newActivity.result === "pending" ? "pending" : newActivity.result;
          return {
            ...a,
            lastOutcomes: [newOutcome, ...a.lastOutcomes.slice(0, 4)] as OutcomeType[],
            successProbability: Math.max(50, Math.min(99, a.successProbability + (newActivity.result === "success" ? 1 : -2))),
          };
        }
        return a;
      }));
    }
  }, [agents]);

  // Auto-simulation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(simulateActivity, 2000);
    return () => clearInterval(interval);
  }, [isSimulating, simulateActivity]);

  // Calculate system-wide metrics
  const systemMetrics = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === "active").length,
    avgConfidence: Math.round(agents.reduce((sum, a) => sum + a.successProbability, 0) / agents.length),
    totalTasks: agents.reduce((sum, a) => sum + a.tasksCompleted, 0),
    errorRate: Math.round(agents.reduce((sum, a) => sum + a.errorLikelihood, 0) / agents.length),
  };

  return (
    <IOAuthGate>
      <ScanLines />
      <div className="min-h-screen" style={{ background: colors.deepForest }}>
        {/* Header */}
        <header
          className="border-b px-6 py-4"
          style={{
            borderColor: `${colors.sage}30`,
            background: `linear-gradient(180deg, ${colors.forestDark} 0%, ${colors.deepForest} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/io"
                className="text-xs font-mono uppercase tracking-wider transition-colors"
                style={{ color: colors.sage }}
              >
                ← IO
              </Link>
              <div>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    color: colors.cream,
                    textShadow: `0 0 30px ${colors.sage}40`,
                  }}
                >
                  Agent Command Center
                </h1>
                <p className="text-xs font-mono" style={{ color: colors.olive }}>
                  Probabilistic Decision Engine v2.1
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Live indicator */}
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all"
                style={{
                  background: isSimulating ? `${colors.lime}20` : `${colors.olive}20`,
                  border: `1px solid ${isSimulating ? colors.lime : colors.olive}40`,
                  color: isSimulating ? colors.lime : colors.sage,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: isSimulating ? colors.lime : colors.olive,
                    boxShadow: isSimulating ? `0 0 8px ${colors.lime}` : "none",
                    animation: isSimulating ? "pulse 1s infinite" : "none",
                  }}
                />
                {isSimulating ? "SIMULATING" : "SIMULATE"}
              </button>

              {/* System time */}
              <div className="text-right">
                <p className="font-mono text-sm" style={{ color: colors.cream }}>
                  {systemTime.toLocaleTimeString("en-US", { hour12: false })}
                </p>
                <p className="font-mono text-[10px]" style={{ color: colors.olive }}>
                  {systemTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* System Metrics Bar */}
        <div
          className="border-b px-6 py-3"
          style={{ borderColor: `${colors.sage}20`, background: `${colors.forestDark}80` }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            {[
              { label: "AGENTS", value: `${systemMetrics.activeAgents}/${systemMetrics.totalAgents}`, color: colors.lime },
              { label: "AVG CONFIDENCE", value: `${systemMetrics.avgConfidence}%`, color: systemMetrics.avgConfidence >= 85 ? colors.lime : colors.gold },
              { label: "THRESHOLD", value: `${CONFIDENCE_THRESHOLD}%`, color: colors.amber },
              { label: "TOTAL TASKS", value: systemMetrics.totalTasks.toLocaleString(), color: colors.sage },
              { label: "ERROR RATE", value: `${systemMetrics.errorRate}%`, color: systemMetrics.errorRate <= 15 ? colors.sage : colors.error },
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.olive }}>
                  {metric.label}
                </span>
                <span
                  className="font-mono font-bold text-sm"
                  style={{ color: metric.color, textShadow: `0 0 10px ${metric.color}40` }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">

            {/* Agent Registry - Left Column */}
            <div className="col-span-8">
              <GlowBorder color={colors.sage} className="rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: `${colors.sage}20`, background: colors.forestDark }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: colors.lime, boxShadow: `0 0 8px ${colors.lime}` }} />
                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: colors.cream }}>
                      Agent Registry
                    </h2>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: colors.olive }}>
                    {agents.length} REGISTERED
                  </span>
                </div>

                <div className="divide-y" style={{ divideColor: `${colors.sage}15`, background: `${colors.terminal}90` }}>
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 cursor-pointer transition-all hover:bg-white/5"
                      onClick={() => setSelectedAgent(agent)}
                      style={{
                        background: selectedAgent?.id === agent.id ? `${colors.sage}10` : "transparent",
                        borderLeft: selectedAgent?.id === agent.id ? `2px solid ${colors.lime}` : "2px solid transparent",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                            style={{
                              background: `${colors.sage}20`,
                              color: colors.sage,
                              border: `1px solid ${colors.sage}30`,
                            }}
                          >
                            {agent.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-mono font-bold" style={{ color: colors.cream }}>
                                {agent.name}
                              </h3>
                              <StatusBadge status={agent.status} />
                            </div>
                            <p className="text-xs font-mono" style={{ color: colors.olive }}>
                              {agent.type}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="text-[10px] font-mono" style={{ color: colors.olive }}>LAST 5</span>
                            <OutcomeIndicators outcomes={agent.lastOutcomes} />
                          </div>
                          <p className="text-xs font-mono" style={{ color: colors.sage }}>
                            {agent.tasksCompleted.toLocaleString()} tasks
                          </p>
                        </div>
                      </div>

                      {/* Current Task */}
                      {agent.currentTask && (
                        <div
                          className="mb-3 px-3 py-2 rounded font-mono text-xs"
                          style={{
                            background: `${colors.terminal}`,
                            border: `1px solid ${colors.sage}20`,
                            color: agent.status === "error" ? colors.error : colors.amber,
                          }}
                        >
                          &gt; {agent.currentTask}
                        </div>
                      )}

                      {/* Probability Meters */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono uppercase" style={{ color: colors.olive }}>
                              Success Probability
                            </span>
                            <span
                              className="font-mono text-xs font-bold"
                              style={{
                                color: agent.successProbability >= CONFIDENCE_THRESHOLD ? colors.lime : colors.gold,
                              }}
                            >
                              {agent.successProbability}%
                            </span>
                          </div>
                          <ProbabilityBar value={agent.successProbability} threshold={CONFIDENCE_THRESHOLD} />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono uppercase" style={{ color: colors.olive }}>
                              Error Likelihood
                            </span>
                            <span
                              className="font-mono text-xs font-bold"
                              style={{ color: agent.errorLikelihood <= 15 ? colors.sage : colors.error }}
                            >
                              {agent.errorLikelihood}%
                            </span>
                          </div>
                          <ProbabilityBar value={agent.errorLikelihood} threshold={15} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowBorder>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">

              {/* Decision Engine Visualization */}
              <GlowBorder color={colors.gold} className="rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: `${colors.gold}20`, background: colors.forestDark }}
                >
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: colors.cream }}>
                    Decision Engine
                  </h2>
                </div>

                <div className="p-4" style={{ background: `${colors.terminal}90` }}>
                  {/* Flow Diagram */}
                  <div className="flex flex-col items-center gap-3 mb-4">
                    {/* Agent Node */}
                    <div
                      className="w-full px-4 py-2 rounded text-center font-mono text-xs"
                      style={{
                        background: `${colors.sage}20`,
                        border: `1px solid ${colors.sage}40`,
                        color: colors.sage,
                      }}
                    >
                      AGENT RECEIVES TASK
                    </div>

                    {/* Arrow */}
                    <div className="w-px h-4" style={{ background: `${colors.sage}40` }} />

                    {/* Confidence Check */}
                    <div
                      className="w-full px-4 py-3 rounded text-center relative"
                      style={{
                        background: `${colors.gold}15`,
                        border: `1px solid ${colors.gold}40`,
                      }}
                    >
                      <p className="font-mono text-xs font-bold" style={{ color: colors.gold }}>
                        CONFIDENCE CHECK
                      </p>
                      <p className="font-mono text-[10px] mt-1" style={{ color: colors.olive }}>
                        Threshold: {CONFIDENCE_THRESHOLD}%
                      </p>
                    </div>

                    {/* Branch */}
                    <div className="w-full flex items-start justify-center gap-4">
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-px h-4" style={{ background: `${colors.lime}40` }} />
                        <div
                          className="w-full px-3 py-2 rounded text-center font-mono text-[10px]"
                          style={{
                            background: `${colors.lime}15`,
                            border: `1px solid ${colors.lime}40`,
                            color: colors.lime,
                          }}
                        >
                          ≥{CONFIDENCE_THRESHOLD}%
                          <br />
                          <span className="font-bold">PROCEED</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-px h-4" style={{ background: `${colors.error}40` }} />
                        <div
                          className="w-full px-3 py-2 rounded text-center font-mono text-[10px]"
                          style={{
                            background: `${colors.error}15`,
                            border: `1px solid ${colors.error}40`,
                            color: colors.error,
                          }}
                        >
                          &lt;{CONFIDENCE_THRESHOLD}%
                          <br />
                          <span className="font-bold">FALLBACK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current System State */}
                  <div className="flex justify-around pt-4 border-t" style={{ borderColor: `${colors.sage}20` }}>
                    <CircularGauge value={systemMetrics.avgConfidence} size={70} label="System" />
                    <CircularGauge value={100 - systemMetrics.errorRate} size={70} label="Reliability" />
                  </div>
                </div>
              </GlowBorder>

              {/* Activity Feed */}
              <GlowBorder color={colors.lime} className="rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: `${colors.lime}20`, background: colors.forestDark }}
                >
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: colors.cream }}>
                    Live Activity
                  </h2>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: colors.lime, boxShadow: `0 0 6px ${colors.lime}` }}
                    />
                    <span className="font-mono text-[10px]" style={{ color: colors.lime }}>LIVE</span>
                  </div>
                </div>

                <div
                  className="h-[280px] overflow-y-auto font-mono text-xs"
                  style={{ background: colors.terminal }}
                >
                  {activityLog.map((log, i) => (
                    <div
                      key={log.id}
                      className="px-3 py-2 border-b flex items-start gap-2"
                      style={{
                        borderColor: `${colors.sage}10`,
                        background: i === 0 ? `${colors.lime}05` : "transparent",
                      }}
                    >
                      <span style={{ color: colors.olive }}>
                        {log.timestamp.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      <span
                        className="font-bold min-w-[60px]"
                        style={{
                          color: log.result === "success" ? colors.lime
                            : log.result === "fail" ? colors.error
                            : log.result === "pending" ? colors.gold
                            : colors.sage
                        }}
                      >
                        [{log.agentName}]
                      </span>
                      <span style={{ color: colors.cream }}>
                        {log.action}
                        {log.details && <span style={{ color: colors.error }}> ({log.details})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowBorder>
            </div>
          </div>

          {/* Agent Detail Panel */}
          {selectedAgent && (
            <div className="mt-6">
              <GlowBorder color={colors.sage} className="rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: `${colors.sage}20`, background: colors.forestDark }}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="font-mono text-sm font-bold uppercase tracking-wider" style={{ color: colors.cream }}>
                      Agent Details: {selectedAgent.name}
                    </h2>
                    <StatusBadge status={selectedAgent.status} />
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="text-xs font-mono px-2 py-1 rounded transition-colors"
                    style={{ color: colors.sage, background: `${colors.sage}20` }}
                  >
                    CLOSE
                  </button>
                </div>

                <div className="p-6 grid grid-cols-4 gap-6" style={{ background: `${colors.terminal}90` }}>
                  {/* Performance Metrics */}
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: colors.olive }}>
                      Performance Metrics
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-xs" style={{ color: colors.sage }}>Historical Accuracy</span>
                          <span className="font-mono text-xs font-bold" style={{ color: colors.lime }}>{selectedAgent.historicalAccuracy}%</span>
                        </div>
                        <ProbabilityBar value={selectedAgent.historicalAccuracy} threshold={85} />
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-xs" style={{ color: colors.sage }}>Avg Completion</span>
                        <span className="font-mono text-xs font-bold" style={{ color: colors.cream }}>{selectedAgent.avgCompletionTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-xs" style={{ color: colors.sage }}>Total Tasks</span>
                        <span className="font-mono text-xs font-bold" style={{ color: colors.cream }}>{selectedAgent.tasksCompleted.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Patterns */}
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: colors.olive }}>
                      Error Patterns
                    </h3>
                    <div className="space-y-2">
                      {selectedAgent.errorPatterns.map((err, i) => (
                        <div
                          key={i}
                          className="px-2 py-1.5 rounded flex items-center justify-between"
                          style={{ background: `${colors.error}10`, border: `1px solid ${colors.error}20` }}
                        >
                          <span className="font-mono text-[11px]" style={{ color: colors.cream }}>{err.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold" style={{ color: colors.error }}>{err.count}×</span>
                            <span className="font-mono text-[10px]" style={{ color: colors.olive }}>{err.lastOccurred}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Redundancy Config */}
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color: colors.olive }}>
                      Redundancy Workflow
                    </h3>
                    <div className="space-y-2">
                      <div
                        className="px-3 py-2 rounded text-center"
                        style={{ background: `${colors.sage}15`, border: `1px solid ${colors.sage}30` }}
                      >
                        <p className="font-mono text-[10px] uppercase" style={{ color: colors.olive }}>Primary</p>
                        <p className="font-mono text-sm font-bold" style={{ color: colors.sage }}>{selectedAgent.name}</p>
                      </div>
                      {selectedAgent.fallbackAgent && (
                        <>
                          <div className="flex justify-center">
                            <svg className="w-4 h-4" fill="none" stroke={colors.gold} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <div
                            className="px-3 py-2 rounded text-center"
                            style={{ background: `${colors.gold}15`, border: `1px solid ${colors.gold}30` }}
                          >
                            <p className="font-mono text-[10px] uppercase" style={{ color: colors.olive }}>Fallback</p>
                            <p className="font-mono text-sm font-bold" style={{ color: colors.gold }}>
                              {agents.find(a => a.id === selectedAgent.fallbackAgent)?.name || "None"}
                            </p>
                          </div>
                        </>
                      )}
                      {!selectedAgent.fallbackAgent && (
                        <div
                          className="px-3 py-2 rounded text-center"
                          style={{ background: `${colors.olive}15`, border: `1px solid ${colors.olive}30` }}
                        >
                          <p className="font-mono text-xs" style={{ color: colors.olive }}>No fallback configured</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gauges */}
                  <div className="flex items-center justify-around">
                    <CircularGauge value={selectedAgent.successProbability} size={90} label="Success" />
                    <CircularGauge value={100 - selectedAgent.errorLikelihood} size={90} label="Stability" />
                  </div>
                </div>
              </GlowBorder>
            </div>
          )}
        </div>

        {/* Pulse animation styles */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </IOAuthGate>
  );
}
