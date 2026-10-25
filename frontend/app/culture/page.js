import Image from 'next/image';
import SiteLayout from '@/components/SiteLayout';
import PageTitle from '@/components/ui/PageTitle';
import { PHOTOS } from '@/data/photos';

export const metadata = { title: 'Culture and etiquette — RAAAH' };

const STORIES = [
  {
    photo: PHOTOS.baltit,
    title: 'The forts of Hunza',
    text: 'Baltit Fort above Karimabad was the seat of the Mirs of Hunza for centuries. Altit Fort, a short walk away, is thought to be the oldest building in Gilgit-Baltistan. Both were restored by the Aga Khan Trust for Culture and can be visited with a local guide.',
  },
  {
    photo: PHOTOS.shandur,
    title: 'Polo at Shandur',
    text: 'Every summer, teams from Chitral and Gilgit meet on the Shandur pass at around 3,700 m for freestyle polo, often called the highest polo ground in the world. The festival brings music, camping and very large crowds — check conditions before you go.',
  },
  {
    photo: PHOTOS.khaplu,
    title: 'Languages and food',
    text: 'In a single day on the road you can pass through valleys speaking Shina, Burushaski, Wakhi and Balti. Try chapshuro and diram fitti in Hunza, marzan and balay in Baltistan, and the dried apricots and walnuts sold everywhere.',
  },
];

const ETIQUETTE = [
  'Dress modestly. Long sleeves and loose clothing are expected in villages for both men and women.',
  'Always ask before photographing people, and do not photograph women without clear permission.',
  'Remove your shoes before entering a mosque or a home.',
  'If you are offered tea, accept it if you can. Hospitality matters a great deal here.',
  'Avoid public displays of affection, and be discreet about eating in public during Ramadan.',
];

const ENVIRONMENT = [
  'Carry all rubbish back with you. Most valleys have no waste collection.',
  'Keep soap and detergent out of streams and lakes; they are drinking water downstream.',
  'Stay on existing paths in meadows such as Fairy Meadows and Deosai.',
  'Do not feed, chase or disturb wildlife, and never buy animal parts.',
  'Spend locally: village guest houses, local guides, handicrafts made in the valley.',
];

export default function CulturePage() {
  return (
    <SiteLayout>
      <div className="page pb-20">
        <PageTitle title="Culture and etiquette">
          The people of Gilgit-Baltistan have welcomed travellers for a long time. A little knowledge goes a long way.
        </PageTitle>

        <section className="grid gap-x-8 gap-y-12 border-b border-rule py-12 md:grid-cols-3">
          {STORIES.map((s) => (
            <article key={s.title}>
              <div className="relative aspect-[4/3] overflow-hidden bg-rule">
                <Image src={s.photo.src} alt={s.photo.place} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <p className="meta mt-2 text-[12px]">{s.photo.place}. Photo: {s.photo.author}</p>
              <h2 className="mt-3 text-[24px]">{s.title}</h2>
              <p className="mt-2 text-[15px] text-ink-2">{s.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Etiquette</h2>
          <ul className="divide-y divide-rule border-y border-rule text-[16px] text-ink-2">
            {ETIQUETTE.map((t) => <li key={t} className="py-3.5">{t}</li>)}
          </ul>
        </section>

        <section className="grid gap-10 py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Looking after the mountains</h2>
          <ul className="divide-y divide-rule border-y border-rule text-[16px] text-ink-2">
            {ENVIRONMENT.map((t) => <li key={t} className="py-3.5">{t}</li>)}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
}
