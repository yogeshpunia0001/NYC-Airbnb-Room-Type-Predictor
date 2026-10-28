"use client";

import React from "react";
import Image from "next/image";
import { PRESET_LISTINGS } from "@/data/presets";
import { Zap, MapPin, Home, UserCheck, Users } from "lucide-react";

export default function PresetSelector() {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "Entire home/apt":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Private room":
        return "bg-airbnb-red/15 text-airbnb-coral border-airbnb-red/30";
      case "Shared room":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Entire home/apt":
        return <Home className="w-3 h-3 mr-1" />;
      case "Private room":
        return <UserCheck className="w-3 h-3 mr-1" />;
      case "Shared room":
        return <Users className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-airbnb-coral" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            NYC Listing Benchmarks & Categories
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Typical market configurations across NYC boroughs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_LISTINGS.map((preset) => (
          <div
            key={preset.id}
            className="relative p-3 rounded-2xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between cursor-default"
          >
            {/* Thumbnail banner */}
            <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3">
              <Image
                src={preset.image}
                alt={preset.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

              {/* Top Type Badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${getBadgeStyle(
                    preset.expectedType
                  )}`}
                >
                  {getIcon(preset.expectedType)}
                  {preset.expectedType}
                </span>
              </div>

              {/* Price pill */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-dark-950/85 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center">
                <span>${preset.features.price}</span>
                <span className="text-[10px] text-slate-400 font-normal">/night</span>
              </div>
            </div>

            {/* Title & Neighbourhood */}
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1">
                {preset.title}
              </h3>
              <div className="flex items-center text-xs text-slate-400 mb-2">
                <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                <span className="truncate">
                  {preset.neighbourhood}, {preset.borough}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {preset.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
