import AdminSidebar from '@/components/AdminSidebar';
import CrowdBadge from '@/components/CrowdBadge';

export default function BusinessPortalPage() {
  return (
    <div className="min-h-screen flex bg-[#FAF9F8]">
      <AdminSidebar title="Business Hotel Portal" />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DC] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0051D5]">
              Hunza Serena Inn Vendor Portal
            </span>
            <h1 className="font-serif-editorial text-3xl font-bold text-[#041627]">
              Business Management Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-600">Surrounding Area Status:</span>
            <CrowdBadge level="High" score={78} size="md" />
          </div>
        </div>

        {/* Key Business Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Room Occupancy</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-[#041627]">88%</span>
              <span className="text-xs font-bold text-emerald-700">+12% vs last wk</span>
            </div>
            <span className="text-[11px] text-slate-500 block">39 of 45 Rooms Occupied</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Weekly Revenue</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-[#041627]">PKR 1.24M</span>
              <span className="text-xs font-bold text-emerald-700">+8.4%</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Average Rate PKR 28,000</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">RAAAH Direct Bookings</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-[#041627]">38</span>
              <span className="text-xs font-bold text-blue-700">Verified</span>
            </div>
            <span className="text-[11px] text-slate-500 block">6 Pending Confirmation</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm space-y-2">
            <span className="text-xs font-semibold text-[#575A60] uppercase">Predicted Tourist Footfall</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-mono text-amber-700">HIGH</span>
              <span className="text-xs font-bold text-amber-800">Peak Weekend</span>
            </div>
            <span className="text-[11px] text-slate-500 block">3,400 tourists expected</span>
          </div>

        </div>

        {/* Room Inventory Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E3DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-xl font-bold text-[#041627]">
              Room Type Inventory & Real-Time Rates
            </h2>
            <button className="px-4 py-2 rounded-xl bg-[#041627] text-white text-xs font-semibold hover:bg-[#003120]">
              + Add Room Category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F8] text-slate-600 uppercase font-bold border-b border-[#E5E3DC]">
                <tr>
                  <th className="p-3">Room Category</th>
                  <th className="p-3">Total Rooms</th>
                  <th className="p-3">Available Now</th>
                  <th className="p-3">Nightly Rate (PKR)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE9]">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Deluxe Mountain View Suite</td>
                  <td className="p-3 font-mono">20</td>
                  <td className="p-3 font-mono font-bold text-amber-700">2 left</td>
                  <td className="p-3 font-mono">28,000</td>
                  <td className="p-3"><button className="text-blue-700 font-bold hover:underline">Update Rate</button></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Heritage Royal Villa</td>
                  <td className="p-3 font-mono">10</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">4 left</td>
                  <td className="p-3 font-mono">42,000</td>
                  <td className="p-3"><button className="text-blue-700 font-bold hover:underline">Update Rate</button></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Executive Family Room</td>
                  <td className="p-3 font-mono">15</td>
                  <td className="p-3 font-mono font-bold text-red-700">0 (Fully Booked)</td>
                  <td className="p-3 font-mono">22,000</td>
                  <td className="p-3"><button className="text-blue-700 font-bold hover:underline">Update Rate</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
