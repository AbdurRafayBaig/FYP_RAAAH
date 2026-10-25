import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { PHOTOS } from '@/data/photos';
import { FYP_INFO } from '@/data/teamData';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/lib/i18n-server';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata = { title: 'Forgot Password — RAAAH' };

export default async function ForgotPasswordPage() {
  const t = await getT();
  const [lead] = FYP_INFO.teamMembers;

  return (
    <AuthLayout
      photo={PHOTOS.deosai}
      title={t('Forgot your password?')}
      intro={t('Enter the email of your account. We will send you a link to choose a new password.')}
      footer={<Link href={ROUTES.LOGIN} className="link">{t('Back to sign in')}</Link>}
    >
      <ForgotPasswordForm teamEmail={lead.email} />
    </AuthLayout>
  );
}
