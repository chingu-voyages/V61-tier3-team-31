import { createAdminClient } from "@/lib/supabase/admin";

const TEAM_STYLES = [
  {
    emoji: "🌌",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
    barColor: "bg-indigo-500",
  },
  {
    emoji: "🚀",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    textColor: "text-rose-600 dark:text-rose-400",
    barColor: "bg-rose-500",
  },
  {
    emoji: "🌿",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
    barColor: "bg-emerald-500",
  },
  {
    emoji: "⚡",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
    barColor: "bg-amber-500",
  },
  {
    emoji: "🌊",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    textColor: "text-cyan-600 dark:text-cyan-400",
    barColor: "bg-cyan-500",
  },
  {
    emoji: "🎮",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    textColor: "text-purple-600 dark:text-purple-400",
    barColor: "bg-purple-500",
  },
];

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  active: {
    label: "Active",
    style: "bg-nexus-green/10 text-nexus-green border border-nexus-green/20",
  },
  at_risk: {
    label: "At Risk",
    style:
      "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20",
  },
  forming: {
    label: "Forming",
    style:
      "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10",
  },
  completed: {
    label: "Completed",
    style: "bg-nexus-green/10 text-nexus-green border border-nexus-green/20",
  },
  archived: {
    label: "Archived",
    style:
      "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10",
  },
};

function hashToIndex(name: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % max;
  }
  return hash;
}

function getTeamStyle(name: string) {
  return TEAM_STYLES[hashToIndex(name, TEAM_STYLES.length)];
}

export interface TeamCardData {
  id: string;
  name: string;
  tier: string;
  domain: string;
  emoji: string;
  bg: string;
  textColor: string;
  status: string;
  statusStyle: string;
  description: string;
  progress: number;
  barColor: string;
  members: string[];
  extra: string;
}

export interface ParticipantData {
  id: string;
  name: string;
  role: string;
  assigned: boolean;
}

export async function getCurrentVoyage(): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("voyages")
    .select("id")
    .eq("status", "active")
    .order("number", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch current voyage: ${error.message}`);
  return data?.id ?? null;
}

export async function listTeams(voyageId?: string): Promise<TeamCardData[]> {
  const admin = createAdminClient();

  let query = admin
    .from("teams")
    .select("id, name, description, status, created_at")
    .order("created_at", { ascending: false });

  if (voyageId) {
    query = query.eq("voyage_id", voyageId);
  }

  const { data: teams, error } = await query;
  if (error) throw new Error(`Failed to fetch teams: ${error.message}`);
  if (!teams || teams.length === 0) return [];

  const { data: memberships, error: mError } = await admin
    .from("team_memberships")
    .select("team_id, enrollment_id")
    .in(
      "team_id",
      teams.map((t) => t.id),
    );

  if (mError) throw new Error(`Failed to fetch memberships: ${mError.message}`);

  const memberCountMap = new Map<string, number>();
  for (const m of memberships ?? []) {
    memberCountMap.set(m.team_id, (memberCountMap.get(m.team_id) ?? 0) + 1);
  }

  const enrollmentIds = [...new Set((memberships ?? []).map((m) => m.enrollment_id))];

  const { data: enrollments, error: eError } = await admin
    .from("enrollments")
    .select("id, account_id")
    .in("id", enrollmentIds);

  if (eError) throw new Error(`Failed to fetch enrollments: ${eError.message}`);

  const enrollmentToAccount = new Map((enrollments ?? []).map((e) => [e.id, e.account_id]));

  const accountIds = [...new Set((enrollments ?? []).map((e) => e.account_id))];

  const { data: profiles, error: pError } = await admin
    .from("profiles")
    .select("id, avatar_path")
    .in("id", accountIds);

  if (pError) throw new Error(`Failed to fetch profiles: ${pError.message}`);

  const profileAvatarMap = new Map((profiles ?? []).map((p) => [p.id, p.avatar_path]));

  const memberAvatarByTeam = new Map<string, string[]>();
  for (const m of memberships ?? []) {
    const accountId = enrollmentToAccount.get(m.enrollment_id);
    if (!accountId) continue;
    const avatarPath = profileAvatarMap.get(accountId);
    const list = memberAvatarByTeam.get(m.team_id) ?? [];
    list.push(avatarPath ?? "");
    memberAvatarByTeam.set(m.team_id, list);
  }

  const maxDisplayMembers = 3;

  return teams.map((team) => {
    const style = getTeamStyle(team.name);
    const memberAvatars = memberAvatarByTeam.get(team.id) ?? [];
    const count = memberCountMap.get(team.id) ?? 0;
    const statusInfo = STATUS_MAP[team.status] ?? {
      label: team.status,
      style:
        "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10",
    };

    return {
      id: team.id,
      name: team.name,
      tier: "Tier 2",
      domain: "New Project",
      emoji: style.emoji,
      bg: style.bg,
      textColor: style.textColor,
      status: statusInfo.label,
      statusStyle: statusInfo.style,
      description: team.description,
      progress: 0,
      barColor: style.barColor,
      members: memberAvatars.slice(0, maxDisplayMembers),
      extra: count > maxDisplayMembers ? `+${count - maxDisplayMembers}` : "",
    };
  });
}

export async function listAvailableParticipants(): Promise<ParticipantData[]> {
  const admin = createAdminClient();

  const { data: assignedEnrollments, error: aeError } = await admin
    .from("team_memberships")
    .select("enrollment_id");

  if (aeError) throw new Error(`Failed to fetch assigned enrollments: ${aeError.message}`);

  const assignedIds = new Set((assignedEnrollments ?? []).map((m) => m.enrollment_id));

  const { data: enrollments, error: eError } = await admin
    .from("enrollments")
    .select("id, account_id, participant_role")
    .eq("status", "active");

  if (eError) throw new Error(`Failed to fetch enrollments: ${eError.message}`);
  if (!enrollments || enrollments.length === 0) return [];

  const unassigned = enrollments.filter((e) => !assignedIds.has(e.id));

  if (unassigned.length === 0) return [];

  const accountIds = [...new Set(unassigned.map((e) => e.account_id))];

  const { data: profiles, error: pError } = await admin
    .from("profiles")
    .select("id, full_name, avatar_path")
    .in("id", accountIds);

  if (pError) throw new Error(`Failed to fetch profiles: ${pError.message}`);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return unassigned.map((e) => {
    const profile = profileMap.get(e.account_id);
    return {
      id: e.id,
      name: profile?.full_name ?? "Unknown",
      role: e.participant_role,
      assigned: false,
    };
  });
}

export async function createTeam(
  name: string,
  description: string,
  voyageId: string,
  enrollmentIds: string[],
  createdBy: string,
): Promise<string> {
  const admin = createAdminClient();

  const { data: team, error: tError } = await admin
    .from("teams")
    .insert({ name, description, voyage_id: voyageId, created_by: createdBy })
    .select("id")
    .single();

  if (tError) throw new Error(`Failed to create team: ${tError.message}`);
  if (!team) throw new Error("Team creation returned no data");

  if (enrollmentIds.length > 0) {
    const { data: enrollments, error: eError } = await admin
      .from("enrollments")
      .select("id, account_id, participant_role")
      .in("id", enrollmentIds);

    if (eError) throw new Error(`Failed to fetch enrollments: ${eError.message}`);

    const memberships = (enrollments ?? []).map((e) => ({
      team_id: team.id,
      enrollment_id: e.id,
      team_role: e.participant_role,
      created_by: createdBy,
    }));

    const { error: mError } = await admin.from("team_memberships").insert(memberships);

    if (mError) throw new Error(`Failed to assign members: ${mError.message}`);
  }

  return team.id;
}
