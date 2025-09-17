import { useGeolocation, useLocalStorage } from "@bymeisam/use";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLocationName } from "../api/weather/openweather/geocoding";
import { queryKeys } from "../query/query-client";

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
  const [value, setValue] = useLocalStorage<Position | null>(
    "byskies-geolocatin",
    null,
  );
  const {
    loading,
    error,
    position: location,
    getCurrentPosition,
  } = useGeolocation();

  const {
    data: locationData,
    isLoading: isLocationNameLoading,
    error: locationNameError,
  } = useLocationName(
    value?.latitude,
    value?.longitude,
    !value?.name && shouldSearch,
  );

  const getPosition = () => {
    setShouldSearch(true);
    setValue(null);
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
    if (value?.latitude && value?.longitude) {
      if (locationData) {
        setValue({ ...value, name: locationData.name });
        setShouldSearch(false);
      }
    } else {
      if (!location) {
        getCurrentPosition();
      } else {
        setValue({
          ...value,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    }
  }, [
    error,
    getCurrentPosition,
    isLocationNameLoading,
    loading,
    locationData,
    locationNameError,
    location,
    setValue,
    shouldSearch,
    value,
  ]);

  return {
    loading: loading || isLocationNameLoading,
    error: error || locationNameError?.message,
    location: value,
    getPosition,
  };
};
