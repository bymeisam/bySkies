import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Loader2, 
  Navigation, 
  Globe,
  X,
  Clock,
  Check
} from 'lucide-react';

interface LocationOption {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  state?: string;
  id: string;
}

interface LocationSelectorProps {
  currentLocation: LocationOption | null;
  onLocationSelect: (location: LocationOption) => void;
  onUseCurrentLocation: () => void;
  onSearchLocations: (query: string) => Promise<LocationOption[]>;
  isGeolocationLoading?: boolean;
  isSearchLoading?: boolean;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationSelect,
  onUseCurrentLocation,
  onSearchLocations,
  isGeolocationLoading = false,
  isSearchLoading = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const [recentLocations, setRecentLocations] = useState<LocationOption[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent locations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('byskies-recent-locations');
      if (stored) {
        setRecentLocations(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent locations:', error);
    }
  }, []);

  // Save to recent locations
  const saveToRecent = (location: LocationOption) => {
    try {
      const updated = [
        location,
        ...recentLocations.filter(loc => loc.id !== location.id)
      ].slice(0, 5); // Keep only 5 recent locations
      
      setRecentLocations(updated);
      localStorage.setItem('byskies-recent-locations', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent location:', error);
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        const results = await onSearchLocations(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Location search failed:', error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]); // Removed onSearchLocations from dependencies

  // Handle location selection
  const handleLocationSelect = (location: LocationOption) => {
    saveToRecent(location);
    onLocationSelect(location);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Handle current location
  const handleCurrentLocation = () => {
    onUseCurrentLocation();
    setIsOpen(false);
  };

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Current location button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 bg-white/10 backdrop-blur-xl border rounded-2xl p-4 text-white transition-all duration-300 group ${
          isOpen 
            ? 'border-sky-400/50 shadow-lg shadow-sky-500/20' 
            : 'border-white/20 hover:border-white/30'
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
          <svg className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a city..."
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/50" />
                  </button>
                )}
              </div>

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
                  {isGeolocationLoading ? 'Getting location...' : 'Use current location'}
                </span>
              </motion.button>

              {/* Search results */}
              {isSearchLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-white/60 uppercase tracking-wide font-medium px-1">
                    Search Results
                  </div>
                  {searchResults.map((location) => (
                    <motion.button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
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
                      {currentLocation?.id === location.id && (
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
                      onClick={() => handleLocationSelect(location)}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
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
                      {currentLocation?.id === location.id && (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchQuery && searchResults.length === 0 && !isSearchLoading && (
                <div className="text-center py-8 text-white/60">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No locations found</div>
                  <div className="text-xs mt-1">Try a different search term</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};