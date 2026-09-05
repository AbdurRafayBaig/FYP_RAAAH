import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-[#F7F8F5] p-1">
            <Image src="/logo.png" alt="RAAAH Logo" fill className="object-contain" />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#17211F]">Welcome back</h1>
          <p className="text-xs text-[#66736F]">Sign in to continue your journey.</p>
        </div>

        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#17211F] mb-1.5">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
            />
          </div>
          <div>
            <label className="block font-semibold text-[#17211F] mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-[#F7F8F5] text-[#17211F] focus:outline-none focus:border-[#164A41]" 
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-[#66736F]">
              <input type="checkbox" className="rounded border-stone-300" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-[#2F6B5B] font-semibold hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 rounded-lg bg-[#164A41] hover:bg-[#2F6B5B] text-white font-semibold transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-[#66736F] pt-2 border-t border-stone-100">
          New to RAAAH?{' '}
          <Link href="/register" className="text-[#164A41] font-bold hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
