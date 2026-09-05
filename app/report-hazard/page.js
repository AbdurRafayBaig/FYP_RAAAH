"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DESTINATIONS } from '@/data/destinations';
import { HAZARD_TYPES } from '@/constants/riskLevels';
import { useState } from 'react';

export default function ReportHazardPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
        
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F]">
            Report a Hazard
          </h1>
          <p className="text-xs sm:text-sm text-[#66736F]">
            Help keep other travellers informed about road conditions and safety risks.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#EBF5F0] p-8 rounded-xl border border-[#B6E0CF] text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#2E7D5B]">check_circle</span>
            <h2 className="text-xl font-bold text-[#164A41]">Report Submitted</h2>
            <p className="text-xs text-[#17211F] max-w-sm mx-auto leading-relaxed">
              Thank you. Your report will be reviewed before appearing as verified safety information.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2 rounded-lg bg-[#164A41] text-white font-semibold text-xs hover:bg-[#2F6B5B] transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form 
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">Destination *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] bg-[#F7F8F5] focus:outline-none focus:border-[#164A41]">
                <option value="">Select a destination</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">What did you observe? *</label>
              <select className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] bg-[#F7F8F5] focus:outline-none focus:border-[#164A41]">
                {HAZARD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">Where did it happen?</label>
              <input 
                type="text" 
                placeholder="e.g. Karakoram Highway near Aliabad, KM 14"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] bg-[#F7F8F5] focus:outline-none focus:border-[#164A41]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">Describe the situation</label>
              <textarea 
                rows="4"
                placeholder="Provide any details that could help other travellers..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] bg-[#F7F8F5] focus:outline-none focus:border-[#164A41]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">When did you notice it?</label>
              <input 
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-[#17211F] bg-[#F7F8F5] focus:outline-none focus:border-[#164A41]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17211F] mb-1.5">Photo (optional)</label>
              <input 
                type="file"
                accept="image/*"
                className="w-full text-xs text-[#66736F] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-stone-200 file:text-xs file:font-semibold file:bg-[#F7F8F5] file:text-[#164A41] hover:file:bg-stone-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#D65A4A] hover:bg-[#A83232] text-white font-semibold text-xs shadow-2xs transition-colors"
            >
              Submit Report
            </button>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
