"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PredictionResponse, ListingFeatures } from "@/types";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Home,
  UserCheck,
  Users,
  Copy,
  Check,
  BookmarkPlus,
  Cpu,
  Clock,
  BarChart2,
  TrendingUp,
} from "lucide-react";

interface PredictionResultCardProps {
  prediction: PredictionResponse | null;
  features: ListingFeatures;
  onSaveToHistory: () => void;
  isSaved?: boolean;
}

export default function PredictionResultCard({
  prediction,
  features,
  onSaveToHistory,
  isSaved = false,
}: PredictionResultCardProps) {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti only when prediction arrives
  useEffect(() => {
    if (!prediction) return;
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#FF385C", "#00F2FE", "#A855F7", "#10B981"],
      });
    } catch {
      // Confetti fallback
    }
  }, [prediction]);

  // When no prediction has been executed yet, show clean awaiting input state
  if (!prediction) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 rounded-3xl glass-panel border border-white/10 text-center min-h-[460px] bg-dark-900/60">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
          <Sparkles className="w-8 h-8 text-airbnb-red animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-display">
          Awaiting Model Prediction
        </h3>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
          Adjust the listing parameters or pick a preset, then click{" "}
          <strong className="text-slate-200">&ldquo;Predict Room Type&rdquo;</strong> to run the Random Forest classification pipeline.
        </p>

        <div className="w-full max-w-xs space-y-2 text-left p-3.5 rounded-2xl bg-dark-950/70 border border-white/5 mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Target Classification Classes</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Entire home/apt
            </span>
            <span className="text-[11px] font-mono text-slate-400">52.0%</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-airbnb-coral" /> Private room
            </span>
            <span className="text-[11px] font-mono text-slate-400">45.7%</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Shared room
            </span>
            <span className="text-[11px] font-mono text-slate-400">2.3%</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span>RandomForestClassifier &bull; 85.8% Test Accuracy</span>
        </div>
      </div>
    );
  }

  const roomType = prediction.predicted_room_type;
  const probs = prediction.confidence_probabilities;

  // Visual Theme Mapping matching pipeline target classes
  const getTheme = () => {
    switch (roomType) {
      case "Entire home/apt":
        return {
          title: "Entire home/apt",
          sub: "Independent private accommodation with full private access to the entire apartment or home.",
          icon: <Home className="w-5 h-5 text-accent-cyan" />,
          badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-glow-cyan",
          image: "/entire_home_apt.jpg",
          accentColor: "#00F2FE",
        };
      case "Private room":
        return {
          title: "Private room",
          sub: "Dedicated private bedroom while sharing common areas (bathroom, kitchen, living) with others.",
          icon: <UserCheck className="w-5 h-5 text-airbnb-coral" />,
          badgeColor: "bg-airbnb-red/20 text-airbnb-coral border-airbnb-red/40 shadow-glow",
          image: "/private_room.jpg",
          accentColor: "#FF385C",
        };
      case "Shared room":
        return {
          title: "Shared room",
          sub: "Shared sleeping quarters with multiple beds in a common co-living or hostel space.",
          icon: <Users className="w-5 h-5 text-emerald-400" />,
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-glow",
          image: "/shared_room.jpg",
          accentColor: "#10B981",
        };
      default:
        return {
          title: roomType,
          sub: "Model classification output.",
          icon: <Sparkles className="w-5 h-5 text-purple-400" />,
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/40",
          image: "/entire_home_apt.jpg",
          accentColor: "#A855F7",
        };
    }
  };

  const theme = getTheme();
  const highestProb = Math.max(...Object.values(probs));
  const confidencePercent = Math.round(highestProb * 100);

  const handleCopyJSON = () => {
    const payload = JSON.stringify({ features, prediction }, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl glass-panel border border-white/15 bg-dark-900/90 shadow-2xl relative overflow-hidden transition-all duration-500">
      {/* Background glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: theme.accentColor }}
      />

      <div>
        {/* Output Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Model Prediction Output
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
              {prediction.source === "fastapi" ? "FastAPI Server" : "Inference"}
            </span>
            {prediction.execution_time_ms !== undefined && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-accent-cyan" />
                {prediction.execution_time_ms}ms
              </span>
            )}
          </div>
        </div>

        {/* Accommodation Showcase */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg group">
          <Image
            src={theme.image}
            alt={theme.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />

          {/* Predicted Class Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold border backdrop-blur-md ${theme.badgeColor}`}
            >
              {theme.icon}
              <span className="ml-1 tracking-wide">{theme.title}</span>
            </span>
          </div>

          {/* Probability Pill */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-dark-950/85 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent-emerald" />
            <span>{confidencePercent}% Probability</span>
          </div>
        </div>

        {/* Prediction Headline */}
        <div className="mb-5">
          <h2 className="text-2xl font-black font-display text-white tracking-tight mb-1">
            {theme.title}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {theme.sub}
          </p>
        </div>

        {/* Probability Distribution */}
        <div className="space-y-3 mb-5 p-4 rounded-2xl bg-dark-950/60 border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span>Class</span>
            <span>Probability</span>
          </div>

          {[
            { key: "Entire home/apt", label: "Entire home/apt", color: "from-cyan-500 to-blue-500" },
            { key: "Private room", label: "Private room", color: "from-airbnb-red to-pink-500" },
            { key: "Shared room", label: "Shared room", color: "from-emerald-400 to-teal-500" },
          ].map((item) => {
            const prob = probs[item.key] || 0;
            const pct = Math.round(prob * 100);
            const isWinner = roomType === item.key;

            return (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span
                    className={`font-medium ${
                      isWinner ? "text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`font-mono ${
                      isWinner ? "text-white font-bold" : "text-slate-400"
                    }`}
                  >
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Snapshot */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 mb-5 text-[11px] text-slate-300 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Location:</span>
            <span className="font-medium text-white">{features.neighbourhood}, {features.neighbourhood_group}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Coordinates:</span>
            <span className="font-mono text-white">{features.latitude.toFixed(4)}, {features.longitude.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Price / Min Nights:</span>
            <span className="font-mono text-white">${features.price} / {features.minimum_nights}d</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Availability:</span>
            <span className="font-mono text-white">{features.availability_365} / 365 days</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onSaveToHistory}
          disabled={isSaved}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border ${
            isSaved
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-white/10 hover:bg-white/15 text-white border-white/10"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved to History</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5 text-accent-purple" />
              <span>Save Record</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleCopyJSON}
          className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
          title="Copy JSON Payload"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>JSON</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
