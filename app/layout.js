import "./globals.css";

export const metadata = {
  title: "RAAAH — Intelligent Crowd Management & Smart Tourism Platform",
  description: "Official Smart Tourism and Crowd Management Platform for Northern Pakistan (Hunza, Naran, Skardu, Swat, Murree). Real-time density tracking, hazard alerts, AI route recommendations, and verified accommodations.",
  keywords: ["RAAAH", "Northern Pakistan Tourism", "Crowd Management", "Smart Tourism", "Hunza Valley", "Skardu", "Swat", "Travel Safety Pakistan"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-[#FAF9F8] text-[#1A1C1C] antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
