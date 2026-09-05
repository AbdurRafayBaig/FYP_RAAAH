import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FYP_INFO } from '@/data/teamData';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* About RAAAH Hero */}
        <section className="bg-[#164A41] text-white p-8 sm:p-12 rounded-xl space-y-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-semibold text-[#D9B77A] uppercase tracking-wider">
              About RAAAH
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Making travel across Northern Pakistan safer and better informed.
            </h1>
            <p className="text-sm text-stone-200 leading-relaxed max-w-2xl">
              Tourists often have limited information about crowd levels, weather, road conditions and local hazards before travelling. RAAAH brings these signals together so travellers can make better-informed decisions.
            </p>
          </div>
        </section>

        {/* What RAAAH Helps You Do */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#17211F]">
            What we help you do
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <span className="material-symbols-outlined text-[#164A41] text-xl">explore</span>
              <h3 className="font-bold text-[#17211F] text-sm">Discover</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Explore destinations across Northern Pakistan with useful travel information.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <span className="material-symbols-outlined text-[#C68A19] text-xl">monitoring</span>
              <h3 className="font-bold text-[#17211F] text-sm">Check Conditions</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Understand crowd levels, weather, and safety conditions before you travel.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <span className="material-symbols-outlined text-[#2F6B5B] text-xl">alt_route</span>
              <h3 className="font-bold text-[#17211F] text-sm">Choose Alternatives</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Find suitable, quieter destinations when popular spots are too busy or affected by hazards.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <span className="material-symbols-outlined text-[#D9B77A] text-xl">eco</span>
              <h3 className="font-bold text-[#17211F] text-sm">Travel Responsibly</h3>
              <p className="text-xs text-[#66736F] leading-relaxed">
                Learn about local culture and environmental guidelines for responsible tourism.
              </p>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider">
              FAST-NUCES Final Year Project 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17211F]">
              The Team
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FYP_INFO.teamMembers.map((member) => (
              <div 
                key={member.rollNo}
                className={`bg-white rounded-xl p-6 border space-y-4 ${
                  member.isLead 
                    ? 'border-[#D9B77A] ring-2 ring-[#D9B77A]/20' 
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-[#164A41] text-white font-bold text-lg flex items-center justify-center`}>
                    {member.initials}
                  </div>
                  {member.isLead && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF8EC] text-[#C68A19] text-[10px] font-bold border border-[#F4DFB4]">
                      Project Lead
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#17211F]">
                    {member.name}
                  </h3>
                  <span className="text-xs text-[#66736F] block">{member.role}</span>
                  <span className="text-[11px] text-[#66736F] font-mono block mt-0.5">Roll No: {member.rollNo}</span>
                </div>

                <p className="text-xs text-[#66736F] leading-relaxed">
                  {member.bio}
                </p>

                {/* Responsibilities */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#66736F] block">
                    Responsibilities:
                  </span>
                  <ul className="space-y-1 text-xs text-[#17211F]">
                    {member.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-[#2F6B5B]">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email */}
                <div className="pt-3 border-t border-stone-100 flex items-center space-x-1.5 text-xs text-[#66736F]">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supervisor */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-3">
            <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider">
              Project Supervisor
            </span>
            <div className="flex items-center space-x-4 pt-1">
              <div className="w-12 h-12 rounded-xl bg-[#164A41] text-[#D9B77A] font-bold text-lg flex items-center justify-center shrink-0">
                DU
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#17211F]">
                  {FYP_INFO.supervisor.name}
                </h3>
                <span className="text-xs text-[#66736F] block">{FYP_INFO.supervisor.title}</span>
                <span className="text-[11px] text-[#66736F] block">
                  {FYP_INFO.supervisor.institution} · {FYP_INFO.campus}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Declaration */}
          <div className="bg-[#F7F8F5] p-6 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center space-x-2 text-[#D65A4A]">
              <span className="material-symbols-outlined text-lg">verified</span>
              <h3 className="font-bold text-base">Originality Declaration</h3>
            </div>
            <p className="text-xs text-[#17211F] leading-relaxed italic bg-white p-3 rounded-lg border border-stone-200">
              &ldquo;{FYP_INFO.antiPlagiarismDeclaration}&rdquo;
            </p>
            <div className="flex items-center justify-between text-[11px] text-[#66736F] pt-1 border-t border-stone-200">
              <span>Date: <strong>{FYP_INFO.declarationDate}</strong></span>
              <span className="font-semibold text-[#17211F]">Signed by FYP Team</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
