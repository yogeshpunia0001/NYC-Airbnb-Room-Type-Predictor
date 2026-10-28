"use client";

import React from "react";
import Image from "next/image";
import { History, Info } from "lucide-react";

interface HeaderProps {
  onOpenModelInfo: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export default function Header({
  onOpenModelInfo,
  onOpenHistory,
  historyCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-dark-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-glow shrink-0">
            <Image
              src="/favicon.png"
              alt="YP Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-display">
                NYC Room Predictor
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-airbnb-red/15 border border-airbnb-red/30 text-airbnb-coral">
                Random Forest
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              FastAPI + Scikit-Learn Pipeline
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Model info button */}
          <button
            type="button"
            onClick={onOpenModelInfo}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="hidden sm:inline">Model Specs</span>
          </button>

          {/* History drawer trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-accent-purple" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-airbnb-red text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
