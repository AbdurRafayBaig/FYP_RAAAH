import "./globals.css";

export const metadata = {
  title: "RAAAH — Explore Northern Pakistan with Confidence",
  description: "Check crowd levels, weather and safety conditions before travelling across Northern Pakistan. Discover destinations in Hunza, Skardu, Naran, Swat and Murree.",
  keywords: ["RAAAH", "Northern Pakistan Tourism", "Travel Safety", "Hunza Valley", "Skardu", "Crowd Levels", "Weather Conditions"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-[#F7F8F5] text-[#17211F] antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
