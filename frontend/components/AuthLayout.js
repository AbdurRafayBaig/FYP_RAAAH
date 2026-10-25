import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { LanguageToggle, Logo } from '@/components/Navbar';

// Sign-in and registration: photograph on the left, the form centred in the right half
export default function AuthLayout({ photo, title, intro, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-ink lg:block">
        <Image src={photo.src} alt={photo.place} fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
        <p className="absolute bottom-5 left-8 text-[12px] text-white/80" dir="ltr">
          {photo.place}. Photo: {photo.author}, {photo.licence}
        </p>
      </div>

      <div className="flex justify-center px-5 py-8 sm:px-12">
        <div className="flex w-full max-w-[440px] flex-col">
          <div className="flex items-center justify-between gap-4">
            <Link href={ROUTES.HOME} aria-label="RAAAH home" className="w-fit"><Logo /></Link>
            <LanguageToggle className="text-ink-2 hover:text-ink" />
          </div>
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
