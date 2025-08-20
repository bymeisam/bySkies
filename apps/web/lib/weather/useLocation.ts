import { useState, useCallback } from "react";
import type { LocationObject, GeocodingResponse } from "@repo/types";
import { searchLocations, getLocationName } from "./api";

interface UseLocationState extends LocationObject {
  error?: string;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<UseLocationState>({
    lat: 0,
    lon: 0,
    name: "",
    loading: false,
    error: undefined,
  });

  // Get browser geolocation
  const detectLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, loading: true, error: undefined }));
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        loading: false,
      }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await getLocationName(latitude, longitude);
          const name =
            res[0]?.name && res[0]?.country
              ? `${res[0].name}, ${res[0].country}`
              : "";
          setLocation({
            lat: latitude,
            lon: longitude,
            name,
            loading: false,
            error: undefined,
          });
        } catch (err) {
          setLocation((prev) => ({
            ...prev,
            error: "Failed to resolve location name",
            loading: false,
          }));
        }
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message || "Failed to get location",
          loading: false,
        }));
      }
    );
  }, []);

  // Manual search by city name
  const searchLocation = useCallback(async (query: string) => {
    setLocation((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const results: GeocodingResponse = await searchLocations(query);
      if (results.length === 0) {
        setLocation((prev) => ({
          ...prev,
          error: "No locations found",
          loading: false,
        }));
        return;
      }
      const loc = results[0];
      setLocation({
        lat: loc.lat,
        lon: loc.lon,
        name: loc.name,
        loading: false,
        error: undefined,
      });
    } catch (err) {
      setLocation((prev) => ({
        ...prev,
        error: "Failed to search location",
        loading: false,
      }));
    }
  }, []);

  return {
    location,
    detectLocation,
    searchLocation,
    setLocation,
  };
}
