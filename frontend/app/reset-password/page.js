import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { PHOTOS } from '@/data/photos';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/lib/i18n-server';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata = { title: 'Choose a New Password — RAAAH' };

export default async function ResetPasswordPage({ searchParams }) {
  const t = await getT();
  const { token } = await searchParams;

  return (
    <AuthLayout
      photo={PHOTOS.deosai}
      title={t('Choose a new password')}
      intro={t('After saving it, sessions that were signed in with the old password end.')}
      footer={<Link href={ROUTES.LOGIN} className="link">{t('Back to sign in')}</Link>}
    >
      <ResetPasswordForm token={typeof token === 'string' ? token : ''} />
    </AuthLayout>
  );
}
