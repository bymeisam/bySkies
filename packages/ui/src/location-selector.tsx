import React, { useState, useEffect } from "react";
import { useLocalStorage, useClickOutside, useDebounce } from "@bymeisam/use";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { LocationInput } from "./location-input";
import { LocationDropdown } from "./location-dropdown";

export interface LocationOption {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  state?: string;
  id: string;
}

interface LocationSelectorProps {
  currentLocation?: LocationOption | null;
  onLocationSelect: (location: LocationOption) => void;
  onUseCurrentLocation: () => void;
  onSearchQueryChange: (query: string) => void;
  searchResults: LocationOption[];
  isGeolocationLoading?: boolean;
  isSearchLoading?: boolean;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationSelect,
  onUseCurrentLocation,
  onSearchQueryChange,
  searchResults,
  isGeolocationLoading = false,
  isSearchLoading = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [recentLocations, setRecentLocations] = useLocalStorage<
    LocationOption[]
  >("byskies-recent-locations", []);
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() =>
    setIsOpen(false),
  );

  console.log({ currentLocation });
  const saveToRecent = (location: LocationOption) => {
    setRecentLocations((prevLocations) =>
      [
        location,
        ...prevLocations.filter((loc) => loc.id !== location.id),
      ].slice(0, 5),
    );
  };

  // Notify parent when debounced search query changes
  useEffect(() => {
    onSearchQueryChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchQueryChange]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationOption) => {
    saveToRecent(location);
    onLocationSelect(location);
    setIsOpen(false);
    setSearchQuery("");
  };

  // Handle current location
  const handleCurrentLocation = () => {
    onUseCurrentLocation();
    setIsOpen(false);
  };

  return (
    <div ref={clickOutsideRef} className={`relative ${className}`}>
      {/* Current location button */}
      <motion.button
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 bg-white/10 backdrop-blur-xl border rounded-2xl p-4 text-white transition-all duration-300 group ${
          isOpen
            ? "border-sky-400/50 shadow-lg shadow-sky-500/20"
            : "border-white/20 hover:border-white/30"
        }`}
        style={{
          boxShadow: `
            0 10px 25px -5px rgba(59, 130, 246, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        <div className="p-2 bg-sky-400/20 rounded-xl border border-sky-400/30 group-hover:bg-sky-400/30 transition-colors flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-sky-300" />
        </div>

        <div className="flex-1 text-left">
          {currentLocation ? (
            <div>
              <div className="font-medium">{currentLocation.name}</div>
              {(currentLocation.state || currentLocation.country) && (
                <div className="text-sm text-white/60">
                  {currentLocation.state && `${currentLocation.state}, `}
                  {currentLocation.country}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="font-medium">Select Location</div>
              <div className="text-sm text-white/60">Choose your location</div>
            </div>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <svg
            className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 z-[100] mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* Search input */}
              <LocationInput
                value={searchQuery}
                onValueChange={handleInputChange}
                isShowing={isOpen}
              />

              {/* Current location button */}
              <motion.button
                onClick={handleCurrentLocation}
                disabled={isGeolocationLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 bg-sky-400/10 border border-sky-400/20 rounded-xl text-white hover:bg-sky-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGeolocationLoading ? (
                  <Loader2 className="w-5 h-5 text-sky-300 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 text-sky-300" />
                )}
                <span className="font-medium">
                  {isGeolocationLoading
                    ? "Getting location..."
                    : "Use current location"}
                </span>
              </motion.button>

              {/* Location dropdown with search results and recent locations */}
              <LocationDropdown
                locations={searchResults}
                recentLocations={recentLocations}
                currentLocationId={currentLocation?.id}
                onLocationSelect={handleLocationSelect}
                isLoading={isSearchLoading}
                showNoResults={searchQuery.length >= 2}
                searchQuery={searchQuery}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
