"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Navigation, Crosshair, MapPin, AlertCircle } from "lucide-react";
import nycDataRaw from "@/data/nyc_data.json";

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  selectedBorough: string;
  selectedNeighbourhood: string;
  onChangeCoordinates: (lat: number, lng: number) => void;
  onSelectBorough?: (borough: string) => void;
  onSelectNeighbourhood?: (neighbourhood: string, price?: number) => void;
}

const nycData = nycDataRaw as Record<
  string,
  {
    center: { lat: number; lng: number };
    neighbourhoods: Array<{
      name: string;
      lat: number;
      lng: number;
      avgPrice: number;
      count: number;
    }>;
  }
>;

// Exact bounding box of the NYC 2019 Airbnb geographic dataset & New_York_City_.png
const MIN_LAT = 40.49979;
const MAX_LAT = 40.912724;
const MIN_LNG = -74.258;
const MAX_LNG = -73.700;

// Maximum distance threshold (~2.8 miles in degree space) to reject ocean / off-NYC clicks
const MAX_VALID_DISTANCE = 0.038;

// Borough centroid anchors
const BOROUGH_PINS = [
  { name: "Manhattan", lat: 40.7831, lng: -73.9712 },
  { name: "Brooklyn", lat: 40.6782, lng: -73.9442 },
  { name: "Queens", lat: 40.7282, lng: -73.7949 },
  { name: "Bronx", lat: 40.8448, lng: -73.8648 },
  { name: "Staten Island", lat: 40.5795, lng: -74.1502 },
];

export default function InteractiveMap({
  latitude,
  longitude,
  selectedBorough,
  selectedNeighbourhood,
  onChangeCoordinates,
  onSelectBorough,
  onSelectNeighbourhood,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Convert GPS coordinates to container percentage [0..100%]
  const getPercentPos = (lat: number, lng: number) => {
    const clampedLat = Math.min(Math.max(lat, MIN_LAT), MAX_LAT);
    const clampedLng = Math.min(Math.max(lng, MIN_LNG), MAX_LNG);

    const x = ((clampedLng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    const y = ((MAX_LAT - clampedLat) / (MAX_LAT - MIN_LAT)) * 100;
    return { x, y };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const yRatio = Math.max(0, Math.min(1, clickY / rect.height));

    const clickedLng = MIN_LNG + xRatio * (MAX_LNG - MIN_LNG);
    const clickedLat = MAX_LAT - yRatio * (MAX_LAT - MIN_LAT);

    // Find the closest authentic NYC neighbourhood in the dataset
    let closestHood: {
      name: string;
      borough: string;
      lat: number;
      lng: number;
      avgPrice: number;
    } | null = null;
    let minDistance = Infinity;

    for (const [borough, data] of Object.entries(nycData)) {
      for (const hood of data.neighbourhoods) {
        const dLat = clickedLat - hood.lat;
        const dLng = (clickedLng - hood.lng) * 0.76; // Aspect ratio adjustment
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist < minDistance) {
          minDistance = dist;
          closestHood = {
            name: hood.name,
            borough,
            lat: hood.lat,
            lng: hood.lng,
            avgPrice: hood.avgPrice,
          };
        }
      }
    }

    // Do NOT allow selecting empty ocean or off-NYC areas
    if (minDistance > MAX_VALID_DISTANCE || !closestHood) {
      setWarningMessage("Water / Out-of-bounds area. Click on an NYC borough or neighbourhood.");
      setTimeout(() => setWarningMessage(null), 2500);
      return;
    }

    setWarningMessage(null);
    onChangeCoordinates(closestHood.lat, closestHood.lng);
    onSelectBorough?.(closestHood.borough);
    onSelectNeighbourhood?.(closestHood.name, closestHood.avgPrice);
  };

  const currentPin = getPercentPos(latitude, longitude);

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 bg-dark-900 shadow-2xl p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-airbnb-red animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            NYC Geographic Map
          </span>
          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            Original 2019 Dataset Boundaries
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-dark-950/80 px-2.5 py-1 rounded-full border border-white/10 font-mono">
          <Crosshair className="w-3.5 h-3.5 text-airbnb-coral" />
          <span>
            {latitude.toFixed(4)}° N, {Math.abs(longitude).toFixed(4)}° W
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={containerRef}
        onClick={handleMapClick}
        className="relative w-full aspect-[1326/1291] rounded-2xl overflow-hidden border border-white/15 bg-[#070B14] cursor-crosshair select-none group shadow-inner"
      >
        {/* Authentic Geographically Accurate Dark NYC Map Base */}
        <Image
          src="/nyc_map_dark.png"
          alt="Authentic New York City Geographic Map"
          fill
          priority
          className="object-cover pointer-events-none opacity-90"
        />

        {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* Borough Headquarter Markers */}
        {BOROUGH_PINS.map((b) => {
          const pos = getPercentPos(b.lat, b.lng);
          const isSelected = selectedBorough === b.name;

          return (
            <div
              key={b.name}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBorough?.(b.name);
                onChangeCoordinates(b.lat, b.lng);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
            >
              <div
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 border flex items-center gap-1 shadow-lg ${
                  isSelected
                    ? "bg-airbnb-red text-white border-white/40 shadow-glow scale-110"
                    : "bg-dark-950/85 text-slate-300 border-white/15 hover:text-white hover:border-airbnb-red/50 hover:scale-105"
                }`}
              >
                <MapPin className="w-2.5 h-2.5 text-airbnb-coral shrink-0" />
                <span>{b.name}</span>
              </div>
            </div>
          );
        })}

        {/* Pulsing Active Radar Pin */}
        <div
          style={{ left: `${currentPin.x}%`, top: `${currentPin.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-300 ease-out"
        >
          {/* Outer Ripple */}
          <div className="w-9 h-9 rounded-full border-2 border-airbnb-red/70 animate-ping absolute -inset-2" />
          {/* Inner Glow Circle */}
          <div className="w-5 h-5 rounded-full bg-airbnb-red/30 border border-airbnb-red flex items-center justify-center shadow-glow">
            {/* Center Core */}
            <div className="w-2 h-2 rounded-full bg-white shadow" />
          </div>
        </div>

        {/* Warning Toast for Invalid Empty Area Clicks */}
        {warningMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-dark-950/95 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xl backdrop-blur-md animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
          <span className="text-[10px] text-slate-300 bg-dark-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
            <Navigation className="w-2.5 h-2.5 text-accent-cyan" />
            Click on any borough to place GPS coordinates
          </span>
          <span className="text-[10px] text-airbnb-coral font-bold bg-dark-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-airbnb-red/30">
            {selectedNeighbourhood} ({selectedBorough})
          </span>
        </div>
      </div>

      {/* Borough Shortcut Pills */}
      <div className="mt-3.5 flex flex-wrap gap-1.5 justify-center">
        {BOROUGH_PINS.map((b) => (
          <button
            key={b.name}
            type="button"
            onClick={() => {
              onSelectBorough?.(b.name);
              onChangeCoordinates(b.lat, b.lng);
            }}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all duration-200 border cursor-pointer ${
              selectedBorough === b.name
                ? "bg-airbnb-red text-white border-airbnb-pink shadow-glow"
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
