import { requireUser } from "@/lib/auth/queries";
import { getApplicationStatusCounts } from "@/lib/dashboard/application-statistics";
import { getCurrentCourse } from "@/lib/dashboard/course";
import { AdminOverview } from "./admin-overview";
import { getDeadlines } from "@/lib/dashboard/deadlines";
import { getOnboardingStatistics } from "@/lib/dashboard/onboarding-statistics";
import { getRecentActivity } from "@/lib/dashboard/activity-statistics";
import { getAttentionStatistics } from "@/lib/dashboard/attention-statistics";
import { getTeamsStatistics } from "@/lib/dashboard/team-statistics";
import { getMatchingStatistics } from "@/lib/dashboard/matching-statistics";

export default async function OverviewPage() {
  const user = await requireUser();
  const stats = await getApplicationStatusCounts();
  const course = await getCurrentCourse();
  const deadlines = getDeadlines(course);
  const teams = await getTeamsStatistics();
  const matching = await getMatchingStatistics();
  const onboarding = await getOnboardingStatistics();
  const attention = await getAttentionStatistics();
  const activity = await getRecentActivity();

  return (
    <AdminOverview
      userName={user.profile?.full_name ?? user.email.split("@")[0]}
      stats={stats}
      course={course}
      deadlines={deadlines}
      onboarding={onboarding}
      teams={teams}
      matching={matching}
      attention={attention}
      activity={activity}
    />
  );
}
