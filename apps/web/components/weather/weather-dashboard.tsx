"use client";

import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  PremiumWeatherCard,
  PremiumActivityCard,
  PremiumForecastCard,
  PremiumWeatherMap,
  LocationSelector,
  SolarUVCard,
  SmartActivityCard,
} from "@repo/ui";
import {
  useWeatherStore,
  useLocationSearch,
  useGeolocation,
  useSmartActivitySuggestions,
  useAgriculturalForecast,
} from "@/lib/hooks/use-weather";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/query-client";
import type { Location } from "@/lib/store/weather-store";

const WeatherDashboard: React.FC = () => {
  const {
    currentLocation,
    currentWeather,
    forecast,
    airQuality,
    suggestions,
    alerts,
    isAnyLoading,
    hasAllData,
    canShowSuggestions,
  } = useWeatherStore();

  // REMOVED: useSolarForecast hook - replaced by server action in forecast page
  const smartSuggestionsQuery = useSmartActivitySuggestions();
  const agriculturalForecastQuery = useAgriculturalForecast();
  console.log({ smartSuggestionsQuery });
  const locationSearch = useLocationSearch();
  const geolocation = useGeolocation();
  const queryClient = useQueryClient();

  // Auto-fetch location on mount if not set
  useEffect(() => {
    if (!currentLocation && !geolocation.isPending) {
      // Try to get geolocation automatically on first visit
      const hasAskedBefore = localStorage.getItem("byskies-geolocation-asked");
      if (!hasAskedBefore) {
        localStorage.setItem("byskies-geolocation-asked", "true");
        geolocation.mutate();
      }
    }
  }, [currentLocation, geolocation]);

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    console.log("🏙️ Location selected:", location.name);
    console.log("📊 Store state before location change:", {
      currentLocation: currentLocation?.name,
      hasWeather: !!currentWeather,
      hasForecast: !!forecast,
      hasAirQuality: !!airQuality,
      hasSuggestions: suggestions.length > 0,
    });

    // Set new location first
    useWeatherStore.getState().setLocation(location);

    // Invalidate all weather queries to refetch with new location
    console.log("🔄 Invalidating weather, suggestion queries...");
    queryClient.invalidateQueries({ queryKey: queryKeys.weather.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.suggestions.all });
    queryClient.invalidateQueries({
      queryKey: ["weather", "extended-forecast"],
    });
    // REMOVED: solar query invalidation - now handled by server actions
    queryClient.invalidateQueries({ queryKey: ["weather", "agricultural"] });
    queryClient.invalidateQueries({
      queryKey: ["suggestions", "smart-activities"],
    });

    // Force refetch all queries immediately
    console.log("🚀 Force refetching all queries...");
    queryClient.refetchQueries({ queryKey: queryKeys.weather.all });
    queryClient.refetchQueries({ queryKey: queryKeys.suggestions.all });
    queryClient.refetchQueries({ queryKey: ["weather", "extended-forecast"] });
    // REMOVED: solar query refetch - now handled by server actions
    queryClient.refetchQueries({ queryKey: ["weather", "agricultural"] });
    queryClient.refetchQueries({
      queryKey: ["suggestions", "smart-activities"],
    });

    // Log state after brief delay to see what happened
    setTimeout(() => {
      const state = useWeatherStore.getState();
      console.log("📈 Store state after location change:", {
        newLocation: state.currentLocation?.name,
        hasWeather: !!state.currentWeather,
        hasForecast: !!state.forecast,
        hasAirQuality: !!state.airQuality,
        hasSuggestions: state.suggestions.length > 0,
        canShowSuggestions: state.canShowSuggestions(),
        smartSuggestionsLoading: smartSuggestionsQuery.isLoading,
        agriculturalLoading: agriculturalForecastQuery.isLoading,
      });
    }, 2000);

    toast.success(`Weather updated for ${location.name}`);
  };

  // Handle search locations - memoized to prevent infinite loops
  const handleSearchLocations = useCallback(
    async (query: string) => {
      try {
        const results = await locationSearch.mutateAsync(query);
        return results.map((loc) => ({
          ...loc,
          id: `${loc.lat}-${loc.lon}`,
        }));
      } catch (error) {
        console.log({ error });
        toast.error("Failed to search locations");
        return [];
      }
    },
    [locationSearch],
  );

  // Handle geolocation
  const handleUseCurrentLocation = () => {
    geolocation.mutate(undefined, {
      onSuccess: (location) => {
        toast.success(`Location set to ${location.name}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  // REMOVED: airQuality error handling - now handled by server actions

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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            className={`absolute w-2 h-2 bg-white/20 rounded-full blur-sm`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              BySkies
            </span>
          </h1>
          <p className="text-xl text-white/80 font-medium">
            Your plans, guided by skies
          </p>
        </motion.div>

        {/* Location Selector */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto mb-12">
          <LocationSelector
            currentLocation={
              currentLocation
                ? {
                    ...currentLocation,
                    id: `${currentLocation.lat}-${currentLocation.lon}`,
                  }
                : null
            }
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={handleUseCurrentLocation}
            onSearchLocations={handleSearchLocations}
            isGeolocationLoading={geolocation.isPending}
            isSearchLoading={locationSearch.isPending}
          />
        </motion.div>

        {/* Main Content */}
        {currentLocation && (
          <div className="space-y-8">
            {/* Weather and Activity Cards */}
            <motion.div
              variants={itemVariants}
              className="grid gap-8 lg:grid-cols-2"
            >
              {/* Weather Card */}
              <div>
                {hasAllData() && currentWeather && airQuality ? (
                  <PremiumWeatherCard
                    weather={currentWeather}
                    airQuality={airQuality}
                    alerts={alerts}
                    isLoading={false}
                    locationName={currentLocation?.name}
                  />
                ) : (
                  <PremiumWeatherCard
                    weather={{} as any}
                    airQuality={{} as any}
                    alerts={[]}
                    isLoading={true}
                    locationName={currentLocation?.name}
                  />
                )}
              </div>

              {/* Activity Suggestions */}
              <div>
                {canShowSuggestions() ? (
                  <PremiumActivityCard
                    suggestions={suggestions}
                    isLoading={false}
                    locationName={currentLocation?.name}
                    timezone={currentWeather?.timezone}
                  />
                ) : (
                  <PremiumActivityCard
                    suggestions={[]}
                    isLoading={isAnyLoading()}
                    locationName={currentLocation?.name}
                    timezone={currentWeather?.timezone}
                  />
                )}
              </div>
            </motion.div>

            {/* Solar & UV Intelligence Card */}
            <motion.div variants={itemVariants}>
              <SolarUVCard
                solarForecast={null}
                isLoading={true}
              />
            </motion.div>

            {/* Smart Agricultural Activities Card */}
            {currentLocation && (
              <motion.div variants={itemVariants}>
                <SmartActivityCard
                  suggestions={
                    smartSuggestionsQuery.data?.smart_suggestions || []
                  }
                  isLoading={
                    smartSuggestionsQuery.isLoading ||
                    agriculturalForecastQuery.isLoading
                  }
                  locationName={currentLocation?.name}
                  timezone={currentWeather?.timezone}
                  optimalGardeningDays={
                    agriculturalForecastQuery.data?.weekly_summary
                      ?.best_gardening_days?.length || 0
                  }
                />
              </motion.div>
            )}

            {/* Additional Weather Info Cards */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Top Row: 5-Day Forecast and Weather Map */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* 5-Day Forecast with 16-Day Toggle */}
                <PremiumForecastCard
                  forecast={forecast}
                  extendedForecast={null}
                  isLoading={!forecast && isAnyLoading()}
                  onExtendedToggle={(enabled: boolean) => {
                    console.log(
                      enabled
                        ? "🚀 Switched to 16-day forecast (disabled in client-side version)"
                        : "🔙 Switched to 5-day forecast",
                    );
                  }}
                />

                {/* Weather Map */}
                <PremiumWeatherMap
                  center={
                    currentLocation
                      ? [currentLocation.lat, currentLocation.lon]
                      : [40.7128, -74.006]
                  }
                  isLoading={!currentLocation}
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
        {!currentLocation && !geolocation.isPending && (
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
                onClick={handleUseCurrentLocation}
                disabled={geolocation.isPending}
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
