import { useGeolocation, useLocalStorage } from "@bymeisam/use";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLocationName } from "../api/weather/openweather/geocoding";
import { queryKeys } from "../query/query-client";
import { GeocodingResult } from "@repo/types";

export type Position = {
  latitude: number;
  longitude: number;
  name?: string | null;
};

// Custom hook for getting location name with React Query
export const useLocationName = (
  lat?: number,
  lon?: number,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey:
      lat && lon
        ? queryKeys.location.reverse(lat, lon)
        : ["location", "name", "disabled"],
    queryFn: async () => {
      if (!lat || !lon) throw new Error("Coordinates required");
      const data = await getLocationName(lat, lon);
      return data[0] || null;
    },
    enabled: enabled && Boolean(lat && lon),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - location names don't change
    retry: 2,
  });
};

export const useGeolocationWithCache = () => {
  const [shouldSearch, setShouldSearch] = useState(false);
  const [cachedValue, setCachedValue] = useLocalStorage<GeocodingResult | null>(
    "byskies-geolocatin",
    null,
  );
  const { loading, error, location, getCurrentPosition } = useGeolocation();

  const {
    data: locationData,
    isLoading: isLocationNameLoading,
    error: locationNameError,
  } = useLocationName(
    location?.coords.latitude,
    location?.coords.longitude,
    shouldSearch && !!location,
  );

  const getPosition = () => {
    setShouldSearch(true);
    setCachedValue(null);
    getCurrentPosition();
  };

  useEffect(() => {
    if (
      loading ||
      isLocationNameLoading ||
      error ||
      locationNameError ||
      !shouldSearch
    )
      return;
    if (locationData) {
      setCachedValue({ ...locationData });
      setShouldSearch(false);
    }
  }, [
    error,
    isLocationNameLoading,
    loading,
    locationData,
    locationNameError,
    setCachedValue,
    shouldSearch,
  ]);

  return {
    loading: loading || isLocationNameLoading,
    error: error || locationNameError?.message,
    location: cachedValue,
    getPosition,
  };
};
