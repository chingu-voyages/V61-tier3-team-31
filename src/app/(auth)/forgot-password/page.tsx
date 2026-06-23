'use client';

import {useState} from 'react';
import {ArrowLeft, Mail, Send, CheckCircle} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import Link from 'next/link';

/**
 * Passwort-Zuruecksetzung — Eingabe der E-Mail-Adresse.
 * Zeigt nach dem Absenden eine Bestaetigungsmeldung.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulierte Verzoegerung fuer den API-Aufruf
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0a0a0a] flex flex-col justify-center items-center p-6 font-sans transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1b24] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden transition-colors">

        {/* Kopfbereich mit Logo */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-white/10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0b0c10] flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-white/10">
            <NexusLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-2">
            {submitted ? 'Check your email' : 'Forgot password?'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {submitted
              ? <>We sent a reset link to <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span></>
              : 'Enter your email and we\'ll send you a reset link.'}
          </p>
        </div>

        <div className="p-8">
          {!submitted ? (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 dark:border-[#0b0c10]/30 border-t-white dark:border-t-[#0b0c10] rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            /* Bestaetigungszustand nach dem Absenden */
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#77CF97]/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#77CF97]" />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                    }}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    try another email address
                  </button>
                  .
                </p>
              </div>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
        Protected by Amigo Identity Management
      </div>
    </div>
  );
}
