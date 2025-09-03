// Open-Meteo Solar & UV API for worldwide coverage
import type { OpenMeteoSolarResponse, SolarForecast, SolarTiming, DayInfo } from './types';

const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Fetch solar and UV data from Open-Meteo
export async function getSolarForecast(
  lat: number, 
  lon: number
): Promise<OpenMeteoSolarResponse | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: 'shortwave_radiation,direct_radiation,diffuse_radiation,uv_index',
      daily: 'sunrise,sunset,sunshine_duration,uv_index_max',
      timezone: 'auto',
      forecast_days: '7' // Next 7 days of solar data
    });

    const response = await fetch(`${OPENMETEO_BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo solar API error: ${response.status}`);
    }

    const data = await response.json() as OpenMeteoSolarResponse;
    return data;
  } catch (error) {
    console.error('Failed to fetch solar forecast:', error);
    return null;
  }
}

// Calculate golden hour times (sun angle between -6° and 6°)
function calculateGoldenHour(sunrise: string, sunset: string): { start: string; end: string } {
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  
  // Golden hour: ~1 hour after sunrise and ~1 hour before sunset
  const morningGoldenStart = new Date(sunriseTime.getTime());
  const morningGoldenEnd = new Date(sunriseTime.getTime() + 60 * 60 * 1000); // +1 hour
  
  const eveningGoldenStart = new Date(sunsetTime.getTime() - 60 * 60 * 1000); // -1 hour
  const eveningGoldenEnd = new Date(sunsetTime.getTime());
  
  const now = new Date();
  
  // Return the next golden hour
  if (now < morningGoldenEnd) {
    return { start: morningGoldenStart.toISOString(), end: morningGoldenEnd.toISOString() };
  } else {
    return { start: eveningGoldenStart.toISOString(), end: eveningGoldenEnd.toISOString() };
  }
}

// Check if current time is during golden hour
function isGoldenHour(currentTime: string, sunrise: string, sunset: string): boolean {
  const current = new Date(currentTime);
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  
  const morningGoldenStart = new Date(sunriseTime.getTime());
  const morningGoldenEnd = new Date(sunriseTime.getTime() + 60 * 60 * 1000);
  
  const eveningGoldenStart = new Date(sunsetTime.getTime() - 60 * 60 * 1000);
  const eveningGoldenEnd = new Date(sunsetTime.getTime());
  
  return (current >= morningGoldenStart && current <= morningGoldenEnd) ||
         (current >= eveningGoldenStart && current <= eveningGoldenEnd);
}

// Check if it's daylight
function isDaylight(currentTime: string, sunrise: string, sunset: string): boolean {
  const current = new Date(currentTime);
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  
  return current >= sunriseTime && current <= sunsetTime;
}

// Generate UV protection message
function getUVProtectionMessage(uvIndex: number): { protection_needed: boolean; message: string } {
  if (uvIndex >= 8) {
    return {
      protection_needed: true,
      message: `Very high UV (${uvIndex}) - Essential protection: sunscreen, hat, shade`
    };
  } else if (uvIndex >= 6) {
    return {
      protection_needed: true,
      message: `High UV (${uvIndex}) - Protection recommended: sunscreen, sunglasses`
    };
  } else if (uvIndex >= 3) {
    return {
      protection_needed: true,
      message: `Moderate UV (${uvIndex}) - Basic protection: sunscreen during midday`
    };
  } else {
    return {
      protection_needed: false,
      message: `Low UV (${uvIndex}) - Minimal protection needed`
    };
  }
}

// Calculate photography score based on conditions
function calculatePhotographyScore(
  uvIndex: number,
  shortwaveRadiation: number,
  isGolden: boolean,
  isDaytime: boolean
): number {
  let score = 0;
  
  // Golden hour bonus
  if (isGolden) {
    score += 40;
  } else if (isDaytime && uvIndex > 2) {
    score += 20; // Good daylight
  }
  
  // Radiation quality (ideal range 200-600 W/m²)
  if (shortwaveRadiation >= 200 && shortwaveRadiation <= 600) {
    score += 30;
  } else if (shortwaveRadiation > 600) {
    score += 15; // Too bright
  }
  
  // UV contribution (good contrast without being too harsh)
  if (uvIndex >= 2 && uvIndex <= 6) {
    score += 20;
  } else if (uvIndex > 6) {
    score += 10; // Too harsh
  }
  
  // General daylight bonus
  if (isDaytime) {
    score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Calculate solar energy score
function calculateSolarEnergyScore(shortwaveRadiation: number, isDaytime: boolean): number {
  if (!isDaytime) return 0;
  
  // Peak solar: 1000 W/m² = 100 score
  const score = Math.min(100, (shortwaveRadiation / 1000) * 100);
  return Math.max(0, score);
}

// Process raw solar data into structured forecast
export function processSolarForecast(data: OpenMeteoSolarResponse): SolarForecast {
  const now = new Date();
  const currentHour = now.toISOString().split('T')[0] + 'T' + String(now.getHours()).padStart(2, '0') + ':00';
  
  // Process daily info
  const daily: DayInfo[] = data.daily.time.map((dateStr, index) => {
    const sunrise = data.daily.sunrise[index] || '';
    const sunset = data.daily.sunset[index] || '';
    const sunshineDuration = data.daily.sunshine_duration[index] || 0;
    const uvIndexMax = data.daily.uv_index_max[index] || 0;
    
    const sunriseTime = new Date(sunrise);
    const sunsetTime = new Date(sunset);
    const daylightDuration = Math.round((sunsetTime.getTime() - sunriseTime.getTime()) / (1000 * 60));
    
    const goldenHour = calculateGoldenHour(sunrise, sunset);
    
    return {
      date: dateStr,
      sunrise,
      sunset,
      sunshine_duration: sunshineDuration,
      daylight_duration: daylightDuration,
      uv_index_max: uvIndexMax,
      golden_hour_start: goldenHour.start,
      golden_hour_end: goldenHour.end
    };
  });
  
  // Get today's daily info
  const today = daily[0];
  if (!today) {
    throw new Error('No daily solar data available');
  }
  
  // Process hourly data
  const hourly: SolarTiming[] = data.hourly.time.map((timeStr, index) => {
    const shortwaveRadiation = data.hourly.shortwave_radiation[index] || 0;
    const directRadiation = data.hourly.direct_radiation[index] || 0;
    const diffuseRadiation = data.hourly.diffuse_radiation[index] || 0;
    const uvIndex = data.hourly.uv_index[index] || 0;
    
    const isGolden = isGoldenHour(timeStr, today.sunrise, today.sunset);
    const isDaytime = isDaylight(timeStr, today.sunrise, today.sunset);
    
    return {
      time: timeStr,
      shortwave_radiation: shortwaveRadiation,
      direct_radiation: directRadiation,
      diffuse_radiation: diffuseRadiation,
      uv_index: uvIndex,
      isGoldenHour: isGolden,
      isDaylight: isDaytime
    };
  });
  
  // Find current solar conditions
  const currentIndex = data.hourly.time.findIndex(t => t.startsWith(currentHour));
  const current = currentIndex >= 0 ? hourly[currentIndex] : null;
  
  // Calculate next golden hour
  let nextGoldenHour: SolarForecast['next_golden_hour'];
  const currentTime = now.getTime();
  
  const morningGoldenStart = new Date(today.golden_hour_start);
  const eveningGoldenStart = new Date(today.golden_hour_end).getTime() - 60 * 60 * 1000; // Start of evening golden hour
  
  if (currentTime < morningGoldenStart.getTime()) {
    nextGoldenHour = {
      type: 'morning',
      start: today.golden_hour_start,
      end: today.golden_hour_end,
      minutes_until: Math.round((morningGoldenStart.getTime() - currentTime) / (1000 * 60))
    };
  } else if (currentTime < eveningGoldenStart) {
    nextGoldenHour = {
      type: 'evening',
      start: new Date(eveningGoldenStart).toISOString(),
      end: today.sunset,
      minutes_until: Math.round((eveningGoldenStart - currentTime) / (1000 * 60))
    };
  }
  
  // UV warnings
  const currentUV = current?.uv_index || 0;
  const peakUV = today.uv_index_max;
  const uvProtection = getUVProtectionMessage(Math.max(currentUV, peakUV));
  
  // Calculate scores
  const photographyScore = current ? calculatePhotographyScore(
    current.uv_index,
    current.shortwave_radiation,
    current.isGoldenHour,
    current.isDaylight
  ) : 0;
  
  const solarEnergyScore = current ? calculateSolarEnergyScore(
    current.shortwave_radiation,
    current.isDaylight
  ) : 0;
  
  return {
    current: current || null,
    hourly: hourly.slice(0, 24), // Next 24 hours
    daily,
    next_golden_hour: nextGoldenHour,
    uv_warnings: {
      current_uv: currentUV,
      peak_uv_today: peakUV,
      protection_needed: uvProtection.protection_needed,
      protection_message: uvProtection.message
    },
    photography_score: photographyScore,
    solar_energy_score: solarEnergyScore
  };
}

// Main function to get solar forecast
export async function getSolarWeatherData(
  lat: number,
  lon: number
): Promise<SolarForecast | null> {
  const data = await getSolarForecast(lat, lon);
  
  if (!data) {
    return null;
  }
  
  return processSolarForecast(data);
}