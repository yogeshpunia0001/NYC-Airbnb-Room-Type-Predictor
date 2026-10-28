"use client";

import React from "react";
import { X, Cpu, CheckCircle2, Layers, BarChart2 } from "lucide-react";

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelInfoModal({ isOpen, onClose }: ModelInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-dark-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-airbnb-red/15 border border-airbnb-red/30 flex items-center justify-center text-airbnb-coral">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                Random Forest ML Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Model Pipeline Specifications & Evaluation Metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Key Evaluation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-dark-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Test Accuracy</span>
              <span className="text-xl font-black text-accent-cyan font-display">85.79%</span>
            </div>
            <div className="p-3 rounded-2xl bg-dark-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Macro F1</span>
              <span className="text-xl font-black text-emerald-400 font-display">0.754</span>
            </div>
            <div className="p-3 rounded-2xl bg-dark-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">CV Score</span>
              <span className="text-xl font-black text-purple-400 font-display">0.738</span>
            </div>
            <div className="p-3 rounded-2xl bg-dark-950 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Estimators</span>
              <span className="text-xl font-black text-airbnb-coral font-display">100 Trees</span>
            </div>
          </div>

          {/* Pipeline Details */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Layers className="w-4 h-4 text-accent-cyan" />
              <span>Scikit-Learn Pipeline Composition</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Serialized in <code>Model_Pipeline.pkl</code> and served via <strong>FastAPI</strong>:
            </p>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 pl-1">
              <li>
                <strong>Numerical Pipeline:</strong> <code>SimpleImputer(median)</code> &rarr; <code>StandardScaler</code> on 8 features.
              </li>
              <li>
                <strong>Categorical Pipeline:</strong> <code>SimpleImputer(most_frequent)</code> &rarr; <code>OneHotEncoder(ignore)</code> on <code>neighbourhood_group</code> and <code>neighbourhood</code>.
              </li>
              <li>
                <strong>Classifier:</strong> <code>RandomForestClassifier(n_estimators=100, class_weight=&apos;balanced&apos;, random_state=42)</code>
              </li>
            </ul>
          </div>

          {/* Target Classes */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Classification Target Classes (AB_NYC_2019)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-300">Entire home/apt</span>
                <span className="text-xs font-mono font-bold text-cyan-400">25,409 (52%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-300">Private room</span>
                <span className="text-xs font-mono font-bold text-airbnb-coral">22,326 (46%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-300">Shared room</span>
                <span className="text-xs font-mono font-bold text-emerald-400">1,160 (2%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
