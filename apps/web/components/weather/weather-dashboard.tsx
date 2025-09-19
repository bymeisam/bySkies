"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  LocationSelector,
  LocationOption,
  FullPageLoader,
  Svg,
} from "@repo/ui";
import { useGeolocationWithCache } from "@/lib/hooks/useGeolocationWithCach";
import { useSearchLocations } from "@/lib/hooks/use-search-locations";
import AnimatedBackground from "./animated-background";
import Header from "./header";
import { WeatherCardsWrapper } from "./weather-cards-wrapper";
import { styles, motionVariants } from "./weather-dashboard.styles";

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
  return (
    <motion.div
      variants={motionVariants.container}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <AnimatedBackground />
      <Header />
      <div className={styles.contentContainer}>
        {/* Location Selector */}
        <motion.div variants={motionVariants.item} className={styles.locationSelectorContainer}>
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
          <div className={styles.mainContentWrapper}>
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
          <motion.div variants={motionVariants.item} className={styles.welcomeContainer()}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeIcon}>
                <Svg
                  name="star"
                  className={styles.welcomeIconSvg}
                />
              </div>

              <div className={styles.welcomeTextContainer}>
                <h2 className={styles.welcomeHeading}>
                  Ready for sky guidance?
                </h2>
                <p className={styles.welcomeDescription}>
                  Choose your location to get personalized weather insights and
                  intelligent activity suggestions.
                </p>
              </div>

              <motion.button
                onClick={getPosition}
                disabled={geolocationLoading}
                whileHover={motionVariants.button.hover}
                whileTap={motionVariants.button.tap}
                className={styles.getStartedButton({ disabled: geolocationLoading })}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Version indicator for development */}
      <div className={styles.versionIndicator}>
        <div className={styles.versionBadge}>
          v1.0.29-agricultural
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherDashboard;
