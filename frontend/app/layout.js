import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { dirFor } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import OfflineSupport from "@/components/OfflineSupport";

export const metadata = {
  title: "RAAAH — Crowd, weather and hazards in Northern Pakistan",
  description:
    "Check how busy a destination in Gilgit-Baltistan is, the latest weather and verified hazard reports, and find a quieter alternative before you travel.",
  icons: { icon: "/favicon.png", apple: "/icon-192.png" },
};

export const viewport = { themeColor: "#1c1b18" };

export default async function RootLayout({ children }) {
  const lang = await getLang();
  return (
    <html lang={lang} dir={dirFor(lang)}>
      <head>
        {/* Destination photos come from Wikimedia Commons; open the connection early */}
        <link rel="preconnect" href="https://thumb.wikimedia.org" />
      </head>
      <body className="min-h-screen">
        <LanguageProvider initialLang={lang}>
          <AuthProvider>
            {children}
            <OfflineSupport />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
