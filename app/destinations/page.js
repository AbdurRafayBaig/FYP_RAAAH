"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard from '@/components/DestinationCard';
import { DESTINATIONS } from '@/data/destinations';
import { useState, useMemo } from 'react';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [crowdFilter, setCrowdFilter] = useState('All');

  const regions = ['All', 'Gilgit-Baltistan', 'Khyber Pakhtunkhwa', 'Punjab'];
  const crowdLevels = ['All', 'Low', 'Moderate', 'High', 'Critical'];

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.highlights?.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRegion = selectedRegion === 'All' || item.region.includes(selectedRegion);
      const matchesCrowd = crowdFilter === 'All' || item.crowdLevel.toLowerCase() === crowdFilter.toLowerCase();
      
      return matchesSearch && matchesRegion && matchesCrowd;
    });
  }, [searchQuery, selectedRegion, crowdFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Page Title & Intro */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider block">
            Explore Northern Pakistan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211F]">
            Travel Destinations
          </h1>
          <p className="text-xs sm:text-sm text-[#66736F] max-w-2xl leading-relaxed">
            Discover destinations across Gilgit-Baltistan, KP, and Punjab. Check current crowd levels, weather, and safety conditions before travelling.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-stone-400 text-xl">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination, valley, lake, or fort..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] focus:outline-none focus:border-[#164A41] bg-[#F7F8F5]"
              />
            </div>

            {/* Region Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs font-medium text-[#17211F] bg-[#F7F8F5] focus:outline-none"
              >
                {regions.map((reg) => (
                  <option key={reg} value={reg}>Region: {reg}</option>
                ))}
              </select>
            </div>

            {/* Crowd Filter */}
            <div className="md:col-span-3">
              <select
                value={crowdFilter}
                onChange={(e) => setCrowdFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs font-medium text-[#17211F] bg-[#F7F8F5] focus:outline-none"
              >
                {crowdLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>Crowd Level: {lvl}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Summary */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-[#66736F]">
            <span>Showing <strong>{filteredDestinations.length}</strong> of {DESTINATIONS.length} destinations</span>
            {(searchQuery || selectedRegion !== 'All' || crowdFilter !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedRegion('All'); setCrowdFilter('All'); }}
                className="text-[#164A41] font-semibold hover:underline"
              >
                Clear Filters
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
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 space-y-3">
            <span className="material-symbols-outlined text-4xl text-stone-400">search_off</span>
            <h3 className="text-lg font-bold text-[#17211F]">No Destinations Found</h3>
            <p className="text-xs text-[#66736F]">Try searching with a different term or clearing your filters.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
