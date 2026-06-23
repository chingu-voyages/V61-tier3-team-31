'use client';

import {useState, useEffect} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

/** Registrierungsseite mit Formular */
export default function RegisterPage() {
  const {setRole, setStatus, setIsAuthenticated, isAuthenticated, isInitialized} = useDashboard();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Bereits authentifiziert → direkt zum Dashboard
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/overview');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (isInitialized && isAuthenticated) {
    return null;
  }

  /** Validierung */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      e.fullName = 'Name must be at least 2 characters.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!password || password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    if (!agreed) {
      e.agreed = 'You must agree to the Terms of Service.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Formular absenden */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulierte Registrierung
    await new Promise((r) => setTimeout(r, 1200));

    setRole('user');
    setStatus('applicant');
    setIsAuthenticated(true);
    router.push('/overview');
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-slate-50 dark:bg-white/5 border ${hasError ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-white/10'} rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none ${hasError ? 'focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`;

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0a0a0a] flex flex-col justify-center items-center p-6 font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1b24] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-white/10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0b0c10] flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-white/10">
            <NexusLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-2">Create account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Join Amigo and start your journey.</p>
        </div>

        {/* Formular */}
        <div className="p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                placeholder="Jane Cooper"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass(!!errors.fullName)}
              />
              {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(!!errors.email)}
              />
              {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass(!!errors.password)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass(!!errors.confirmPassword)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${agreed ? 'bg-[#77CF97] border-[#77CF97]' : 'border-slate-300 dark:border-white/20 bg-white dark:bg-white/5'}`}
              >
                {agreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</a>.
              </span>
            </div>
            {errors.agreed && <p className="text-xs text-rose-500">{errors.agreed}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign-in Link */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
        Protected by Amigo Identity Management
      </div>
    </div>
  );
}
