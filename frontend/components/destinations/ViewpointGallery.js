"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';

// FR-02.04 - the viewpoints of a destination; a photo opens full screen, with its credit
export default function ViewpointGallery({ name, photos }) {
  const dialog = useRef(null);
  const [open, setOpen] = useState(null); // index of the photo shown full screen

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length]);

  const show = (i) => {
    setOpen(i);
    if (!dialog.current.open) dialog.current.showModal();
  };
  const step = (n) => setOpen((i) => (i + n + photos.length) % photos.length);
  const photo = open === null ? null : photos[open];

  return (
    <section>
      <h2 className="text-[24px]">Viewpoints</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
            <button type="button" onClick={() => show(i)} className="group block w-full text-left">
              <span className="relative block aspect-[4/3] overflow-hidden bg-rule">
                <Image
                  src={p.src}
                  alt={`${name}: ${p.caption}`}
                  fill
                  sizes={i === 0 ? '(max-width: 640px) 100vw, 480px' : '(max-width: 640px) 50vw, 240px'}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-1.5 block text-[13px] leading-snug text-ink-2 group-hover:text-ink">{p.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        aria-label={`Photos of ${name}`}
        className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
      >
        {photo && (
          <div className="flex h-full flex-col px-4 py-4 sm:px-8" onClick={(e) => e.target === e.currentTarget && dialog.current.close()}>
            <div className="flex items-center justify-between gap-4">
              <p className="data text-white/70">{open + 1} / {photos.length}</p>
              <button type="button" onClick={() => dialog.current.close()} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="relative my-4 flex-1">
              <Image key={photo.src} src={photo.src} alt={`${name}: ${photo.caption}`} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15">
                <Icon name="previous" size={18} />
              </button>
              <div className="min-w-0 text-center">
                <p className="text-[15px]">{photo.caption}</p>
                <p className="text-[12px] text-white/60">Photo: {photo.author}, {photo.licence} · Wikimedia Commons</p>
              </div>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15">
                <Icon name="next" size={18} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
