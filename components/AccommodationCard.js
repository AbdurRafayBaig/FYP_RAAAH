import Image from 'next/image';
import CrowdBadge from './CrowdBadge';

export default function AccommodationCard({ item }) {
  const {
    name,
    location,
    type,
    rating,
    reviewsCount,
    priceFormatted,
    surroundingCrowd,
    totalRooms,
    availableRooms,
    isVerified,
    isEcoCertified,
    image,
    amenities,
    description
  } = item;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
      {/* Hotel Image */}
      <div className="relative h-64 lg:h-full lg:col-span-5 bg-slate-100">
        <Image src={image} alt={name} fill className="object-cover" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isVerified && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center space-x-1">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>RAAAH Verified</span>
            </span>
          )}
          {isEcoCertified && (
            <span className="bg-teal-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center space-x-1">
              <span className="material-symbols-outlined text-xs">eco</span>
              <span>Eco Lodge</span>
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center space-x-1">
          <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
          <span>{rating}</span>
          <span className="text-slate-300">({reviewsCount} reviews)</span>
        </div>
      </div>

      {/* Hotel Info & Availability */}
      <div className="p-6 lg:col-span-7 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#0051D5] uppercase tracking-wider">
                {type} • {location}
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-[#041627] mt-0.5">
                {name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#041627] block font-mono">
                {priceFormatted}
              </span>
              <span className="text-[11px] text-[#575A60]">/ night (tax incl.)</span>
            </div>
          </div>

          <p className="text-xs text-[#575A60] leading-relaxed mt-2 line-clamp-2">
            {description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {amenities.map((item, idx) => (
              <span key={idx} className="bg-[#FAF9F8] border border-[#E5E3DC] text-[11px] text-slate-700 px-2.5 py-1 rounded-md">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Real-time Status & Booking Bar */}
        <div className="pt-4 border-t border-[#F0EEE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Surrounding Area</span>
              <CrowdBadge level={surroundingCrowd} showScore={false} size="sm" />
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Real-time Vacancy</span>
              <span className={`text-xs font-bold ${availableRooms <= 3 ? 'text-red-600' : 'text-emerald-700'}`}>
                {availableRooms} of {totalRooms} rooms left
              </span>
            </div>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-[#041627] hover:bg-[#003120] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center space-x-1.5">
            <span>Reserve Room</span>
            <span className="material-symbols-outlined text-sm">calendar_month</span>
          </button>
        </div>
      </div>
    </div>
  );
}
