import WeatherDashboard from "@/components/weather/weather-dashboard";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      {/* Add navigation to show both approaches */}
      <div className="fixed top-4 right-4 z-50 bg-slate-800 p-4 rounded-lg text-white">
        <h3 className="font-bold mb-2">Weather Approaches</h3>
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            <span className="text-green-300">Current:</span> Client + React Query + Zustand
          </div>
          <Link 
            href="/forecast?lat=40.7128&lon=-74.0060" 
            className="text-blue-300 hover:text-blue-100 underline text-sm"
          >
            New: Server Action (NYC)
          </Link>
          <Link 
            href="/forecast?lat=37.7749&lon=-122.4194" 
            className="text-blue-300 hover:text-blue-100 underline text-sm"
          >
            New: Server Action (SF)
          </Link>
        </div>
      </div>
      
      <WeatherDashboard />
    </div>
  );
}
