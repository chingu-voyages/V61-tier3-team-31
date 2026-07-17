"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, CheckCircle, X, Check } from "lucide-react";
import { createTeamAction } from "@/lib/admin/actions";
import type { TeamCardData, ParticipantData } from "@/lib/admin/teams";

interface TeamsClientProps {
  initialTeams: TeamCardData[];
  initialParticipants: ParticipantData[];
  userId: string;
  voyageId: string;
}

export function TeamsClient({
  initialTeams,
  initialParticipants,
  userId,
  voyageId,
}: TeamsClientProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [participants, setParticipants] = useState(initialParticipants);
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

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    if (!voyageId) {
      setSuccessMessage("No active voyage found. Cannot create team.");
      setTimeout(() => setSuccessMessage(""), 4000);
      return;
    }

    const result = await createTeamAction(
      newTeamName,
      newTeamDesc,
      voyageId,
      selectedParticipants,
      userId,
    );

    if ("error" in result) {
      setSuccessMessage(`Error: ${result.error}`);
      setTimeout(() => setSuccessMessage(""), 4000);
      return;
    }

    const newTeam: TeamCardData = {
      id: result.teamId,
      name: newTeamName,
      tier: "Tier 3",
      domain: "New Project",
      emoji: "🚀",
      bg: "bg-nexus-green/10",
      textColor: "text-nexus-green",
      status: "Active",
      statusStyle: "bg-nexus-green/10 text-nexus-green border border-nexus-green/20",
      description: newTeamDesc || "A newly created team.",
      progress: 0,
      barColor: "bg-nexus-green",
      members: [],
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
          <h1 className="text-[28px] font-outfit font-medium             text-foreground mb-1 tracking-tight">
            Teams Directory
          </h1>
          <p className=" text-muted-foreground text-sm">
            Monitor team progress, project status, and engagement.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-80 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Team
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-nexus-green/10 border border-nexus-green/20 text-nexus-green px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-px gap-4">
        <div className="flex gap-2 overflow-x-auto">
          <button className="px-4 py-2 border-b-2 border-foreground text-foreground font-medium text-sm cursor-pointer whitespace-nowrap">
            All Teams ({teams.length})
          </button>
        </div>
        <div className="relative mb-2 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-muted border border-border rounded-lg py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-green/50 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams
          .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
          .map((team) => {
            return (
              <div
                key={team.id}
                className="bg-card rounded-[24px] border border-border shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 items-center">
                    <div
                      className={`w-12 h-12 rounded-2xl ${team.bg} flex items-center justify-center font-outfit font-bold text-xl ${team.textColor}`}
                    >
                      {team.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{team.name}</h3>
                      <div className="text-xs text-muted-foreground">
                        {team.tier} {"\u2022"} {team.domain}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${team.statusStyle}`}
                  >
                    <CheckCircle className="w-3 h-3" /> {team.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                  {team.description}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className="text-foreground font-bold">{team.progress}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
                    <div
                      className={`absolute top-0 left-0 h-full ${team.barColor} rounded-full`}
                      style={{ width: `${team.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 3).map((m, j) => (
                        <img
                          key={j}
                          src={`https://i.pravatar.cc/100?img=${j + 1}`}
                          className="w-8 h-8 rounded-full border-2 border-card bg-muted"
                          alt=""
                        />
                      ))}
                      {team.extra && (
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-muted text-muted-foreground text-[10px] font-medium flex items-center justify-center">
                          {team.extra}
                        </div>
                      )}
                    </div>
                    <button className="text-sm font-semibold text-muted-foreground hover:text-nexus-green transition-colors cursor-pointer">
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
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground font-outfit">Create New Team</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-5 space-y-5">
              {!voyageId && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-medium">
                  No active voyage found. A voyage must be active before teams can be created.
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Code Ninjas"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nexus-green/30 focus:border-nexus-green/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="What is this team building?"
                  rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nexus-green/30 focus:border-nexus-green/50 transition-all resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Assign Participants
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {selectedParticipants.length} selected
                  </span>
                </div>
                <div className="border border-border rounded-xl overflow-hidden max-h-[200px] overflow-y-auto bg-muted scrollbar-premium">
                  {unassignedParticipants.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No unassigned participants available.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {unassignedParticipants.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => toggleParticipant(p.id)}
                          className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${selectedParticipants.includes(p.id) ? "bg-nexus-green border-nexus-green text-black" : "border-border"}`}
                          >
                            {selectedParticipants.includes(p.id) && (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {p.name}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            {p.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTeamName.trim() || !voyageId}
                  title={!voyageId ? "No active voyage available" : ""}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-80 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
