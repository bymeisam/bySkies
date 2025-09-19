"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  LocationSelector,
  LocationOption,
  FullPageLoader,
} from "@repo/ui";
import { useGeolocationWithCache } from "@/lib/hooks/useGeolocationWithCach";
import { useSearchLocations } from "@/lib/hooks/use-search-locations";
import AnimatedBackground from "./animated-background";
import Header from "./header";
import { WeatherCardsWrapper } from "./weather-cards-wrapper";

const WeatherDashboard: React.FC = () => {
  const {
    loading: geolocationLoading,
    error: geolocationError,
    location,
    getPosition,
  } = useGeolocationWithCache();
  const [currentLocation, setCurrentLocation] = useState<LocationOption>();

  // Search locations hook
  const {
    data: searchResults,
    loading: isSearchLoading,
    error: searchError,
    search: searchLocations,
  } = useSearchLocations();

  useEffect(() => {
    if (location)
      setCurrentLocation({
        ...location,
        id: location ? `${location.lat}-${location.lon}` : "",
      });
  }, [location]);

  // Handle location selection
  const handleLocationSelect = (location: LocationOption) => {
    setCurrentLocation(location);
    toast.success(`Weather updated for ${location.name}`);
  };

  // Handle search query changes
  const handleSearchQueryChange = useCallback(
    (query: string) => {
      searchLocations(query);
    },
    [searchLocations],
  );

  // Show search errors as toasts
  useEffect(() => {
    if (searchError) {
      toast.error(searchError);
    }
  }, [searchError]);

  if (geolocationLoading) {
    return <FullPageLoader message="Getting your location..." />;
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
        {currentLocation && (
          <div className="space-y-8">
            {/* Weather Data Cards */}
            <WeatherCardsWrapper
              lat={currentLocation.lat}
              lon={currentLocation.lon}
              locationName={currentLocation.name}
              units="metric"
            />
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
