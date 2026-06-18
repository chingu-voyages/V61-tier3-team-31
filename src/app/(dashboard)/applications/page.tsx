'use client';

import {FileText, FileSearch, Clock, CheckCircle, XCircle} from 'lucide-react';

/** Mock-Bewerbungsdaten fuer die Tabelle */
const applications = [
  {name: 'Sarah Jenkins', email: 'sarah.j@example.com', avatar: 'https://i.pravatar.cc/100?img=12', role: 'Fullstack', roleColor: 'bg-purple-50 text-purple-600', experience: 'Advanced', years: '4 years', status: 'Pending Review', statusStyle: 'bg-slate-100 text-slate-600 border border-slate-200/50', statusIcon: Clock, date: 'May 1, 2026', action: 'Review', actionStyle: 'text-[#1CB368] hover:text-[#189958] bg-[#1CB368]/10 hover:bg-[#1CB368]/20'},
  {name: 'Michael Chang', email: 'm.chang@example.com', avatar: 'https://i.pravatar.cc/100?img=15', role: 'Frontend', roleColor: 'bg-blue-50 text-blue-600', experience: 'Intermediate', years: '2 years', status: 'Accepted', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, date: 'May 1, 2026', action: 'View Profile', actionStyle: 'text-slate-500 hover:text-slate-800'},
  {name: 'David Rust', email: 'david.r@example.com', avatar: 'https://i.pravatar.cc/100?img=32', role: 'Backend', roleColor: 'bg-amber-50 text-amber-600', experience: 'Beginner', years: '1 year', status: 'Rejected', statusStyle: 'bg-rose-50 text-rose-500 border border-rose-100', statusIcon: XCircle, date: 'Apr 30, 2026', action: 'View Profile', actionStyle: 'text-slate-500 hover:text-slate-800'},
  {name: 'Emily Chen', email: 'emily.chen@example.com', avatar: 'https://i.pravatar.cc/100?img=47', role: 'Frontend', roleColor: 'bg-blue-50 text-blue-600', experience: 'Advanced', years: '5+ years', status: 'Pending Review', statusStyle: 'bg-slate-100 text-slate-600 border border-slate-200/50', statusIcon: Clock, date: 'Apr 30, 2026', action: 'Review', actionStyle: 'text-[#1CB368] hover:text-[#189958] bg-[#1CB368]/10 hover:bg-[#1CB368]/20'},
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
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Applications</h1>
          <p className="text-slate-500 text-sm">Manage and review incoming voyage applications.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <FileSearch className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-[#0b0c10] text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        <button className="px-4 py-2 border-b-2 border-slate-900 text-slate-900 font-medium text-sm cursor-pointer shadow-sm">All (312)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer">Pending Review (64)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer">Accepted (128)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer">Rejected (28)</button>
        <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer">Incomplete (92)</button>
      </div>

      {/* Tabelle */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app, i) => {
              const StatusIcon = app.statusIcon;
              return (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={app.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{app.name}</div>
                        <div className="text-[11px] text-slate-500">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${app.roleColor}`}>{app.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{app.experience}</div>
                    <div className="text-[11px] text-slate-500">{app.years}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${app.statusStyle}`}>
                      <StatusIcon className="w-3 h-3" /> {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{app.date}</td>
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
