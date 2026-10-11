import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function AuthLayout({ photo, title, intro, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="relative hidden bg-ink lg:block">
        <Image src={photo.src} alt={photo.place} fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <p className="absolute bottom-5 left-8 text-[12px] text-white/70">
          {photo.place}. Photo: {photo.author}, {photo.licence}
        </p>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-12">
        <Link href={ROUTES.HOME} className="font-display text-[22px] font-semibold">RAAAH</Link>
        <div className="my-auto w-full max-w-[400px] py-12">
          <h1 className="text-[36px]">{title}</h1>
          {intro && <p className="mt-2 text-[15px] text-ink-2">{intro}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 border-t border-rule pt-5 text-[14px] text-ink-2">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
