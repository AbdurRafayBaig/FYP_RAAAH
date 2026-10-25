import Image from 'next/image';
import Link from 'next/link';
import SiteLayout from '@/components/SiteLayout';
import { FYP_INFO } from '@/data/teamData';
import { PHOTOS } from '@/data/photos';
import { ROUTES } from '@/constants/routes';

export const metadata = { title: 'About — RAAAH' };

const FACTS = [
  { value: '23', label: 'registered destinations in Gilgit-Baltistan, Khyber Pakhtunkhwa, Azad Kashmir and Murree' },
  { value: '4', label: 'crowd levels, from Low to Critical, estimated from check-ins' },
  { value: '6', label: 'hazard types tracked, from flash floods to road blockages' },
  { value: '4', label: 'user roles with access enforced on the server' },
];

// SRS section 2.3
const OBJECTIVES = [
  'Provide an estimate of current crowd levels for every supported destination.',
  'Detect overcrowding and classify it as Low, Moderate, High or Critical.',
  'Recommend safer and less crowded alternatives using crowd, distance, accommodation, safety and preference factors.',
  'Provide weather and destination-specific hazard information before travel.',
  'Give administrators and tourism authorities aggregated analytics for tourism management.',
  'Protect privacy by using location only with consent and never exposing an individual traveller.',
];

// Use cases of SRS section 6, grouped by module
const MODULES = [
  { name: 'Accounts, sign-in and travel preferences', cases: 'UC-01 – UC-03', status: 'available' },
  { name: 'Destination information, map and weather', cases: 'UC-04', status: 'available' },
  { name: 'Check-in and crowd estimation', cases: 'UC-06', status: 'available' },
  { name: 'AI-based alternative recommendations', cases: 'UC-09', status: 'available' },
  { name: 'Saved destinations', cases: 'UC-05', status: 'available' },
  { name: 'Check-out and visit history', cases: 'UC-07, UC-08', status: 'development' },
  { name: 'Community hazard reporting and review', cases: 'UC-10 – UC-12', status: 'development' },
  { name: 'Safety notifications', cases: 'UC-13', status: 'development' },
  { name: 'Cultural content, administration and analytics', cases: 'UC-14 – UC-17', status: 'development' },
];

const PRINCIPLES = [
  {
    title: 'Privacy by design',
    text: 'Location is read only with consent and only at the moment of a check-in. Public pages and dashboards show totals, never where an individual is.',
  },
  {
    title: 'Verified information',
    text: 'Hazard reports from community observers reach the public only after an administrator has verified them. Weather is shown with the time of the last reading.',
  },
  {
    title: 'Informed choice',
    text: 'RAAAH never restricts travel. It explains the conditions at a destination, suggests alternatives, and leaves the decision to the traveller.',
  },
];

// SRS section 4 and the Deployment Diagram (Fig. 45)
const STACK = [
  ['Web client', 'Next.js (React), responsive for mobile and desktop'],
  ['Application server', 'Node.js and Express.js REST API with role-based access control'],
  ['Recommendation engine', 'Python, FastAPI and scikit-learn; content-based scoring and ranking'],
  ['Data', 'PostgreSQL with PostGIS for locations, Redis for crowd and status caching'],
  ['External services', 'Google Maps Platform, OpenWeatherMap, Firebase Cloud Messaging'],
];

const STATUS = {
  available: { label: 'Available', className: 'text-low', dot: 'bg-low' },
  development: { label: 'In development', className: 'text-muted', dot: 'bg-rule' },
};

const initials = (name) =>
  name.replace(/^(Dr\.|M)\s+/, '').split(' ').map((w) => w[0]).slice(0, 2).join('');

function Section({ id, title, intro, children }) {
  return (
    <section id={id} className="grid gap-8 border-b border-rule py-14 md:grid-cols-[1fr_2fr] md:gap-12">
      <div>
        <h2 className="text-[28px]">{title}</h2>
        {intro && <p className="mt-3 max-w-xs text-[14px] text-ink-2">{intro}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Person({ name, role, detail, email, photo }) {
  return (
    <div className="flex gap-4 border-t border-rule pt-5">
      {/* A photo is shown when one is added to data/teamData.js (a file in public/team/) */}
      {photo ? (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-rule">
          <Image src={photo} alt={name} fill sizes="56px" className="object-cover" />
        </span>
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[18px] text-paper">
          {initials(name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-medium text-ink">{name}</p>
        <p className="text-[14px] text-ink-2">{role}</p>
        <p className="meta mt-1">
          {detail}
          {email && <> · <a href={`mailto:${email}`} className="link">{email}</a></>}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const hero = PHOTOS.deosai;
  const [lead] = FYP_INFO.teamMembers;

  return (
    <SiteLayout>
      {/* Header */}
      <section className="relative bg-ink text-white">
        <Image src={hero.src} alt={hero.place} fill priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="page relative py-20 sm:py-28">
          <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/75">
            Final Year Project · {FYP_INFO.year}
          </p>
          <h1 className="mt-4 max-w-3xl text-[40px] leading-[1.08] sm:text-[56px]">
            Intelligent crowd management and smart tourism for Northern Pakistan
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] text-white/85">
            RAAAH helps travellers check crowd levels, weather and verified hazards before they set out, and suggests
            safer, quieter alternatives when a destination is full or unsafe.
          </p>
          <p className="mt-8 text-[14px] text-white/70">
            {FYP_INFO.department}, {FYP_INFO.institution}, {FYP_INFO.campus}
          </p>
        </div>
      </section>

      <div className="page pb-20">
        {/* Key facts */}
        <dl className="grid grid-cols-2 border-b border-rule lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="border-rule py-6 pr-4 lg:border-l lg:px-6 lg:py-8 lg:first:border-l-0 lg:first:pl-0">
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-display text-[36px] leading-none sm:text-[44px]">{f.value}</dd>
              <dd className="mt-3 text-[14px] text-ink-2">{f.label}</dd>
            </div>
          ))}
        </dl>

        <Section title="The problem">
          <div className="max-w-[64ch] space-y-4 text-[16px] text-ink-2">
            <p>
              Visitors to Northern Pakistan concentrate on a small number of popular destinations, usually in the same
              few weeks. Roads, accommodation and fragile mountain environments come under heavy pressure, and when
              the weather turns or a slope fails there is little warning and no easy way to find somewhere else to go.
            </p>
            <p>
              The Murree tragedy of January 2022, in which 23 people died, showed the cost of a sudden tourist influx
              combined with severe weather and no information about crowds or road conditions. Authorities, in turn,
              lack aggregated data for crowd and safety planning.
            </p>
          </div>
        </Section>

        <Section title="Objectives" intro="As set out in the project's Software Requirements Specification.">
          <ol className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {OBJECTIVES.map((o, i) => (
              <li key={o} className="flex gap-4">
                <span className="data pt-0.5 text-muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15px] text-ink-2">{o}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Guiding principles">
          <div className="grid gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-t-2 border-ink pt-4">
                <h3 className="text-[20px]">{p.title}</h3>
                <p className="mt-2 text-[14px] text-ink-2">{p.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Development status" intro="The platform is being delivered in phases. Available modules can be used today.">
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="pb-2 text-[13px] font-medium text-ink-2">Module</th>
                <th scope="col" className="hidden pb-2 text-[13px] font-medium text-ink-2 sm:table-cell">Use cases</th>
                <th scope="col" className="pb-2 text-right text-[13px] font-medium text-ink-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {MODULES.map((m) => {
                const s = STATUS[m.status];
                return (
                  <tr key={m.name}>
                    <td className="py-3 pr-4 text-ink">{m.name}</td>
                    <td className="data hidden py-3 pr-4 text-muted sm:table-cell">{m.cases}</td>
                    <td className={`whitespace-nowrap py-3 text-right text-[14px] ${s.className}`}>
                      <span className={`mr-2 inline-block h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
                      {s.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Section>

        <Section title="Technology" intro="Separate web, application and recommendation components, so the model can be retrained independently.">
          <dl className="divide-y divide-rule border-y border-rule">
            {STACK.map(([layer, tech]) => (
              <div key={layer} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="text-[14px] font-medium text-ink">{layer}</dt>
                <dd className="text-[15px] text-ink-2">{tech}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Project team" intro={`${FYP_INFO.department}, FAST-NUCES ${FYP_INFO.campus}.`}>
          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {FYP_INFO.teamMembers.map((m) => (
              <Person key={m.rollNo} name={m.name} role={m.role} detail={m.rollNo} email={m.email} photo={m.photo} />
            ))}
            <Person name={FYP_INFO.supervisor.name} role="Project supervisor" detail={FYP_INFO.department} photo={FYP_INFO.supervisor.photo} />
          </div>
        </Section>

        <Section title="Contact">
          <p className="max-w-[64ch] text-[16px] text-ink-2">
            For questions about the project, write to the team technical lead, {lead.name}, at{' '}
            <a href={`mailto:${lead.email}`} className="link">{lead.email}</a>. To see the platform in use,{' '}
            <Link href={ROUTES.DESTINATIONS} className="link">explore the destinations</Link>.
          </p>
        </Section>

        <section id="credits" className="pt-10">
          <details className="group">
            <summary className="cursor-pointer list-none text-[14px] text-ink-2 hover:text-ink">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
              Photograph credits — all photographs are from Wikimedia Commons, used under the licences shown
            </summary>
            <ul className="mt-4 grid gap-x-10 text-[13px] sm:grid-cols-2">
              {Object.values(PHOTOS).map((p) => (
                <li key={p.src} className="flex justify-between gap-4 border-b border-rule py-2">
                  <span>{p.place}</span>
                  <span className="text-right text-muted">{p.author} · {p.licence}</span>
                </li>
              ))}
            </ul>
            <p className="meta mt-4">The viewpoint photographs on each destination page are credited under the photo.</p>
          </details>
        </section>
      </div>
    </SiteLayout>
  );
}
