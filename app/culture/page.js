import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function CulturePage() {
  const culturalHighlights = [
    {
      title: "Silk Route & Historic Forts",
      region: "Hunza Valley",
      description: "Altit & Baltit Forts stand as 900-year-old architectural marvels overlooking the Silk Route, restored by the Aga Khan Cultural Service.",
      image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Shandur Polo Festival",
      region: "Chitral & Gilgit",
      description: "The world's highest polo ground at 3,700 meters above sea level, hosting freestyle polo matches without referee whistles since 1936.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Balti & Burushaski Traditions",
      region: "Skardu & Hunza",
      description: "Rich traditions of dried apricot crafts, hand-woven Hunza caps, and mountain musical instruments like the Dadang and Damal drums.",
      image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F8]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-800">
            Cultural Preservation & Sustainable Tourism
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#041627]">
            Northern Heritage & Traditions
          </h1>
          <p className="text-sm text-[#575A60] max-w-2xl">
            Promoting responsible travel that respects local communities, heritage architecture, and fragile mountain environments across Gilgit-Baltistan and KP.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {culturalHighlights.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#E5E3DC] shadow-sm flex flex-col justify-between">
              <div className="relative h-56 w-full">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                  {item.region}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-serif-editorial text-2xl font-bold text-[#041627]">{item.title}</h3>
                <p className="text-xs text-[#575A60] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
