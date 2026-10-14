import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { HELPLINES } from '@/constants/helplines';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rule">
      <div className="page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-[22px] font-semibold">RAAAH</p>
          <p className="max-w-sm text-[14px] text-ink-2">
            Crowd, weather and hazard information for travellers in Northern Pakistan, starting with Gilgit-Baltistan.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">In an emergency</p>
          <ul className="space-y-1.5 text-[14px]">
            {HELPLINES.map(({ name, phone }) => (
              <li key={phone} className="flex justify-between gap-4 text-ink-2">
                <span>{name}</span>
                <a href={`tel:${phone}`} className="data text-ink hover:underline">{phone}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">Pages</p>
          <ul className="space-y-1.5 text-[14px] text-ink-2">
            <li><Link href={ROUTES.DESTINATIONS} className="hover:text-ink">Destinations</Link></li>
            <li><Link href={ROUTES.SAFETY} className="hover:text-ink">Safety</Link></li>
            <li><Link href={ROUTES.CULTURE} className="hover:text-ink">Culture and etiquette</Link></li>
            <li><Link href={ROUTES.ABOUT_US} className="hover:text-ink">About the project</Link></li>
          </ul>
        </div>
      </div>
      <div className="page">
        <p className="meta border-t border-rule py-5">
          Final Year Project, FAST-NUCES Chiniot-Faisalabad, 2026. Photographs from Wikimedia Commons —{' '}
          <Link href={`${ROUTES.ABOUT_US}#credits`} className="underline underline-offset-2 hover:text-ink">credits</Link>.
        </p>
      </div>
    </footer>
  );
}
