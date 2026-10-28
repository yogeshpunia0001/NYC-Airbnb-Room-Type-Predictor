"use client";

import React, { useState, useMemo } from "react";
import { ListingFeatures } from "@/types";
import nycDataRaw from "@/data/nyc_data.json";
import {
  DollarSign,
  Calendar,
  MessageSquare,
  Building,
  Clock,
  Sparkles,
  Search,
  MapPin,
  Compass,
} from "lucide-react";

interface PredictionFormProps {
  features: ListingFeatures;
  onChange: (updated: ListingFeatures) => void;
  onSubmit: () => void;
  loading: boolean;
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

const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

export default function PredictionForm({
  features,
  onChange,
  onSubmit,
  loading,
}: PredictionFormProps) {
  const [hoodSearch, setHoodSearch] = useState("");
  const [isHoodDropdownOpen, setIsHoodDropdownOpen] = useState(false);

  // Available neighbourhoods for selected borough
  const currentBoroughData = nycData[features.neighbourhood_group] || nycData["Manhattan"];
  const availableHoods = currentBoroughData?.neighbourhoods || [];

  const filteredHoods = useMemo(() => {
    if (!hoodSearch.trim()) return availableHoods.slice(0, 35);
    return availableHoods.filter((h) =>
      h.name.toLowerCase().includes(hoodSearch.toLowerCase())
    );
  }, [availableHoods, hoodSearch]);

  const handleBoroughChange = (borough: string) => {
    const bData = nycData[borough];
    const firstHood = bData?.neighbourhoods[0];
    onChange({
      ...features,
      neighbourhood_group: borough,
      neighbourhood: firstHood ? firstHood.name : features.neighbourhood,
      latitude: firstHood ? firstHood.lat : bData.center.lat,
      longitude: firstHood ? firstHood.lng : bData.center.lng,
      price: firstHood ? firstHood.avgPrice : features.price,
    });
  };

  const handleNeighbourhoodSelect = (hood: (typeof availableHoods)[0]) => {
    onChange({
      ...features,
      neighbourhood: hood.name,
      latitude: hood.lat,
      longitude: hood.lng,
      price: hood.avgPrice,
    });
    setIsHoodDropdownOpen(false);
    setHoodSearch("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      {/* ─── 1. neighbourhood_group ─────────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          1. Neighbourhood Group (Borough)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {BOROUGHS.map((b) => {
            const isSelected = features.neighbourhood_group === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => handleBoroughChange(b)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 border flex items-center justify-center ${
                  isSelected
                    ? "bg-airbnb-red text-white border-airbnb-pink shadow-glow"
                    : "glass-input text-slate-300 hover:text-white hover:bg-white/10 border-white/10"
                }`}
              >
                <span>{b}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. neighbourhood ──────────────────────────────────────────────── */}
      <div className="relative">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
          2. Neighbourhood ({features.neighbourhood_group})
        </label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={isHoodDropdownOpen ? hoodSearch : features.neighbourhood}
              onFocus={() => {
                setIsHoodDropdownOpen(true);
                setHoodSearch("");
              }}
              onChange={(e) => {
                setHoodSearch(e.target.value);
                setIsHoodDropdownOpen(true);
              }}
              placeholder={`Search in ${features.neighbourhood_group}...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm glass-input font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsHoodDropdownOpen(!isHoodDropdownOpen)}
            className="px-3 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 shrink-0"
          >
            <span>Browse</span>
          </button>
        </div>

        {isHoodDropdownOpen && (
          <div className="absolute z-40 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl glass-panel bg-dark-900 border border-white/15 shadow-2xl p-1.5">
            <div className="text-[11px] text-slate-400 px-3 py-1 font-semibold uppercase tracking-wider">
              Select Neighbourhood ({filteredHoods.length} matches)
            </div>
            {filteredHoods.map((hood) => (
              <button
                key={hood.name}
                type="button"
                onClick={() => handleNeighbourhoodSelect(hood)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  features.neighbourhood === hood.name
                    ? "bg-airbnb-red/20 text-white font-bold"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{hood.name}</span>
                <span className="text-[11px] text-slate-400">
                  Avg ${hood.avgPrice}/night
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── 3. Geographic Coordinates: latitude & longitude ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl glass-panel border border-white/10">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-accent-cyan" />
            Latitude (40.0 to 41.5)
          </label>
          <input
            type="number"
            step="0.0001"
            min={40.0}
            max={41.5}
            value={features.latitude}
            onChange={(e) =>
              onChange({ ...features, latitude: parseFloat(e.target.value) || 40.7128 })
            }
            className="w-full px-3 py-2 rounded-xl text-sm font-bold font-mono glass-input text-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-airbnb-coral" />
            Longitude (-75.0 to -73.0)
          </label>
          <input
            type="number"
            step="0.0001"
            min={-75.0}
            max={-73.0}
            value={features.longitude}
            onChange={(e) =>
              onChange({ ...features, longitude: parseFloat(e.target.value) || -73.9654 })
            }
            className="w-full px-3 py-2 rounded-xl text-sm font-bold font-mono glass-input text-white"
          />
        </div>
      </div>

      {/* ─── 4. price ───────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-airbnb-coral" />
            Price ($ USD / night)
          </label>
          <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
            ${features.price}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-36 shrink-0">
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">$</span>
            <input
              type="number"
              min={0}
              max={10000}
              value={features.price}
              onChange={(e) =>
                onChange({ ...features, price: Math.max(0, Number(e.target.value)) })
              }
              className="w-full pl-7 pr-3 py-2 rounded-xl text-base font-bold font-mono glass-input text-white"
            />
          </div>
          <input
            type="range"
            min={10}
            max={600}
            step={5}
            value={Math.min(features.price, 600)}
            onChange={(e) => onChange({ ...features, price: Number(e.target.value) })}
            className="flex-1 accent-airbnb-red cursor-pointer"
          />
        </div>
      </div>

      {/* ─── 5. minimum_nights & availability_365 ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* minimum_nights */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent-cyan" />
              Minimum Nights
            </label>
            <span className="text-xs font-mono font-bold text-white">
              {features.minimum_nights} {features.minimum_nights === 1 ? "night" : "nights"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={features.minimum_nights}
              onChange={(e) =>
                onChange({ ...features, minimum_nights: Math.max(1, Number(e.target.value)) })
              }
              className="w-20 px-2.5 py-1.5 rounded-lg text-sm font-bold font-mono glass-input"
            />
            <input
              type="range"
              min={1}
              max={30}
              value={Math.min(features.minimum_nights, 30)}
              onChange={(e) =>
                onChange({ ...features, minimum_nights: Number(e.target.value) })
              }
              className="flex-1 accent-accent-cyan cursor-pointer"
            />
          </div>
        </div>

        {/* availability_365 */}
        <div className="p-3.5 rounded-2xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-purple" />
              Availability 365
            </label>
            <span className="text-xs font-mono font-bold text-white">
              {features.availability_365} / 365 days
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={365}
              value={features.availability_365}
              onChange={(e) =>
                onChange({
                  ...features,
                  availability_365: Math.max(0, Math.min(365, Number(e.target.value))),
                })
              }
              className="w-20 px-2.5 py-1.5 rounded-lg text-sm font-bold font-mono glass-input"
            />
            <input
              type="range"
              min={0}
              max={365}
              step={5}
              value={features.availability_365}
              onChange={(e) =>
                onChange({ ...features, availability_365: Number(e.target.value) })
              }
              className="flex-1 accent-accent-purple cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ─── 6. Activity & Host Features ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* number_of_reviews */}
        <div className="p-3.5 rounded-xl glass-panel border border-white/10">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-accent-cyan" />
            Number of Reviews
          </label>
          <input
            type="number"
            min={0}
            max={1000}
            value={features.number_of_reviews}
            onChange={(e) =>
              onChange({
                ...features,
                number_of_reviews: Math.max(0, Number(e.target.value)),
              })
            }
            className="w-full px-3 py-1.5 rounded-lg text-sm font-bold font-mono glass-input"
          />
        </div>

        {/* reviews_per_month */}
        <div className="p-3.5 rounded-xl glass-panel border border-white/10">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            Reviews per Month
          </label>
          <input
            type="number"
            step="0.01"
            min={0.0}
            max={50.0}
            value={features.reviews_per_month}
            onChange={(e) =>
              onChange({
                ...features,
                reviews_per_month: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }
            className="w-full px-3 py-1.5 rounded-lg text-sm font-bold font-mono glass-input"
          />
        </div>

        {/* calculated_host_listings_count */}
        <div className="p-3.5 rounded-xl glass-panel border border-white/10">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
            <Building className="w-3.5 h-3.5 text-accent-emerald" />
            Host Listings Count
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={features.calculated_host_listings_count}
            onChange={(e) =>
              onChange({
                ...features,
                calculated_host_listings_count: Math.max(1, Number(e.target.value)),
              })
            }
            className="w-full px-3 py-1.5 rounded-lg text-sm font-bold font-mono glass-input"
          />
        </div>
      </div>

      {/* ─── Submit Action Button ─────────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-4 px-6 rounded-2xl font-display font-extrabold text-base tracking-wide text-white overflow-hidden group shadow-glow hover:shadow-airbnb-red/50 transition-all duration-300 disabled:opacity-60 cursor-pointer"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-airbnb-red via-airbnb-pink to-accent-purple group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-slide pointer-events-none" />

          <div className="relative flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Random Forest Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Predict Room Type</span>
              </>
            )}
          </div>
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-2">
          Executes <code className="text-slate-300">RandomForestClassifier</code> pipeline inference
        </p>
      </div>
    </form>
  );
}
