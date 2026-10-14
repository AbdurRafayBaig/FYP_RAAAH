import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

// Sign-in and registration: photograph on the left, the form centred in the right half
export default function AuthLayout({ photo, title, intro, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-ink lg:block">
        <Image src={photo.src} alt={photo.place} fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
        <p className="absolute bottom-5 left-8 text-[12px] text-white/80">
          {photo.place}. Photo: {photo.author}, {photo.licence}
        </p>
      </div>

      <div className="flex justify-center px-5 py-8 sm:px-12">
        <div className="flex w-full max-w-[440px] flex-col">
          <Link href={ROUTES.HOME} className="flex w-fit items-center gap-2.5">
            <span className="relative h-8 w-8 overflow-hidden rounded-[3px] bg-white">
              <Image src="/logo.png" alt="" fill sizes="32px" className="object-contain p-0.5" />
            </span>
            <span className="font-display text-[22px] font-semibold tracking-tight">RAAAH</span>
          </Link>
          <div className="my-auto py-12">
            <h1 className="text-[36px]">{title}</h1>
            {intro && <p className="mt-2 text-[15px] text-ink-2">{intro}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-rule pt-5 text-[14px] text-ink-2">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
