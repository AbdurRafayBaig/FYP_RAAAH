"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const TRAVEL_INTERESTS = [
  { id: 'nature', label: 'Nature', icon: 'park' },
  { id: 'history', label: 'Historical Sites', icon: 'museum' },
  { id: 'adventure', label: 'Adventure', icon: 'hiking' },
  { id: 'culture', label: 'Culture', icon: 'groups' },
  { id: 'photography', label: 'Photography', icon: 'photo_camera' },
];

export default function RegisterPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-[#F7F8F5] p-1">
            <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#17211F]">Create your account</h1>
          <p className="text-xs text-[#66736F]">Join RAAAH and plan safer trips across Northern Pakistan.</p>
        </div>

        <form className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17211F] mb-1.5">First name</label>
              <input 
                type="text" 
                placeholder="Abdur Rafay" 
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17211F] mb-1.5">Last name</label>
              <input 
                type="text" 
                placeholder="Baig" 
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#17211F] mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
            />
          </div>

          <div>
            <label className="block font-semibold text-[#17211F] mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
            />
          </div>

          <div>
            <label className="block font-semibold text-[#17211F] mb-1.5">Confirm password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
            />
          </div>

          {/* Travel Interests - drives recommendation engine */}
          <div>
            <label className="block font-semibold text-[#17211F] mb-2">What do you enjoy?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRAVEL_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    type="button"
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#164A41] text-white border-[#164A41]'
                        : 'bg-[#F7F8F5] text-[#17211F] border-stone-200 hover:border-[#2F6B5B]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{interest.icon}</span>
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 rounded-lg bg-[#164A41] hover:bg-[#2F6B5B] text-white font-semibold transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-[#66736F] pt-2 border-t border-stone-100">
          Already have an account?{' '}
          <Link href="/login" className="text-[#164A41] font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
