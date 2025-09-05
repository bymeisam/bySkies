/**
 * Enhanced Activity Suggestions Engine for BySkies
 *
 * This module provides intelligent activity recommendations based on:
 * - Current weather conditions
 * - Forecast data analysis
 * - Air quality measurements
 * - Time-based planning
 * - Weather trend analysis
 */

// Core utilities for intelligent activity suggestions

import type {
  ForecastResponse,
  ForecastListItem,
  ActivitySuggestion,
  SuggestionResult,
  WeatherConditions,
  PlanningDisruptionAlert,
  AirQualityAlert,
} from "@repo/types";

/**
 * Analyze forecast data for planning disruptions.
 * Detects temp drops >10°C, wind >25km/h, heavy rain >5mm/3h.
 * Returns PlanningDisruptionAlert[].
 */
function analyzePlanningDisruptions(
  forecast: ForecastResponse,
): PlanningDisruptionAlert[] {
  const alerts: PlanningDisruptionAlert[] = [];
  const list = forecast.list;
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1];
    const curr = list[i];
    if (!prev || !curr) continue;

    // Temperature drop
    if (
      typeof prev.main.temp === "number" &&
      typeof curr.main.temp === "number" &&
      prev.main.temp - curr.main.temp > 10
    ) {
      alerts.push({
        type: "weather",
        message: `Significant temperature drop after ${curr.dt_txt}: ${prev.main.temp}°C → ${curr.main.temp}°C. Consider indoor plans.`,
        severity: "moderate",
        affectedActivities: ["Outdoor"],
        start: curr.dt_txt,
      });
    }

    // High wind
    if (typeof curr.wind.speed === "number" && curr.wind.speed > 25) {
      alerts.push({
        type: "weather",
        message: `Strong winds (${curr.wind.speed}km/h) expected after ${curr.dt_txt}. Outdoor activities may be disrupted.`,
        severity: "moderate",
        affectedActivities: ["Outdoor", "Cycling", "Running"],
        start: curr.dt_txt,
      });
    }

    // Heavy rain
    if (curr.rain?.["3h"] && curr.rain["3h"] > 5) {
      alerts.push({
        type: "weather",
        message: `Heavy rain (${curr.rain["3h"]}mm/3h) expected after ${curr.dt_txt}. Consider indoor alternatives.`,
        severity: "moderate",
        affectedActivities: ["Outdoor", "Dining", "Running"],
        start: curr.dt_txt,
      });
    }
  }
  return alerts;
}

/**
 * Generate air quality alerts and trend analysis.
 * Returns AirQualityAlert[].
 */
function generateAirQualityAlerts(
  aqiHistory: number[],
  currentAqi: number,
  time: string,
): AirQualityAlert[] {
  const alerts: AirQualityAlert[] = [];
  // Alert if AQI > 3
  if (currentAqi > 3) {
    alerts.push({
      type: "air",
      aqi: currentAqi,
      message: "Air quality poor - consider indoor exercise instead.",
      trend: "stable",
      start: time,
    });
  }
  // Trend analysis
  if (aqiHistory.length >= 2) {
    const prevAqi = aqiHistory[aqiHistory.length - 2];
    let trend: "improving" | "worsening" | "stable" = "stable";
    if (typeof prevAqi === "number") {
      if (currentAqi > prevAqi) trend = "worsening";
      else if (currentAqi < prevAqi) trend = "improving";
    }
    alerts.push({
      type: "air",
      aqi: currentAqi,
      message:
        trend === "worsening"
          ? "Air quality is worsening - consider limiting outdoor activities."
          : trend === "improving"
            ? "Air quality is improving."
            : "Air quality stable.",
      trend,
      start: time,
    });
  }
  return alerts;
}

// Helper to extract WeatherConditions from ForecastListItem
function extractConditions(
  item: ForecastListItem,
  aqi: number,
): WeatherConditions {
  return {
    temp: item.main.temp,
    feels_like: item.main.feels_like,
    wind_speed: item.wind.speed,
    cloud_cover: item.clouds.all,
    precipitation: item.rain?.["3h"] ?? 0,
    precipitation_type: item.rain ? "rain" : undefined,
    aqi,
    visibility: 10000, // Placeholder, OpenWeatherMap forecast API does not provide visibility
    time_of_day: getTimeOfDay(item.dt_txt),
  };
}

function getTimeOfDay(dt_txt: string): string {
  const hour = new Date(dt_txt).getHours();
  if (hour >= 6 && hour < 18) return "day";
  return "night";
}

// Advanced suggestion engine using forecast intervals
/**
 * Generate planning-focused alerts from forecast and AQI.
 */
function generatePlanningAlerts(
  forecast: ForecastResponse,
  aqiHistory: number[],
  currentAqi: number,
  time: string,
): (PlanningDisruptionAlert | AirQualityAlert)[] {
  const weatherAlerts = analyzePlanningDisruptions(forecast);
  const airAlerts = generateAirQualityAlerts(aqiHistory, currentAqi, time);
  return [...weatherAlerts, ...airAlerts];
}

// Enhanced suggestions with agricultural intelligence
import type { AgriculturalForecast } from '../api/weather/open-meteo';
import { generateAgriculturalSuggestions } from './agricultural';

// Helper function to generate proper end times (2-3 hours from start)
function generateEndTime(startTime: string): string {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
  return end.toISOString();
}

export interface EnhancedSuggestionResult extends SuggestionResult {
  smart_suggestions?: import('@repo/ui').SmartActivitySuggestion[];
}

export function suggestActivitiesFromForecast(
  forecast: ForecastResponse,
  aqi: number, // Assume AQI is provided externally for now
  aqiHistory: number[] = [],
  time: string = "",
  agriculturalForecast?: AgriculturalForecast,
  locationName?: string,
): EnhancedSuggestionResult {
  const suggestions: ActivitySuggestion[] = [];
  const list = forecast.list;

  // Activity categories and triggers
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item) continue;
    const conditions = extractConditions(item, aqi);

    // Defensive checks for undefined values
    if (
      typeof conditions.precipitation === "undefined" ||
      typeof conditions.temp === "undefined" ||
      typeof conditions.wind_speed === "undefined" ||
      typeof conditions.aqi === "undefined"
    ) {
      continue;
    }

    // Running/Cycling
    if (
      conditions.temp >= 10 &&
      conditions.temp <= 25 &&
      conditions.wind_speed < 15 &&
      conditions.precipitation < 0.2 &&
      conditions.aqi <= 3
    ) {
      // Check if rain is expected soon
      let rainSoon = false;
      for (let j = i + 1; j < Math.min(i + 2, list.length); j++) {
        if (
          list[j] &&
          list[j]?.rain &&
          list[j]?.rain?.["3h"] &&
          list[j]?.rain?.["3h"]! > 0
        )
          rainSoon = true;
      }
      const nextItem = list && list[Math.min(i + 1, list.length - 1)];
      suggestions.push({
        activity: "Running",
        description: `Perfect for running in next 3 hours${rainSoon ? ", rain expected later" : ""}`,
        confidence: 1,
        reasons: [
          `Comfortable ${conditions.temp ?? 0}°C`,
          `Gentle ${conditions.wind_speed ?? 0}km/h breeze`,
          `Rain chance ${(conditions.precipitation ?? 0) * 100}%`,
          `Air quality ${(conditions.aqi ?? 0) <= 2 ? "good" : "moderate"}`,
        ],
        start: item.dt_txt ?? "",
        end:
          nextItem && typeof nextItem.dt_txt === "string"
            ? nextItem.dt_txt
            : generateEndTime(item.dt_txt ?? ""),
      });
    }

    // Outdoor dining
    if (
      conditions.temp >= 15 &&
      conditions.temp <= 28 &&
      conditions.wind_speed < 10 &&
      conditions.precipitation === 0
    ) {
      let rainNext3h = false;
      for (let j = i + 1; j < Math.min(i + 2, list.length); j++) {
        if (
          list[j] &&
          list[j]?.rain &&
          list[j]?.rain?.["3h"] &&
          list[j]?.rain?.["3h"]! > 0
        )
          rainNext3h = true;
      }
      if (!rainNext3h) {
        const nextItem = list && list[Math.min(i + 1, list.length - 1)];
        suggestions.push({
          activity: "Outdoor Dining",
          description: `Great for outdoor dining: ${conditions.temp ?? 0}°C, calm wind, no rain next 3 hours`,
          confidence: 1,
          reasons: [
            `Comfortable temperature`,
            `Wind ${conditions.wind_speed ?? 0}km/h`,
            `No rain expected`,
          ],
          start: item.dt_txt ?? "",
          end:
            nextItem && typeof nextItem.dt_txt === "string"
              ? nextItem.dt_txt
              : (item.dt_txt ?? ""),
        });
      }
    }

    // Photography
    if (
      conditions.cloud_cover >= 30 &&
      conditions.cloud_cover <= 70 &&
      getTimeOfDay(item.dt_txt) === "day"
    ) {
      const nextItem = list && list[Math.min(i + 1, list.length - 1)];
      suggestions.push({
        activity: "Photography",
        description: `Interesting clouds (${conditions.cloud_cover ?? 0}%), good daylight`,
        confidence: 1,
        reasons: [`Cloud cover ${conditions.cloud_cover ?? 0}%`, `Daytime`],
        start: item.dt_txt ?? "",
        end:
          nextItem && typeof nextItem.dt_txt === "string"
            ? nextItem.dt_txt
            : generateEndTime(item.dt_txt ?? ""),
      });
    }

    // Air quality sensitive activities
    if (conditions.aqi <= 2) {
      const nextItem = list && list[Math.min(i + 1, list.length - 1)];
      suggestions.push({
        activity: "Air Quality Sensitive",
        description: `Air quality good (AQI ${conditions.aqi ?? 0})`,
        confidence: 1,
        reasons: [`AQI ≤2`],
        start: item.dt_txt ?? "",
        end:
          nextItem && typeof nextItem.dt_txt === "string"
            ? nextItem.dt_txt
            : generateEndTime(item.dt_txt ?? ""),
      });
    }
  }

  // Weather transition analysis (example: find windows between rain)
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1];
    const curr = list[i];
    if (!prev || !curr) continue;
    if ((prev.rain?.["3h"] ?? 0) > 0 && (curr.rain?.["3h"] ?? 0) === 0) {
      const nextItem = list && list[Math.min(i + 1, list.length - 1)];
      suggestions.push({
        activity: "Post-Rain Outdoor",
        description: `Rain ending at ${curr.dt_txt ?? ""}, outdoor activities possible`,
        confidence: 0.8,
        reasons: ["Rain transition", "Dry window opening"],
        start: curr.dt_txt ?? "",
        end:
          nextItem && typeof nextItem.dt_txt === "string"
            ? nextItem.dt_txt
            : generateEndTime(curr.dt_txt ?? ""),
      });
    }
  }

  // Generate agricultural suggestions if data is available
  let smartSuggestions;
  if (agriculturalForecast && locationName) {
    try {
      smartSuggestions = generateAgriculturalSuggestions({
        current_time: time,
        location_name: locationName,
        agricultural_forecast: agriculturalForecast
      });
    } catch (error) {
      console.warn('Failed to generate agricultural suggestions:', error);
      smartSuggestions = [];
    }
  }

  // Debug the first few regular suggestions
  console.log("🎯 REGULAR SUGGESTIONS:", suggestions.slice(0, 3).map(s => `${s.activity}: ${new Date(s.start).toLocaleTimeString()} - ${new Date(s.end).toLocaleTimeString()}`));

  return {
    suggestions,
    alerts: generatePlanningAlerts(forecast, aqiHistory, aqi, time),
    forecast: list,
    smart_suggestions: smartSuggestions,
  };
}
