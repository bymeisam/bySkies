// Open-Meteo Agricultural API - Professional farming data worldwide

import { makeOpenMeteoRequest } from './client';
import type {
  OpenMeteoAgriculturalResponse,
  AgriculturalForecast,
  AgriculturalTiming,
  DailyAgriculturalData
} from './types';

export interface AgriculturalDataParams {
  latitude: number;
  longitude: number;
  days?: number; // Default: 7 days
  timezone?: string; // Default: 'auto'
}

export async function getAgriculturalData(
  params: AgriculturalDataParams
): Promise<OpenMeteoAgriculturalResponse> {
  const requestParams = {
    latitude: params.latitude,
    longitude: params.longitude,
    hourly: 'vapour_pressure_deficit,relative_humidity_2m,dew_point_2m',
    daily: 'et0_fao_evapotranspiration,precipitation_hours',
    forecast_days: params.days || 7,
    timezone: params.timezone || 'auto',
  };

  return makeOpenMeteoRequest<OpenMeteoAgriculturalResponse>('/forecast', requestParams);
}

export function processAgriculturalData(
  response: OpenMeteoAgriculturalResponse
): AgriculturalForecast {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Process hourly data
  const hourlyData: AgriculturalTiming[] = response.hourly.time.map((time, index) => {
    const vpd = response.hourly.vapour_pressure_deficit[index] || 0;
    const humidity = response.hourly.relative_humidity_2m[index] || 0;
    const dewPoint = response.hourly.dew_point_2m[index] || 0;
    
    return {
      time,
      vapour_pressure_deficit: vpd,
      relative_humidity: humidity,
      dew_point: dewPoint,
      plant_stress_level: getPlantStressLevel(vpd),
      watering_efficiency: calculateWateringEfficiency(vpd, humidity),
      comfort_index: calculateComfortIndex(vpd, dewPoint, humidity)
    };
  });

  // Process daily data
  const dailyData: DailyAgriculturalData[] = response.daily.time.map((date, index) => {
    const et0 = response.daily.et0_fao_evapotranspiration[index] || 0;
    const precipHours = response.daily.precipitation_hours[index] || 0;
    
    return {
      date,
      et0_evapotranspiration: et0,
      precipitation_hours: precipHours,
      water_demand_level: getWaterDemandLevel(et0),
      irrigation_recommendation: getIrrigationRecommendation(et0, precipHours)
    };
  });

  // Find current conditions
  const current = hourlyData.find(data => {
    const dataHour = new Date(data.time).getHours();
    return dataHour === currentHour;
  }) || null;

  // Generate insights
  const insights = generateGardeningInsights(hourlyData, dailyData);
  const weeklySummary = generateWeeklySummary(dailyData, hourlyData);

  return {
    current,
    hourly: hourlyData,
    daily: dailyData,
    gardening_insights: insights,
    weekly_summary: weeklySummary
  };
}

function getPlantStressLevel(vpd: number): 'low' | 'moderate' | 'high' {
  if (vpd < 0.4) return 'low';
  if (vpd <= 1.6) return 'moderate';
  return 'high';
}

function calculateWateringEfficiency(vpd: number, humidity: number): number {
  // Optimal VPD range for watering: 0.4-1.2 kPa
  // Higher humidity increases efficiency
  let vpdScore = 0;
  if (vpd >= 0.4 && vpd <= 1.2) {
    vpdScore = 100 - Math.abs(vpd - 0.8) * 50; // Peak at 0.8 kPa
  } else if (vpd < 0.4) {
    vpdScore = 60 + (vpd * 100); // Low transpiration
  } else {
    vpdScore = Math.max(0, 100 - (vpd - 1.2) * 30); // High evaporation
  }

  const humidityScore = Math.min(100, humidity * 1.2); // Bonus for high humidity
  
  return Math.round((vpdScore * 0.7 + humidityScore * 0.3));
}

function calculateComfortIndex(vpd: number, dewPoint: number, humidity: number): number {
  // Human comfort based on VPD and dew point
  let vpdComfort = 0;
  if (vpd >= 0.6 && vpd <= 1.4) {
    vpdComfort = 100 - Math.abs(vpd - 1.0) * 25; // Peak at 1.0 kPa
  } else {
    vpdComfort = Math.max(0, 100 - Math.abs(vpd - 1.0) * 40);
  }

  // Dew point comfort (15-18°C is ideal)
  let dewComfort = 0;
  if (dewPoint >= 15 && dewPoint <= 18) {
    dewComfort = 100;
  } else if (dewPoint >= 10 && dewPoint <= 22) {
    dewComfort = 80 - Math.abs(dewPoint - 16.5) * 3;
  } else {
    dewComfort = Math.max(0, 60 - Math.abs(dewPoint - 16.5) * 2);
  }

  return Math.round((vpdComfort * 0.6 + dewComfort * 0.4));
}

function getWaterDemandLevel(et0: number): 'low' | 'moderate' | 'high' {
  if (et0 < 3) return 'low';
  if (et0 <= 6) return 'moderate';
  return 'high';
}

function getIrrigationRecommendation(et0: number, precipHours: number): string {
  if (precipHours > 4) {
    return "Natural irrigation sufficient - skip watering today";
  }
  
  if (et0 < 2) {
    return "Low water demand - light watering if needed";
  } else if (et0 < 5) {
    return "Moderate watering recommended - check soil moisture";
  } else {
    return "High water demand - ensure adequate irrigation";
  }
}

function generateGardeningInsights(
  hourlyData: AgriculturalTiming[],
  dailyData: DailyAgriculturalData[]
) {
  const optimalWateringWindows: Array<{
    start: string;
    end: string;
    efficiency_score: number;
    reason: string;
  }> = [];
  const plantStressWarnings: Array<{
    time: string;
    severity: 'moderate' | 'high';
    message: string;
  }> = [];
  const comfortPeriods: Array<{
    start: string;
    end: string;
    comfort_score: number;
    description: string;
  }> = [];

  // Find optimal watering windows (high efficiency periods)
  for (let i = 0; i < hourlyData.length - 1; i++) {
    const current = hourlyData[i];
    const next = hourlyData[i + 1];
    
    if (current && current.watering_efficiency >= 75) {
      const windowStart = current.time;
      let windowEnd = next?.time || current.time;
      let totalEfficiency = current.watering_efficiency;
      let hours = 1;

      // Extend window if efficiency remains high
      for (let j = i + 1; j < hourlyData.length; j++) {
        const hourData = hourlyData[j];
        if (hourData && hourData.watering_efficiency >= 70) {
          windowEnd = hourData.time;
          totalEfficiency += hourData.watering_efficiency;
          hours++;
          i = j; // Skip processed hours
        } else {
          break;
        }
      }

      const referenceHour = hourlyData[Math.max(0, i - hours + 1)];
      optimalWateringWindows.push({
        start: windowStart,
        end: windowEnd,
        efficiency_score: Math.round(totalEfficiency / hours),
        reason: getWateringReason(totalEfficiency / hours, referenceHour?.vapour_pressure_deficit || 0)
      });
    }
  }

  // Find plant stress warnings
  hourlyData.forEach(data => {
    if (data.plant_stress_level === 'high') {
      plantStressWarnings.push({
        time: data.time,
        severity: 'high' as const,
        message: `High plant stress: VPD ${data.vapour_pressure_deficit.toFixed(1)} kPa - water loss exceeds optimal range`
      });
    } else if (data.plant_stress_level === 'moderate' && data.vapour_pressure_deficit > 1.4) {
      plantStressWarnings.push({
        time: data.time,
        severity: 'moderate' as const,
        message: `Moderate plant stress: VPD ${data.vapour_pressure_deficit.toFixed(1)} kPa - monitor plant hydration`
      });
    }
  });

  // Find comfort periods for outdoor activities
  for (let i = 0; i < hourlyData.length - 1; i++) {
    const current = hourlyData[i];
    
    if (current && current.comfort_index >= 70) {
      const periodStart = current.time;
      let periodEnd = hourlyData[i + 1]?.time || current.time;
      let totalComfort = current.comfort_index;
      let hours = 1;

      // Extend period if comfort remains high
      for (let j = i + 1; j < hourlyData.length; j++) {
        const hourData = hourlyData[j];
        if (hourData && hourData.comfort_index >= 65) {
          periodEnd = hourData.time;
          totalComfort += hourData.comfort_index;
          hours++;
          i = j;
        } else {
          break;
        }
      }

      comfortPeriods.push({
        start: periodStart,
        end: periodEnd,
        comfort_score: Math.round(totalComfort / hours),
        description: getComfortDescription(totalComfort / hours)
      });
    }
  }

  return {
    optimal_watering_windows: optimalWateringWindows.slice(0, 5), // Top 5
    plant_stress_warnings: plantStressWarnings.slice(0, 10), // Top 10
    outdoor_comfort_periods: comfortPeriods.slice(0, 5) // Top 5
  };
}

function generateWeeklySummary(dailyData: DailyAgriculturalData[], hourlyData: AgriculturalTiming[]) {
  const avgVpd = hourlyData.reduce((sum, data) => sum + data.vapour_pressure_deficit, 0) / hourlyData.length;
  const totalEt0 = dailyData.reduce((sum, data) => sum + data.et0_evapotranspiration, 0);
  const rainHours = dailyData.reduce((sum, data) => sum + data.precipitation_hours, 0);
  
  // Best gardening days: moderate ET0, low stress periods
  const bestDays = dailyData
    .filter(day => day.water_demand_level !== 'high')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(day => day.date)
    .slice(0, 3);

  return {
    avg_vpd: Math.round(avgVpd * 100) / 100,
    total_et0: Math.round(totalEt0 * 10) / 10,
    rain_hours: Math.round(rainHours),
    irrigation_needed: totalEt0 > rainHours * 2, // Simple heuristic
    best_gardening_days: bestDays
  };
}

function getWateringReason(efficiency: number, vpd: number): string {
  if (efficiency >= 90) {
    return `Excellent conditions: VPD ${vpd.toFixed(1)} kPa - water will be absorbed efficiently`;
  } else if (efficiency >= 80) {
    return `Good watering conditions: optimal plant water uptake`;
  } else {
    return `Fair conditions: plants will benefit but monitor for stress`;
  }
}

function getComfortDescription(comfort: number): string {
  if (comfort >= 85) {
    return "Excellent outdoor conditions - perfect for gardening and activities";
  } else if (comfort >= 75) {
    return "Very comfortable - ideal for extended outdoor work";
  } else {
    return "Comfortable conditions - suitable for most outdoor activities";
  }
}