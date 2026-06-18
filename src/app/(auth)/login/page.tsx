'use client';

import {useState} from 'react';
import {ShieldAlert, User, FileCheck} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';

/** Login-Seite mit Formular und Quick-Login-Buttons */
export default function LoginPage() {
  const {setRole, setIsAuthenticated} = useDashboard();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (selectedRole: 'admin' | 'applicant' | 'participant') => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
        <div className="p-8 pb-6 border-b border-slate-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0b0c10] flex items-center justify-center mb-6 shadow-sm border border-slate-200">
            <NexusLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your Nexus Ops workspace.</p>
        </div>

        <div className="p-8">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin('applicant');
            }}
          >
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#0b0c10] text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm mt-2 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 uppercase tracking-wider font-semibold">
                Or quick login as
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLogin('admin')}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin
            </button>

            <button
              onClick={() => handleLogin('applicant')}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-amber-300 hover:text-amber-600 transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Applicant
            </button>

            <button
              onClick={() => handleLogin('participant')}
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-emerald-300 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              Participant
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-medium text-slate-400">
        Protected by Nexus Identity Management
      </div>
    </div>
  );
}
