import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import PageTitle from '@/components/ui/PageTitle';
import { FYP_INFO } from '@/data/teamData';
import { PHOTOS } from '@/data/photos';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'About — RAAAH' };

const DONE = [
  'Sign in with role-based access for tourists, observers, administrators and the tourism authority',
  'Profile, travel preferences and location consent',
  'Destination search, map, weather, road access and verified hazards',
  'Location-checked check-ins and crowd levels calculated from them',
  'Ranked alternative destinations from a content-based recommendation engine',
];

const NEXT = [
  'Registration and saved destinations',
  'Check-out and visit history',
  'Hazard reports from community safety observers, and their review',
  'Push notifications when a saved destination becomes unsafe',
  'Administrator tools and the analytics dashboard',
];

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="page pb-20">
        <PageTitle title="About RAAAH">
          A final year project at {FYP_INFO.institution}, {FYP_INFO.campus}, {FYP_INFO.year}.
        </PageTitle>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Why we are building it</h2>
          <div className="max-w-[62ch] space-y-4 text-[16px] text-ink-2">
            <p>
              Most visitors to Northern Pakistan head for the same handful of places, usually in the same few weeks.
              Roads, guest houses and fragile valleys take the strain, and when the weather turns or a slope gives way
              there is little warning and no easy way to find somewhere else to go.
            </p>
            <p>
              RAAAH puts the crowd level, weather and verified hazard reports for each destination in one place, and
              suggests safer, quieter alternatives that suit what you like. It gives tourism and disaster management
              authorities the same picture in aggregate. It never restricts where anyone can travel, and it never
              shows where an individual traveller is.
            </p>
          </div>
        </section>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Where the project is</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-[14px] font-medium">Working now</p>
              <ul className="space-y-2 text-[15px] text-ink-2">
                {DONE.map((item) => <li key={item} className="border-l-2 border-low pl-3">{item}</li>)}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[14px] font-medium">Coming next</p>
              <ul className="space-y-2 text-[15px] text-ink-2">
                {NEXT.map((item) => <li key={item} className="border-l-2 border-rule pl-3">{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-b border-rule py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Team</h2>
          <div>
            <table className="w-full text-left text-[15px]">
              <tbody className="divide-y divide-rule border-y border-rule">
                {FYP_INFO.teamMembers.map((m) => (
                  <tr key={m.rollNo}>
                    <td className="py-3 pr-4 font-medium">{m.name}</td>
                    <td className="py-3 pr-4 text-ink-2">{m.role}</td>
                    <td className="data py-3 text-right text-muted">{m.rollNo}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-medium">{FYP_INFO.supervisor.name}</td>
                  <td className="py-3 pr-4 text-ink-2">{FYP_INFO.supervisor.title}</td>
                  <td className="py-3" />
                </tr>
              </tbody>
            </table>
            <p className="meta mt-3">{FYP_INFO.department}</p>
          </div>
        </section>

        <section id="credits" className="grid gap-10 py-12 md:grid-cols-[1fr_1.4fr]">
          <h2 className="text-[26px]">Photographs</h2>
          <div>
            <p className="mb-4 text-[15px] text-ink-2">
              All photographs are from Wikimedia Commons and are used under the licences shown.
            </p>
            <ul className="divide-y divide-rule border-y border-rule text-[14px]">
              {Object.values(PHOTOS).map((p) => (
                <li key={p.src} className="flex flex-wrap justify-between gap-x-4 py-2">
                  <span>{p.place}</span>
                  <span className="text-muted">{p.author} · {p.licence}</span>
                </li>
              ))}
            </ul>
            <p className="meta mt-4">
              Questions about the project? Write to the team lead at{' '}
              <a href={`mailto:${FYP_INFO.teamMembers[0].email}`} className="link">{FYP_INFO.teamMembers[0].email}</a>, or{' '}
              <Link href={ROUTES.DESTINATIONS} className="link">try it</Link>.
            </p>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
