import React from "react";
import { motion } from "framer-motion";
import { Globe, Clock, Check, Loader2 } from "lucide-react";

interface LocationOption {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  state?: string;
  id: string;
}

interface LocationDropdownProps {
  locations: LocationOption[];
  recentLocations: LocationOption[];
  currentLocationId?: string;
  onLocationSelect: (location: LocationOption) => void;
  isLoading?: boolean;
  showNoResults?: boolean;
  searchQuery?: string;
}

export const LocationDropdown: React.FC<LocationDropdownProps> = ({
  locations,
  recentLocations,
  currentLocationId,
  onLocationSelect,
  isLoading = true,
  showNoResults = false,
  searchQuery = "",
}) => {
  const formatLocationName = (location: LocationOption) => {
    if (location.state && location.country) {
      return `${location.name}, ${location.state}, ${location.country}`;
    }
    if (location.country) {
      return `${location.name}, ${location.country}`;
    }
    return location.name;
  };

  return (
    <div className="space-y-4">
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
        </div>
      )}

      {/* Search results */}
      {locations.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-white/60 uppercase tracking-wide font-medium px-1">
            Search Results
          </div>
          {locations.map((location) => (
            <motion.button
              key={location.id}
              onClick={() => onLocationSelect(location)}
              whileHover={{
                scale: 1.01,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 text-left"
            >
              <Globe className="w-4 h-4 text-white/50 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{location.name}</div>
                {(location.state || location.country) && (
                  <div className="text-sm text-white/60 truncate">
                    {location.state && `${location.state}, `}
                    {location.country}
                  </div>
                )}
              </div>
              {currentLocationId === location.id && (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Recent locations */}
      {recentLocations.length > 0 && !searchQuery && (
        <div className="space-y-1">
          <div className="text-xs text-white/60 uppercase tracking-wide font-medium px-1">
            <Clock className="w-3 h-3 inline mr-1" />
            Recent
          </div>
          {recentLocations.map((location) => (
            <motion.button
              key={location.id}
              onClick={() => onLocationSelect(location)}
              whileHover={{
                scale: 1.01,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-200 text-left"
            >
              <Clock className="w-4 h-4 text-white/50 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{location.name}</div>
                {(location.state || location.country) && (
                  <div className="text-sm text-white/60 truncate">
                    {location.state && `${location.state}, `}
                    {location.country}
                  </div>
                )}
              </div>
              {currentLocationId === location.id && (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* No results */}
      {showNoResults && searchQuery && locations.length === 0 && !isLoading && (
        <div className="text-center py-8 text-white/60">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No locations found</div>
          <div className="text-xs mt-1">Try a different search term</div>
        </div>
      )}
    </div>
  );
};

