# Spec: Participant Overview — Refactor

**Status:** Draft
**Autor:** Architekt
**Zielsprache:** TypeScript (Next.js App Router)
**Komponente:** `src/app/(dashboard)/overview/page.tsx` → `ParticipantOverview`
**Abhängigkeiten:** `useDashboard`, `DashboardView`, Lucide Icons, Recharts (entfernen)

---

## 1. Problem

Der aktuelle `ParticipantOverview` (`:272-567`) enthält PM-Metaphern aus einem Project-Management-Tool, die für Nexus als **Cohort-Management-Plattform** nicht relevant sind.

### Entfernen (rote Linie)

| Sektion | Zeilen | Problem |
|---------|--------|---------|
| Sprint Progress (Pie-Chart, To Do / In Progress / Done) | `303-358` | Tasks/Springe gehören nicht in Cohort Management |
| My Tasks (Assigned / In Review / Blocked) | `391-420` | Tasks-Metapher, kein Teil von Nexus |
| Sprint Health (On Track / Overlap) | `520-542` | Sprint-Gesundheit ist PM-Konzept |
| Pie-Chart Import (`PieChart`, `Pie`, `Cell`, `RechartsTooltip`) | `8`, `321-327` | Wird nicht mehr gebraucht |
| `sprintTaskData` / `TASK_COLORS` | `12-17` | Nur für Sprint-Chart verwendet |

### Behalten (grüne Linie)

| Sektion | Zeilen | Grund |
|---------|--------|-------|
| Begrüssung + Badges | `280-298` | Allgemeiner Header |
| Upcoming Meetings | `360-384` | Relevant für Teilnehmer |
| My Onboarding | `422-459` | Kern-MVP-Feature |
| My Team (Avaatare, Rollen) | `482-516` | Kern-MVP-Feature |
| Recent Activity | `544-562` | Nützlich, muss aber angepasst werden |

---

## 2. Neues Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Welcome back, Olivia! 👋                                     │
│  You're on track. Next up: Confirm your availability.         │
│                                                                │
│  [🏔️ Team Atlas • Active]  [✅ Onboarding: 3/6]  [👤 Member] │
├──────────────────────────┬─────────────────────────────────────┤
│                          │                                     │
│  ◉ ONBOARDING PROGRESS   │  📋 MY TEAM                         │
│                          │                                     │
│    ┌────────────┐        │  Team Atlas · Active                │
│    │     ◉      │        │  [Ava][Ben][Cat][Dan] +1            │
│    │   50%      │        │  PM · FE · BE · DS                  │
│    │  3/6 steps │        │                                     │
│    └────────────┘        │  [View Team Space →]                │
│                          │                                     │
│  Next: Confirm Avail.    │  Shared Overlap: 4.5h/day           │
│  [Continue →]            │                                     │
├──────────────────────────┼─────────────────────────────────────┤
│                          │                                     │
│  📅 UPCOMING DATES       │  ⚡ QUICK ACTIONS                   │
│                          │                                     │
│  📅 May 12 — Standup     │  ┌─────────────────────────────┐   │
│  📅 May 13 — Planning    │  │ ▶ Continue Onboarding      │   │
│  📅 May 16 — Mentor      │  ├─────────────────────────────┤   │
│  📅 Jun 1 — Demo Day     │  │ ✏️ Update My Profile        │   │
│                          │  ├─────────────────────────────┤   │
│  [View Calendar →]       │  │ 👥 View My Team             │   │
│                          │  └─────────────────────────────┘   │
├──────────────────────────┴─────────────────────────────────────┤
│                                                                │
│  🔔 ANNOUNCEMENTS                                              │
│                                                                │
│  ● Team Atlas completed onboarding                          2h │
│  ● Mentorship sessions start next week                      1d │
│  ● Voyage 51 Demo Day: Jun 1                                3d │
│                                                                │
│  [View All →]                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Komponenten-Struktur

```
ParticipantOverview
├── WelcomeHeader
│   ├── Greeting (name)
│   ├── StatusMessage (dynamisch basierend auf Onboarding)
│   └── BadgeRow
│       ├── TeamBadge (name + status)
│       ├── OnboardingBadge (X/6 steps)
│       └── RoleBadge (Participant)
│
├── OnboardingCard                        ← NEU, prominenter
│   ├── ProgressRing (SVG, kein Recharts)
│   ├── StepSummary ("3 of 6 steps completed")
│   ├── NextStep ("Next: Confirm Availability")
│   └── ContinueButton → /onboarding
│
├── MyTeamCard                             ← aus altem My Team übernommen
│   ├── TeamName + StatusBadge
│   ├── MemberAvatars (Stack)
│   ├── RoleTags
│   ├── SharedOverlap
│   └── ViewTeamButton → /teams
│
├── UpcomingDates                          ← aus altem Upcoming Meetings
│   ├── EventItem[] (Programm-Dates, nicht nur Meetings)
│   └── ViewAllLink
│
├── QuickActions                           ← NEU
│   ├── ActionButton "Continue Onboarding"
│   ├── ActionButton "Update My Profile"
│   └── ActionButton "View My Team"
│
└── Announcements                          ← NEU (ersetzt Recent Activity)
    └── AnnouncementItem[]
```

---

## 4. Mock-Daten (für Prototyp)

```typescript
// Datei: overview/page.tsx — ersetzt MOCK_PARTICIPANT

const MOCK_PARTICIPANT = {
  name: 'Olivia',
  team: {
    name: 'Team Atlas',
    status: 'active' as const,
    members: [
      {avatar: '32', name: 'Olivia Chen', role: 'Frontend', timezone: 'UTC-7', isYou: true},
      {avatar: '11', name: 'Daniel Martinez', role: 'PM', timezone: 'UTC-6'},
      {avatar: '5', name: 'Emma Wilson', role: 'Design', timezone: 'UTC-5'},
      {avatar: '7', name: 'Michael Davis', role: 'Backend', timezone: 'UTC+1'},
    ],
    memberExtra: '+2',
    roles: ['PM', 'Frontend', 'Backend', 'Design'],
    sharedOverlap: '4.5h/day',
  },
  onboarding: {
    completed: 3,
    total: 6,
    percent: 50,
    nextStep: 'Confirm Availability',
  },
  upcomingDates: [
    {month: 'May', day: 12, title: 'Daily Standup', time: 'Today, 18:30', icon: 'standup'},
    {month: 'May', day: 13, title: 'Sprint Planning', time: 'Tomorrow, 19:00', icon: 'planning'},
    {month: 'May', day: 16, title: 'Mentor Check-in', time: 'Friday, 17:00', icon: 'mentor'},
    {month: 'Jun', day: 1, title: 'Demo Day', time: '3 weeks away', icon: 'demo'},
  ],
  quickActions: [
    {label: 'Continue Onboarding', icon: 'CheckCircle', route: 'onboarding'},
    {label: 'Update My Profile', icon: 'User', route: 'profile'},
    {label: 'View My Team', icon: 'UsersRound', route: 'teams'},
  ],
  announcements: [
    {text: 'Team Atlas completed onboarding', time: '2h ago', type: 'team'},
    {text: 'Mentorship sessions start next week', time: '1d ago', type: 'program'},
    {text: 'Voyage 51 Demo Day: Jun 1', time: '3d ago', type: 'deadline'},
  ],
};
```

---

## 5. Acceptance Criteria

### Funktionale AC

| # | Kriterium | Prio |
|---|-----------|------|
| AC1 | Das Onboarding-Progres-Ring ist die grösste, prominenteste Karte oben links | P0 |
| AC2 | "My Tasks" (Assigned/In Review/Blocked) existiert nicht mehr | P0 |
| AC3 | "Sprint Progress" (Pie-Chart + To Do/In Progress/Done) existiert nicht mehr | P0 |
| AC4 | "Sprint Health" existiert nicht mehr | P0 |
| AC5 | "Recent Activity" wird durch "Announcements" ersetzt | P1 |
| AC6 | "Quick Actions" ist eine neue Sektion mit 3 Buttons | P1 |
| AC7 | "Upcoming Meetings" wird zu "Upcoming Dates" — inkl. Programm-Dates | P1 |
| AC8 | Der StatusMessage-Text unter der Begrüssung ist dynamisch je nach Onboarding | P2 |

### UI/UX AC

| # | Kriterium | Prio |
|---|-----------|------|
| AC9 | Progress Ring verwendet reines SVG (kein Recharts) | P0 |
| AC10 | Alle Cards behalten den existierenden visuellen Stil (rounded-2xl, shadow-sm, border) | P0 |
| AC11 | Dark Mode wird in allen neuen Komponenten unterstützt | P0 |
| AC12 | Das Layout bleibt responsive (grid-cols-1 → lg:grid-cols-3) | P0 |
| AC13 | BadgeRow behält gleiches Styling wie aktuell | P1 |

### Technische AC

| # | Kriterium | Prio |
|---|-----------|------|
| AC14 | Recharts-Import wird aus der Datei entfernt | P0 |
| AC15 | `sprintTaskData` und `TASK_COLORS` werden gelöscht | P0 |
| AC16 | `AdminOverview` (Mock-Daten) bleibt unberührt | P0 |
| AC17 | Neue Komponenten sind als eigenständige Funktionen exportiert | P1 |
| AC18 | JSDoc-Kommentare auf Deutsch für jede neue Komponente | P2 |

---

## 6. Datenfluss (später mit Supabase)

```
┌─────────────────────┐
│   Supabase          │
│                     │
│  participants       │──→ team_id, onboarding_completed, onboarding_total
│  profiles           │──→ full_name
│  teams              │──→ name, status
│  team_members       │──→ member list + roles
│  onboarding_steps   │──→ step status per participant
│  program_settings   │──→ voyage dates, deadlines
│  announcements      │──→ program-wide messages
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Server Component   │  ← Daten werden im Server gefetched
│  (zukünftig)        │     und als Props an Client übergeben.
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  ParticipantOverview│  ← Client Component (nur UI-Logik)
│  (Client)           │     useDashboard() für Navigation
└─────────────────────┘
```

---

## 7. Zustände

| Zustand | Sichtbarer Inhalt |
|---------|------------------|
| **Loading** | Skeleton: 2 grosse Cards + 3 kleine Cards |
| **Loaded** | Volles Dashboard mit Mock-Daten |
| **Onboarding abgeschlossen** | Progress Ring zeigt 100%, StatusMessage: "You're all set! 🎉" |
| **Kein Team** | MyTeamCard zeigt "You haven't been assigned to a team yet" statt Mitgliedern, kein Overlap |
| **Keine Announcements** | "No announcements yet" — zentrierter Text |
| **Error** | Toaster + Retry-Button (zukünftig) |

---

## 8. Änderungen an anderen Dateien

### `src/app/(dashboard)/overview/page.tsx`

```diff
- import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
+ // kein Recharts-Import mehr

- const sprintTaskData = [...];
- const TASK_COLORS = [...];
+ // gelöscht

- const MOCK_PARTICIPANT = { ... };  // alt
+ const MOCK_PARTICIPANT = { ... };  // neu (siehe Section 4)

- function ParticipantOverview() { ... }  // alt
+ function ParticipantOverview() { ... }  // neu

+ // Neue Hilfskomponenten (optional ausgelagert)
+ function ProgressRing({ percent }: { percent: number }) { ... }
+ function QuickActions({ actions, onNavigate }: { ... }) { ... }
+ function Announcements({ items }: { items: ... }) { ... }
```

### `src/app/(dashboard)/overview/page.tsx` — OverviewPage

```diff
export default function OverviewPage() {
  const { role } = useDashboard();
  if (role === 'admin') return <AdminOverview />;
  if (role === 'participant') return <ParticipantOverview />;
-   return <UserOverview />;  // existiert nicht mehr
+   return <ApplicantOverview />;  // ✅ korrekt nach Refactor roles
}
```

> **Hinweis:** Zeile `637` verwendet bereits `role === 'participant'`, und `639` returned `ApplicantOverview`. Die alte `UserOverview`-Funktion existiert nicht mehr — sie wurde bereits durch `ParticipantOverview` ersetzt. Nach diesem Refactor muss also nur der Body von `ParticipantOverview` getauscht werden.

---

## 9. Test-Szenarien (manuell)

1. **Render-Test:** Dashboard zeigt 6 Karten: Onboarding, My Team, Upcoming Dates, Quick Actions, Announcements + WelcomeHeader
2. **Kein Sprint-Content:** Nirgendwo auf der Seite erscheint "Sprint", "To Do", "In Progress", "Done", "Sprint Health"
3. **Navigation:** "Continue Onboarding" → `/onboarding`, "View My Team" → `/teams`, "Update My Profile" → `/profile`
4. **Dark Mode:** Alle neuen Elemente haben korrekte `dark:` Klassen
5. **Responsive:** Unter 1024px werden Cards gestapelt

---

## 10. Migration Steps

1. Alte Mock-Daten (`MOCK_PARTICIPANT`) durch neue ersetzen
2. Recharts-Import entfernen
3. `sprintTaskData` / `TASK_COLORS` löschen
4. `ParticipantOverview`-Body durch neues Layout ersetzen
5. Hilfskomponenten (`ProgressRing`, `QuickActions`, `Announcements`) hinzufügen
6. `AdminOverview` unverändert lassen
7. `ApplicantOverview` unverändert lassen
8. Manuelle Tests durchführen (Section 9)

---

## 11. Out of Scope

- Keine echten Supabase-Daten — bleibt bei Mock-Daten
- Keine Änderungen an `AdminOverview`
- Keine Änderungen an `ApplicantOverview`
- Keine `Announcements`-CRUD — nur Anzeige
