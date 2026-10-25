import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import PageTitle from '@/components/ui/PageTitle';
import { ROUTES } from '@/constants/routes';
import { HELPLINES } from '@/constants/helplines';
import { getT } from '@/lib/i18n-server';

export const metadata = { title: 'Safety — RAAAH' };

const HAZARDS = [
  ['Flash flood', 'Streams can rise within minutes after rain upstream, even under clear sky where you are. Do not camp on river banks.'],
  ['Landslide', 'Most common on the Karakoram Highway and jeep tracks during and after rain. Debris can close a road for hours or days.'],
  ['Rockfall', 'Loose rock above roads and trails, especially after freeze and thaw. Do not stop under unstable slopes.'],
  ['Glacier-related hazard', 'Glacial lake outbursts and surging glaciers in summer. Follow GBDMA warnings for affected valleys.'],
  ['Road blockage', 'Slides, snow, accidents or repair work. Ask locally before starting a long drive.'],
  ['Extreme weather', 'Heavy snow, storms and sudden cold at altitude. Passes such as Babusar and Khunjerab close seasonally.'],
];

const BEFORE_YOU_GO = [
  'Check the destination page on RAAAH the evening before and again in the morning. Hazards and crowd levels change.',
  'Avoid driving mountain roads and jeep tracks after dark.',
  'Above 2,500 m, give yourself a day to adjust before strenuous walking. Headache and nausea are signs to go lower.',
  'Carry cash, warm clothing and enough fuel for the round trip. Mobile signal disappears in many valleys.',
  'Tell someone your route and when you expect to arrive.',
];

export default async function SafetyPage() {
  const t = await getT();
  return (
    <SiteLayout>
      <div className="page pb-20">
        <PageTitle title={t('Safety')}>
          {t('Hazard reports from local observers appear on each destination page once an administrator has verified them. This page has the numbers to call and what to know before you drive into the mountains.')}
        </PageTitle>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">{t('In an emergency')}</h2>
          <div>
            <ul className="divide-y divide-rule border-y border-rule">
              {HELPLINES.map((h) => (
                <li key={h.phone} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-[16px]">{t(h.name)}</p>
                    <p className="meta">{t(h.service)}</p>
                  </div>
                  <a href={`tel:${h.phone}`} className="inline-flex h-11 min-w-[72px] items-center justify-center gap-1.5 rounded-full bg-critical px-4 font-mono text-[18px] text-white hover:bg-[#82261e]" dir="ltr">{h.phone}</a>
                </li>
              ))}
            </ul>
            <p className="meta mt-3">{t('Numbers are for Pakistan. Local guest houses usually know the nearest police post and hospital.')}</p>
          </div>
        </section>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">{t('Before you go')}</h2>
          <ol className="space-y-4 text-[16px] text-ink-2">
            {BEFORE_YOU_GO.map((tip, i) => (
              <li key={tip} className="flex gap-4">
                <span className="data pt-0.5 text-muted">{i + 1}</span>
                <span>{t(tip)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-10 py-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-[26px]">{t('Hazards we track')}</h2>
            <p className="mt-3 text-[15px] text-ink-2">
              {t('Verified community safety observers can')}{' '}
              <Link href={ROUTES.REPORT_HAZARD} className="link">{t('report a hazard')}</Link>. {t('Reports are checked before anyone else sees them.')}
            </p>
          </div>
          <dl className="divide-y divide-rule border-y border-rule">
            {HAZARDS.map(([name, text]) => (
              <div key={name} className="grid gap-1 py-4 sm:grid-cols-[190px_1fr] sm:gap-6">
                <dt className="font-medium">{t(name)}</dt>
                <dd className="text-[15px] text-ink-2">{t(text)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </SiteLayout>
  );
}
