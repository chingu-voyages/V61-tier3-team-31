'use client';

import {FileText, FileSearch, Clock, CheckCircle, XCircle} from 'lucide-react';

/** Mock-Bewerbungsdaten fuer die Tabelle */
const applications = [
  {name: 'Sarah Jenkins', email: 'sarah.j@example.com', avatar: 'https://i.pravatar.cc/100?img=12', role: 'Fullstack', roleColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400', experience: 'Advanced', years: '4 years', status: 'Pending Review', statusStyle: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10', statusIcon: Clock, date: 'May 1, 2026', action: 'Review', actionStyle: 'text-[#1CB368] hover:text-[#189958] bg-[#1CB368]/10 hover:bg-[#1CB368]/20'},
  {name: 'Michael Chang', email: 'm.chang@example.com', avatar: 'https://i.pravatar.cc/100?img=15', role: 'Frontend', roleColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', experience: 'Intermediate', years: '2 years', status: 'Accepted', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, date: 'May 1, 2026', action: 'View Profile', actionStyle: 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'},
  {name: 'David Rust', email: 'david.r@example.com', avatar: 'https://i.pravatar.cc/100?img=32', role: 'Backend', roleColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', experience: 'Beginner', years: '1 year', status: 'Rejected', statusStyle: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20', statusIcon: XCircle, date: 'Apr 30, 2026', action: 'View Profile', actionStyle: 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'},
  {name: 'Emily Chen', email: 'emily.chen@example.com', avatar: 'https://i.pravatar.cc/100?img=47', role: 'Frontend', roleColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', experience: 'Advanced', years: '5+ years', status: 'Pending Review', statusStyle: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10', statusIcon: Clock, date: 'Apr 30, 2026', action: 'Review', actionStyle: 'text-[#1CB368] hover:text-[#189958] bg-[#1CB368]/10 hover:bg-[#1CB368]/20'},
];

/**
 * Bewerbungsseite mit Tabelle, Filtern und Tabs.
 * Zeigt eine Liste aller eingegangenen Voyage-Bewerbungen.
 */
export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and review incoming voyage applications.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <FileSearch className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#1CB368] text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#189958] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px">
        <button className="px-4 py-2 border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium text-sm cursor-pointer shadow-sm">All (312)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Pending Review (64)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Accepted (128)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Rejected (28)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Incomplete (92)</button>
      </div>

      {/* Tabelle */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {applications.map((app, i) => {
              const StatusIcon = app.statusIcon;
              return (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={app.avatar} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10" alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">{app.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${app.roleColor}`}>{app.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300">{app.experience}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.years}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${app.statusStyle}`}>
                      <StatusIcon className="w-3 h-3" /> {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{app.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className={`text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg ${app.actionStyle}`}>{app.action}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
