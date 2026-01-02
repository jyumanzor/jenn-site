const fs = require('fs');
const path = require('path');

// Paths
const OURA_DATA_PATH = '/Users/jennumanzor/Desktop/~Working/~BUILDS/Personal/Jenn\'s Site/Running/oura_extracted/App Data';
const OUTPUT_PATH = '/Users/jennumanzor/Desktop/~Working/~BUILDS/Personal/Jenn\'s Site/website/data/oura-full.json';

// Helper to parse CSV
function parseCSV(content, delimiter = ';') {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(delimiter);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter);
    const row = {};
    headers.forEach((header, idx) => {
      let value = values[idx];
      // Try to parse JSON objects
      if (value && value.startsWith('{')) {
        try {
          value = JSON.parse(value);
        } catch (e) {}
      }
      // Try to parse numbers
      else if (value && !isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      row[header] = value;
    });
    rows.push(row);
  }
  return rows;
}

// Read and parse all CSV files
function readCSV(filename) {
  const filePath = path.join(OURA_DATA_PATH, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseCSV(content);
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
    return [];
  }
}

// Main parsing function
function parseOuraData() {
  console.log('Parsing Oura data...');

  // Read all CSV files
  const dailySleep = readCSV('dailysleep.csv');
  const dailyReadiness = readCSV('dailyreadiness.csv');
  const dailyActivity = readCSV('dailyactivity.csv');
  const workouts = readCSV('workout.csv');
  const vo2max = readCSV('vo2max.csv');
  const heartrate = readCSV('heartrate.csv');
  const dailyStress = readCSV('dailystress.csv');

  console.log(`Loaded: ${dailySleep.length} sleep records, ${dailyReadiness.length} readiness records, ${workouts.length} workouts, ${vo2max.length} VO2max records`);

  // Create daily data map
  const dailyData = {};

  // Process sleep data
  dailySleep.forEach(row => {
    const date = row.day;
    if (!date) return;

    if (!dailyData[date]) {
      dailyData[date] = { date };
    }

    dailyData[date].sleepScore = row.score;
    dailyData[date].sleepContributors = row.contributors;
  });

  // Process readiness data
  dailyReadiness.forEach(row => {
    const date = row.day;
    if (!date) return;

    if (!dailyData[date]) {
      dailyData[date] = { date };
    }

    dailyData[date].readinessScore = row.score;
    dailyData[date].readinessContributors = row.contributors;
    dailyData[date].temperatureDeviation = row.temperature_deviation;
  });

  // Process activity data
  dailyActivity.forEach(row => {
    const date = row.day;
    if (!date) return;

    if (!dailyData[date]) {
      dailyData[date] = { date };
    }

    dailyData[date].activityScore = row.score;
    dailyData[date].steps = row.steps;
    dailyData[date].activeCalories = row.active_calories;
    dailyData[date].totalCalories = row.total_calories;
    dailyData[date].targetCalories = row.target_calories;
    dailyData[date].meetDailyTargets = row.meet_daily_targets;
    dailyData[date].moveEveryHour = row.move_every_hour;
    dailyData[date].recoveryTime = row.recovery_time;
    dailyData[date].highActivityTime = row.high_activity_time;
    dailyData[date].mediumActivityTime = row.medium_activity_time;
    dailyData[date].lowActivityTime = row.low_activity_time;
    dailyData[date].sedentaryTime = row.sedentary_time;
    dailyData[date].restingTime = row.resting_time;
    dailyData[date].inactiveTime = row.inactive_time;
    dailyData[date].activityContributors = row.contributors;
  });

  // Process VO2max
  vo2max.forEach(row => {
    const date = row.day;
    if (!date) return;

    if (!dailyData[date]) {
      dailyData[date] = { date };
    }

    dailyData[date].vo2max = row.vo2_max;
  });

  // Process workouts
  const workoutsByDate = {};
  workouts.forEach(row => {
    const date = row.day;
    if (!date) return;

    if (!workoutsByDate[date]) {
      workoutsByDate[date] = [];
    }

    workoutsByDate[date].push({
      activity: row.activity,
      calories: row.calories,
      distance: row.distance,
      startTime: row.start_datetime,
      endTime: row.end_datetime,
      intensity: row.intensity,
      source: row.source
    });

    if (!dailyData[date]) {
      dailyData[date] = { date };
    }
    dailyData[date].workouts = workoutsByDate[date];
  });

  // Convert to sorted array
  const dailyArray = Object.values(dailyData)
    .filter(d => d.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log(`Total daily records: ${dailyArray.length}`);

  // Calculate weekly aggregates
  const weeklyData = {};
  dailyArray.forEach(day => {
    const date = new Date(day.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        weekStart: weekKey,
        days: [],
        sleepScores: [],
        readinessScores: [],
        activityScores: [],
        steps: [],
        activeCalories: [],
        workoutCount: 0,
        workoutMinutes: 0,
        workoutCalories: 0,
        workoutDistance: 0
      };
    }

    weeklyData[weekKey].days.push(day);
    if (day.sleepScore) weeklyData[weekKey].sleepScores.push(day.sleepScore);
    if (day.readinessScore) weeklyData[weekKey].readinessScores.push(day.readinessScore);
    if (day.activityScore) weeklyData[weekKey].activityScores.push(day.activityScore);
    if (day.steps) weeklyData[weekKey].steps.push(day.steps);
    if (day.activeCalories) weeklyData[weekKey].activeCalories.push(day.activeCalories);

    if (day.workouts) {
      weeklyData[weekKey].workoutCount += day.workouts.length;
      day.workouts.forEach(w => {
        if (w.calories) weeklyData[weekKey].workoutCalories += w.calories;
        if (w.distance) weeklyData[weekKey].workoutDistance += w.distance;
      });
    }
  });

  // Calculate weekly averages
  const weeklyArray = Object.values(weeklyData).map(week => ({
    weekStart: week.weekStart,
    avgSleepScore: week.sleepScores.length ? Math.round(week.sleepScores.reduce((a, b) => a + b, 0) / week.sleepScores.length) : null,
    avgReadinessScore: week.readinessScores.length ? Math.round(week.readinessScores.reduce((a, b) => a + b, 0) / week.readinessScores.length) : null,
    avgActivityScore: week.activityScores.length ? Math.round(week.activityScores.reduce((a, b) => a + b, 0) / week.activityScores.length) : null,
    totalSteps: week.steps.reduce((a, b) => a + b, 0),
    avgSteps: week.steps.length ? Math.round(week.steps.reduce((a, b) => a + b, 0) / week.steps.length) : 0,
    totalActiveCalories: week.activeCalories.reduce((a, b) => a + b, 0),
    avgActiveCalories: week.activeCalories.length ? Math.round(week.activeCalories.reduce((a, b) => a + b, 0) / week.activeCalories.length) : 0,
    workoutCount: week.workoutCount,
    workoutCalories: Math.round(week.workoutCalories),
    workoutDistance: Math.round(week.workoutDistance),
    daysTracked: week.days.length
  })).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));

  // Calculate monthly aggregates
  const monthlyData = {};
  dailyArray.forEach(day => {
    const monthKey = day.date.substring(0, 7); // YYYY-MM

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        sleepScores: [],
        readinessScores: [],
        activityScores: [],
        steps: [],
        activeCalories: [],
        workoutCount: 0,
        workoutCalories: 0,
        workoutDistance: 0,
        vo2maxValues: []
      };
    }

    if (day.sleepScore) monthlyData[monthKey].sleepScores.push(day.sleepScore);
    if (day.readinessScore) monthlyData[monthKey].readinessScores.push(day.readinessScore);
    if (day.activityScore) monthlyData[monthKey].activityScores.push(day.activityScore);
    if (day.steps) monthlyData[monthKey].steps.push(day.steps);
    if (day.activeCalories) monthlyData[monthKey].activeCalories.push(day.activeCalories);
    if (day.vo2max) monthlyData[monthKey].vo2maxValues.push(day.vo2max);

    if (day.workouts) {
      monthlyData[monthKey].workoutCount += day.workouts.length;
      day.workouts.forEach(w => {
        if (w.calories) monthlyData[monthKey].workoutCalories += w.calories;
        if (w.distance) monthlyData[monthKey].workoutDistance += w.distance;
      });
    }
  });

  const monthlyArray = Object.values(monthlyData).map(month => ({
    month: month.month,
    avgSleepScore: month.sleepScores.length ? Math.round(month.sleepScores.reduce((a, b) => a + b, 0) / month.sleepScores.length) : null,
    avgReadinessScore: month.readinessScores.length ? Math.round(month.readinessScores.reduce((a, b) => a + b, 0) / month.readinessScores.length) : null,
    avgActivityScore: month.activityScores.length ? Math.round(month.activityScores.reduce((a, b) => a + b, 0) / month.activityScores.length) : null,
    totalSteps: month.steps.reduce((a, b) => a + b, 0),
    avgSteps: month.steps.length ? Math.round(month.steps.reduce((a, b) => a + b, 0) / month.steps.length) : 0,
    totalActiveCalories: month.activeCalories.reduce((a, b) => a + b, 0),
    avgActiveCalories: month.activeCalories.length ? Math.round(month.activeCalories.reduce((a, b) => a + b, 0) / month.activeCalories.length) : 0,
    workoutCount: month.workoutCount,
    workoutCalories: Math.round(month.workoutCalories),
    workoutDistance: Math.round(month.workoutDistance),
    avgVo2max: month.vo2maxValues.length ? Math.round(month.vo2maxValues.reduce((a, b) => a + b, 0) / month.vo2maxValues.length) : null,
    daysTracked: month.sleepScores.length
  })).sort((a, b) => a.month.localeCompare(b.month));

  // Calculate yearly aggregates
  const yearlyData = {};
  dailyArray.forEach(day => {
    const yearKey = day.date.substring(0, 4);

    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = {
        year: yearKey,
        sleepScores: [],
        readinessScores: [],
        activityScores: [],
        steps: [],
        activeCalories: [],
        workoutCount: 0,
        workoutCalories: 0,
        workoutDistance: 0,
        workoutMinutes: 0,
        activeDays: 0,
        vo2maxValues: []
      };
    }

    if (day.sleepScore) yearlyData[yearKey].sleepScores.push(day.sleepScore);
    if (day.readinessScore) yearlyData[yearKey].readinessScores.push(day.readinessScore);
    if (day.activityScore) yearlyData[yearKey].activityScores.push(day.activityScore);
    if (day.steps) yearlyData[yearKey].steps.push(day.steps);
    if (day.activeCalories) yearlyData[yearKey].activeCalories.push(day.activeCalories);
    if (day.vo2max) yearlyData[yearKey].vo2maxValues.push(day.vo2max);

    if (day.workouts && day.workouts.length > 0) {
      yearlyData[yearKey].activeDays++;
      yearlyData[yearKey].workoutCount += day.workouts.length;
      day.workouts.forEach(w => {
        if (w.calories) yearlyData[yearKey].workoutCalories += w.calories;
        if (w.distance) yearlyData[yearKey].workoutDistance += w.distance;
      });
    }
  });

  const yearlyArray = Object.values(yearlyData).map(year => ({
    year: year.year,
    avgSleepScore: year.sleepScores.length ? Math.round(year.sleepScores.reduce((a, b) => a + b, 0) / year.sleepScores.length) : null,
    avgReadinessScore: year.readinessScores.length ? Math.round(year.readinessScores.reduce((a, b) => a + b, 0) / year.readinessScores.length) : null,
    avgActivityScore: year.activityScores.length ? Math.round(year.activityScores.reduce((a, b) => a + b, 0) / year.activityScores.length) : null,
    totalSteps: year.steps.reduce((a, b) => a + b, 0),
    avgSteps: year.steps.length ? Math.round(year.steps.reduce((a, b) => a + b, 0) / year.steps.length) : 0,
    totalActiveCalories: year.activeCalories.reduce((a, b) => a + b, 0),
    avgActiveCalories: year.activeCalories.length ? Math.round(year.activeCalories.reduce((a, b) => a + b, 0) / year.activeCalories.length) : 0,
    workoutCount: year.workoutCount,
    workoutCalories: Math.round(year.workoutCalories),
    workoutDistance: Math.round(year.workoutDistance),
    activeDays: year.activeDays,
    activeDaysPercent: Math.round((year.activeDays / year.sleepScores.length) * 100),
    avgVo2max: year.vo2maxValues.length ? Math.round(year.vo2maxValues.reduce((a, b) => a + b, 0) / year.vo2maxValues.length) : null,
    daysTracked: year.sleepScores.length
  })).sort((a, b) => a.year.localeCompare(b.year));

  // Process workout types summary
  const workoutsByType = {};
  workouts.forEach(w => {
    const type = w.activity || 'other';
    if (!workoutsByType[type]) {
      workoutsByType[type] = {
        activity: type,
        count: 0,
        totalCalories: 0,
        totalDistance: 0
      };
    }
    workoutsByType[type].count++;
    if (w.calories) workoutsByType[type].totalCalories += w.calories;
    if (w.distance) workoutsByType[type].totalDistance += w.distance;
  });

  const workoutSummary = Object.values(workoutsByType)
    .map(w => ({
      ...w,
      totalCalories: Math.round(w.totalCalories),
      totalDistance: Math.round(w.totalDistance)
    }))
    .sort((a, b) => b.count - a.count);

  // Get all VO2max readings
  const vo2maxReadings = vo2max.map(v => ({
    date: v.day,
    value: v.vo2_max
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate overall stats
  const allSleepScores = dailyArray.filter(d => d.sleepScore).map(d => d.sleepScore);
  const allReadinessScores = dailyArray.filter(d => d.readinessScore).map(d => d.readinessScore);
  const allActivityScores = dailyArray.filter(d => d.activityScore).map(d => d.activityScore);
  const allSteps = dailyArray.filter(d => d.steps).map(d => d.steps);

  const overallStats = {
    dateRange: {
      start: dailyArray[0]?.date,
      end: dailyArray[dailyArray.length - 1]?.date,
      totalDays: dailyArray.length
    },
    sleep: {
      avgScore: Math.round(allSleepScores.reduce((a, b) => a + b, 0) / allSleepScores.length),
      minScore: Math.min(...allSleepScores),
      maxScore: Math.max(...allSleepScores)
    },
    readiness: {
      avgScore: Math.round(allReadinessScores.reduce((a, b) => a + b, 0) / allReadinessScores.length),
      minScore: Math.min(...allReadinessScores),
      maxScore: Math.max(...allReadinessScores)
    },
    activity: {
      avgScore: allActivityScores.length ? Math.round(allActivityScores.reduce((a, b) => a + b, 0) / allActivityScores.length) : null,
      avgSteps: Math.round(allSteps.reduce((a, b) => a + b, 0) / allSteps.length),
      totalSteps: allSteps.reduce((a, b) => a + b, 0)
    },
    workouts: {
      totalCount: workouts.length,
      totalCalories: Math.round(workouts.reduce((a, b) => a + (b.calories || 0), 0)),
      totalDistance: Math.round(workouts.reduce((a, b) => a + (b.distance || 0), 0))
    },
    vo2max: {
      latest: vo2maxReadings[vo2maxReadings.length - 1]?.value,
      latestDate: vo2maxReadings[vo2maxReadings.length - 1]?.date,
      min: Math.min(...vo2maxReadings.map(v => v.value)),
      max: Math.max(...vo2maxReadings.map(v => v.value))
    }
  };

  // Build final output
  const output = {
    metadata: {
      generated: new Date().toISOString(),
      source: 'Oura Ring App Export',
      dataPath: OURA_DATA_PATH
    },
    overallStats,
    daily: dailyArray,
    weekly: weeklyArray,
    monthly: monthlyArray,
    yearly: yearlyArray,
    workoutSummary,
    vo2maxHistory: vo2maxReadings,
    workouts: workouts.map(w => ({
      date: w.day,
      activity: w.activity,
      calories: w.calories,
      distance: w.distance,
      startTime: w.start_datetime,
      endTime: w.end_datetime
    })).sort((a, b) => new Date(b.date) - new Date(a.date))
  };

  return output;
}

// Run
const data = parseOuraData();
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
console.log(`Output written to ${OUTPUT_PATH}`);
console.log('Done!');
