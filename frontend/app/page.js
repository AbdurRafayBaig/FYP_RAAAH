import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/Icon';
import { PHOTOS } from '@/data/photos';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/lib/i18n-server';
import HomeCta from './HomeCta';

// Each tile opens the destination list searched for that one place
const PLACES = [
  { name: 'Hunza Valley', region: 'Hunza', photo: PHOTOS.baltit },
  { name: 'Attabad Lake', region: 'Gojal, Hunza', photo: PHOTOS.attabad },
  { name: 'Fairy Meadows', region: 'Diamer', photo: PHOTOS.fairyMeadows },
  { name: 'Upper Kachura Lake', region: 'Skardu', photo: PHOTOS.upperKachura },
  { name: 'Nagar Valley & Rakaposhi View', region: 'Nagar', photo: PHOTOS.rakaposhi },
  { name: 'Neelum Valley & Arang Kel', region: 'Azad Kashmir', photo: PHOTOS.arangKel },
  { name: 'Shigar Valley', region: 'Shigar', photo: PHOTOS.shigar },
  { name: 'Naltar Valley', region: 'Gilgit', photo: PHOTOS.naltar },
];

const STEPS = [
  {
    title: 'Crowd from check-ins',
    text: "Travellers check in when they arrive. Active check-ins are counted against each destination's capacity and shown as Low, Moderate, High or Critical. No one's location is ever displayed.",
  },
  {
    title: 'Verified hazards and weather',
    text: 'Local observers report landslides, floods and road blocks. A report reaches the public only after an administrator verifies it. Weather comes with the time it was last updated.',
  },
  {
    title: 'A quieter alternative',
    text: 'When your destination is crowded or unsafe, RAAAH ranks other places by your interests, crowd, safety, weather and distance. You can still choose to go.',
  },
];

const RESPONSIBLE = [
  'Ask before photographing people, and always before photographing women.',
  'Carry your rubbish back down. Most valleys have no waste collection.',
  'Stay in locally run guest houses and hire guides from the village.',
];

export default async function Home() {
  const t = await getT();
  const hero = PHOTOS.hunza;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[86vh] flex-col bg-ink text-white">
        <Image src={hero.src} alt={hero.place} fill priority sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
        <Navbar overlay />

        <div className="page relative mt-auto pb-14 pt-32">
          <h1 className="max-w-3xl text-[44px] leading-[1.05] sm:text-[64px]">
            {t('Know the crowd, the weather and the road before you go north.')}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] text-white/85">
            {t('RAAAH estimates how busy each destination is from traveller check-ins, shows verified hazard reports and the latest weather, and suggests a quieter place when yours is full.')}
          </p>

          <form action={ROUTES.DESTINATIONS} role="search" className="mt-8 flex max-w-xl overflow-hidden rounded-[3px] bg-white shadow-lg">
            <label htmlFor="hero-search" className="sr-only">{t('Search destinations')}</label>
            <span className="flex items-center ps-4 text-muted"><Icon name="search" /></span>
            <input
              id="hero-search"
              name="search"
              placeholder={t('Hunza, Skardu, Fairy Meadows…')}
              className="h-14 min-w-0 flex-1 bg-transparent px-3 text-[17px] text-ink placeholder:text-muted focus:outline-none"
            />
            <button type="submit" className="btn btn-accent m-1.5 h-11 px-5 text-[15px]">
              {t('Search')}
            </button>
          </form>
          <Link href={ROUTES.DESTINATIONS} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-white hover:underline">
            {t('Or explore all 23 destinations')} <Icon name="arrow" size={16} />
          </Link>
        </div>

        <p className="page relative pb-4 text-end text-[12px] text-white/60" dir="ltr">
          {hero.place}. Photo: {hero.author}, {hero.licence}
        </p>
      </section>

      <main className="flex-1">
        {/* Section rules line up with the text, not with the page padding */}
        <div className="page">
          {/* Why */}
          <section className="grid gap-10 border-b border-rule py-20 md:grid-cols-[1.3fr_1fr]">
            <p className="font-display text-[28px] leading-snug sm:text-[34px]">
              {t('In January 2022, twenty-three people died in Murree when thousands of cars drove up into a snowstorm. No one on the road knew how full the town already was, or what the weather was about to do.')}
            </p>
            <div className="space-y-4 self-end text-[16px] text-ink-2">
              <p>
                {t('RAAAH is our attempt to put that information in front of travellers before they leave home. We are starting with Gilgit-Baltistan, where the roads are long, the signal is weak and a single landslide can close a valley for days.')}
              </p>
              <p>{t('It does not stop anyone from travelling. It tells you what is happening, and what else is nearby.')}</p>
            </div>
          </section>

          {/* How it works */}
          <section className="border-b border-rule py-16">
            <h2 className="mb-10 text-[30px]">{t('How it works')}</h2>
            <ol className="grid gap-10 md:grid-cols-3 md:gap-0">
              {STEPS.map((step, i) => (
                <li key={step.title} className="md:border-s md:border-rule md:px-8 md:first:border-s-0 md:first:ps-0">
                  <span className="data text-muted">0{i + 1}</span>
                  <h3 className="mt-2 text-[21px]">{t(step.title)}</h3>
                  <p className="mt-3 text-[15px] text-ink-2">{t(step.text)}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Places */}
          <section className="border-b border-rule py-16">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="text-[30px]">{t('Places on RAAAH')}</h2>
              <Link href={ROUTES.DESTINATIONS} className="flex items-center gap-1.5 text-[14px] font-medium text-accent hover:underline">
                {t('All 23 destinations')} <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {PLACES.map((p, i) => (
                <Link
                  key={p.name}
                  href={`${ROUTES.DESTINATIONS}?search=${encodeURIComponent(p.name)}`}
                  className={`group flex flex-col ${i === 0 ? 'col-span-2 lg:row-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-rule ${i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]'}`}>
                    <Image
                      src={p.photo.src}
                      alt={p.photo.place}
                      fill
                      sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className={`mt-3 font-display ${i === 0 ? 'text-[24px]' : 'text-[18px] sm:text-[19px]'}`} dir="ltr">{p.name}</p>
                  <p className="meta" dir="ltr">{p.region}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Responsible travel */}
          <section className="grid gap-10 border-b border-rule py-16 md:grid-cols-[1fr_1.6fr]">
            <h2 className="text-[30px]">{t('Travelling responsibly')}</h2>
            <ul className="divide-y divide-rule border-y border-rule text-[16px] text-ink-2">
              {RESPONSIBLE.map((line) => <li key={line} className="py-4">{t(line)}</li>)}
              <li className="py-4">
                {t('More in')} <Link href={ROUTES.CULTURE} className="link">{t('culture and etiquette')}</Link>.
              </li>
            </ul>
          </section>
        </div>

        <HomeCta />
      </main>

      <Footer />
    </div>
  );
}
