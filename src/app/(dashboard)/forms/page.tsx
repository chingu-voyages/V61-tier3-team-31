'use client';

import {
  Plus, Search, FileSignature, CheckCircle, BarChart2,
  ShieldAlert, MessageSquare, UsersRound, Link2, Edit2,
  Eye, MoreVertical, ArrowUpRight, Archive,
} from 'lucide-react';

/** Mock-Formulardaten */
const formsData = [
  {
    name: 'Voyage 51 Application Form',
    description: 'Role selection, XP, and availability',
    icon: ShieldAlert,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-500/10',
    iconBorder: 'border-purple-100 dark:border-purple-500/20',
    status: 'Collecting',
    responses: 312,
    responseExtra: '+24 today',
    conversion: 92,
    lastModified: '2 hours ago',
  },
  {
    name: 'Sprint 1 Feedback Survey',
    description: 'Anonymous team dynamics pulse check',
    icon: MessageSquare,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
    iconBorder: 'border-orange-100 dark:border-orange-500/20',
    status: 'Collecting',
    responses: 84,
    responseExtra: '/ 128 Participants',
    conversion: 65,
    lastModified: 'Yesterday',
  },
  {
    name: 'Mentorship Matching Survey',
    description: 'For senior engineers offering mentorship',
    icon: UsersRound,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconBorder: 'border-blue-100 dark:border-blue-500/20',
    status: 'Closed',
    responses: 32,
    responseExtra: 'Final',
    conversion: 100,
    lastModified: 'Oct 24, 2025',
  },
];

/**
 * Formular-Seite mit Tabellenuebersicht.
 * Zeigt Formulare mit Status, Antworten und Konvertierungsrate.
 */
export default function FormsPage() {
  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Form Builder & Templates</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create and manage application forms, feedback surveys, and onboarding documents.</p>
        </div>
        <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#1CB368] text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#189958] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Create Form
        </button>
      </div>

      {/* Statistik-Banner */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {label: 'Active Forms', value: '12', icon: FileSignature, iconBg: 'bg-indigo-50 dark:bg-indigo-500/10', iconColor: 'text-indigo-500 dark:text-indigo-400', iconBorder: 'border-indigo-100 dark:border-indigo-500/20'},
          {label: 'Total Submissions', value: '1,482', icon: CheckCircle, iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', iconColor: 'text-emerald-500 dark:text-emerald-400', iconBorder: 'border-emerald-100 dark:border-emerald-500/20'},
          {label: 'Avg. Completion Rate', value: '94.2%', icon: BarChart2, iconBg: 'bg-amber-50 dark:bg-amber-500/10', iconColor: 'text-amber-500 dark:text-amber-400', iconBorder: 'border-amber-100 dark:border-amber-500/20'},
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#1a1b24] p-5 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</div>
                <div className="text-3xl font-outfit font-bold text-slate-900 dark:text-white leading-none">{stat.value}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center ${stat.iconColor}`}>
                <StatIcon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Formular-Liste */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-medium transition-colors">Active</button>
            <button className="px-4 py-1.5 bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 rounded-full text-sm font-medium transition-colors">Drafts (3)</button>
            <button className="px-4 py-1.5 bg-slate-50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/20 rounded-full text-sm font-medium transition-colors">Archived</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search forms..." className="w-64 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/20 transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Responses</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversion</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {formsData.map((form, i) => {
                const FormIcon = form.icon;
                return (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${form.iconBg} ${form.iconColor} border ${form.iconBorder} flex items-center justify-center shrink-0`}>
                          <FormIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer">{form.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{form.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        form.status === 'Collecting'
                          ? 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                      }`}>
                        {form.status === 'Collecting' ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1CB368] animate-pulse"></div>
                        ) : (
                          <Archive className="w-3 h-3" />
                        )}
                        {form.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">{form.responses}</div>
                      <div className={`text-[11px] flex items-center gap-1 ${form.responseExtra?.startsWith('+') ? 'text-[#1CB368]' : 'text-slate-400 dark:text-slate-500'}`}>
                        {form.responseExtra?.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
                        {form.responseExtra}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-800 dark:bg-white rounded-full" style={{width: `${form.conversion}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{form.conversion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{form.lastModified}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Copy Link"><Link2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Edit Form"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
