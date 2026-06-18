'use client';

import {Settings, Network, Search, Users, CheckCircle, Plus, ChevronRight, MoreHorizontal, ShieldAlert} from 'lucide-react';

/** Unbesetzte Teilnehmer im Pool */
const unassignedPool = [
  {name: 'Robert Fox', role: 'Frontend', exp: 'L3', av: '22', avail: '20hrs/wk'},
  {name: 'Jane Cooper', role: 'Backend', exp: 'L4', av: '43', avail: '15hrs/wk'},
  {name: 'Wade Warren', role: 'Fullstack', exp: 'L5', av: '13', avail: '30hrs/wk'},
  {name: 'Esther Howard', role: 'Design', exp: 'L2', av: '9', avail: '20hrs/wk'},
  {name: 'Cameron Williamson', role: 'Frontend', exp: 'L3', av: '6', avail: '25hrs/wk'},
  {name: 'Brooklyn Simmons', role: 'Backend', exp: 'L4', av: '34', avail: '10hrs/wk'},
  {name: 'Leslie Alexander', role: 'Product', exp: 'L3', av: '41', avail: '20hrs/wk'},
];

/** Team-Matching-Seite mit Pool und Draft-Teams */
export default function MatchingPage() {
  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Team Matching</h1>
          <p className="text-slate-500 text-sm">Review unassigned participants and form squads for Voyage 51.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" /> Matching Rules
          </button>
          <button className="px-4 py-2 bg-[#1CB368] text-white rounded-xl text-sm font-medium hover:bg-[#189958] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Network className="w-4 h-4" /> Auto-Match All
          </button>
        </div>
      </div>

      {/* Statistikreihe */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {icon: <Users />, bg: 'bg-slate-100 text-slate-600', value: '72', label: 'Unassigned'},
          {icon: <Network />, bg: 'bg-blue-50 text-blue-500', value: '34', label: 'Partial Matches'},
          {icon: <Users />, bg: 'bg-purple-50 text-purple-600', value: '18', label: 'Drafted Teams'},
          {icon: <CheckCircle />, bg: 'bg-[#1CB368]/10 text-[#1CB368]', value: '56', label: 'Matched'},
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-outfit font-bold text-slate-800 leading-tight">{s.value}</div>
              <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Matching-Arbeitsbereich */}
      <div className="flex gap-6 items-start">
        {/* Unbesetzter Pool */}
        <div className="w-1/3 bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[700px]">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
              Unassigned Pool
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">72</span>
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by name or role..." className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-slate-300 transition-colors" />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              <button className="whitespace-nowrap px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-medium">All</button>
              <button className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-xs font-medium transition-colors">Frontend (24)</button>
              <button className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-xs font-medium transition-colors">Backend (19)</button>
              <button className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-xs font-medium transition-colors">Design (8)</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {unassignedPool.map((p, i) => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-grab transition-all">
                <img src={`https://i.pravatar.cc/100?img=${p.av}`} className="w-10 h-10 rounded-full bg-slate-200" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{p.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">{p.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[11px] text-slate-500 font-medium">{p.exp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 mb-1">{p.avail}</div>
                  <button className="w-6 h-6 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors ml-auto">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entwurfsteams */}
        <div className="w-2/3 flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-slate-900">Drafted Teams</h3>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Expand All</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 pb-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Team 1: Alpha Core */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm">T1</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Alpha Core</div>
                    <div className="text-[11px] text-slate-500">Timezone: EST/CST • 100% Match</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 p-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {[
                  {name: 'Alice Smith', avatar: '1', role: 'Frontend', roleStyle: 'text-blue-600 bg-blue-50'},
                  {name: 'Bob Jones', avatar: '2', role: 'Backend', roleStyle: 'text-amber-600 bg-amber-50'},
                  {name: 'Charlie Davis', avatar: '3', role: 'Fullstack', roleStyle: 'text-purple-600 bg-purple-50'},
                ].map((m, j) => (
                  <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-7 h-7 rounded-full" alt="" />
                      <div className="text-sm font-medium text-slate-800">{m.name}</div>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${m.roleStyle}`}>{m.role}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#1CB368]">
                  <CheckCircle className="w-3.5 h-3.5" /> Team Complete
                </div>
                <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">Confirm Team</button>
              </div>
            </div>

            {/* Team 2: Beta Squad */}
            <div className="bg-white rounded-[24px] border border-rose-200 shadow-sm p-5 hover:border-rose-300 transition-colors relative">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">Missing Slot</span>
              </div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">T2</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Beta Squad</div>
                    <div className="text-[11px] text-slate-500">Timezone: PST • 66% Match</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 p-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img src="https://i.pravatar.cc/100?img=4" className="w-7 h-7 rounded-full" alt="" />
                    <div className="text-sm font-medium text-slate-800">Diana Prince</div>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Frontend</div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img src="https://i.pravatar.cc/100?img=5" className="w-7 h-7 rounded-full" alt="" />
                    <div className="text-sm font-medium text-slate-800">Evan Wright</div>
                  </div>
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Design</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                      <Plus className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Add Backend...</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 flex items-center gap-2 border-t border-slate-100">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-rose-500 font-medium">Cannot confirm until team is full</span>
              </div>
            </div>

            {/* Team 3: Gamma Ray */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">T3</div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Gamma Ray</div>
                    <div className="text-[11px] text-slate-500">Timezone: GMT • 100% Match</div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700 p-1"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2">
                {[
                  {name: 'Fiona Gallagher', avatar: '6', role: 'Product', roleStyle: 'text-emerald-600 bg-emerald-50'},
                  {name: 'George Clark', avatar: '7', role: 'Fullstack', roleStyle: 'text-purple-600 bg-purple-50'},
                  {name: 'Hannah Lee', avatar: '8', role: 'Fullstack', roleStyle: 'text-purple-600 bg-purple-50'},
                ].map((m, j) => (
                  <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-7 h-7 rounded-full" alt="" />
                      <div className="text-sm font-medium text-slate-800">{m.name}</div>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${m.roleStyle}`}>{m.role}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#1CB368]">
                  <CheckCircle className="w-3.5 h-3.5" /> Team Complete
                </div>
                <button className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">Confirm Team</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
