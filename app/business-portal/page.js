import AdminSidebar from '@/components/AdminSidebar';
import CrowdBadge from '@/components/CrowdBadge';

export default function BusinessPortalPage() {
  return (
    <div className="min-h-screen flex bg-[#F7F8F5]">
      <AdminSidebar title="Business Portal" />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-xs font-semibold text-[#2F6B5B] uppercase tracking-wider block">
              Hotel Management
            </span>
            <h1 className="text-2xl font-extrabold text-[#17211F]">
              Business Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-[#66736F]">Area Crowd:</span>
            <CrowdBadge level="High" size="sm" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Room Occupancy</span>
            <span className="text-2xl font-bold text-[#17211F] block">88%</span>
            <span className="text-[11px] text-[#2E7D5B] font-medium">39 of 45 rooms occupied</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Weekly Revenue</span>
            <span className="text-2xl font-bold text-[#17211F] block">PKR 1.24M</span>
            <span className="text-[11px] text-[#2E7D5B] font-medium">+8.4% from last week</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Bookings via RAAAH</span>
            <span className="text-2xl font-bold text-[#17211F] block">38</span>
            <span className="text-[11px] text-[#66736F]">6 pending confirmation</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-xs font-medium text-[#66736F]">Expected Visitors</span>
            <span className="text-2xl font-bold text-[#C68A19] block">High</span>
            <span className="text-[11px] text-[#66736F]">~3,400 tourists this weekend</span>
          </div>

        </div>

        {/* Room Inventory Table */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#17211F]">
              Room Inventory & Rates
            </h2>
            <button className="px-4 py-2 rounded-lg bg-[#164A41] text-white text-xs font-semibold hover:bg-[#2F6B5B] transition-colors">
              + Add Room Type
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8F5] text-[#66736F] font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Room Category</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Rate (PKR/night)</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-3 font-semibold text-[#17211F]">Deluxe Mountain View Suite</td>
                  <td className="p-3 font-mono text-[#17211F]">20</td>
                  <td className="p-3 font-mono font-bold text-[#C68A19]">2 left</td>
                  <td className="p-3 font-mono text-[#17211F]">28,000</td>
                  <td className="p-3"><button className="text-[#164A41] font-semibold hover:underline">Update</button></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#17211F]">Heritage Royal Villa</td>
                  <td className="p-3 font-mono text-[#17211F]">10</td>
                  <td className="p-3 font-mono font-bold text-[#2E7D5B]">4 left</td>
                  <td className="p-3 font-mono text-[#17211F]">42,000</td>
                  <td className="p-3"><button className="text-[#164A41] font-semibold hover:underline">Update</button></td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[#17211F]">Executive Family Room</td>
                  <td className="p-3 font-mono text-[#17211F]">15</td>
                  <td className="p-3 font-mono font-bold text-[#D65A4A]">0 (Fully Booked)</td>
                  <td className="p-3 font-mono text-[#17211F]">22,000</td>
                  <td className="p-3"><button className="text-[#164A41] font-semibold hover:underline">Update</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
