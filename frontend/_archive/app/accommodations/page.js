"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccommodationCard from '@/components/AccommodationCard';
import { ACCOMMODATIONS } from '@/data/accommodations';
import { useState, useMemo } from 'react';

export default function AccommodationsPage() {
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const destinations = ['All', 'Hunza', 'Naran', 'Skardu', 'Swat'];
  const types = ['All', 'Luxury Resort', 'Lakeside Resort', 'Alpine Hotel', 'Heritage Resort', 'Mountain & Ski Resort'];

  const filteredHotels = useMemo(() => {
    return ACCOMMODATIONS.filter((item) => {
      const matchDest = selectedDestination === 'All' || item.location.toLowerCase().includes(selectedDestination.toLowerCase());
      const matchType = selectedType === 'All' || item.type === selectedType;
      return matchDest && matchType;
    });
  }, [selectedDestination, selectedType]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
            Eco-Lodge & Hotel Vacancy Portal
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#041627]">
            Find Accommodations & Real-Time Availability
          </h1>
          <p className="text-sm text-[#575A60] max-w-2xl">
            Book verified hotels and alpine lodges with live room vacancy tracking and surrounding area density scores.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Destination</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] text-xs font-semibold text-[#1A1C1C] bg-[#FAF9F8]"
            >
              {destinations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Property Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] text-xs font-semibold text-[#1A1C1C] bg-[#FAF9F8]"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setSelectedDestination('All'); setSelectedType('All'); }}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset Search
            </button>
          </div>
        </div>

        {/* Accommodations List */}
        <div className="space-y-6">
          {filteredHotels.map((hotel) => (
            <AccommodationCard key={hotel.id} item={hotel} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
