'use client';

import {CheckCircle, Check, Lock, ArrowUpRight} from 'lucide-react';

/** Onboarding-Schritte */
const steps = [
  {done: true, title: 'Accept Invitation & Terms', desc: 'Review and accept the Nexus Operation guidelines.', date: 'Completed Oct 20'},
  {done: false, active: true, title: 'Complete Profile Form', desc: 'Please fill out your skills, availability, and preferred project types so we can match you to the best team.'},
  {done: false, title: 'Link GitHub Account', desc: 'Connect your GitHub to sync repositories and track sprint points.'},
  {done: false, title: 'Team Introduction', desc: 'Join the #general Discord channel and introduce yourself to the community.'},
];

/** Onboarding-Checkliste fuer User */
export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Onboarding Checklist</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Complete these steps to gain full access to the Nexus workspace.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> 1 / 4 Completed
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-[#1a1b24] p-6 rounded-[20px] flex items-start gap-4 ${
                step.active ? 'border-2 border-indigo-500 shadow-md dark:shadow-[0_4px_20px_rgba(99,102,241,0.15)]' : step.done ? 'border border-slate-200 dark:border-white/10 shadow-sm' : 'border border-slate-200 dark:border-white/10 shadow-sm opacity-75'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? 'bg-[#1CB368] text-white' : step.active ? 'border-2 border-indigo-500 shadow-sm' : 'border-2 border-slate-300 dark:border-slate-600'
              }`}>
                {step.done && <Check className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${step.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{step.title}</h3>
                <p className={`text-sm mt-1 ${step.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-500 dark:text-slate-400'} ${step.active ? 'mb-4' : ''}`}>{step.desc}</p>
                {step.active && (
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                    Start Form <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {step.date && <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{step.date}</span>}
              {step.active && <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">Action Required</span>}
              {!step.done && !step.active && <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-[#13151a] text-white p-6 rounded-[24px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <CheckCircle className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-2">Need help?</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10">
              If you&apos;re stuck on any of the onboarding steps, reach out to the moderation team.
            </p>
            <button className="w-full py-2.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/15 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700 dark:border-white/10 relative z-10">
              Read the Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
