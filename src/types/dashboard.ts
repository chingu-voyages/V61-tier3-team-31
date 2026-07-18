export type ApplicationStats = {
  draft: number;
  total: number;
  accepted: number;
  rejected: number;
  submitted: number;
  withdrawn: number;
  under_review: number;
  course_id: string;

  accepted_rate: number;
  under_review_rate: number;
  rejected_rate: number;
  accepted_last_24h: number;
};

export type MatchingStats = {
  unassigned: number;
  partial_matches: number;
  matched: number;
};

export type TeamStats = {
  total_teams: number;
  draft_teams: number;
  confirmed_teams: number;
  needs_attention: number;
};

export type OnboardingStats = {
  total_participants: number;
  completed: number;
  in_progress: number;
  not_started: number;
  completion_rate: number;
};

export type Course = {
  id: string;
  number: number;
  status: string;
  application_deadline: string;
  starts_at: string;
  ends_at: string;
};

export type Deadline = {
  title: string;
  date: string;
  badgeColor: string;
};

export type PipelineProps = {
  applicationStats: ApplicationStats;
  onboardingStats: OnboardingStats;
  // matchingStats: MatchingStats;
  // teamStats: TeamStats;
};

export type Activity = {
  id: string;
  type: string;
  text: string;
  user_name: string;
  user_id: string | null;
  avatar: string | null;
  created_at: string;
};
