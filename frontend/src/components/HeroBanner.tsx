"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Cpu, ShieldCheck } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-dark-900 shadow-2xl mb-8 group">
      {/* High-Visibility NYC Skyline Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/nyc_dark_skyline.jpg"
          alt="NYC Skyline at Dusk"
          fill
          priority
          className="object-cover object-center opacity-85 group-hover:scale-102 transition-transform duration-1000 ease-out"
        />
        {/* Soft, minimal gradient overlay so the skyline is prominently visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/85 via-dark-950/45 to-dark-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between max-w-3xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-airbnb-red/25 text-white border border-airbnb-red/40 backdrop-blur-md shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-airbnb-coral" />
            <span>AI Real Estate Analytics</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-dark-950/70 text-slate-200 border border-white/20 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Random Forest Pipeline</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-dark-950/70 text-slate-200 border border-white/20 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
            <span>NYC Open Data (2019)</span>
          </div>
        </div>

        {/* Main Heading with crisp drop-shadow */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white mb-4 leading-tight drop-shadow-lg">
          Classify New York City <br />
          <span className="text-gradient-airbnb">Airbnb Room Types</span> with Machine Learning
        </h1>

        <p className="text-slate-100 text-sm sm:text-base max-w-2xl leading-relaxed mb-6 drop-shadow-md bg-dark-950/40 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
          Predict whether an NYC rental operates as an{" "}
          <strong className="text-white font-bold">Entire Home/Apt</strong>,{" "}
          <strong className="text-white font-bold">Private Room</strong>, or{" "}
          <strong className="text-white font-bold">Shared Space</strong> using a tuned Random Forest classifier trained on 48,895 verified listings.
        </p>

        {/* Dynamic Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 bg-dark-950/50 p-3.5 rounded-2xl border backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white font-display">48,895</span>
            <span className="text-xs text-slate-300">Trained Listings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-accent-cyan font-display">221</span>
            <span className="text-xs text-slate-300">Neighbourhoods</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-airbnb-coral font-display">3 Types</span>
            <span className="text-xs text-slate-300">Target Classes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-accent-emerald font-display">85.8%</span>
            <span className="text-xs text-slate-300">Test Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
