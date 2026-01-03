"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import Link from "next/link";
import nutritionData from "@/data/nutrition.json";
import bloodTestData from "@/data/blood-tests.json";

// ===================== TYPES =====================
interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  mealType: MealType;
  portion: number;
  portionUnit: string;
  date: string;
  timestamp: string;
}

interface WaterEntry {
  id: string;
  amount: number;
  date: string;
  timestamp: string;
}

interface NutritionAnalysis {
  healthScore: number;
  strengths: string[];
  improvements: string[];
  runnerInsights: string[];
  micronutrientHighlights: { name: string; status: "good" | "low" | "high"; note: string }[];
}

type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

interface FoodItem {
  name: string;
  category: FoodCategory;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  benefits: string[];
  timing: string;
  healthScore: number;
  servingSize: string;
}

type FoodCategory = "nuts" | "greens" | "fruits" | "legumes" | "grains" | "proteins" | "treats";

// ===================== DATA =====================

const MEAL_ICONS: Record<MealType, ReactNode> = {
  breakfast: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  lunch: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  dinner: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  snacks: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

const CATEGORY_COLORS: Record<FoodCategory, string> = {
  nuts: "bg-amber-100 text-amber-800 border-amber-200",
  greens: "bg-emerald-100 text-emerald-800 border-emerald-200",
  fruits: "bg-rose-100 text-rose-800 border-rose-200",
  legumes: "bg-orange-100 text-orange-800 border-orange-200",
  grains: "bg-yellow-100 text-yellow-800 border-yellow-200",
  proteins: "bg-red-100 text-red-800 border-red-200",
  treats: "bg-purple-100 text-purple-800 border-purple-200",
};

const QUICK_ADD_FOODS: FoodItem[] = [
  { name: "Banana", category: "fruits", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, benefits: ["Quick energy", "Potassium"], timing: "Pre-run", healthScore: 88, servingSize: "1 medium" },
  { name: "Oatmeal", category: "grains", calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, benefits: ["Sustained energy", "Heart health"], timing: "2-3 hrs pre-run", healthScore: 92, servingSize: "1 cup cooked" },
  { name: "Greek Yogurt", category: "proteins", calories: 130, protein: 17, carbs: 6, fat: 4, fiber: 0, benefits: ["Muscle recovery", "Probiotics"], timing: "Post-run", healthScore: 90, servingSize: "170g" },
  { name: "Almonds", category: "nuts", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, benefits: ["Healthy fats", "Vitamin E"], timing: "Snack", healthScore: 94, servingSize: "1 oz (23)" },
  { name: "Sweet Potato", category: "grains", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, benefits: ["Complex carbs", "Beta-carotene"], timing: "Post-run", healthScore: 95, servingSize: "1 medium" },
  { name: "Spinach", category: "greens", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, benefits: ["Iron", "Anti-inflammatory"], timing: "Any", healthScore: 98, servingSize: "1 cup raw" },
  { name: "Eggs", category: "proteins", calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, benefits: ["Complete protein", "Choline"], timing: "Any", healthScore: 89, servingSize: "1 large" },
  { name: "Salmon", category: "proteins", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, benefits: ["Omega-3s", "Anti-inflammatory"], timing: "Post-run", healthScore: 96, servingSize: "4 oz" },
  { name: "Avocado", category: "fruits", calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, benefits: ["Healthy fats", "Potassium"], timing: "Any", healthScore: 94, servingSize: "1/2 fruit" },
  { name: "Blueberries", category: "fruits", calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, benefits: ["Antioxidants", "Recovery"], timing: "Post-run", healthScore: 97, servingSize: "1 cup" },
  { name: "Quinoa", category: "grains", calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, benefits: ["Complete protein", "Iron"], timing: "Post-run", healthScore: 95, servingSize: "1 cup cooked" },
];

const HEALTHY_FOODS_DATABASE: FoodItem[] = [
  // Nuts
  { name: "Almonds", category: "nuts", calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, benefits: ["Vitamin E", "Magnesium", "Healthy fats"], timing: "Snack, 1-2 hrs pre-run", healthScore: 94, servingSize: "1 oz (23 almonds)" },
  { name: "Walnuts", category: "nuts", calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, benefits: ["Omega-3s", "Brain health", "Anti-inflammatory"], timing: "Snack", healthScore: 93, servingSize: "1 oz (14 halves)" },
  { name: "Cashews", category: "nuts", calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, fiber: 0.9, benefits: ["Iron", "Zinc", "Magnesium"], timing: "Snack", healthScore: 87, servingSize: "1 oz" },
  { name: "Pistachios", category: "nuts", calories: 159, protein: 5.7, carbs: 7.7, fat: 12.9, fiber: 3, benefits: ["Antioxidants", "B6", "Potassium"], timing: "Snack", healthScore: 91, servingSize: "1 oz (49 kernels)" },

  // Green Vegetables
  { name: "Spinach", category: "greens", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, benefits: ["Iron", "Vitamin K", "Folate"], timing: "Any meal", healthScore: 98, servingSize: "1 cup raw" },
  { name: "Kale", category: "greens", calories: 33, protein: 2.9, carbs: 6, fat: 0.6, fiber: 2.6, benefits: ["Vitamin C", "Vitamin K", "Antioxidants"], timing: "Any meal", healthScore: 97, servingSize: "1 cup chopped" },
  { name: "Broccoli", category: "greens", calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1, benefits: ["Vitamin C", "Fiber", "Sulforaphane"], timing: "Post-run meal", healthScore: 96, servingSize: "1 cup cooked" },
  { name: "Brussels Sprouts", category: "greens", calories: 56, protein: 4, carbs: 11, fat: 0.8, fiber: 4.1, benefits: ["Vitamin K", "Fiber", "Antioxidants"], timing: "Post-run meal", healthScore: 94, servingSize: "1 cup cooked" },

  // Fruits
  { name: "Banana", category: "fruits", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, benefits: ["Potassium", "Quick energy", "Muscle function"], timing: "30-60 min pre-run", healthScore: 88, servingSize: "1 medium" },
  { name: "Blueberries", category: "fruits", calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, benefits: ["Antioxidants", "Recovery", "Brain health"], timing: "Post-run", healthScore: 97, servingSize: "1 cup" },
  { name: "Avocado", category: "fruits", calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, benefits: ["Healthy fats", "Potassium", "Heart health"], timing: "Any meal", healthScore: 94, servingSize: "1/2 fruit" },
  { name: "Tart Cherries", category: "fruits", calories: 77, protein: 1.6, carbs: 19, fat: 0.5, fiber: 2.5, benefits: ["Reduces inflammation", "Sleep quality", "Recovery"], timing: "Post-run, evening", healthScore: 95, servingSize: "1 cup" },
  { name: "Orange", category: "fruits", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, benefits: ["Vitamin C", "Hydration", "Immune support"], timing: "Pre or post-run", healthScore: 90, servingSize: "1 medium" },

  // Legumes
  { name: "Black Beans", category: "legumes", calories: 227, protein: 15.2, carbs: 40.8, fat: 0.9, fiber: 15, benefits: ["Fiber", "Plant protein", "Iron"], timing: "Post-run meal", healthScore: 93, servingSize: "1 cup cooked" },
  { name: "Lentils", category: "legumes", calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6, benefits: ["Iron", "Folate", "Sustained energy"], timing: "Post-run meal", healthScore: 95, servingSize: "1 cup cooked" },
  { name: "Chickpeas", category: "legumes", calories: 269, protein: 14.5, carbs: 45, fat: 4.3, fiber: 12.5, benefits: ["Fiber", "Plant protein", "Manganese"], timing: "Any meal", healthScore: 92, servingSize: "1 cup cooked" },
  { name: "Edamame", category: "legumes", calories: 188, protein: 18.5, carbs: 14, fat: 8, fiber: 8, benefits: ["Complete protein", "Fiber", "Folate"], timing: "Snack, any meal", healthScore: 94, servingSize: "1 cup shelled" },

  // Whole Grains
  { name: "Oatmeal", category: "grains", calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, benefits: ["Sustained energy", "Heart health", "Beta-glucan"], timing: "2-3 hrs pre-run", healthScore: 92, servingSize: "1 cup cooked" },
  { name: "Quinoa", category: "grains", calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, benefits: ["Complete protein", "Iron", "Magnesium"], timing: "Post-run meal", healthScore: 95, servingSize: "1 cup cooked" },
  { name: "Brown Rice", category: "grains", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, benefits: ["Manganese", "Selenium", "Sustained energy"], timing: "Post-run meal", healthScore: 86, servingSize: "1 cup cooked" },
  { name: "Sweet Potato", category: "grains", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, benefits: ["Beta-carotene", "Vitamin C", "Potassium"], timing: "Post-run meal", healthScore: 95, servingSize: "1 medium" },

  // Proteins
  { name: "Salmon", category: "proteins", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, benefits: ["Omega-3s", "Vitamin D", "Anti-inflammatory"], timing: "Post-run meal", healthScore: 96, servingSize: "4 oz" },
  { name: "Eggs", category: "proteins", calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, benefits: ["Complete protein", "Choline", "B12"], timing: "Any meal", healthScore: 89, servingSize: "1 large" },
  { name: "Greek Yogurt", category: "proteins", calories: 130, protein: 17, carbs: 6, fat: 4, fiber: 0, benefits: ["Probiotics", "Calcium", "Muscle recovery"], timing: "Post-run", healthScore: 90, servingSize: "170g" },

  // Treats (healthier options)
  { name: "Dark Chocolate", category: "treats", calories: 170, protein: 2.2, carbs: 13, fat: 12, fiber: 3.1, benefits: ["Antioxidants", "Magnesium", "Mood boost"], timing: "Occasional treat", healthScore: 72, servingSize: "1 oz (70%+)" },
  { name: "Honey", category: "treats", calories: 64, protein: 0.1, carbs: 17.3, fat: 0, fiber: 0, benefits: ["Quick energy", "Antioxidants", "Natural sugar"], timing: "During long runs", healthScore: 65, servingSize: "1 tbsp" },
  { name: "Dried Mango", category: "treats", calories: 134, protein: 1.2, carbs: 33, fat: 0.6, fiber: 2, benefits: ["Vitamin A", "Quick energy", "Fiber"], timing: "During long runs", healthScore: 68, servingSize: "1/4 cup" },
];

const RUNNER_RECOMMENDATIONS = {
  marathon: [
    { food: "Sweet Potato", reason: "Complex carbs for glycogen loading" },
    { food: "Oatmeal", reason: "Sustained energy, easy to digest" },
    { food: "Banana", reason: "Quick energy, potassium for cramps" },
    { food: "Salmon", reason: "Omega-3s reduce inflammation" },
    { food: "Quinoa", reason: "Complete protein + carbs for recovery" },
  ],
  antiInflammatory: [
    { food: "Tart Cherries", reason: "Reduces muscle soreness by 20%" },
    { food: "Salmon", reason: "EPA/DHA omega-3 fatty acids" },
    { food: "Spinach", reason: "Rich in anti-inflammatory compounds" },
    { food: "Walnuts", reason: "Plant-based omega-3s" },
    { food: "Blueberries", reason: "Anthocyanins fight inflammation" },
  ],
  recovery: [
    { food: "Greek Yogurt", reason: "20:1 protein to carb ratio ideal" },
    { food: "Eggs", reason: "Leucine triggers muscle synthesis" },
    { food: "Chocolate Milk", reason: "4:1 carb to protein ratio" },
    { food: "Tart Cherry Juice", reason: "Speeds recovery by 13%" },
    { food: "Salmon", reason: "Protein + anti-inflammatory fats" },
  ],
  energy: [
    { food: "Oatmeal", reason: "Low glycemic, sustained release" },
    { food: "Banana", reason: "Fast-acting carbs + potassium" },
    { food: "Honey", reason: "Quick glucose for long runs" },
    { food: "Sweet Potato", reason: "Complex carbs, vitamin B6" },
    { food: "Dates", reason: "Natural sugars, easy to digest" },
  ],
  toLimit: [
    { food: "Alcohol", reason: "Impairs recovery and hydration" },
    { food: "Fried Foods", reason: "Inflammation, slow digestion" },
    { food: "Processed Meats", reason: "Inflammatory, high sodium" },
    { food: "Sugary Drinks", reason: "Empty calories, energy crash" },
    { food: "High-fiber before runs", reason: "GI distress risk" },
  ],
};

const PORTION_OPTIONS = [
  { value: 0.5, label: "1/2" },
  { value: 0.75, label: "3/4" },
  { value: 1, label: "1" },
  { value: 1.5, label: "1.5" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

// ===================== COMPONENTS =====================

// Progress Ring for Calories
function CalorieRing({ current, goal }: { current: number; goal: number }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isOver = current > goal;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#EDE5D8"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={isOver ? "#FABF34" : "#97A97C"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-medium text-deep-forest">{current}</span>
        <span className="text-xs text-deep-forest/60">/ {goal} cal</span>
      </div>
    </div>
  );
}

// Macro Bar
function MacroBar({ label, current, goal, color, unit = "g" }: { label: string; current: number; goal: number; color: string; unit?: string }) {
  const percentage = Math.min((current / goal) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-deep-forest/70">{label}</span>
        <span className="font-medium text-deep-forest">{current.toFixed(0)}{unit} / {goal}{unit}</span>
      </div>
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Water Drop
function WaterTracker({ glasses, onAdd, onRemove }: { glasses: number; onAdd: () => void; onRemove: () => void }) {
  const goal = 8;
  return (
    <div className="bg-ivory rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="light-bg-label text-xs">Water Intake</span>
        <span className="text-sm text-deep-forest/60">{glasses} / {goal} glasses</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-deep-forest/60 hover:bg-sage/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <div className="flex-1 flex gap-1">
          {Array.from({ length: goal }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded transition-colors ${
                i < glasses ? "bg-blue-400" : "bg-sand"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-ivory hover:bg-dark-olive transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Food Search Input
function FoodSearch({ onSelect }: { onSelect: (food: FoodItem) => void }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return HEALTHY_FOODS_DATABASE.filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-ivory border border-sage/20 rounded-lg px-3 py-2">
        <svg className="w-4 h-4 text-deep-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search foods..."
          className="flex-1 bg-transparent text-sm text-deep-forest placeholder-deep-forest/40 focus:outline-none"
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-ivory border border-sage/20 rounded-lg shadow-lg overflow-hidden">
          {filtered.map((food) => (
            <button
              key={food.name}
              onClick={() => {
                onSelect(food);
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-sage/10 transition-colors flex items-center justify-between"
            >
              <span className="text-sm text-deep-forest">{food.name}</span>
              <span className="text-xs text-deep-forest/50">{food.calories} cal</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Quick Add Button
function QuickAddButton({ food, onClick }: { food: FoodItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-ivory border border-sage/20 rounded-lg hover:border-sage hover:bg-sage/5 transition-colors group"
    >
      <span className="text-sm text-deep-forest group-hover:text-dark-olive">{food.name}</span>
      <span className="text-xs text-deep-forest/50">{food.calories}</span>
    </button>
  );
}

// Food Entry Card
function FoodEntryCard({ entry, onDelete }: { entry: FoodEntry; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-ivory rounded-lg p-3 group">
      <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage">
        {MEAL_ICONS[entry.mealType]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-deep-forest truncate">{entry.name}</p>
        <p className="text-xs text-deep-forest/50">
          {entry.portion} {entry.portionUnit} | {entry.calories} cal | P:{entry.protein}g C:{entry.carbs}g F:{entry.fat}g
        </p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-all"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Food Database Card
function FoodDatabaseCard({ food }: { food: FoodItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-ivory rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between text-left hover:bg-sage/5 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`px-2 py-1 rounded text-xs font-medium border ${CATEGORY_COLORS[food.category]}`}>
            {food.category}
          </div>
          <div>
            <h4 className="font-medium text-deep-forest">{food.name}</h4>
            <p className="text-xs text-deep-forest/50">{food.servingSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-deep-forest">{food.calories} cal</p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-lime-accent font-medium">{food.healthScore}</span>
              <svg className="w-3 h-3 text-lime-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-deep-forest/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-sage/10">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center p-2 bg-cream rounded">
              <p className="text-xs text-deep-forest/50">Protein</p>
              <p className="text-sm font-medium text-deep-forest">{food.protein}g</p>
            </div>
            <div className="text-center p-2 bg-cream rounded">
              <p className="text-xs text-deep-forest/50">Carbs</p>
              <p className="text-sm font-medium text-deep-forest">{food.carbs}g</p>
            </div>
            <div className="text-center p-2 bg-cream rounded">
              <p className="text-xs text-deep-forest/50">Fat</p>
              <p className="text-sm font-medium text-deep-forest">{food.fat}g</p>
            </div>
            <div className="text-center p-2 bg-cream rounded">
              <p className="text-xs text-deep-forest/50">Fiber</p>
              <p className="text-sm font-medium text-deep-forest">{food.fiber}g</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-1">Benefits for Runners</p>
            <div className="flex flex-wrap gap-1">
              {food.benefits.map((b) => (
                <span key={b} className="px-2 py-0.5 bg-sage/20 text-sage text-xs rounded-full">{b}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-1">Optimal Timing</p>
            <p className="text-sm text-deep-forest">{food.timing}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// AI Analysis Panel
function AIAnalysisPanel({ entries, onAnalyze, analysis, isAnalyzing }: {
  entries: FoodEntry[];
  onAnalyze: () => void;
  analysis: NutritionAnalysis | null;
  isAnalyzing: boolean;
}) {
  if (entries.length === 0) {
    return (
      <div className="bg-ivory rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-sm text-deep-forest/60">Log some foods to get AI analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-ivory rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="light-bg-header text-lg">AI Nutrition Analysis</h3>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-sage text-ivory rounded-lg text-sm font-medium hover:bg-dark-olive transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing..." : "Get Analysis"}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Health Score */}
          <div className="flex items-center gap-4 p-4 bg-cream rounded-lg">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#EDE5D8" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke={analysis.healthScore >= 80 ? "#97A97C" : analysis.healthScore >= 60 ? "#FABF34" : "#E07B39"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${analysis.healthScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-deep-forest">{analysis.healthScore}</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-deep-forest">Health Score</p>
              <p className="text-sm text-deep-forest/60">
                {analysis.healthScore >= 80 ? "Excellent" : analysis.healthScore >= 60 ? "Good" : "Needs Improvement"}
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-2">Strengths</p>
            <div className="space-y-1">
              {analysis.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-deep-forest">
                  <svg className="w-4 h-4 text-sage mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div>
            <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-2">Areas to Improve</p>
            <div className="space-y-1">
              {analysis.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-deep-forest">
                  <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Runner Insights */}
          <div className="p-3 bg-sage/10 rounded-lg">
            <p className="text-xs text-sage uppercase tracking-wide mb-2 font-medium">Runner Insights</p>
            <div className="space-y-1">
              {analysis.runnerInsights.map((s, i) => (
                <p key={i} className="text-sm text-deep-forest">{s}</p>
              ))}
            </div>
          </div>

          {/* Micronutrient Highlights */}
          <div>
            <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-2">Key Micronutrients</p>
            <div className="grid grid-cols-2 gap-2">
              {analysis.micronutrientHighlights.map((m) => (
                <div key={m.name} className="flex items-center gap-2 p-2 bg-cream rounded">
                  <div className={`w-2 h-2 rounded-full ${
                    m.status === "good" ? "bg-sage" : m.status === "low" ? "bg-gold" : "bg-tangerine"
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-deep-forest">{m.name}</p>
                    <p className="text-xs text-deep-forest/50">{m.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Expanded meal options for the weekly planner - organized by vitamin D priority for blood test optimization
const MEAL_OPTIONS = {
  breakfast: [
    "Nutty Pudding",
    "Nutty Pudding + banana",
    "Oatmeal with berries",
    "Greek yogurt parfait",
    "Eggs + avocado toast",
    "Smoothie bowl",
    "Salmon + eggs (Vitamin D boost)",
    "Chia pudding with fruit",
    "Overnight oats",
    "Acai bowl",
    "Egg white omelette + spinach",
    "Cottage cheese + fruit"
  ],
  lunch: [
    "Super Veggie",
    "Super Veggie + extra lentils",
    "Salmon Bowl (Vitamin D)",
    "Sardine Super Toast (Vitamin D)",
    "Quinoa salad",
    "Lentil soup",
    "Mediterranean bowl",
    "Poke bowl",
    "Buddha bowl",
    "Grain bowl + roasted vegetables",
    "Minestrone soup",
    "Black bean tacos",
    "Sushi rolls",
    "Miso soup + edamame"
  ],
  dinner: [
    "Salmon Bowl (Vitamin D)",
    "Tuna Poke Bowl",
    "Shrimp Stir-Fry",
    "Shrimp Stir-Fry (carb load)",
    "Super Veggie",
    "Grilled fish + vegetables",
    "Baked salmon + sweet potato",
    "Seafood pasta",
    "Fish tacos",
    "Seared ahi tuna",
    "Cioppino (seafood stew)",
    "Miso-glazed cod",
    "Shrimp scampi",
    "Paella",
    "Grilled halibut + greens"
  ],
  snack: [
    "Morning Mix",
    "Recovery Mix",
    "Pre-Run Mix",
    "Greek yogurt",
    "Fruit + nuts",
    "Hummus + vegetables",
    "Hard-boiled eggs (Vitamin D)",
    "Cheese + crackers",
    "Trail mix",
    "Apple + almond butter",
    "Protein bar",
    "Edamame",
    "Dark chocolate + almonds",
    "Cottage cheese + berries"
  ],
  postRun: [
    "Salmon Bowl (Vitamin D)",
    "Protein smoothie",
    "Recovery shake",
    "Greek yogurt + banana",
    "Chocolate milk",
    "PB&J on whole grain",
    "Tart cherry juice + protein",
    "Eggs + toast"
  ]
};

type MealSlot = "breakfast" | "lunch" | "dinner" | "snack" | "postRun";
type DayName = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// Blood Test Insights Component
function BloodTestInsights() {
  const [isExpanded, setIsExpanded] = useState(false);
  const tests = bloodTestData.tests;
  const recommendations = bloodTestData.nutritionRecommendations;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return '#E53E3E';
      case 'high': return '#ED8936';
      case 'normal': return '#38A169';
      case 'optimal': return '#38A169';
      default: return '#718096';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'low': return '#FED7D7';
      case 'high': return '#FEEBC8';
      case 'normal': return '#C6F6D5';
      case 'optimal': return '#C6F6D5';
      default: return '#E2E8F0';
    }
  };

  const priorityTests = [tests.vitaminD, tests.iron, tests.vitaminB12, tests.hba1c];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#2A3C24' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FABF3420' }}>
            <svg className="w-5 h-5" style={{ color: '#FABF34' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
              Blood Test Insights
            </h3>
            <p className="text-xs" style={{ color: '#FFF5EB99' }}>
              Last updated: {bloodTestData.lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FED7D7', color: '#E53E3E' }}>
              1 Low
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#C6F6D5', color: '#38A169' }}>
              9 Normal
            </span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: '#FFF5EB99' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Priority Alert */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FED7D720', border: '1px solid #E53E3E40' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5" style={{ color: '#E53E3E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-sm" style={{ color: '#FFF5EB' }}>Vitamin D Insufficiency</p>
                <p className="text-xs mt-1" style={{ color: '#FFF5EB99' }}>
                  Current: {tests.vitaminD.value} {tests.vitaminD.unit} (optimal: 30+)
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recommendations.prioritize[0].foods.map((food, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#FABF3420', color: '#FABF34' }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorityTests.map((test, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#FFF5EB10' }}>
                <p className="text-xs mb-1" style={{ color: '#FFF5EB60' }}>{test.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-medium" style={{ color: '#FFF5EB' }}>{test.value}</span>
                  <span className="text-xs" style={{ color: '#FFF5EB60' }}>{test.unit}</span>
                </div>
                <span
                  className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: getStatusBg(test.status), color: getStatusColor(test.status) }}
                >
                  {test.status}
                </span>
              </div>
            ))}
          </div>

          {/* Runner Insights */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#97A97C20' }}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Runner Insights</p>
            <ul className="space-y-1">
              <li className="text-sm" style={{ color: '#FFF5EB99' }}>
                <span style={{ color: '#97A97C' }}>•</span> {bloodTestData.runnerInsights.oxygenCapacity}
              </li>
              <li className="text-sm" style={{ color: '#FFF5EB99' }}>
                <span style={{ color: '#97A97C' }}>•</span> {bloodTestData.runnerInsights.energyMetabolism}
              </li>
              <li className="text-sm" style={{ color: '#FFF5EB99' }}>
                <span style={{ color: '#97A97C' }}>•</span> {bloodTestData.runnerInsights.recoverySupport}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

interface WeeklyPlan {
  [day: string]: {
    [meal: string]: string;
  };
}

// Blueprint Meals Section
function BlueprintMeals() {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'pescatarian' | 'mixes' | 'weekly'>('blueprint');
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(nutritionData.weeklyMealPlan);
  const [editingCell, setEditingCell] = useState<{ day: string; meal: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const blueprintMeals = nutritionData.blueprintMeals;
  const pescatarianMeals = nutritionData.pescatarianMeals;
  const mixes = nutritionData.berryNutMixes;
  const defaultWeeklyPlan = nutritionData.weeklyMealPlan;
  const science = nutritionData.scienceNotes;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("jenn-weekly-meal-plan");
    if (saved) {
      try {
        setWeeklyPlan(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse weekly meal plan:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jenn-weekly-meal-plan", JSON.stringify(weeklyPlan));
    }
  }, [weeklyPlan, isLoaded]);

  const updateMeal = (day: string, meal: string, value: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
    setEditingCell(null);
  };

  const resetPlan = () => {
    setWeeklyPlan(defaultWeeklyPlan);
    localStorage.removeItem("jenn-weekly-meal-plan");
  };

  const getMealOptions = (meal: string): string[] => {
    if (meal === "postRun") return MEAL_OPTIONS.postRun;
    if (meal in MEAL_OPTIONS) return MEAL_OPTIONS[meal as MealSlot];
    return MEAL_OPTIONS.snack;
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'blueprint' as const, label: 'Blueprint Core', icon: '🧪' },
          { key: 'pescatarian' as const, label: 'Pescatarian', icon: '🐟' },
          { key: 'mixes' as const, label: 'Nut & Berry Mixes', icon: '🫐' },
          { key: 'weekly' as const, label: 'Weekly Plan', icon: '📅' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-deep-forest text-ivory shadow-lg'
                : 'bg-ivory text-deep-forest hover:bg-sage/20'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Blueprint Core Tab */}
      {activeTab === 'blueprint' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/30">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Bryan Johnson&apos;s Blueprint Protocol</p>
            <p className="text-sm text-deep-forest/80">
              Science-backed meals designed for longevity. Adapted here for a pescatarian marathon runner.
            </p>
          </div>

          {/* Nutty Pudding */}
          <div className="bg-ivory rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedMeal(expandedMeal === 'nutty' ? null : 'nutty')}
              className="w-full p-5 flex items-start justify-between text-left hover:bg-sage/5 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🥜</span>
                  <h4 className="text-lg font-medium text-deep-forest" style={{ fontFamily: 'var(--font-instrument)' }}>
                    {blueprintMeals.nuttyPudding.name}
                  </h4>
                </div>
                <p className="text-sm text-deep-forest/60">Breakfast • {blueprintMeals.nuttyPudding.prepTime} prep</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: '#97A97C' }}>{blueprintMeals.nuttyPudding.calories}</p>
                <p className="text-xs text-deep-forest/50">calories</p>
              </div>
            </button>
            {expandedMeal === 'nutty' && (
              <div className="px-5 pb-5 border-t border-sage/10">
                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 py-4">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Carbs</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.nuttyPudding.macros.carbs}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Protein</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.nuttyPudding.macros.protein}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Fat</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.nuttyPudding.macros.fat}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Fiber</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.nuttyPudding.macros.fiber}g</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Ingredients</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {blueprintMeals.nuttyPudding.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-cream">
                        <span className="text-sm text-deep-forest">{ing.item}</span>
                        <span className="text-xs text-deep-forest/50 font-mono">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {blueprintMeals.nuttyPudding.benefits.map((b, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#97A97C20', color: '#546E40' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Runner Mod */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#FABF3420', borderLeft: '3px solid #FABF34' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#FABF34' }}>Runner Modification</p>
                  <p className="text-sm text-deep-forest">{blueprintMeals.nuttyPudding.runnerMod}</p>
                </div>
              </div>
            )}
          </div>

          {/* Super Veggie */}
          <div className="bg-ivory rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedMeal(expandedMeal === 'super' ? null : 'super')}
              className="w-full p-5 flex items-start justify-between text-left hover:bg-sage/5 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🥦</span>
                  <h4 className="text-lg font-medium text-deep-forest" style={{ fontFamily: 'var(--font-instrument)' }}>
                    {blueprintMeals.superVeggie.name}
                  </h4>
                </div>
                <p className="text-sm text-deep-forest/60">Lunch • {blueprintMeals.superVeggie.prepTime} prep</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold" style={{ color: '#97A97C' }}>{blueprintMeals.superVeggie.calories}</p>
                <p className="text-xs text-deep-forest/50">calories</p>
              </div>
            </button>
            {expandedMeal === 'super' && (
              <div className="px-5 pb-5 border-t border-sage/10">
                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 py-4">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Carbs</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.superVeggie.macros.carbs}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Protein</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.superVeggie.macros.protein}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Fat</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.superVeggie.macros.fat}g</p>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                    <p className="text-xs text-deep-forest/50">Fiber</p>
                    <p className="text-lg font-bold text-deep-forest">{blueprintMeals.superVeggie.macros.fiber}g</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Ingredients</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {blueprintMeals.superVeggie.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-cream">
                        <span className="text-sm text-deep-forest">{ing.item}</span>
                        <span className="text-xs text-deep-forest/50 font-mono">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Method */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Method</p>
                  <ol className="space-y-2">
                    {blueprintMeals.superVeggie.method.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-deep-forest">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#97A97C', color: '#FFF5EB' }}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {blueprintMeals.superVeggie.benefits.map((b, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#97A97C20', color: '#546E40' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Runner Mod */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#FABF3420', borderLeft: '3px solid #FABF34' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#FABF34' }}>Runner Modification</p>
                  <p className="text-sm text-deep-forest">{blueprintMeals.superVeggie.runnerMod}</p>
                </div>
              </div>
            )}
          </div>

          {/* Science Notes */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#3B412D' }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>Blueprint Science Principles</p>
            <ul className="space-y-2">
              {science.blueprintPrinciples.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#EFE4D6' }}>
                  <span style={{ color: '#97A97C' }}>•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pescatarian Tab */}
      {activeTab === 'pescatarian' && (
        <div className="space-y-4">
          {Object.entries(pescatarianMeals).map(([key, meal]) => (
            <div key={key} className="bg-ivory rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedMeal(expandedMeal === key ? null : key)}
                className="w-full p-5 flex items-start justify-between text-left hover:bg-sage/5 transition-colors"
              >
                <div>
                  <h4 className="text-lg font-medium text-deep-forest" style={{ fontFamily: 'var(--font-instrument)' }}>
                    {meal.name}
                  </h4>
                  <p className="text-sm text-deep-forest/60">{meal.timing} • {meal.prepTime} prep</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: '#0067B1' }}>{meal.calories}</p>
                  <p className="text-xs text-deep-forest/50">calories</p>
                </div>
              </button>
              {expandedMeal === key && (
                <div className="px-5 pb-5 border-t border-sage/10">
                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3 py-4">
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                      <p className="text-xs text-deep-forest/50">Carbs</p>
                      <p className="text-lg font-bold text-deep-forest">{meal.macros.carbs}g</p>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                      <p className="text-xs text-deep-forest/50">Protein</p>
                      <p className="text-lg font-bold text-deep-forest">{meal.macros.protein}g</p>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#EFE4D6' }}>
                      <p className="text-xs text-deep-forest/50">Fat</p>
                      <p className="text-lg font-bold text-deep-forest">{meal.macros.fat}g</p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#0067B1' }}>Ingredients</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {meal.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-cream">
                          <span className="text-sm text-deep-forest">{ing.item}</span>
                          <span className="text-xs text-deep-forest/50 font-mono">{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#0067B1' }}>Runner Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {meal.benefits.map((b, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#0067B120', color: '#003763' }}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pescatarian Advantages */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#003763' }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#00C9D4' }}>Pescatarian Advantages for Runners</p>
            <ul className="space-y-2">
              {science.pescatarianAdvantages.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#FFF5EB' }}>
                  <span style={{ color: '#00C9D4' }}>•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mixes Tab */}
      {activeTab === 'mixes' && (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(mixes).map(([key, mix]) => (
            <div key={key} className="bg-ivory rounded-xl p-5">
              <h4 className="font-medium text-deep-forest mb-1" style={{ fontFamily: 'var(--font-instrument)' }}>
                {mix.name}
              </h4>
              <p className="text-sm mb-3" style={{ color: '#FABF34' }}>{mix.calories} cal</p>

              <div className="space-y-2 mb-4">
                {mix.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-deep-forest/80">{ing.item}</span>
                    <span className="text-deep-forest/50 text-xs font-mono">{ing.amount}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs p-2 rounded" style={{ backgroundColor: '#97A97C20', color: '#546E40' }}>
                {mix.benefits}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Plan Tab */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {/* Header with reset button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-deep-forest/60">Click any meal to edit. Changes save automatically.</p>
            <button
              onClick={resetPlan}
              className="px-3 py-1.5 text-xs rounded-lg transition-colors"
              style={{ backgroundColor: '#FABF3420', color: '#FABF34', border: '1px solid #FABF34' }}
            >
              Reset to Default
            </button>
          </div>

          {/* Editable Weekly Grid */}
          <div className="space-y-3">
            {Object.entries(weeklyPlan).map(([day, meals]) => (
              <div key={day} className="bg-ivory rounded-xl p-4">
                <h4 className="font-medium text-deep-forest capitalize mb-3" style={{ fontFamily: 'var(--font-instrument)' }}>
                  {day}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(meals).map(([mealTime, mealName]) => (
                    <div key={mealTime} className="relative">
                      {editingCell?.day === day && editingCell?.meal === mealTime ? (
                        <div className="p-2 rounded" style={{ backgroundColor: '#97A97C20', border: '2px solid #97A97C' }}>
                          <p className="text-xs text-deep-forest/50 capitalize mb-1">{mealTime}</p>
                          <select
                            value={mealName}
                            onChange={(e) => updateMeal(day, mealTime, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                            className="w-full text-sm text-deep-forest bg-transparent border-none focus:outline-none cursor-pointer"
                          >
                            {getMealOptions(mealTime).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                            <option value={mealName}>{mealName}</option>
                          </select>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingCell({ day, meal: mealTime })}
                          className="w-full p-2 rounded text-left transition-all hover:shadow-md group"
                          style={{ backgroundColor: '#EFE4D6' }}
                        >
                          <p className="text-xs text-deep-forest/50 capitalize flex items-center justify-between">
                            {mealTime}
                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </p>
                          <p className="text-sm text-deep-forest">{mealName}</p>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Meal Slot */}
          <div className="bg-ivory rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#97A97C' }}>Add Custom Meal</p>
            <p className="text-sm text-deep-forest/60">
              Type a custom meal name in any cell to add it to your rotation.
            </p>
          </div>

          {/* Runner Adaptations */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FABF3420', border: '1px solid #FABF34' }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>Runner Adaptations</p>
            <ul className="space-y-2">
              {science.runnerAdaptations.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-deep-forest">
                  <span style={{ color: '#FABF34' }}>•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Runner Recommendations Section
function RunnerRecommendations() {
  const [activeTab, setActiveTab] = useState<keyof typeof RUNNER_RECOMMENDATIONS>("marathon");
  const tabs = [
    { key: "marathon" as const, label: "Marathon Training" },
    { key: "antiInflammatory" as const, label: "Anti-Inflammatory" },
    { key: "recovery" as const, label: "Recovery" },
    { key: "energy" as const, label: "Energy" },
    { key: "toLimit" as const, label: "Foods to Limit" },
  ];

  return (
    <div className="bg-ivory rounded-xl p-5">
      <h3 className="light-bg-header text-lg mb-4">Runner Nutrition Guide</h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-deep-forest text-ivory"
                : "bg-sand text-deep-forest hover:bg-sage/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {RUNNER_RECOMMENDATIONS[activeTab].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-cream rounded-lg">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              activeTab === "toLimit" ? "bg-red-100 text-red-600" : "bg-sage/20 text-sage"
            }`}>
              {i + 1}
            </div>
            <div>
              <p className="font-medium text-deep-forest text-sm">{item.food}</p>
              <p className="text-xs text-deep-forest/60">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");
  const [selectedPortion, setSelectedPortion] = useState(1);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [waterLog, setWaterLog] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "all">("all");
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("jenn-nutrition-entries");
    const savedWater = localStorage.getItem("jenn-water-log");

    if (savedEntries) {
      try {
        setFoodEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Failed to parse nutrition entries:", e);
      }
    }

    if (savedWater) {
      try {
        setWaterLog(JSON.parse(savedWater));
      } catch (e) {
        console.error("Failed to parse water log:", e);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jenn-nutrition-entries", JSON.stringify(foodEntries));
    }
  }, [foodEntries, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("jenn-water-log", JSON.stringify(waterLog));
    }
  }, [waterLog, isLoaded]);

  // Filter entries for selected date
  const todayEntries = useMemo(() => {
    return foodEntries.filter((e) => e.date === selectedDate);
  }, [foodEntries, selectedDate]);

  // Calculate totals
  const dailyTotals = useMemo(() => {
    return todayEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
        carbs: acc.carbs + e.carbs,
        fat: acc.fat + e.fat,
        fiber: acc.fiber + (e.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [todayEntries]);

  // Goals (could be customizable)
  const goals = { calories: 2000, protein: 100, carbs: 250, fat: 65, fiber: 30 };

  // Water for today
  const todayWater = waterLog[selectedDate] || 0;

  // Add food entry
  const addFoodEntry = (food: FoodItem) => {
    const entry: FoodEntry = {
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: food.name,
      calories: Math.round(food.calories * selectedPortion),
      protein: Math.round(food.protein * selectedPortion * 10) / 10,
      carbs: Math.round(food.carbs * selectedPortion * 10) / 10,
      fat: Math.round(food.fat * selectedPortion * 10) / 10,
      fiber: Math.round(food.fiber * selectedPortion * 10) / 10,
      mealType: selectedMeal,
      portion: selectedPortion,
      portionUnit: food.servingSize,
      date: selectedDate,
      timestamp: new Date().toISOString(),
    };
    setFoodEntries((prev) => [entry, ...prev]);
  };

  // Delete entry
  const deleteEntry = (id: string) => {
    setFoodEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Water controls
  const addWater = () => {
    setWaterLog((prev) => ({ ...prev, [selectedDate]: (prev[selectedDate] || 0) + 1 }));
  };

  const removeWater = () => {
    setWaterLog((prev) => ({
      ...prev,
      [selectedDate]: Math.max(0, (prev[selectedDate] || 0) - 1),
    }));
  };

  // AI Analysis
  const runAnalysis = () => {
    if (todayEntries.length === 0) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const proteinRatio = dailyTotals.protein / goals.protein;
      const carbRatio = dailyTotals.carbs / goals.carbs;
      const fiberRatio = dailyTotals.fiber / goals.fiber;

      const strengths: string[] = [];
      const improvements: string[] = [];
      const runnerInsights: string[] = [];

      if (proteinRatio >= 0.8) strengths.push("Good protein intake for muscle recovery");
      else improvements.push("Consider adding more protein for optimal recovery");

      if (carbRatio >= 0.7) strengths.push("Adequate carb intake for energy");
      else improvements.push("Runners need carbs - aim for complex carbs pre-run");

      if (fiberRatio >= 0.8) strengths.push("Excellent fiber intake for gut health");
      else improvements.push("Add more fiber through vegetables and whole grains");

      if (todayWater >= 6) strengths.push("Great hydration habits");
      else improvements.push("Increase water intake - aim for 8+ glasses daily");

      // Check for specific foods
      const hasOmega3 = todayEntries.some(e =>
        e.name.toLowerCase().includes("salmon") ||
        e.name.toLowerCase().includes("walnut")
      );
      if (hasOmega3) {
        runnerInsights.push("Omega-3 rich foods detected - great for reducing inflammation");
      } else {
        runnerInsights.push("Consider adding omega-3 sources like salmon or walnuts");
      }

      const hasAntiInflammatory = todayEntries.some(e =>
        e.name.toLowerCase().includes("cherry") ||
        e.name.toLowerCase().includes("blueberr") ||
        e.name.toLowerCase().includes("spinach")
      );
      if (hasAntiInflammatory) {
        runnerInsights.push("Anti-inflammatory foods detected - excellent for recovery");
      }

      const hasPreRunCarbs = todayEntries.some(e =>
        (e.mealType === "breakfast" || e.mealType === "snacks") &&
        e.carbs > 20
      );
      if (hasPreRunCarbs) {
        runnerInsights.push("Good pre-run carb options in your log");
      } else {
        runnerInsights.push("Add complex carbs 2-3 hours before runs for optimal energy");
      }

      const score = Math.min(100, Math.round(
        (proteinRatio * 25) +
        (carbRatio * 25) +
        (fiberRatio * 20) +
        ((todayWater / 8) * 15) +
        (hasOmega3 ? 8 : 0) +
        (hasAntiInflammatory ? 7 : 0)
      ));

      setAnalysis({
        healthScore: score,
        strengths,
        improvements,
        runnerInsights,
        micronutrientHighlights: [
          { name: "Iron", status: todayEntries.some(e => e.name.toLowerCase().includes("spinach") || e.name.toLowerCase().includes("lentil")) ? "good" : "low", note: todayEntries.some(e => e.name.toLowerCase().includes("spinach")) ? "From greens" : "Add leafy greens" },
          { name: "Potassium", status: todayEntries.some(e => e.name.toLowerCase().includes("banana") || e.name.toLowerCase().includes("sweet potato")) ? "good" : "low", note: "Important for cramps" },
          { name: "Magnesium", status: todayEntries.some(e => e.name.toLowerCase().includes("almond") || e.name.toLowerCase().includes("spinach")) ? "good" : "low", note: "Supports muscles" },
          { name: "Vitamin D", status: todayEntries.some(e => e.name.toLowerCase().includes("salmon") || e.name.toLowerCase().includes("egg")) ? "good" : "low", note: "Bone health" },
        ],
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  // Filter database by category
  const filteredDatabase = useMemo(() => {
    if (selectedCategory === "all") return HEALTHY_FOODS_DATABASE;
    return HEALTHY_FOODS_DATABASE.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Nutrition Tracking</p>
            <h1 className="light-bg-header text-3xl md:text-4xl mb-4">Fuel Your Runs</h1>
            <p className="light-bg-body leading-relaxed">
              Log meals, track macros, and get AI-powered insights tailored for marathon training.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Date & Controls */}
      <section className="py-6 bg-ivory sticky top-0 z-10 border-b border-sage/10">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-deep-forest/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-cream border border-sage/20 rounded-lg text-sm text-deep-forest focus:outline-none focus:border-sage"
              />
            </div>

            {/* Meal Selector */}
            <div className="flex items-center gap-1 bg-cream rounded-lg p-1">
              {(["breakfast", "lunch", "dinner", "snacks"] as MealType[]).map((meal) => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                    selectedMeal === meal
                      ? "bg-sage text-ivory"
                      : "text-deep-forest/60 hover:bg-sage/10"
                  }`}
                >
                  {MEAL_ICONS[meal]}
                  {meal}
                </button>
              ))}
            </div>

            {/* Portion Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-deep-forest/60">Portion:</span>
              <select
                value={selectedPortion}
                onChange={(e) => setSelectedPortion(Number(e.target.value))}
                className="px-2 py-1.5 bg-cream border border-sage/20 rounded-lg text-sm text-deep-forest focus:outline-none focus:border-sage"
              >
                {PORTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}x
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Food Logging */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Food Entry */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <div>
                <p className="light-bg-label text-xs mb-3">Search Foods</p>
                <FoodSearch onSelect={addFoodEntry} />
              </div>

              {/* Quick Add */}
              <div>
                <p className="light-bg-label text-xs mb-3">Quick Add</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ADD_FOODS.map((food) => (
                    <QuickAddButton
                      key={food.name}
                      food={food}
                      onClick={() => addFoodEntry(food)}
                    />
                  ))}
                </div>
              </div>

              {/* Today's Log */}
              <div className="bg-white rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="light-bg-header text-lg">
                    {selectedDate === new Date().toISOString().split("T")[0] ? "Today's" : "Logged"} Foods
                  </h3>
                  <span className="text-sm text-deep-forest/50">{todayEntries.length} items</span>
                </div>

                {todayEntries.length === 0 ? (
                  <p className="text-sm text-deep-forest/40 italic py-8 text-center">
                    No foods logged yet. Use quick add or search above.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {/* Group by meal */}
                    {(["breakfast", "lunch", "dinner", "snacks"] as MealType[]).map((meal) => {
                      const mealEntries = todayEntries.filter((e) => e.mealType === meal);
                      if (mealEntries.length === 0) return null;
                      return (
                        <div key={meal} className="mb-4">
                          <p className="text-xs text-deep-forest/60 uppercase tracking-wide mb-2 capitalize flex items-center gap-2">
                            {MEAL_ICONS[meal]}
                            {meal}
                          </p>
                          <div className="space-y-2">
                            {mealEntries.map((entry) => (
                              <FoodEntryCard
                                key={entry.id}
                                entry={entry}
                                onDelete={() => deleteEntry(entry.id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Calorie Ring */}
              <div className="bg-white rounded-xl p-5">
                <p className="light-bg-label text-xs mb-4 text-center">Daily Calories</p>
                <CalorieRing current={Math.round(dailyTotals.calories)} goal={goals.calories} />
              </div>

              {/* Macros */}
              <div className="bg-white rounded-xl p-5 space-y-4">
                <p className="light-bg-label text-xs">Macronutrients</p>
                <MacroBar label="Protein" current={dailyTotals.protein} goal={goals.protein} color="bg-red-400" />
                <MacroBar label="Carbs" current={dailyTotals.carbs} goal={goals.carbs} color="bg-amber-400" />
                <MacroBar label="Fat" current={dailyTotals.fat} goal={goals.fat} color="bg-blue-400" />
                <MacroBar label="Fiber" current={dailyTotals.fiber} goal={goals.fiber} color="bg-emerald-400" />
              </div>

              {/* Water */}
              <WaterTracker glasses={todayWater} onAdd={addWater} onRemove={removeWater} />
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* AI Analysis */}
      <section className="py-12 bg-sage/10">
        <div className="container-editorial">
          <p className="light-bg-label mb-6">AI Evaluation</p>
          <AIAnalysisPanel
            entries={todayEntries}
            onAnalyze={runAnalysis}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </section>

      <hr className="rule" />

      {/* Healthy Foods Database */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="light-bg-label">Healthy Foods Database</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-deep-forest text-ivory"
                    : "bg-sand text-deep-forest"
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_COLORS) as FoodCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? "bg-deep-forest text-ivory"
                      : CATEGORY_COLORS[cat]
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredDatabase.map((food) => (
              <FoodDatabaseCard key={food.name} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Meal Planner - PROMINENT HERO SECTION */}
      <section className="py-12" style={{ backgroundColor: '#2A3C24' }}>
        <div className="container-editorial">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#FABF34' }}>Your Personalized Plan</p>
              <h2 className="text-3xl" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                Weekly Meal Planner
              </h2>
              <p className="text-sm mt-2" style={{ color: '#FFF5EB99' }}>
                Click any meal to customize. Vitamin D-rich options highlighted based on your blood work.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#FABF3420', color: '#FABF34' }}>
                Personalized
              </span>
              <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#97A97C20', color: '#97A97C' }}>
                Blood-Test Optimized
              </span>
            </div>
          </div>

          {/* Blood Test Insights Panel */}
          <div className="mb-6">
            <BloodTestInsights />
          </div>

          {/* Quick Jump to Planner */}
          <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#FFF5EB10', border: '1px dashed #FFF5EB30' }}>
            <p className="text-sm" style={{ color: '#FFF5EB' }}>
              <span style={{ color: '#FABF34' }}>Tip:</span> Meals marked with &quot;(Vitamin D)&quot; help address your insufficiency.
              Aim for 3-4 Vitamin D-rich meals per week.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Blueprint Meals */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <div className="mb-6">
            <p className="light-bg-label mb-2">Reliable Meals</p>
            <h2 className="text-2xl text-deep-forest" style={{ fontFamily: 'var(--font-instrument)' }}>
              Blueprint-Style Nutrition
            </h2>
            <p className="text-sm text-deep-forest/60 mt-2">
              Science-backed meals from Bryan Johnson&apos;s Blueprint, adapted for pescatarian runners.
            </p>
          </div>
          <BlueprintMeals />
        </div>
      </section>

      <hr className="rule" />

      {/* Runner Recommendations */}
      <section className="py-12 bg-ivory">
        <div className="container-editorial">
          <p className="light-bg-label mb-6">Runner Profile Recommendations</p>
          <RunnerRecommendations />
        </div>
      </section>

      <hr className="rule" />

      {/* Back Link */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">
            &larr; Back to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
