import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { PHOTOS } from '@/data/photos';
import { FYP_INFO } from '@/data/teamData';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/lib/i18n-server';

export const metadata = { title: 'Forgot Password — RAAAH' };

// RAAAH does not send e-mail yet, so a password is reset by the project team on request
export default async function ForgotPasswordPage() {
  const t = await getT();
  const [lead] = FYP_INFO.teamMembers;
  const subject = encodeURIComponent('RAAAH password reset');
  const body = encodeURIComponent('Please reset the password of my RAAAH account.\n\nEmail of the account:\nTourist ID (if known):');

  return (
    <AuthLayout
      photo={PHOTOS.deosai}
      title={t('Forgot your password?')}
      intro={t('Write to the RAAAH team from the email address of your account. We will check it is yours and send you a new password.')}
      footer={<Link href={ROUTES.LOGIN} className="link">{t('Back to sign in')}</Link>}
    >
      <ol className="space-y-3 text-[15px] text-ink-2">
        <li>1. {t('Use the email address you registered with.')}</li>
        <li>2. {t('Add your Tourist ID if you know it (on your profile page).')}</li>
        <li>3. {t('For your safety, never send your old password.')}</li>
      </ol>
      <a href={`mailto:${lead.email}?subject=${subject}&body=${body}`} className="btn btn-accent mt-8 h-11 w-full">
        {t('Email the RAAAH team')}
      </a>
      <p className="meta mt-3" dir="ltr">{lead.email}</p>
    </AuthLayout>
  );
}
