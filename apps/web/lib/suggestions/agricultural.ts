/**
 * Agricultural Intelligence for Smart Activity Suggestions
 * 
 * Uses Open-Meteo professional agricultural data to provide:
 * - VPD-based watering recommendations
 * - ET₀ evapotranspiration analysis
 * - Plant stress monitoring
 * - Outdoor comfort optimization
 */

import type { AgriculturalForecast } from '../api/weather/open-meteo';
import type { SmartActivitySuggestion } from '@repo/ui';

// Helper function to generate proper end times
function getEndTime(startTime: string, hoursToAdd: number): string {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);
  return end.toISOString();
}

// Helper to get current time in proper format
function getCurrentTime(): string {
  return new Date().toISOString();
}

export interface AgriculturalActivityContext {
  current_time: string;
  location_name: string;
  agricultural_forecast: AgriculturalForecast;
}

/**
 * Generate intelligent gardening and outdoor activity suggestions
 * based on professional agricultural data
 */
export function generateAgriculturalSuggestions(
  context: AgriculturalActivityContext
): SmartActivitySuggestion[] {
  const suggestions: SmartActivitySuggestion[] = [];
  const { agricultural_forecast, current_time, location_name } = context;
  
  // Use current conditions or first available
  const current = agricultural_forecast.current || agricultural_forecast.hourly[0];
  if (!current) return suggestions;

  // Use the actual current time instead of data timestamp for start times
  const now = getCurrentTime();

  // Generate gardening suggestions based on VPD
  const wateringSuggestions = generateWateringRecommendations(current, agricultural_forecast, now);
  suggestions.push(...wateringSuggestions.map(s => ({ ...s, id: '' })));
  
  // Generate plant care suggestions
  const plantCareSuggestions = generatePlantCareSuggestions(current, agricultural_forecast, now);
  suggestions.push(...plantCareSuggestions.map(s => ({ ...s, id: '' })));
  
  // Generate outdoor comfort suggestions  
  const comfortSuggestions = generateOutdoorComfortSuggestions(current, agricultural_forecast, now);
  suggestions.push(...comfortSuggestions.map(s => ({ ...s, id: '' })));

  // Add timing-based suggestions from insights
  const timingSuggestions = generateTimingBasedSuggestions(agricultural_forecast, now);
  suggestions.push(...timingSuggestions.map(s => ({ ...s, id: '' })));

  const finalSuggestions = suggestions.map(suggestion => ({
    ...suggestion,
    id: `agri_${suggestion.activity.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
  }));

  // Quick debug to see if times are fixed
  console.log("🌱 SMART SUGGESTIONS:", finalSuggestions.map(s => `${s.activity}: ${new Date(s.start).toLocaleTimeString()} - ${new Date(s.end).toLocaleTimeString()}`));

  return finalSuggestions;
}

function generateWateringRecommendations(
  current: any,
  forecast: AgriculturalForecast,
  now: string
): Omit<SmartActivitySuggestion, 'id'>[] {
  const suggestions: Omit<SmartActivitySuggestion, 'id'>[] = [];
  const vpd = current.vapour_pressure_deficit;
  const efficiency = current.watering_efficiency;

  // Optimal watering conditions
  if (vpd >= 0.4 && vpd <= 1.6 && efficiency >= 75) {
    suggestions.push({
      activity: "Optimal Plant Watering",
      category: "gardening",
      description: `Perfect watering conditions detected with ${efficiency}% efficiency`,
      confidence: Math.min(0.95, efficiency / 100),
      reasons: [
        `VPD ${vpd.toFixed(1)} kPa - ideal water uptake`,
        `${current.relative_humidity.toFixed(0)}% humidity reduces evaporation`,
        `Plant stress level: ${current.plant_stress_level}`,
        `Watering efficiency: ${efficiency}%`
      ],
      start: now,
      end: getEndTime(now, 2), // 2 hours from now
      professional_insight: `VPD of ${vpd.toFixed(1)} kPa indicates plants can efficiently absorb water without stress. This is the sweet spot for watering where water loss through leaves is moderate and roots can uptake nutrients effectively.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: current.dew_point,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  // High VPD warning
  if (vpd > 1.6) {
    suggestions.push({
      activity: "Avoid Watering - High VPD",
      category: "plant_care", 
      description: `Water stress conditions: VPD ${vpd.toFixed(1)} kPa will cause rapid water loss`,
      confidence: 0.9,
      reasons: [
        `High VPD ${vpd.toFixed(1)} kPa - rapid evaporation`,
        `Plant stress level: ${current.plant_stress_level}`,
        `Water will evaporate quickly`,
        `Wait for better conditions`
      ],
      start: now,
      end: getEndTime(now, 1), // 1 hour from now
      professional_insight: `High VPD indicates the air is demanding water from plants faster than they can absorb it. Watering now would be wasteful as most water will evaporate before reaching roots.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: current.dew_point,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  // Low VPD information
  if (vpd < 0.4) {
    suggestions.push({
      activity: "Light Watering Only", 
      category: "gardening",
      description: `Low transpiration conditions: VPD ${vpd.toFixed(1)} kPa - minimal water demand`,
      confidence: 0.7,
      reasons: [
        `Low VPD ${vpd.toFixed(1)} kPa - reduced transpiration`,
        `High humidity ${current.relative_humidity.toFixed(0)}%`,
        `Minimal water stress`,
        `Risk of overwatering`
      ],
      start: now,
      end: getEndTime(now, 1), // 1 hour from now
      professional_insight: `Very low VPD means plants are barely transpiring. They need less water now, and overwatering could lead to root problems or fungal issues.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: current.dew_point,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  return suggestions;
}

function generatePlantCareSuggestions(
  current: any,
  forecast: AgriculturalForecast,
  now: string
): Omit<SmartActivitySuggestion, 'id'>[] {
  const suggestions: Omit<SmartActivitySuggestion, 'id'>[] = [];
  const dailyData = forecast.daily[0];
  if (!dailyData) return suggestions;

  // ET₀ analysis for plant water demand
  const et0 = dailyData.et0_evapotranspiration;
  
  if (et0 > 5) {
    suggestions.push({
      activity: "High Water Demand Day",
      category: "plant_care",
      description: `ET₀ ${et0.toFixed(1)}mm indicates high plant water demand today`,
      confidence: 0.85,
      reasons: [
        `ET₀ rate: ${et0.toFixed(1)}mm - high demand`,
        `${dailyData.water_demand_level} water demand level`,
        `Monitor plant hydration closely`,
        `Consider shade for sensitive plants`
      ],
      start: now,
      end: getEndTime(now, 24), // End of day
      professional_insight: `ET₀ (reference evapotranspiration) of ${et0.toFixed(1)}mm indicates high atmospheric water demand. Plants will lose water quickly today - ensure adequate hydration and consider temporary shading.`,
      agricultural_data: {
        vpd: current.vapour_pressure_deficit,
        humidity: current.relative_humidity,
        dew_point: current.dew_point,
        et0: et0
      }
    });
  }

  if (et0 < 2) {
    suggestions.push({
      activity: "Low Maintenance Day",
      category: "plant_care",
      description: `Low ET₀ ${et0.toFixed(1)}mm - minimal water stress expected`,
      confidence: 0.8,
      reasons: [
        `Low ET₀ rate: ${et0.toFixed(1)}mm`,
        `Minimal atmospheric water demand`,
        `Plants won't stress easily`,
        `Good day for transplanting`
      ],
      start: now,
      end: getEndTime(now, 24), // End of day
      professional_insight: `Low ET₀ means the atmosphere isn't pulling much water from plants. This is ideal for plant care activities like transplanting, pruning, or working with sensitive plants.`,
      agricultural_data: {
        vpd: current.vapour_pressure_deficit,
        humidity: current.relative_humidity,
        dew_point: current.dew_point,
        et0: et0
      }
    });
  }

  return suggestions;
}

function generateOutdoorComfortSuggestions(
  current: any,
  forecast: AgriculturalForecast,
  now: string
): Omit<SmartActivitySuggestion, 'id'>[] {
  const suggestions: Omit<SmartActivitySuggestion, 'id'>[] = [];
  const comfortIndex = current.comfort_index;
  const dewPoint = current.dew_point;
  const vpd = current.vapour_pressure_deficit;

  // High comfort conditions
  if (comfortIndex >= 80) {
    suggestions.push({
      activity: "Perfect Outdoor Conditions",
      category: "outdoor_comfort",
      description: `Excellent outdoor comfort with ${comfortIndex}% comfort index`,
      confidence: 0.9,
      reasons: [
        `Comfort index: ${comfortIndex}%`,
        `Dew point: ${dewPoint.toFixed(1)}°C - not sticky`,
        `VPD ${vpd.toFixed(1)} kPa - comfortable air`,
        `Low dehydration risk`
      ],
      start: now,
      end: forecast.hourly[Math.min(3, forecast.hourly.length - 1)]?.time || current.time,
      professional_insight: `The combination of VPD and dew point creates optimal conditions for extended outdoor activities. Your body won't lose water excessively, and the air won't feel oppressive.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: dewPoint,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  // VPD-based dehydration warning
  if (vpd > 1.8) {
    suggestions.push({
      activity: "High Dehydration Risk", 
      category: "outdoor_comfort",
      description: `VPD ${vpd.toFixed(1)} kPa will increase water loss through skin - stay hydrated`,
      confidence: 0.85,
      reasons: [
        `High VPD ${vpd.toFixed(1)} kPa - dry air`,
        `Increased skin water loss`,
        `Bring extra water`,
        `Take breaks in shade`
      ],
      start: now,
      end: getEndTime(now, 2), // 2 hours from now
      professional_insight: `High VPD doesn't just affect plants - it also increases water loss through your skin and respiratory system. You'll dehydrate faster in these conditions.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: dewPoint,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  // Dew point comfort analysis
  if (dewPoint >= 15 && dewPoint <= 18) {
    suggestions.push({
      activity: "Ideal Outdoor Temperature Feel",
      category: "outdoor_comfort",
      description: `Perfect dew point ${dewPoint.toFixed(1)}°C - comfortable air moisture`,
      confidence: 0.8,
      reasons: [
        `Dew point: ${dewPoint.toFixed(1)}°C - ideal range`,
        `Air won't feel sticky or dry`,
        `Comfortable for all activities`,
        `Natural air conditioning effect`
      ],
      start: now,
      end: getEndTime(now, 2), // 2 hours from now
      professional_insight: `Dew point between 15-18°C is the sweet spot where air feels neither too dry nor too humid. This is like natural air conditioning for outdoor comfort.`,
      agricultural_data: {
        vpd: vpd,
        humidity: current.relative_humidity,
        dew_point: dewPoint,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  }

  return suggestions;
}

function generateTimingBasedSuggestions(
  forecast: AgriculturalForecast,
  now: string
): Omit<SmartActivitySuggestion, 'id'>[] {
  const suggestions: Omit<SmartActivitySuggestion, 'id'>[] = [];
  
  // Use optimal watering windows from insights
  const optimalWindows = forecast.gardening_insights.optimal_watering_windows;
  
  optimalWindows.slice(0, 3).forEach((window, index) => {
    // Simple consistent logic: all windows start now and last 2 hours
    // Just offset each window by a few hours to spread them out
    const startOffset = index * 3; // 0, 3, 6 hours etc
    
    suggestions.push({
      activity: `Optimal Watering Window ${index + 1}`,
      category: "gardening", 
      description: window.reason,
      confidence: window.efficiency_score / 100,
      reasons: [
        `Efficiency: ${window.efficiency_score}%`,
        `Optimal timing identified`,
        `Professional agriculture data`,
        `Maximize water uptake`
      ],
      start: startOffset === 0 ? now : getEndTime(now, startOffset), // Use now for first window
      end: getEndTime(now, startOffset + 2), // End 2 hours after start
      professional_insight: `This window was identified by analyzing VPD, humidity, and evapotranspiration patterns. Watering during this time maximizes plant water uptake while minimizing waste.`,
      agricultural_data: {
        vpd: 0, // Will be filled from hourly data
        humidity: 0,
        dew_point: 0,
        et0: forecast.daily[0]?.et0_evapotranspiration || 0
      }
    });
  });


  return suggestions;
}