import { getForecastAction, getCurrentWeatherAction, getExtendedForecastAction, getAirQualityAction, getSolarForecastAction, getAgriculturalForecastAction, getSmartActivitySuggestionsAction } from "@/lib/actions/weather-actions";
import ServerWeatherDashboard from "@/components/weather/server-weather-dashboard";
import { Suspense } from "react";

interface ForecastPageProps {
  searchParams: {
    lat?: string;
    lon?: string;
    units?: 'metric' | 'imperial' | 'kelvin';
  };
}

// Loading component
function ForecastLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">Loading Forecast...</h2>
        <p className="text-slate-300">Fetching weather data from server</p>
      </div>
    </div>
  );
}

export default async function ForecastPage({ searchParams }: ForecastPageProps) {
  // Default location (New York) for demo purposes
  const lat = searchParams.lat ? parseFloat(searchParams.lat) : 40.7128;
  const lon = searchParams.lon ? parseFloat(searchParams.lon) : -74.0060;
  const units = searchParams.units || 'metric';

  // Validate coordinates
  if (isNaN(lat) || isNaN(lon)) {
    return (
      <ServerWeatherDashboard 
        forecast={null} 
        error="Invalid coordinates provided. Please provide valid lat and lon parameters." 
      />
    );
  }

  // Fetch all weather data using server actions
  const [currentWeatherResult, forecastResult, extendedForecastResult, airQualityResult, solarForecastResult, agriculturalForecastResult, smartSuggestionsResult] = await Promise.all([
    getCurrentWeatherAction(lat, lon, units),
    getForecastAction(lat, lon, units),
    getExtendedForecastAction(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`),
    getAirQualityAction(lat, lon),
    getSolarForecastAction(lat, lon),
    getAgriculturalForecastAction(lat, lon),
    getSmartActivitySuggestionsAction(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
  ]);

  // Combine any errors
  const errors = [];
  if (!currentWeatherResult.success && currentWeatherResult.error) {
    errors.push(`Current Weather: ${currentWeatherResult.error}`);
  }
  if (!forecastResult.success && forecastResult.error) {
    errors.push(`Forecast: ${forecastResult.error}`);
  }
  if (!extendedForecastResult.success && extendedForecastResult.error) {
    errors.push(`Extended Forecast: ${extendedForecastResult.error}`);
  }
  if (!airQualityResult.success && airQualityResult.error) {
    errors.push(`Air Quality: ${airQualityResult.error}`);
  }
  if (!solarForecastResult.success && solarForecastResult.error) {
    errors.push(`Solar Forecast: ${solarForecastResult.error}`);
  }
  if (!agriculturalForecastResult.success && agriculturalForecastResult.error) {
    errors.push(`Agricultural Forecast: ${agriculturalForecastResult.error}`);
  }
  if (!smartSuggestionsResult.success && smartSuggestionsResult.error) {
    errors.push(`Smart Suggestions: ${smartSuggestionsResult.error}`);
  }

  return (
    <Suspense fallback={<ForecastLoading />}>
      <ServerWeatherDashboard 
        currentWeather={currentWeatherResult.success ? currentWeatherResult.data || null : null}
        forecast={forecastResult.success ? forecastResult.data || null : null}
        extendedForecast={extendedForecastResult.success ? extendedForecastResult.data || null : null}
        airQuality={airQualityResult.success ? airQualityResult.data || null : null}
        solarForecast={solarForecastResult.success ? solarForecastResult.data || null : null}
        agriculturalForecast={agriculturalForecastResult.success ? agriculturalForecastResult.data || null : null}
        smartSuggestions={smartSuggestionsResult.success ? smartSuggestionsResult.data || null : null}
        error={errors.length > 0 ? errors.join(', ') : undefined}
      />
    </Suspense>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: ForecastPageProps) {
  const lat = searchParams.lat ? parseFloat(searchParams.lat) : 40.7128;
  const lon = searchParams.lon ? parseFloat(searchParams.lon) : -74.0060;

  return {
    title: `Weather Forecast - ${lat.toFixed(2)}, ${lon.toFixed(2)} | BySkies`,
    description: `Server-rendered 5-day weather forecast for coordinates ${lat.toFixed(2)}, ${lon.toFixed(2)}`,
  };
}