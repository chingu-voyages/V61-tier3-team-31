'use client';

import {useState} from 'react';
import {ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Shield} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import Link from 'next/link';

/**
 * Passwort zuruecksetzen — Formular fuer das neue Passwort.
 * Wird nach dem Klick auf den Reset-Link aus der E-Mail angezeigt.
 */
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** Prueft ob das Passwort mindestens 8 Zeichen hat */
  const isValid = password.length >= 8 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
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
            {submitted ? 'Password reset!' : 'Set new password'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {submitted
              ? 'Your password has been updated successfully.'
              : 'Create a new strong password for your account.'}
          </p>
        </div>

        <div className="p-8">
          {!submitted ? (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Neues Passwort */}
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Passwort-Staerke-Anzeige */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            password.length >= 12 ? 'bg-[#77CF97]' :
                            password.length >= 8 ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}
                          style={{width: `${Math.min(100, (password.length / 12) * 100)}%`}}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        password.length >= 12 ? 'text-[#77CF97]' :
                        password.length >= 8 ? 'text-amber-500' :
                        'text-rose-500'
                      }`}>
                        {password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : 'Weak'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Passwort bestaetigen */}
                <div className="space-y-1.5 text-left">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      className={`w-full bg-slate-50 dark:bg-white/5 border rounded-xl py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-rose-300 dark:border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                          : confirmPassword && password === confirmPassword
                            ? 'border-[#77CF97]/50 dark:border-[#77CF97]/50 focus:border-[#77CF97] focus:ring-1 focus:ring-[#77CF97]/30'
                            : 'border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-1">Passwords do not match.</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[11px] text-[#77CF97] mt-1">Passwords match.</p>
                  )}
                </div>

                {/* Fehlermeldung */}
                {error && (
                  <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full py-3 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 dark:border-[#0b0c10]/30 border-t-white dark:border-t-[#0b0c10] rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
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
            /* Bestaetigungszustand */
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#77CF97]/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#77CF97]" />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
                  You can now sign in with your new password.
                </p>
              </div>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer"
              >
                Sign In
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
