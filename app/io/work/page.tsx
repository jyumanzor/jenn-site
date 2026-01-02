"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import IOAuthGate from "@/components/IOAuthGate";

// Types
type TaskPriority = "high" | "medium" | "low";
type TaskStatus = "pending" | "in-progress" | "done";
type TaskCategory = "development" | "design" | "writing" | "admin" | "meetings" | "research" | "other";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

interface QuickNote {
  id: string;
  content: string;
  createdAt: string;
}

// localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
      setIsHydrated(true);
    } catch (e) { console.error(e); }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) { console.error(e); }
  };

  return [storedValue, setValue];
}

// Category options with labels
const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "writing", label: "Writing" },
  { value: "admin", label: "Admin" },
  { value: "meetings", label: "Meetings" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" }
];

// Priority colors
const priorityColors: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-red-100", text: "text-red-800", label: "High" },
  medium: { bg: "bg-amber-100", text: "text-amber-800", label: "Medium" },
  low: { bg: "bg-green-100", text: "text-green-800", label: "Low" }
};

// Status options
const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-gray-200 text-gray-700" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "done", label: "Done", color: "bg-green-100 text-green-800" }
];

// Check if task is overdue (pending for more than 3 days)
function isOverdue(task: Task): boolean {
  if (task.status === "done") return false;
  const createdDate = new Date(task.createdAt);
  const now = new Date();
  const diffTime = now.getTime() - createdDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > 3;
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export default function WorkJournalPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("jenn-work-tasks", []);
  const [notes, setNotes] = useLocalStorage<QuickNote[]>("jenn-work-notes", []);

  // UI state
  const [showNewTask, setShowNewTask] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">("all");
  const [quickNoteText, setQuickNoteText] = useState("");

  // New task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    category: "other" as TaskCategory
  });

  // Computed: overdue tasks (pending for more than 3 days)
  const overdueTasks = useMemo(() => {
    return tasks.filter(task => isOverdue(task) && task.status !== "done");
  }, [tasks]);

  // Computed: filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (categoryFilter !== "all" && task.category !== categoryFilter) return false;
      return true;
    }).sort((a, b) => {
      // Sort by status (pending first, then in-progress, then done)
      const statusOrder = { "pending": 0, "in-progress": 1, "done": 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then by priority
      const priorityOrder = { "high": 0, "medium": 1, "low": 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, statusFilter, categoryFilter]);

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", priority: "medium", category: "other" });
    setShowNewTask(false);
  };

  // Update task status
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === "done" ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Add quick note
  const handleAddNote = () => {
    if (!quickNoteText.trim()) return;

    const note: QuickNote = {
      id: Date.now().toString(),
      content: quickNoteText,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => [note, ...prev]);
    setQuickNoteText("");
  };

  // Delete note
  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  return (
    <IOAuthGate>
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-8 pb-8 md:pt-16 md:pb-12">
        <div className="container-editorial">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="light-bg-label mb-3">Backend Tool</p>
              <h1 className="light-bg-header text-3xl md:text-4xl mb-2">Work Journal</h1>
              <p className="light-bg-body">Task catalog, overdue tracking, and quick notes</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* TODAY Section - Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <>
          <section className="py-6 bg-gold/20 border-l-4 border-gold">
            <div className="container-editorial">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="light-bg-label text-amber-800">TODAY - Still Not Done (3+ days pending)</p>
              </div>
              <div className="grid gap-3">
                {overdueTasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl p-4 border-l-4 border-amber-400 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="light-bg-header text-lg">{task.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text}`}>
                            {priorityColors[task.priority].label}
                          </span>
                        </div>
                        {task.description && (
                          <p className="light-bg-body text-sm mb-2">{task.description}</p>
                        )}
                        <p className="text-xs text-amber-700">
                          Created {formatDate(task.createdAt)} - overdue
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, "in-progress")}
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "done")}
                          className="px-3 py-1.5 text-sm bg-deep-forest text-cream rounded-full hover:bg-olive transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <hr className="rule" />
        </>
      )}

      {/* Main Content Grid */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Task Cataloging - Takes 2 columns */}
            <div className="lg:col-span-2">
              {/* Task Header & Add Button */}
              <div className="flex items-center justify-between mb-4">
                <p className="light-bg-label">Task Catalog</p>
                <button
                  onClick={() => setShowNewTask(true)}
                  className="px-4 py-2 bg-deep-forest text-cream rounded-full text-sm font-medium hover:bg-olive transition-colors"
                >
                  + Add Task
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-deep-forest/60 uppercase tracking-wide">Status:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        statusFilter === "all" ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest hover:bg-sage/30"
                      }`}
                    >
                      All
                    </button>
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                          statusFilter === opt.value ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest hover:bg-sage/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-deep-forest/60 uppercase tracking-wide">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as TaskCategory | "all")}
                    className="px-3 py-1 rounded-full text-xs bg-sand text-deep-forest border-none focus:ring-2 focus:ring-sage"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-ivory rounded-xl">
                  <svg className="w-12 h-12 mx-auto mb-4 text-deep-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="light-bg-body">No tasks yet. Add your first task to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-ivory rounded-xl p-4 transition-all hover:shadow-md ${
                        task.status === "done" ? "opacity-60" : ""
                      } ${isOverdue(task) ? "border-l-4 border-amber-400" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`light-bg-header text-base ${task.status === "done" ? "line-through" : ""}`}>
                              {task.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text}`}>
                              {priorityColors[task.priority].label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-sage/20 text-deep-forest">
                              {categoryOptions.find(c => c.value === task.category)?.label}
                            </span>
                            {isOverdue(task) && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 font-medium">
                                Overdue
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="light-bg-body text-sm mb-2">{task.description}</p>
                          )}
                          <p className="text-xs text-deep-forest/50">
                            {formatDate(task.createdAt)}
                            {task.completedAt && ` - Completed ${formatDate(task.completedAt)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Status dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-sage cursor-pointer ${
                              statusOptions.find(s => s.value === task.status)?.color
                            }`}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-deep-forest/40 hover:text-red-600 transition-colors"
                            title="Delete task"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Notes - 1 column */}
            <div>
              <p className="light-bg-label mb-4">Quick Notes</p>

              {/* Note Input */}
              <div className="bg-ivory rounded-xl p-4 mb-4">
                <textarea
                  value={quickNoteText}
                  onChange={(e) => setQuickNoteText(e.target.value)}
                  placeholder="Jot down a quick thought..."
                  rows={4}
                  className="w-full px-3 py-2 border border-sand rounded-lg bg-white text-deep-forest placeholder-deep-forest/40 focus:outline-none focus:ring-2 focus:ring-sage resize-none text-sm"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!quickNoteText.trim()}
                  className="mt-3 w-full py-2 bg-sage text-deep-forest rounded-lg text-sm font-medium hover:bg-sage/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-8 bg-ivory rounded-xl">
                    <p className="text-sm text-deep-forest/50">No notes yet</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-ivory rounded-xl p-4 group">
                      <p className="light-bg-body text-sm mb-2">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-deep-forest/50">{formatTimestamp(note.createdAt)}</p>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-deep-forest/40 hover:text-red-600 transition-all"
                          title="Delete note"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-ivory">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">
            &larr; Back to dashboard
          </Link>
        </div>
      </section>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewTask(false)} />
          <div className="relative bg-cream rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <button
              onClick={() => setShowNewTask(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-deep-forest/10 flex items-center justify-center hover:bg-deep-forest/20 transition-colors"
            >
              <svg className="w-4 h-4 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="light-bg-header text-xl mb-6">Add New Task</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="light-bg-label text-xs mb-2 block">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 border border-sand rounded-lg bg-white text-deep-forest placeholder-deep-forest/40 focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="light-bg-label text-xs mb-2 block">Description (optional)</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add more details..."
                rows={3}
                className="w-full px-4 py-3 border border-sand rounded-lg bg-white text-deep-forest placeholder-deep-forest/40 focus:outline-none focus:ring-2 focus:ring-sage resize-none"
              />
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="light-bg-label text-xs mb-2 block">Priority</label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as TaskPriority[]).map(priority => (
                  <button
                    key={priority}
                    onClick={() => setNewTask(prev => ({ ...prev, priority }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      newTask.priority === priority
                        ? `${priorityColors[priority].bg} ${priorityColors[priority].text} ring-2 ring-offset-2 ring-deep-forest/20`
                        : "bg-sand text-deep-forest hover:bg-sage/20"
                    }`}
                  >
                    {priorityColors[priority].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="light-bg-label text-xs mb-2 block">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as TaskCategory }))}
                className="w-full px-4 py-3 border border-sand rounded-lg bg-white text-deep-forest focus:outline-none focus:ring-2 focus:ring-sage"
              >
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className="w-full py-3 bg-deep-forest text-cream rounded-lg font-medium hover:bg-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
    </IOAuthGate>
  );
}
