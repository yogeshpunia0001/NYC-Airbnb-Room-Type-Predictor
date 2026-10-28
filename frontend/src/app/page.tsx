"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import PresetSelector from "@/components/PresetSelector";
import InteractiveMap from "@/components/InteractiveMap";
import PredictionForm from "@/components/PredictionForm";
import PredictionResultCard from "@/components/PredictionResultCard";
import PredictionHistory from "@/components/PredictionHistory";
import ModelInfoModal from "@/components/ModelInfoModal";
import Footer from "@/components/Footer";
import { ListingFeatures, PredictionResponse, PresetListing, HistoryRecord } from "@/types";
import { PRESET_LISTINGS } from "@/data/presets";

export default function Home() {
  // Default Initial State: Standard Manhattan Listing
  const defaultFeatures: ListingFeatures = {
    latitude: 40.7128,
    longitude: -73.9654,
    neighbourhood_group: "Brooklyn",
    neighbourhood: "Williamsburg",
    price: 150.0,
    minimum_nights: 3,
    number_of_reviews: 25,
    reviews_per_month: 1.5,
    calculated_host_listings_count: 2,
    availability_365: 180,
  };

  const [features, setFeatures] = useState<ListingFeatures>(defaultFeatures);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  // Output is NOT shown by default on opening the website
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Modal & Drawer visibility
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState<boolean>(false);

  // Load history from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nyc_prediction_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Save history to localStorage
  const saveHistoryToStorage = (updated: HistoryRecord[]) => {
    setHistory(updated);
    try {
      localStorage.setItem("nyc_prediction_history", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  // Perform Room Type Prediction on explicit user action
  const handlePredict = useCallback(async () => {
    setLoading(true);
    setIsSaved(false);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      });

      if (!res.ok) {
        throw new Error("Failed to predict");
      }

      const data: PredictionResponse = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  }, [features]);

  // Handle Preset Selection (loads parameters without automatically triggering output)
  const handleSelectPreset = (preset: PresetListing) => {
    setActivePresetId(preset.id);
    setFeatures(preset.features);
    setPrediction(null);
    setIsSaved(false);
  };

  // Handle Coordinate changes from Map
  const handleChangeCoordinates = (lat: number, lng: number) => {
    setFeatures((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setActivePresetId(undefined);
  };

  // Handle Borough change from Map
  const handleSelectBoroughFromMap = (borough: string) => {
    setFeatures((prev) => ({
      ...prev,
      neighbourhood_group: borough,
    }));
  };

  // Handle Neighbourhood change from Map
  const handleSelectNeighbourhoodFromMap = (neighbourhood: string, price?: number) => {
    setFeatures((prev) => ({
      ...prev,
      neighbourhood,
      price: price || prev.price,
    }));
  };

  // Save current prediction to history
  const handleSaveToHistory = () => {
    if (!prediction) return;
    const newRecord: HistoryRecord = {
      id: "rec-" + Date.now(),
      timestamp: Date.now(),
      features,
      prediction,
    };
    const updated = [newRecord, ...history.slice(0, 19)];
    saveHistoryToStorage(updated);
    setIsSaved(true);
  };

  // Clear all saved history
  const handleClearHistory = () => {
    saveHistoryToStorage([]);
  };

  // Load a record from history back into current state
  const handleSelectRecord = (record: HistoryRecord) => {
    setFeatures(record.features);
    setPrediction(record.prediction);
    setActivePresetId(undefined);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-airbnb-red selection:text-white relative">
      {/* Ambient background mesh */}
      <div className="fixed inset-0 bg-mesh-dark pointer-events-none -z-10" />

      {/* Navigation Header with YP Logo Favicon */}
      <Header
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <HeroBanner />

        {/* Preset Listings Showcase */}
        <PresetSelector />

        {/* 2-Column Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Spatial Map + Form Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive NYC Map Visualizer */}
            <InteractiveMap
              latitude={features.latitude}
              longitude={features.longitude}
              selectedBorough={features.neighbourhood_group}
              selectedNeighbourhood={features.neighbourhood}
              onChangeCoordinates={handleChangeCoordinates}
              onSelectBorough={handleSelectBoroughFromMap}
              onSelectNeighbourhood={handleSelectNeighbourhoodFromMap}
            />

            {/* Input Feature Form */}
            <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 bg-dark-900/90 shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-wider text-white font-display">
                    Listing Features
                  </h2>
                  <p className="text-xs text-slate-400">
                    Input parameters for Random Forest pipeline
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  10 Model Dimensions
                </span>
              </div>

              <PredictionForm
                features={features}
                onChange={(updated) => {
                  setFeatures(updated);
                  setActivePresetId(undefined);
                }}
                onSubmit={handlePredict}
                loading={loading}
              />
            </div>
          </div>

          {/* Right Column: Prediction Result (Hidden by default until user predicts) (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <PredictionResultCard
              prediction={prediction}
              features={features}
              onSaveToHistory={handleSaveToHistory}
              isSaved={isSaved}
            />
          </div>
        </div>
      </main>

      {/* Prediction History Drawer */}
      <PredictionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectRecord={handleSelectRecord}
      />

      {/* Model Info Modal */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
      />

      {/* Project Footer */}
      <Footer />
    </div>
  );
}
