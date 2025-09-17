"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { PremiumWeatherMap, LocationSelector, LocationOption } from "@repo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/query-client";
import { useGeolocationWithCache } from "@/lib/hooks/useGeolocationWithCach";
import { searchLocations } from "@/lib/api/weather";
import AnimatedBackground from "./animated-background";
import Header from "./header";
type Location = {
  lat: number;
  lon: number;
  name: string;
  id: string;
};
const WeatherDashboard: React.FC = () => {
  const {
    loading: geolocationLoading,
    error: geolocationError,
    location,
    getPosition,
  } = useGeolocationWithCache();
  const queryClient = useQueryClient();
  const [currentLocation, setCurrentLocation] = useState<LocationOption>();
  const [searchResults, setSearchResults] = useState<
    Array<{
      lat: number;
      lon: number;
      name: string;
      country?: string;
      state?: string;
      id: string;
    }>
  >([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.weather.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.suggestions.all });
    queryClient.invalidateQueries({
      queryKey: ["weather", "extended-forecast"],
    });
    queryClient.refetchQueries({ queryKey: queryKeys.weather.all });
    queryClient.refetchQueries({ queryKey: queryKeys.suggestions.all });
    queryClient.refetchQueries({ queryKey: ["weather", "extended-forecast"] });
    setCurrentLocation(location);
    toast.success(`Weather updated for ${location.name}`);
  };

  useEffect(() => {
    if (location)
      setCurrentLocation({
        lat: location?.latitude || 0,
        lon: location?.longitude || 0,
        name: location?.name || "",
        id: location ? `${location.latitude}-${location.longitude}` : "",
      });
  }, [location]);
  // Handle search query changes
  const handleSearchQueryChange = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearchLoading(true);
      const results = await searchLocations(query, 5);
      const mappedResults = results.map((loc) => ({
        lat: loc.lat,
        lon: loc.lon,
        name: loc.name,
        country: loc.country,
        state: loc.state,
        id: `${loc.lat}-${loc.lon}`,
      }));
      setSearchResults(mappedResults);
    } catch (error) {
      console.error("Location search failed:", error);
      toast.error("Failed to search locations");
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  if (geolocationLoading) {
    return <div>Loading...</div>;
  }
  if (geolocationError) {
    const error = geolocationError;
    toast.error(error);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      <AnimatedBackground />
      <Header />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Location Selector */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto mb-12">
          <LocationSelector
            currentLocation={currentLocation}
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={getPosition}
            onSearchQueryChange={handleSearchQueryChange}
            searchResults={searchResults}
            isGeolocationLoading={geolocationLoading}
            isSearchLoading={isSearchLoading}
          />
        </motion.div>

        {/* Main Content */}
        {location && (
          <div className="space-y-8">
            {/* Additional Weather Info Cards */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Top Row: 5-Day Forecast and Weather Map */}
              <div className="grid gap-6 lg:grid-cols-2">
                <PremiumWeatherMap
                  center={[location.latitude, location.longitude]}
                  isLoading={geolocationLoading}
                />
              </div>

              {/* Bottom Row: Future features */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Smart Alerts placeholder */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 opacity-50">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-amber-300 text-xl">⏰</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Smart Alerts
                    </h3>
                    <p className="text-white/60 text-sm">Coming soon</p>
                  </div>
                </div>

                {/* Additional placeholders for future features */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 opacity-50">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-indigo-300 text-xl">📈</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Analytics</h3>
                    <p className="text-white/60 text-sm">Coming soon</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 opacity-50">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-pink-300 text-xl">📱</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      Mobile App
                    </h3>
                    <p className="text-white/60 text-sm">Coming soon</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Welcome state when no location is selected */}
        {!location && !geolocationLoading && (
          <motion.div variants={itemVariants} className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto">
                <svg
                  className="w-12 h-12 text-sky-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">
                  Ready for sky guidance?
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Choose your location to get personalized weather insights and
                  intelligent activity suggestions.
                </p>
              </div>

              <motion.button
                onClick={getPosition}
                disabled={geolocationLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300 disabled:opacity-50"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Version indicator for development */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-black/20 backdrop-blur-sm text-white/60 text-xs px-2 py-1 rounded-md border border-white/10">
          v1.0.29-agricultural
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherDashboard;
