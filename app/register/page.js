import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F8] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E3DC] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block relative w-12 h-12 rounded-xl overflow-hidden border border-[#D5D3C8] bg-white p-1">
            <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
          </Link>
          <h1 className="font-serif-editorial text-3xl font-bold text-[#041627]">Create RAAAH Account</h1>
          <p className="text-xs text-[#575A60]">Join Pakistan&apos;s smart tourism platform for real-time crowd metrics and hazard alerts.</p>
        </div>

        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase">Full Name</label>
            <input type="text" placeholder="Abdur Rafay" className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-[#FAF9F8]" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase">Account Type</label>
            <select className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3DC] bg-[#FAF9F8] font-semibold">
              <option>Tourist / Traveler</option>
              <option>Hotel / Eco-Lodge Vendor</option>
              <option>Tourism Authority Official</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase">Email Address</label>
            <input type="email" placeholder="user@example.com" className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-[#FAF9F8]" />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1 uppercase">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-[#FAF9F8]" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-[#041627] hover:bg-[#003120] text-white font-semibold shadow-md">
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-[#F0EEE9]">
          Already registered? <Link href="/login" className="text-[#0051D5] font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
