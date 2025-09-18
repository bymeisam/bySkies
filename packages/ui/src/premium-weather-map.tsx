"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map as MapIcon,
  Layers,
  CloudRain,
  Cloud,
  Thermometer,
  Wind,
  Eye,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import dynamic from "next/dynamic";

// Fix Leaflet icons by configuring them when component mounts
const configureLeafletIcons = () => {
  if (typeof window === "undefined") return;

  const L = require("leaflet");

  // Delete default icon options to prevent loading issues
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Set custom icon configuration
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS4xMjggMCAyNC41IDUuMzcyIDI0LjUgMTJDMjQuNSAxOC42MjggMTkuMTI4IDI0IDEyLjUgMjRDNS44NzIgMjQgMC41IDE4LjYyOCAwLjUgMTJDMC41IDUuMzcyIDUuODcyIDAgMTIuNSAwWiIgZmlsbD0iIzM5ODhGRiIvPgo8cGF0aCBkPSJNMTIuNSA0MUwxMi41IDI0IiBzdHJva2U9IiMzOTg4RkYiIHN0cm9rZS13aWR0aD0iMSIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIiIHI9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS4xMjggMCAyNC41IDUuMzcyIDI0LjUgMTJDMjQuNSAxOC42MjggMTkuMTI4IDI0IDEyLjUgMjRDNS44NzIgMjQgMC41IDE4LjYyOCAwLjUgMTJDMC41IDUuMzcyIDUuODcyIDAgMTIuNSAwWiIgZmlsbD0iIzM5ODhGRiIvPgo8cGF0aCBkPSJNMTIuNSA0MUwxMi41IDI0IiBzdHJva2U9IiMzOTg4RkYiIHN0cm9rZS13aWR0aD0iMSIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIiIHI9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    shadowUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMjAuNSIgcnk9IjMuNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPgo=",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Dynamic import of Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Weather map layers configuration
const weatherLayers = {
  precipitation: {
    id: "precipitation_new",
    name: "Precipitation",
    icon: CloudRain,
    color: "text-blue-400",
    bgColor: "from-blue-400/20 to-blue-600/20",
    borderColor: "border-blue-400/30",
    description: "Rainfall and snow intensity",
  },
  clouds: {
    id: "clouds_new",
    name: "Cloud Cover",
    icon: Cloud,
    color: "text-gray-300",
    bgColor: "from-gray-400/20 to-gray-600/20",
    borderColor: "border-gray-400/30",
    description: "Cloud coverage percentage",
  },
  temperature: {
    id: "temp_new",
    name: "Temperature",
    icon: Thermometer,
    color: "text-orange-400",
    bgColor: "from-orange-400/20 to-red-600/20",
    borderColor: "border-orange-400/30",
    description: "Surface temperature",
  },
  wind: {
    id: "wind_new",
    name: "Wind Speed",
    icon: Wind,
    color: "text-green-400",
    bgColor: "from-green-400/20 to-emerald-600/20",
    borderColor: "border-green-400/30",
    description: "Wind speed and direction",
  },
} as const;

type WeatherLayer = keyof typeof weatherLayers;

interface PremiumWeatherMapProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  className?: string;
  isLoading?: boolean;
  apiKey?: string;
  name?: string;
}

const LoadingSkeleton = () => (
  <div className="w-full h-96 bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center">
        <MapIcon className="w-8 h-8 text-white/50" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
        <div className="h-3 bg-white/10 rounded w-24 mx-auto"></div>
      </div>
    </div>
  </div>
);

const LayerToggle: React.FC<{
  layer: WeatherLayer;
  isActive: boolean;
  onToggle: (layer: WeatherLayer) => void;
}> = ({ layer, isActive, onToggle }) => {
  const config = weatherLayers[layer];
  const IconComponent = config.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(layer)}
      className={`
        relative p-3 rounded-2xl border transition-all duration-300
        ${
          isActive
            ? `bg-gradient-to-br ${config.bgColor} ${config.borderColor} ${config.color}`
            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
        }
      `}
      title={`${config.name}: ${config.description}`}
    >
      <IconComponent className="w-5 h-5" />
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
        />
      )}
    </motion.button>
  );
};

const PremiumWeatherMapComponent: React.FC<PremiumWeatherMapProps> = ({
  lat = 0,
  lon: lng = 0,
  zoom = 8,
  className = "",
  name = "",
  isLoading = false,
  apiKey = "55cd1a140017e2635e0fdbc9b920ae24", // Default API key from CLAUDE.md
}) => {
  const [activeLayer, setActiveLayer] = useState<WeatherLayer>("precipitation");
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  // Initialize map after component mounts (client-side only)
  useEffect(() => {
    console.log("🗺️ PremiumWeatherMap mounting...");
    configureLeafletIcons();
    setMapReady(true);
  }, []);

  // Update map view when coordinates change
  useEffect(() => {
    if (mapRef.current && lat && lng) {
      const map = mapRef.current;
      console.log("🗺️ Updating map view to:", { lat, lng });
      map.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom]);

  console.log({ mapReady, lat, lng });

  const toggleLayer = (layer: WeatherLayer) => {
    setActiveLayer(activeLayer === layer ? "precipitation" : layer);
  };

  const weatherTileUrl = useMemo(() => {
    const layerId = weatherLayers[activeLayer].id;
    const url = `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}`;
    console.log(`🗺️ Weather tile URL for ${activeLayer}:`, url);
    return url;
  }, [activeLayer, apiKey]);

  if (isLoading || !lat || !lng) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <LoadingSkeleton />
      </motion.div>
    );
  }

  if (!mapReady) {
    return (
      <div
        className={`overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl
        ${isExpanded ? "fixed inset-4 z-50" : "p-8"}
        ${className}
      `}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl border border-purple-400/30 flex-shrink-0"
            >
              <MapIcon className="w-6 h-6 text-purple-300" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Weather Maps</h2>
              <p className="text-white/60 text-sm">
                Live radar and conditions for {name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white/50 flex-shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(weatherLayers) as WeatherLayer[]).map((layer) => (
              <LayerToggle
                key={layer}
                layer={layer}
                isActive={activeLayer === layer}
                onToggle={toggleLayer}
              />
            ))}
          </div>
        </div>

        {/* Active Layer Info */}
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div
            className={`p-2 rounded-xl bg-gradient-to-br ${
              weatherLayers[activeLayer].bgColor
            } border ${weatherLayers[activeLayer].borderColor}`}
          >
            {React.createElement(weatherLayers[activeLayer].icon, {
              className: `w-4 h-4 ${weatherLayers[activeLayer].color}`,
            })}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              {weatherLayers[activeLayer].name}
            </h3>
            <p className="text-white/60 text-xs">
              {weatherLayers[activeLayer].description}
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div
          className={`
            rounded-2xl border border-white/20 overflow-hidden
            ${isExpanded ? "h-full min-h-96" : "h-96"}
          `}
        >
          {mapReady ? (
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
              attributionControl={true}
              ref={mapRef}
            >
              {/* Base Map Layer */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Weather Overlay */}
              <TileLayer
                url={weatherTileUrl}
                attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                opacity={0.6}
              />

              {/* Location Marker */}
              <Marker position={center}>
                <Popup>
                  <div>
                    <p>
                      <strong>Current Location</strong>
                    </p>
                    <p>Weather data centered here</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white/60">
                <MapIcon className="w-8 h-8 mx-auto mb-2" />
                <p>Loading map...</p>
              </div>
            </div>
          )}

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-20">
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-white/20 rounded-lg transition-all duration-300"
                title="Refresh map data"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!isExpanded && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs text-center">
              Maps update every 10 minutes • Powered by OpenWeatherMap
            </p>
          </div>
        )}
      </div>

      {/* Expanded Mode Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const PremiumWeatherMap = React.memo(PremiumWeatherMapComponent);
