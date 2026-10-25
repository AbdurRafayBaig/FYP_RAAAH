"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/Icon';

const SLIDE_MS = 6000;
const SWIPE_PX = 40;

// With reduced motion asked for in the system settings the photos only change when the visitor asks
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Photo and name of a destination. With several viewpoint photos they change by themselves (crossfade),
// can be paused, and can be stepped through with the buttons, the bars or a swipe on a phone.
export default function DestinationHero({ name, region, photos }) {
  const count = photos.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovered, setHovered] = useState(false);
  // Photos are only loaded once they are about to be shown, so a phone does not fetch them all at once
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const touchX = useRef(null);

  const show = useCallback((i) => {
    const following = (i + 1) % count;
    setIndex(i);
    setMounted((m) => (m.has(i) && m.has(following) ? m : new Set([...m, i, following])));
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused || hovered) return undefined;
    const t = setTimeout(() => show((index + 1) % count), SLIDE_MS);
    return () => clearTimeout(t);
  }, [count, paused, hovered, index, show]);

  const go = (step) => show((index + step + count) % count);
  const current = photos[index];

  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className="relative h-[60vh] min-h-[380px] bg-ink text-white"
      aria-roledescription="carousel"
      aria-label={`Photos of ${name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      {photos.map((p, i) => mounted.has(i) && (
        <Image
          key={p.src}
          src={p.src}
          alt={i === index ? `${name}: ${p.caption}` : ''}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-out ${i === index ? 'opacity-90' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_30%,transparent_50%,rgba(0,0,0,0.75))]" />

      <div className="page relative flex h-full flex-col justify-end pb-6">
        <Link href={ROUTES.DESTINATIONS} className="mb-auto mt-6 flex w-fit items-center gap-1.5 text-[13px] text-white/80 hover:text-white">
          <Icon name="back" size={16} /> All destinations
        </Link>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[14px] text-white/80">{region}</p>
            <h1 className="mt-1 text-[40px] sm:text-[56px]">{name}</h1>
          </div>

          {count > 1 && (
            <div className="flex items-center gap-2 md:pb-3">
              <p className="mr-2 min-w-0 flex-1 text-[14px] text-white/90 md:max-w-[280px] md:text-right" aria-live={paused ? 'polite' : 'off'}>
                <span className="data mr-2 text-white/60">{index + 1}/{count}</span>
                {current.caption}
              </p>
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play the photos' : 'Pause the photos'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15">
                <Icon name={paused ? 'play' : 'pause'} size={15} />
              </button>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15">
                <Icon name="previous" size={16} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15">
                <Icon name="next" size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-6">
          {count > 1 ? (
            <div className="flex flex-1 gap-1.5">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`Show photo ${i + 1}: ${p.caption}`}
                  aria-current={i === index}
                  className="group h-5 max-w-14 flex-1"
                >
                  <span className={`block h-[3px] rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/35 group-hover:bg-white/60'}`} />
                </button>
              ))}
            </div>
          ) : <span />}
          {current?.author && (
            <p className="shrink-0 text-right text-[11px] text-white/60">Photo: {current.author}, {current.licence}</p>
          )}
        </div>
      </div>
    </section>
  );
}
