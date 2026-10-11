import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
