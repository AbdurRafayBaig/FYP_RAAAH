import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FYP_INFO } from '@/data/teamData';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        
        {/* ========================================== */}
        {/* ACADEMIC PROJECT PROPOSAL HERO BANNER */}
        {/* ========================================== */}
        <section className="bg-[#041627] text-white p-8 sm:p-12 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-black text-xs font-bold uppercase tracking-wider shadow-sm">
                FAST-NUCES FYP Defense 2026
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Project Code: CS-FYP-2026-RAAAH
              </span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold leading-tight tracking-wide text-white">
              {FYP_INFO.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {FYP_INFO.tagline}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 relative z-10">
            <div className="space-y-1">
              <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Academic Institution</span>
              <strong className="text-white text-sm block">{FYP_INFO.institution}</strong>
              <span className="text-amber-400 font-medium">{FYP_INFO.campus}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Department & Batch</span>
              <strong className="text-white text-sm block">{FYP_INFO.department}</strong>
              <span className="text-slate-400">Class of {FYP_INFO.academicYear}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Project Supervisor</span>
              <strong className="text-amber-300 text-sm block">{FYP_INFO.supervisor.name}</strong>
              <span className="text-slate-400">{FYP_INFO.supervisor.title}</span>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* FYP ENGINEERING TEAM SECTION */}
        {/* ========================================== */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
              FAST-NUCES Development Team
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#041627]">
              Meet the FYP Software Engineers
            </h2>
            <p className="text-xs sm:text-sm text-[#575A60]">
              Computer Science undergraduate engineers behind the design, full-stack architecture, GIS mapping, and safety workflows of RAAAH.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {FYP_INFO.teamMembers.map((member) => (
              <div 
                key={member.rollNo}
                className={`bg-white rounded-3xl p-7 border transition-all duration-300 shadow-sm flex flex-col justify-between space-y-6 ${
                  member.isLead 
                    ? 'border-2 border-amber-400 ring-4 ring-amber-400/15 shadow-xl scale-102 bg-gradient-to-b from-amber-50/40 via-white to-white' 
                    : 'border-[#E5E3DC] hover:border-slate-400'
                }`}
              >
                <div className="space-y-5">
                  {/* Clean Monogram Header (Professional Academic Emblem, No AI Stock Photos) */}
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} text-white font-serif-editorial text-2xl font-bold flex items-center justify-center shadow-md`}>
                      {member.initials}
                    </div>
                    {member.isLead && (
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center space-x-1">
                        <span>★</span>
                        <span>Project Lead</span>
                      </span>
                    )}
                  </div>

                  {/* Name, Roll No, & Role */}
                  <div>
                    <span className="text-xs font-bold font-mono text-[#0051D5] uppercase tracking-wider block">
                      Roll No: {member.rollNo}
                    </span>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#041627] mt-0.5">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-amber-900 block mt-1">
                      {member.role}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#575A60] leading-relaxed text-justify">
                    {member.bio}
                  </p>

                  {/* Core Technical Contributions List */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EEE9]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Core Responsibilities & Modules:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {member.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span className="leading-snug">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="pt-4 border-t border-[#F0EEE9] flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-base text-slate-400">mail</span>
                    <span>{member.email}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* SYSTEM ARCHITECTURE & CONTRIBUTION BREAKDOWN */}
        {/* ========================================== */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E3DC] space-y-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#0051D5]">
              Technical Work Division
            </span>
            <h2 className="font-serif-editorial text-3xl font-bold text-[#041627]">
              Module & Contribution Matrix
            </h2>
            <p className="text-xs text-[#575A60]">
              Formal division of technical modules for the FAST-NUCES Final Year Project evaluation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E5E3DC] rounded-xl overflow-hidden">
              <thead className="bg-[#FAF9F8] text-[#041627] font-bold border-b border-[#E5E3DC]">
                <tr>
                  <th className="p-3.5">System Module</th>
                  <th className="p-3.5">Assigned Developer</th>
                  <th className="p-3.5">Technical Scope & Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE9]">
                <tr className="bg-amber-50/20">
                  <td className="p-3.5 font-bold text-[#041627]">Full-Stack App & GIS Engine</td>
                  <td className="p-3.5 font-bold text-amber-900">Abdur Rafay Baig (23F-3046)</td>
                  <td className="p-3.5 text-slate-700">Overall Next.js full-stack architecture, GIS telemetry map canvas, Stitch design conversion, database constants, and production build deployment.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#041627]">UI & Crowd Density Analytics</td>
                  <td className="p-3.5 font-bold text-slate-900">M Ammar Ahmad (23P-3071)</td>
                  <td className="p-3.5 text-slate-700">UI component styling, crowd density threshold metrics, capacity status benchmarks, and predictive regional footfall visualizer.</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#041627]">UI & Disaster Safety Integration</td>
                  <td className="p-3.5 font-bold text-slate-900">Faiza Ali (23F-0739)</td>
                  <td className="p-3.5 text-slate-700">UI layout integration, travel hazard alert cards, emergency helpline directory, and crowdsourced hazard reporting form.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================== */}
        {/* FACULTY SUPERVISION & ACADEMIC DECLARATION */}
        {/* ========================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Supervisor Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E5E3DC] shadow-sm space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
              Faculty Leadership
            </span>
            <div className="flex items-center space-x-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#041627] text-amber-400 font-serif-editorial text-2xl font-bold flex items-center justify-center shrink-0 border border-slate-800">
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
            <p className="text-xs text-[#575A60] leading-relaxed pt-2 border-t border-[#F0EEE9] text-justify">
              Supervised the project architecture, ensuring compliance with academic research standards, smart tourism standards, and real-time GIS density benchmarks.
            </p>
          </div>

          {/* Official Anti-Plagiarism Declaration Box */}
          <div className="lg:col-span-7 bg-[#FAF9F8] p-8 rounded-3xl border-2 border-[#D5D3C8] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-red-800">
                <span className="material-symbols-outlined text-xl">verified</span>
                <h3 className="font-serif-editorial text-xl font-bold">
                  Anti-Plagiarism & Originality Declaration
                </h3>
              </div>
              <p className="text-xs text-[#1A1C1C] leading-relaxed italic bg-white p-4 rounded-xl border border-[#E5E3DC]">
                &ldquo;{FYP_INFO.antiPlagiarismDeclaration}&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-[#E5E3DC]">
              <span>Declaration Date: <strong>{FYP_INFO.declarationDate}</strong></span>
              <span className="font-bold text-[#041627]">Signed by FYP Team</span>
            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
