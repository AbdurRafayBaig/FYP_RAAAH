"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function ReportHazardPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-3 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-red-700">
            Crowdsourced Safety Intelligence
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#041627]">
            Report a Road Hazard or Landslide
          </h1>
          <p className="text-xs sm:text-sm text-[#575A60]">
            Report road blockages, flash floods, or traffic gridlocks. Submissions are verified by RAAAH operations team & forwarded to Rescue 1122 and NHA.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-200 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
            <h2 className="font-serif-editorial text-2xl font-bold text-emerald-950">Report Submitted Successfully</h2>
            <p className="text-xs text-emerald-800">
              Thank you for keeping Northern travelers safe. Your hazard report has been routed to GBDMA control room.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form 
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-white p-8 rounded-3xl border border-[#E5E3DC] shadow-sm space-y-6"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Hazard Category</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] text-xs font-semibold text-[#1A1C1C] bg-[#FAF9F8]">
                <option>Landslide Blockage</option>
                <option>Traffic Gridlock</option>
                <option>Flash Flood / Glacial Melt</option>
                <option>Heavy Snowfall / Black Ice</option>
                <option>Bridge Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Corridor / Location</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Karakoram Highway near Aliabad, or Babusar Top KM 14"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] text-xs text-[#1A1C1C] bg-[#FAF9F8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Detailed Description</label>
              <textarea 
                rows="4"
                required
                placeholder="Provide details on road passability, estimated delay, or emergency assistance needed..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] text-xs text-[#1A1C1C] bg-[#FAF9F8]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Contact Phone Number (Optional)</label>
              <input 
                type="tel" 
                placeholder="0300-XXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] text-xs text-[#1A1C1C] bg-[#FAF9F8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs shadow-md transition-colors"
            >
              Submit Hazard Advisory
            </button>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
