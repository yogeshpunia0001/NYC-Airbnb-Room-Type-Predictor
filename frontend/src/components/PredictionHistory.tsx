"use client";

import React from "react";
import { HistoryRecord } from "@/types";
import { X, Trash2, ArrowUpRight, Clock, MapPin, DollarSign } from "lucide-react";

interface PredictionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onClearHistory: () => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

export default function PredictionHistory({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectRecord,
}: PredictionHistoryProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-dark-900 border-l border-white/10 h-full flex flex-col shadow-2xl relative z-50">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-accent-purple" />
            <h2 className="text-base font-bold text-white font-display">
              Prediction History
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Clock className="w-12 h-12 text-slate-400 mb-3" />
              <p className="text-sm font-semibold text-slate-300 mb-1">
                No saved predictions yet
              </p>
              <p className="text-xs text-slate-400">
                Run an ML prediction and click &ldquo;Save Record&rdquo; to store and compare items here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const p = item.prediction;
              const f = item.features;
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-airbnb-red/40 transition-all cursor-pointer group"
                  onClick={() => {
                    onSelectRecord(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-airbnb-coral">
                      {p.predicted_room_type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <div className="text-xs text-white font-semibold flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{f.neighbourhood}, {f.neighbourhood_group}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                    <span className="text-white font-mono font-medium">
                      ${f.price}/night &bull; {f.minimum_nights}d min
                    </span>
                    <span className="text-accent-cyan flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Load params <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
