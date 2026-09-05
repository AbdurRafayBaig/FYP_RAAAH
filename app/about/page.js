import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FYP_INFO } from '@/data/teamData';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* ========================================== */}
        {/* PROJECT PROPOSAL HEADER */}
        {/* ========================================== */}
        <section className="bg-[#041627] text-white p-8 sm:p-12 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Final Year Project Defense Proposal • 2026
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold leading-tight">
              {FYP_INFO.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              {FYP_INFO.tagline}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 relative z-10">
            <div>
              <span className="block text-slate-400 uppercase tracking-wider text-[10px]">Institution</span>
              <strong className="text-white text-sm block mt-0.5">{FYP_INFO.institution}</strong>
              <span>{FYP_INFO.campus}</span>
            </div>
            <div>
              <span className="block text-slate-400 uppercase tracking-wider text-[10px]">Academic Department</span>
              <strong className="text-white text-sm block mt-0.5">{FYP_INFO.department}</strong>
              <span>Class of {FYP_INFO.academicYear}</span>
            </div>
            <div>
              <span className="block text-slate-400 uppercase tracking-wider text-[10px]">Project Supervisor</span>
              <strong className="text-amber-300 text-sm block mt-0.5">{FYP_INFO.supervisor.name}</strong>
              <span>{FYP_INFO.supervisor.title}</span>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* FYP TEAM MEMBERS SECTION - Highlighting Abdur Rafay Baig */}
        {/* ========================================== */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
              Project Developers
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#041627]">
              Meet the FYP Engineering Team
            </h2>
            <p className="text-xs sm:text-sm text-[#575A60]">
              Computer Science undergraduate team at FAST-NUCES developing intelligent tourism solutions for Northern Pakistan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FYP_INFO.teamMembers.map((member) => (
              <div 
                key={member.rollNo}
                className={`bg-white rounded-3xl p-6 border transition-all duration-300 shadow-sm flex flex-col justify-between ${
                  member.isLead 
                    ? 'border-2 border-amber-400 ring-4 ring-amber-400/10 scale-102 bg-gradient-to-b from-amber-50/30 to-white' 
                    : 'border-[#E5E3DC]'
                }`}
              >
                <div className="space-y-4">
                  {/* Avatar & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-100">
                      <Image 
                        src={member.avatar} 
                        alt={member.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    {member.isLead && (
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider shadow-xs">
                        ★ Lead Developer
                      </span>
                    )}
                  </div>

                  {/* Name & Role */}
                  <div>
                    <span className="text-xs font-bold font-mono text-[#0051D5] block">
                      {member.rollNo}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#041627]">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-amber-800 block mt-0.5">
                      {member.role}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#575A60] leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Email Contact */}
                <div className="pt-4 mt-6 border-t border-[#F0EEE9] flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>{member.email}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* SUPERVISOR & ACADEMIC DECLARATION */}
        {/* ========================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Supervisor Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E5E3DC] shadow-sm space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
              Faculty Guidance
            </span>
            <div className="flex items-center space-x-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-white font-serif-editorial text-2xl font-bold flex items-center justify-center shrink-0">
                DU
              </div>
              <div>
                <h3 className="font-serif-editorial text-2xl font-bold text-[#041627]">
                  {FYP_INFO.supervisor.name}
                </h3>
                <span className="text-xs font-semibold text-slate-600 block">
                  {FYP_INFO.supervisor.title}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {FYP_INFO.supervisor.institution} ({FYP_INFO.campus})
                </span>
              </div>
            </div>
            <p className="text-xs text-[#575A60] leading-relaxed pt-2 border-t border-[#F0EEE9]">
              Under Dr. Muhammad Usama&apos;s supervision, the team designed RAAAH to bridge the gap between emergency disaster prevention and sustainable smart tourism in Northern Pakistan.
            </p>
          </div>

          {/* Official Anti-Plagiarism Declaration Box */}
          <div className="lg:col-span-7 bg-[#FAF9F8] p-8 rounded-3xl border-2 border-[#D5D3C8] shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-red-800">
              <span className="material-symbols-outlined text-xl">verified</span>
              <h3 className="font-serif-editorial text-xl font-bold">
                Anti-Plagiarism & Originality Declaration
              </h3>
            </div>
            <p className="text-xs text-[#1A1C1C] leading-relaxed italic bg-white p-4 rounded-xl border border-[#E5E3DC]">
              &ldquo;{FYP_INFO.antiPlagiarismDeclaration}&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-[#E5E3DC]">
              <span>Declaration Date: <strong>{FYP_INFO.declarationDate}</strong></span>
              <span>Signed by FYP Authors</span>
            </div>
          </div>

        </section>

        {/* ========================================== */}
        {/* SYSTEM SCOPE & OBJECTIVES */}
        {/* ========================================== */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E3DC] space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
              Project Scope & Architecture
            </span>
            <h2 className="font-serif-editorial text-3xl font-bold text-[#041627]">
              Core Objectives of RAAAH
            </h2>
            <p className="text-xs sm:text-sm text-[#575A60]">
              Designed according to official FYP defense specifications for Northern Pakistan travel corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
            <div className="p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC] space-y-2">
              <h4 className="font-bold text-[#041627] text-sm flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                <span>1. Real-Time Crowd Density Monitoring</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Provide accurate, 4-tier density classification (Low, Moderate, High, Critical) across Hunza, Skardu, Naran, Swat, and Murree.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC] space-y-2">
              <h4 className="font-bold text-[#041627] text-sm flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-amber-600 text-lg">check_circle</span>
                <span>2. Hazard & Disaster Alert Propagation</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Instant dissemination of landslide blockages, flash flood watches, and traffic gridlocks linked to Rescue 1122 and GBDMA.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC] space-y-2">
              <h4 className="font-bold text-[#041627] text-sm flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                <span>3. Verified Accommodations & Booking</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Real-time room availability counters for hotels, lodges, and eco-resorts with surrounding area density context.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F8] border border-[#E5E3DC] space-y-2">
              <h4 className="font-bold text-[#041627] text-sm flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-purple-600 text-lg">check_circle</span>
                <span>4. Business & Authority Portals</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Dedicated management dashboards for local hotel owners and tourism management authorities to track footfall.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
