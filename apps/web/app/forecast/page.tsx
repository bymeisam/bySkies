import { getForecastAction } from "@/lib/actions/weather-actions";
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

  // Fetch forecast data using server action
  const result = await getForecastAction(lat, lon, units);

  return (
    <Suspense fallback={<ForecastLoading />}>
      <ServerWeatherDashboard 
        forecast={result.success ? result.data || null : null}
        error={result.success ? undefined : result.error}
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