"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrowdBadge from '@/components/CrowdBadge';
import SafetyBadge from '@/components/SafetyBadge';
import { DESTINATIONS } from '@/data/destinations';
import { SAFETY_ALERTS } from '@/data/safetyAlerts';
import { useState } from 'react';
import Link from 'next/link';

export default function CrowdMapPage() {
  const [selectedDestination, setSelectedDestination] = useState(DESTINATIONS[0]);
  const [activeTab, setActiveTab] = useState('zones'); // 'zones', 'sensors', 'bottlenecks'

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        
        {/* ========================================== */}
        {/* LEFT SIDEBAR - CONTROL & ZONE LIST */}
        {/* ========================================== */}
        <div className="w-full lg:w-96 bg-white border-r border-[#E5E3DC] flex flex-col h-full z-20 shadow-md">
          
          {/* Header & Tabs */}
          <div className="p-5 border-b border-[#E5E3DC] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0051D5]">
                  GIS Density Telemetry
                </span>
                <h1 className="font-serif-editorial text-2xl font-bold text-[#041627]">
                  Live Crowd Map
                </h1>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>LIVE FEED</span>
              </span>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#FAF9F8] p-1 rounded-xl border border-[#E5E3DC] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('zones')}
                className={`py-2 rounded-lg text-center transition-colors ${
                  activeTab === 'zones' ? 'bg-[#041627] text-white shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                Hotspots
              </button>
              <button
                onClick={() => setActiveTab('sensors')}
                className={`py-2 rounded-lg text-center transition-colors ${
                  activeTab === 'sensors' ? 'bg-[#041627] text-white shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                Sensors
              </button>
              <button
                onClick={() => setActiveTab('bottlenecks')}
                className={`py-2 rounded-lg text-center transition-colors ${
                  activeTab === 'bottlenecks' ? 'bg-[#041627] text-white shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                Bottlenecks
              </button>
            </div>
          </div>

          {/* Tab Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {activeTab === 'zones' && (
              <>
                <p className="text-[11px] text-[#575A60] px-1 font-medium">Select a zone to inspect real-time capacity metrics:</p>
                {DESTINATIONS.map((dest) => {
                  const isSelected = selectedDestination.id === dest.id;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => setSelectedDestination(dest)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#041627] bg-[#FAF9F8] ring-2 ring-[#041627]/10 shadow-sm' 
                          : 'border-[#E5E3DC] bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{dest.region}</span>
                          <h3 className="font-serif-editorial text-lg font-bold text-[#041627]">{dest.name}</h3>
                        </div>
                        <CrowdBadge level={dest.crowdLevel} score={dest.crowdScore} size="sm" />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-[#F0EEE9]">
                        <span>{dest.liveVisitors.toLocaleString()} Visitors</span>
                        <span className="font-mono text-[11px]">{dest.capacityStatus}</span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {activeTab === 'sensors' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">N-35 Karakoram Highway (KM 380)</span>
                    <span className="text-emerald-700 font-mono text-[10px]">Active Sensor #41</span>
                  </div>
                  <p className="text-xs text-slate-600">Camera Telemetry: 142 vehicles/hour passing north bound towards Karimabad.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Babu Sar Pass Checkpoint</span>
                    <span className="text-amber-700 font-mono text-[10px]">Active Sensor #18</span>
                  </div>
                  <p className="text-xs text-slate-600">Heavy tourist bus queue detected. Estimated transit delay: 45 minutes.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Attabad Tunnel Gate</span>
                    <span className="text-emerald-700 font-mono text-[10px]">Active Sensor #09</span>
                  </div>
                  <p className="text-xs text-slate-600">Smooth traffic flow. Average vehicle speed: 50 km/h.</p>
                </div>
              </div>
            )}

            {activeTab === 'bottlenecks' && (
              <div className="space-y-3">
                {SAFETY_ALERTS.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-900">{alert.category}</span>
                      <SafetyBadge status={alert.severity} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-[11px] text-slate-700">{alert.recommendedAction}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer Quick CTA */}
          <div className="p-4 border-t border-[#E5E3DC] bg-[#FAF9F8]">
            <Link
              href={`/destinations/${selectedDestination.id}`}
              className="block w-full text-center py-2.5 rounded-xl bg-[#041627] hover:bg-[#003120] text-white font-semibold text-xs transition-colors"
            >
              Explore {selectedDestination.name} Guide →
            </Link>
          </div>

        </div>

        {/* ========================================== */}
        {/* RIGHT INTERACTIVE MAP CANVAS */}
        {/* ========================================== */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col justify-between p-6">
          
          {/* Map Overlay Simulation Header */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-white">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-amber-400 text-2xl">map</span>
              <div>
                <h2 className="font-serif-editorial text-lg font-bold">
                  Northern Pakistan GIS Layer: {selectedDestination.name}
                </h2>
                <span className="text-[11px] text-slate-400">
                  Coordinates: {selectedDestination.coordinates.lat}° N, {selectedDestination.coordinates.lng}° E
                </span>
              </div>
            </div>

            {/* Map Legend */}
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Low</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Moderate</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>High</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Critical</span>
              </span>
            </div>
          </div>

          {/* Map Graphic Canvas Simulation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
            {/* Topographic Map Background Pattern */}
            <div className="w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950 relative">
              
              {/* Animated Map Hotspot Pins */}
              {DESTINATIONS.map((dest, i) => {
                const isSelected = dest.id === selectedDestination.id;
                // Offset map pins for visual simulation
                const positions = [
                  { top: '35%', left: '55%' }, // Hunza
                  { top: '40%', left: '65%' }, // Attabad
                  { top: '65%', left: '45%' }, // Naran
                  { top: '30%', left: '75%' }, // Skardu
                  { top: '60%', left: '30%' }, // Swat
                  { top: '80%', left: '40%' }, // Murree
                ];
                const pos = positions[i % positions.length];

                let color = "bg-emerald-500";
                if (dest.crowdLevel === "Moderate") color = "bg-amber-500";
                if (dest.crowdLevel === "High") color = "bg-orange-500";
                if (dest.crowdLevel === "Critical") color = "bg-red-500 animate-bounce";

                return (
                  <div
                    key={dest.id}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute pointer-events-auto cursor-pointer transition-all transform hover:scale-125 ${
                      isSelected ? 'z-30 scale-125' : 'z-10'
                    }`}
                    onClick={() => setSelectedDestination(dest)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`w-8 h-8 rounded-full ${color} opacity-40 animate-ping absolute`}></span>
                      <div className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-xs`}>
                        {dest.crowdScore}%
                      </div>
                    </div>
                    <div className="mt-1 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs whitespace-nowrap text-center">
                      {dest.name}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Bottom Selected Hotspot Info Overlay Card */}
          <div className="relative z-10 max-w-lg bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 text-white shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{selectedDestination.region}</span>
                <h3 className="font-serif-editorial text-xl font-bold">{selectedDestination.name}</h3>
              </div>
              <CrowdBadge level={selectedDestination.crowdLevel} score={selectedDestination.crowdScore} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <div>
                <span className="text-slate-400 text-[10px] block">Live Tourists</span>
                <strong className="text-white font-mono">{selectedDestination.liveVisitors.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Weather</span>
                <strong className="text-amber-300">{selectedDestination.weather.temp}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Open Lodges</span>
                <strong className="text-emerald-400">{selectedDestination.accommodationsAvailable}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-1">{selectedDestination.tagline}</p>
          </div>

        </div>

      </main>
    </div>
  );
}
