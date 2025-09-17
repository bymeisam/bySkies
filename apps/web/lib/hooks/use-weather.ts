import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query/query-client";
import { searchLocations } from "../api/weather";

// Location Search Hook
export function useLocationSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: string) => {
      const results = await searchLocations(query, 5);
      return results.map((location) => ({
        lat: location.lat,
        lon: location.lon,
        name: location.name,
        country: location.country,
        state: location.state,
      }));
    },
    onSuccess: (data) => {
      // Cache the search results
      data.forEach((location) => {
        queryClient.setQueryData(
          queryKeys.location.reverse(location.lat, location.lon),
          [location],
        );
      });
    },
  });
}

