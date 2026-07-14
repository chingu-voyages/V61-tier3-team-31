"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, CheckCircle, X, Check } from "lucide-react";

const MOCK_PARTICIPANTS = [
  { id: "p1", name: "Alice Smith", role: "Frontend", assigned: false },
  { id: "p2", name: "Bob Jones", role: "Backend", assigned: false },
  { id: "p3", name: "Charlie Davis", role: "Fullstack", assigned: false },
  { id: "p4", name: "Diana Lee", role: "Design", assigned: false },
  { id: "p5", name: "Eve Wilson", role: "Product Owner", assigned: false },
];

const INITIAL_TEAMS = [
  {
    id: "team-nebula",
    name: "Nebula Builders",
    tier: "Tier 2",
    domain: "E-Commerce",
    emoji: "\u{1F30C}",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
    status: "Active",
    statusStyle: "bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20",
    statusIcon: CheckCircle,
    description: "Building a decentralized marketplace.",
    progress: 75,
    barColor: "bg-indigo-500",
    members: ["11", "12", "13"],
    extra: "+1",
  },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isModalOpen) return;
    const container = document.getElementById("main-scroll-container");
    if (!container) return;
    const prev = container.style.overflow;
    container.style.overflow = "hidden";
    return () => {
      container.style.overflow = prev;
    };
  }, [isModalOpen]);

  const unassignedParticipants = useMemo(() => {
    return participants.filter((p) => !p.assigned);
  }, [participants]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      tier: "Tier 3",
      domain: "New Project",
      emoji: "\u{1F680}",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
      status: "Active",
      statusStyle: "bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20",
      statusIcon: CheckCircle,
      description: newTeamDesc || "A newly created team.",
      progress: 0,
      barColor: "bg-emerald-500",
      members: selectedParticipants.map((_, i) => `${(i % 10) + 1}`),
      extra: "",
    };

    setTeams([newTeam, ...teams]);

    setParticipants((prev) =>
      prev.map((p) => (selectedParticipants.includes(p.id) ? { ...p, assigned: true } : p)),
    );

    setNewTeamName("");
    setNewTeamDesc("");
    setSelectedParticipants([]);
    setIsModalOpen(false);
    setSuccessMessage("Team created successfully!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Teams Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor team progress, project status, and engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Team
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-[#77CF97]/10 border border-[#77CF97]/20 text-[#77CF97] px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-white/10 pb-px gap-4">
        <div className="flex gap-2 overflow-x-auto">
          <button className="px-4 py-2 border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium text-sm cursor-pointer whitespace-nowrap">
            All Teams ({teams.length})
          </button>
        </div>
        <div className="relative mb-2 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#77CF97]/50 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams
          .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
          .map((team) => {
            const TeamIcon = team.statusIcon;
            return (
              <div
                key={team.id}
                className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl ${team.bg} flex items-center justify-center font-outfit font-bold text-xl ${team.textColor}`}
                    >
                      {team.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {team.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {team.tier} {"\u2022"} {team.domain}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${team.statusStyle}`}
                  >
                    <TeamIcon className="w-3 h-3" /> {team.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-2">
                  {team.description}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                    <span className="text-slate-800 dark:text-white font-bold">
                      {team.progress}%
                    </span>
                  </div>
                  <div className="relative w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-6">
                    <div
                      className={`absolute top-0 left-0 h-full ${team.barColor} rounded-full`}
                      style={{ width: `${team.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 3).map((m, j) => (
                        <img
                          key={j}
                          src={`https://i.pravatar.cc/100?img=${m}`}
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10"
                          alt=""
                        />
                      ))}
                      {team.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-50 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center">
                          +{team.members.length - 3}
                        </div>
                      )}
                    </div>
                    <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#77CF97] transition-colors cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl w-full max-w-lg shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-outfit">
                Create New Team
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Code Ninjas"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="What is this team building?"
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Assign Participants
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedParticipants.length} selected
                  </span>
                </div>
                <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto bg-slate-50 dark:bg-white/5 scrollbar-premium">
                  {unassignedParticipants.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                      No unassigned participants available.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-white/5">
                      {unassignedParticipants.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => toggleParticipant(p.id)}
                          className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedParticipants.includes(p.id) ? "bg-[#77CF97] border-[#77CF97] text-black" : "border-slate-300 dark:border-white/20"}`}
                          >
                            {selectedParticipants.includes(p.id) && (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {p.name}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                            {p.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTeamName.trim()}
                  className="px-5 py-2.5 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
