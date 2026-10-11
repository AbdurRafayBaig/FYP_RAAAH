import LoginForm from './LoginForm';

export const metadata = { title: 'Sign In — RAAAH' };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === 'string' ? next : ''} />;
}
