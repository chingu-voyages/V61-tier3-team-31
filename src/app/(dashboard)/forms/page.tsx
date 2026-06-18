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
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    iconBorder: 'border-purple-100',
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
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    iconBorder: 'border-orange-100',
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
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
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
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Form Builder & Templates</h1>
          <p className="text-slate-500 text-sm">Create and manage application forms, feedback surveys, and onboarding documents.</p>
        </div>
        <button className="px-4 py-2 bg-[#0b0c10] text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Create Form
        </button>
      </div>

      {/* Statistik-Banner */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {label: 'Active Forms', value: '12', icon: FileSignature, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', iconBorder: 'border-indigo-100'},
          {label: 'Total Submissions', value: '1,482', icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', iconBorder: 'border-emerald-100'},
          {label: 'Avg. Completion Rate', value: '94.2%', icon: BarChart2, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', iconBorder: 'border-amber-100'},
        ].map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
                <div className="text-3xl font-outfit font-bold text-slate-900 leading-none">{stat.value}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center ${stat.iconColor}`}>
                <StatIcon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Formular-Liste */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-sm font-medium transition-colors">Active</button>
            <button className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition-colors">Drafts (3)</button>
            <button className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-full text-sm font-medium transition-colors">Archived</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search forms..." className="w-64 bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-slate-300 transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Responses</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formsData.map((form, i) => {
                const FormIcon = form.icon;
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${form.iconBg} ${form.iconColor} border ${form.iconBorder} flex items-center justify-center shrink-0`}>
                          <FormIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors cursor-pointer">{form.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{form.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        form.status === 'Collecting'
                          ? 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
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
                      <div className="text-sm font-semibold text-slate-800">{form.responses}</div>
                      <div className={`text-[11px] flex items-center gap-1 ${form.responseExtra?.startsWith('+') ? 'text-[#1CB368]' : 'text-slate-400'}`}>
                        {form.responseExtra?.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
                        {form.responseExtra}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-800 rounded-full" style={{width: `${form.conversion}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{form.conversion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">{form.lastModified}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Copy Link"><Link2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Form"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
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
