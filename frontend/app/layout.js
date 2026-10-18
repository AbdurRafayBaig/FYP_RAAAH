import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "RAAAH — Crowd, weather and hazards in Northern Pakistan",
  description:
    "Check how busy a destination in Gilgit-Baltistan is, the latest weather and verified hazard reports, and find a quieter alternative before you travel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        {/* Destination photos come from Wikimedia Commons; open the connection early */}
        <link rel="preconnect" href="https://thumb.wikimedia.org" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
