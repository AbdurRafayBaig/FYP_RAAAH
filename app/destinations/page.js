"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { DESTINATIONS } from '@/data/destinations';
import { useState, useMemo } from 'react';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [densityFilter, setDensityFilter] = useState('All');

  const regions = ['All', 'Gilgit-Baltistan', 'Khyber Pakhtunkhwa', 'Punjab'];
  const densityLevels = ['All', 'Low', 'Moderate', 'High', 'Critical'];

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRegion = selectedRegion === 'All' || item.region.includes(selectedRegion);
      const matchesDensity = densityFilter === 'All' || item.crowdLevel.toLowerCase() === densityFilter.toLowerCase();
      
      return matchesSearch && matchesRegion && matchesDensity;
    });
  }, [searchQuery, selectedRegion, densityFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Page Title & Intro */}
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
            Real-Time Northern Corridor Explorer
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#041627]">
            Northern Pakistan Destinations
          </h1>
          <p className="text-sm text-[#575A60] max-w-2xl">
            Compare live crowd density, weather conditions, and available eco-lodges across Hunza, Skardu, Naran, Swat, and Murree.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination name, fort, lake, or peak..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3DC] text-sm text-[#1A1C1C] focus:outline-none focus:border-[#041627] bg-[#FAF9F8]"
              />
            </div>

            {/* Region Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] text-xs font-semibold text-[#1A1C1C] bg-[#FAF9F8] focus:outline-none"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>Region: {reg}</option>
                ))}
              </select>
            </div>

            {/* Density Level Filter */}
            <div className="md:col-span-3">
              <select
                value={densityFilter}
                onChange={(e) => setDensityFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] text-xs font-semibold text-[#1A1C1C] bg-[#FAF9F8] focus:outline-none"
              >
                {densityLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>Density: {lvl}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Active Filter Pills */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F0EEE9] text-[#575A60]">
            <span>Showing <strong>{filteredDestinations.length}</strong> of {DESTINATIONS.length} destinations</span>
            {(searchQuery || selectedRegion !== 'All' || densityFilter !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedRegion('All'); setDensityFilter('All'); }}
                className="text-red-700 font-semibold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Destination Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((item) => (
              <DestinationCard key={item.id} destination={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E3DC] space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">search_off</span>
            <h3 className="font-serif-editorial text-xl font-bold text-[#041627]">No Destinations Found</h3>
            <p className="text-xs text-[#575A60]">Try adjusting your search criteria or density filters.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
