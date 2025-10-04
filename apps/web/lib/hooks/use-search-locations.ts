import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchLocations } from "../api/weather";

export interface SearchLocationResult {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  state?: string;
  id: string;
}

interface UseSearchLocationsReturn {
  data: SearchLocationResult[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
  reset: () => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export function useSearchLocations(
  initialEnabled: boolean = true,
): UseSearchLocationsReturn {
  const [query, setQuery] = useState<string>("");
  const [enabled, setEnabled] = useState(initialEnabled);
  const queryClient = useQueryClient();

  // React Query for search locations
  const {
    data: rawData = [],
    isLoading,
    error: queryError,
    isError,
  } = useQuery({
    queryKey: ["search-locations", query],
    queryFn: async ({ signal }) => {
      if (!query.trim() || query.length < 2) {
        return [];
      }

      const results = await searchLocations(query, 5, signal);
      return results.map((loc) => ({
        ...loc,
        id: `${loc.lat}-${loc.lon}`,
      }));
    },
    enabled: enabled && query.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const reset = useCallback(() => {
    setQuery("");
    // Cancel any ongoing queries
    queryClient.cancelQueries({ queryKey: ["search-locations"] });
    // Remove cached results
    queryClient.removeQueries({ queryKey: ["search-locations"] });
  }, [queryClient]);

  const error =
    isError && queryError
      ? queryError instanceof Error
        ? queryError.message
        : "Failed to search locations"
      : null;

  return {
    data: rawData,
    loading: isLoading,
    error,
    search,
    reset,
    enabled,
    setEnabled,
  };
}

