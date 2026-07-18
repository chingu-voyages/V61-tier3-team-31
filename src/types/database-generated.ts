export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          audience: Database["public"]["Enums"]["audience_kind"];
          author_id: string | null;
          content: string;
          created_at: string;
          id: string;
          pinned: boolean;
          published_at: string | null;
          status: Database["public"]["Enums"]["announcement_status"];
          team_id: string | null;
          title: string;
          updated_at: string;
          voyage_id: string | null;
        };
        Insert: {
          audience: Database["public"]["Enums"]["audience_kind"];
          author_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["announcement_status"];
          team_id?: string | null;
          title: string;
          updated_at?: string;
          voyage_id?: string | null;
        };
        Update: {
          audience?: Database["public"]["Enums"]["audience_kind"];
          author_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["announcement_status"];
          team_id?: string | null;
          title?: string;
          updated_at?: string;
          voyage_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      application_skills: {
        Row: {
          application_id: string;
          skill_id: number;
        };
        Insert: {
          application_id: string;
          skill_id: number;
        };
        Update: {
          application_id?: string;
          skill_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "application_skills_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      application_status_history: {
        Row: {
          application_id: string;
          changed_by: string | null;
          created_at: string;
          from_status: Database["public"]["Enums"]["application_status"] | null;
          id: number;
          note: string | null;
          to_status: Database["public"]["Enums"]["application_status"];
        };
        Insert: {
          application_id: string;
          changed_by?: string | null;
          created_at?: string;
          from_status?: Database["public"]["Enums"]["application_status"] | null;
          id?: never;
          note?: string | null;
          to_status: Database["public"]["Enums"]["application_status"];
        };
        Update: {
          application_id?: string;
          changed_by?: string | null;
          created_at?: string;
          from_status?: Database["public"]["Enums"]["application_status"] | null;
          id?: never;
          note?: string | null;
          to_status?: Database["public"]["Enums"]["application_status"];
        };
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "application_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          applicant_id: string;
          bio_snapshot: string | null;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          experience: Database["public"]["Enums"]["experience_level"] | null;
          id: string;
          motivation: string | null;
          portfolio_url_snapshot: string | null;
          preferred_role: Database["public"]["Enums"]["participant_role"] | null;
          review_notes: string | null;
          status: Database["public"]["Enums"]["application_status"];
          submitted_at: string | null;
          timezone: string | null;
          updated_at: string;
          voyage_id: string;
          weekly_hours: number | null;
          years_experience: number | null;
        };
        Insert: {
          applicant_id: string;
          bio_snapshot?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          experience?: Database["public"]["Enums"]["experience_level"] | null;
          id?: string;
          motivation?: string | null;
          portfolio_url_snapshot?: string | null;
          preferred_role?: Database["public"]["Enums"]["participant_role"] | null;
          review_notes?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          submitted_at?: string | null;
          timezone?: string | null;
          updated_at?: string;
          voyage_id: string;
          weekly_hours?: number | null;
          years_experience?: number | null;
        };
        Update: {
          applicant_id?: string;
          bio_snapshot?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          experience?: Database["public"]["Enums"]["experience_level"] | null;
          id?: string;
          motivation?: string | null;
          portfolio_url_snapshot?: string | null;
          preferred_role?: Database["public"]["Enums"]["participant_role"] | null;
          review_notes?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
          submitted_at?: string | null;
          timezone?: string | null;
          updated_at?: string;
          voyage_id?: string;
          weekly_hours?: number | null;
          years_experience?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey";
            columns: ["applicant_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_decided_by_fkey";
            columns: ["decided_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string;
          entity_type: string;
          id: number;
          metadata: Json;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id: string;
          entity_type: string;
          id?: never;
          metadata?: Json;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string;
          entity_type?: string;
          id?: never;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      availability_windows: {
        Row: {
          created_at: string;
          ends_at: string;
          enrollment_id: string;
          id: number;
          starts_at: string;
          weekday: number;
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          enrollment_id: string;
          id?: never;
          starts_at: string;
          weekday: number;
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          enrollment_id?: string;
          id?: never;
          starts_at?: string;
          weekday?: number;
        };
        Relationships: [
          {
            foreignKeyName: "availability_windows_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollments";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_event_attendees: {
        Row: {
          account_id: string;
          event_id: string;
          responded_at: string | null;
          response: string;
        };
        Insert: {
          account_id: string;
          event_id: string;
          responded_at?: string | null;
          response?: string;
        };
        Update: {
          account_id?: string;
          event_id?: string;
          responded_at?: string | null;
          response?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_event_attendees_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_event_attendees_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "calendar_events";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          all_day: boolean;
          audience: Database["public"]["Enums"]["audience_kind"];
          created_at: string;
          created_by: string | null;
          description: string;
          ends_at: string;
          event_type: Database["public"]["Enums"]["calendar_event_type"];
          id: string;
          pinned: boolean;
          starts_at: string;
          team_id: string | null;
          title: string;
          updated_at: string;
          voyage_id: string;
        };
        Insert: {
          all_day?: boolean;
          audience?: Database["public"]["Enums"]["audience_kind"];
          created_at?: string;
          created_by?: string | null;
          description?: string;
          ends_at: string;
          event_type: Database["public"]["Enums"]["calendar_event_type"];
          id?: string;
          pinned?: boolean;
          starts_at: string;
          team_id?: string | null;
          title: string;
          updated_at?: string;
          voyage_id: string;
        };
        Update: {
          all_day?: boolean;
          audience?: Database["public"]["Enums"]["audience_kind"];
          created_at?: string;
          created_by?: string | null;
          description?: string;
          ends_at?: string;
          event_type?: Database["public"]["Enums"]["calendar_event_type"];
          id?: string;
          pinned?: boolean;
          starts_at?: string;
          team_id?: string | null;
          title?: string;
          updated_at?: string;
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "calendar_events_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          account_id: string;
          application_id: string;
          completed_at: string | null;
          created_at: string;
          experience: Database["public"]["Enums"]["experience_level"];
          id: string;
          joined_at: string | null;
          participant_role: Database["public"]["Enums"]["participant_role"];
          status: Database["public"]["Enums"]["enrollment_status"];
          timezone: string;
          updated_at: string;
          voyage_id: string;
          weekly_hours: number;
        };
        Insert: {
          account_id: string;
          application_id: string;
          completed_at?: string | null;
          created_at?: string;
          experience: Database["public"]["Enums"]["experience_level"];
          id?: string;
          joined_at?: string | null;
          participant_role: Database["public"]["Enums"]["participant_role"];
          status?: Database["public"]["Enums"]["enrollment_status"];
          timezone: string;
          updated_at?: string;
          voyage_id: string;
          weekly_hours: number;
        };
        Update: {
          account_id?: string;
          application_id?: string;
          completed_at?: string | null;
          created_at?: string;
          experience?: Database["public"]["Enums"]["experience_level"];
          id?: string;
          joined_at?: string | null;
          participant_role?: Database["public"]["Enums"]["participant_role"];
          status?: Database["public"]["Enums"]["enrollment_status"];
          timezone?: string;
          updated_at?: string;
          voyage_id?: string;
          weekly_hours?: number;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: true;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      form_answers: {
        Row: {
          question_id: string;
          submission_id: string;
          value: Json;
        };
        Insert: {
          question_id: string;
          submission_id: string;
          value: Json;
        };
        Update: {
          question_id?: string;
          submission_id?: string;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "form_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "form_questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_answers_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "form_submissions";
            referencedColumns: ["id"];
          },
        ];
      };
      form_questions: {
        Row: {
          description: string;
          form_id: string;
          id: string;
          label: string;
          options: Json | null;
          position: number;
          question_type: string;
          required: boolean;
        };
        Insert: {
          description?: string;
          form_id: string;
          id?: string;
          label: string;
          options?: Json | null;
          position: number;
          question_type: string;
          required?: boolean;
        };
        Update: {
          description?: string;
          form_id?: string;
          id?: string;
          label?: string;
          options?: Json | null;
          position?: number;
          question_type?: string;
          required?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "form_questions_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      form_submissions: {
        Row: {
          account_id: string;
          created_at: string;
          form_id: string;
          id: string;
          submitted_at: string | null;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          form_id: string;
          id?: string;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          form_id?: string;
          id?: string;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "form_submissions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "form_submissions_form_id_fkey";
            columns: ["form_id"];
            isOneToOne: false;
            referencedRelation: "forms";
            referencedColumns: ["id"];
          },
        ];
      };
      forms: {
        Row: {
          audience: Database["public"]["Enums"]["audience_kind"];
          closes_at: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          id: string;
          opens_at: string | null;
          status: Database["public"]["Enums"]["form_status"];
          title: string;
          updated_at: string;
          voyage_id: string | null;
        };
        Insert: {
          audience?: Database["public"]["Enums"]["audience_kind"];
          closes_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          opens_at?: string | null;
          status?: Database["public"]["Enums"]["form_status"];
          title: string;
          updated_at?: string;
          voyage_id?: string | null;
        };
        Update: {
          audience?: Database["public"]["Enums"]["audience_kind"];
          closes_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          opens_at?: string | null;
          status?: Database["public"]["Enums"]["form_status"];
          title?: string;
          updated_at?: string;
          voyage_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "forms_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      match_proposal_members: {
        Row: {
          contribution_score: number | null;
          enrollment_id: string;
          proposal_id: string;
          proposed_role: Database["public"]["Enums"]["participant_role"];
        };
        Insert: {
          contribution_score?: number | null;
          enrollment_id: string;
          proposal_id: string;
          proposed_role: Database["public"]["Enums"]["participant_role"];
        };
        Update: {
          contribution_score?: number | null;
          enrollment_id?: string;
          proposal_id?: string;
          proposed_role?: Database["public"]["Enums"]["participant_role"];
        };
        Relationships: [
          {
            foreignKeyName: "match_proposal_members_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_proposal_members_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "match_proposals";
            referencedColumns: ["id"];
          },
        ];
      };
      match_proposals: {
        Row: {
          compatibility_score: number;
          confirmed_team_id: string | null;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          id: string;
          matching_run_id: string | null;
          proposed_name: string;
          rationale: string;
          score_breakdown: Json;
          status: Database["public"]["Enums"]["match_proposal_status"];
          voyage_id: string;
        };
        Insert: {
          compatibility_score: number;
          confirmed_team_id?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          matching_run_id?: string | null;
          proposed_name: string;
          rationale?: string;
          score_breakdown?: Json;
          status?: Database["public"]["Enums"]["match_proposal_status"];
          voyage_id: string;
        };
        Update: {
          compatibility_score?: number;
          confirmed_team_id?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          matching_run_id?: string | null;
          proposed_name?: string;
          rationale?: string;
          score_breakdown?: Json;
          status?: Database["public"]["Enums"]["match_proposal_status"];
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "match_proposals_confirmed_team_id_fkey";
            columns: ["confirmed_team_id"];
            isOneToOne: true;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_proposals_decided_by_fkey";
            columns: ["decided_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_proposals_matching_run_id_fkey";
            columns: ["matching_run_id"];
            isOneToOne: false;
            referencedRelation: "matching_runs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_proposals_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      matching_rule_sets: {
        Row: {
          active: boolean;
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          version: number;
          voyage_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name: string;
          version: number;
          voyage_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          version?: number;
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_rule_sets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_rule_sets_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      matching_rules: {
        Row: {
          config: Json;
          enabled: boolean;
          id: string;
          rule_key: string;
          rule_set_id: string;
          weight: number;
        };
        Insert: {
          config?: Json;
          enabled?: boolean;
          id?: string;
          rule_key: string;
          rule_set_id: string;
          weight: number;
        };
        Update: {
          config?: Json;
          enabled?: boolean;
          id?: string;
          rule_key?: string;
          rule_set_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "matching_rules_rule_set_id_fkey";
            columns: ["rule_set_id"];
            isOneToOne: false;
            referencedRelation: "matching_rule_sets";
            referencedColumns: ["id"];
          },
        ];
      };
      matching_runs: {
        Row: {
          created_at: string;
          error_message: string | null;
          finished_at: string | null;
          id: string;
          requested_by: string | null;
          rule_set_id: string;
          started_at: string | null;
          status: Database["public"]["Enums"]["matching_run_status"];
          voyage_id: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          finished_at?: string | null;
          id?: string;
          requested_by?: string | null;
          rule_set_id: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["matching_run_status"];
          voyage_id: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          finished_at?: string | null;
          id?: string;
          requested_by?: string | null;
          rule_set_id?: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["matching_run_status"];
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matching_runs_requested_by_fkey";
            columns: ["requested_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_runs_rule_set_id_fkey";
            columns: ["rule_set_id"];
            isOneToOne: false;
            referencedRelation: "matching_rule_sets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matching_runs_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          account_id: string;
          body: string;
          created_at: string;
          data: Json;
          id: string;
          notification_type: Database["public"]["Enums"]["notification_type"];
          read_at: string | null;
          title: string;
        };
        Insert: {
          account_id: string;
          body: string;
          created_at?: string;
          data?: Json;
          id?: string;
          notification_type: Database["public"]["Enums"]["notification_type"];
          read_at?: string | null;
          title: string;
        };
        Update: {
          account_id?: string;
          body?: string;
          created_at?: string;
          data?: Json;
          id?: string;
          notification_type?: Database["public"]["Enums"]["notification_type"];
          read_at?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_progress: {
        Row: {
          completed_at: string | null;
          completed_by: string | null;
          enrollment_id: string;
          note: string | null;
          status: Database["public"]["Enums"]["onboarding_progress_status"];
          step_id: string;
          updated_at: string;
        };
        Insert: {
          completed_at?: string | null;
          completed_by?: string | null;
          enrollment_id: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["onboarding_progress_status"];
          step_id: string;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          completed_by?: string | null;
          enrollment_id?: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["onboarding_progress_status"];
          step_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_completed_by_fkey";
            columns: ["completed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "onboarding_progress_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "onboarding_progress_step_id_fkey";
            columns: ["step_id"];
            isOneToOne: false;
            referencedRelation: "onboarding_steps";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_steps: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          id: string;
          position: number;
          required: boolean;
          title: string;
          updated_at: string;
          voyage_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string;
          id?: string;
          position: number;
          required?: boolean;
          title: string;
          updated_at?: string;
          voyage_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          id?: string;
          position?: number;
          required?: boolean;
          title?: string;
          updated_at?: string;
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_skills: {
        Row: {
          profile_id: string;
          skill_id: number;
        };
        Insert: {
          profile_id: string;
          skill_id: number;
        };
        Update: {
          profile_id?: string;
          skill_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          bio: string;
          created_at: string;
          full_name: string;
          github_url: string | null;
          id: string;
          portfolio_url: string | null;
          preferred_role: Database["public"]["Enums"]["participant_role"] | null;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          full_name: string;
          github_url?: string | null;
          id: string;
          portfolio_url?: string | null;
          preferred_role?: Database["public"]["Enums"]["participant_role"] | null;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          bio?: string;
          created_at?: string;
          full_name?: string;
          github_url?: string | null;
          id?: string;
          portfolio_url?: string | null;
          preferred_role?: Database["public"]["Enums"]["participant_role"] | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          active: boolean;
          custom: boolean;
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          active?: boolean;
          custom?: boolean;
          id?: never;
          name: string;
          slug: string;
        };
        Update: {
          active?: boolean;
          custom?: boolean;
          id?: never;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      team_memberships: {
        Row: {
          created_by: string | null;
          enrollment_id: string;
          id: string;
          is_lead: boolean;
          joined_at: string;
          left_at: string | null;
          left_reason: string | null;
          team_id: string;
          team_role: Database["public"]["Enums"]["participant_role"];
        };
        Insert: {
          created_by?: string | null;
          enrollment_id: string;
          id?: string;
          is_lead?: boolean;
          joined_at?: string;
          left_at?: string | null;
          left_reason?: string | null;
          team_id: string;
          team_role: Database["public"]["Enums"]["participant_role"];
        };
        Update: {
          created_by?: string | null;
          enrollment_id?: string;
          id?: string;
          is_lead?: boolean;
          joined_at?: string;
          left_at?: string | null;
          left_reason?: string | null;
          team_id?: string;
          team_role?: Database["public"]["Enums"]["participant_role"];
        };
        Relationships: [
          {
            foreignKeyName: "team_memberships_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_memberships_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_memberships_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string;
          id: string;
          mentor_account_id: string | null;
          name: string;
          status: Database["public"]["Enums"]["team_status"];
          updated_at: string;
          voyage_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          mentor_account_id?: string | null;
          name: string;
          status?: Database["public"]["Enums"]["team_status"];
          updated_at?: string;
          voyage_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          mentor_account_id?: string | null;
          name?: string;
          status?: Database["public"]["Enums"]["team_status"];
          updated_at?: string;
          voyage_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teams_mentor_account_id_fkey";
            columns: ["mentor_account_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teams_voyage_id_fkey";
            columns: ["voyage_id"];
            isOneToOne: false;
            referencedRelation: "voyages";
            referencedColumns: ["id"];
          },
        ];
      };
      test_connection: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          granted_at: string;
          granted_by: string | null;
          role: Database["public"]["Enums"]["platform_role"];
          user_id: string;
        };
        Insert: {
          granted_at?: string;
          granted_by?: string | null;
          role: Database["public"]["Enums"]["platform_role"];
          user_id: string;
        };
        Update: {
          granted_at?: string;
          granted_by?: string | null;
          role?: Database["public"]["Enums"]["platform_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey";
            columns: ["granted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      voyages: {
        Row: {
          application_deadline: string | null;
          applications_open_at: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          ends_at: string;
          id: string;
          max_team_size: number;
          min_team_size: number;
          name: string;
          number: number;
          starts_at: string;
          status: Database["public"]["Enums"]["voyage_status"];
          updated_at: string;
        };
        Insert: {
          application_deadline?: string | null;
          applications_open_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          ends_at: string;
          id?: string;
          max_team_size?: number;
          min_team_size?: number;
          name: string;
          number: number;
          starts_at: string;
          status?: Database["public"]["Enums"]["voyage_status"];
          updated_at?: string;
        };
        Update: {
          application_deadline?: string | null;
          applications_open_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          ends_at?: string;
          id?: string;
          max_team_size?: number;
          min_team_size?: number;
          name?: string;
          number?: number;
          starts_at?: string;
          status?: Database["public"]["Enums"]["voyage_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voyages_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_application: {
        Args: { p_application_id: string };
        Returns: string;
      };
      reject_application: {
        Args: { p_application_id: string; p_note?: string | null };
        Returns: undefined;
      };
    };
    Enums: {
      announcement_status: "draft" | "published" | "archived";
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "accepted"
        | "rejected"
        | "withdrawn";
      audience_kind: "all" | "applicants" | "participants" | "team";
      calendar_event_type: "deadline" | "meeting" | "milestone" | "social" | "demo";
      enrollment_status: "invited" | "active" | "inactive" | "completed" | "withdrawn";
      experience_level: "beginner" | "intermediate" | "advanced";
      form_status: "draft" | "collecting" | "closed" | "archived";
      match_proposal_status: "suggested" | "confirmed" | "rejected";
      matching_run_status: "queued" | "running" | "completed" | "failed" | "cancelled";
      notification_type:
        | "application_submitted"
        | "application_decided"
        | "team_assigned"
        | "onboarding_reminder"
        | "announcement_published"
        | "event_changed";
      onboarding_progress_status: "not_started" | "in_progress" | "completed" | "waived";
      participant_role: "frontend" | "backend" | "fullstack" | "design" | "product";
      platform_role: "admin" | "moderator";
      team_status: "forming" | "active" | "at_risk" | "completed" | "archived";
      voyage_status:
        | "planning"
        | "applications_open"
        | "review"
        | "matching"
        | "active"
        | "completed"
        | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      announcement_status: ["draft", "published", "archived"],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      audience_kind: ["all", "applicants", "participants", "team"],
      calendar_event_type: ["deadline", "meeting", "milestone", "social", "demo"],
      enrollment_status: ["invited", "active", "inactive", "completed", "withdrawn"],
      experience_level: ["beginner", "intermediate", "advanced"],
      form_status: ["draft", "collecting", "closed", "archived"],
      match_proposal_status: ["suggested", "confirmed", "rejected"],
      matching_run_status: ["queued", "running", "completed", "failed", "cancelled"],
      notification_type: [
        "application_submitted",
        "application_decided",
        "team_assigned",
        "onboarding_reminder",
        "announcement_published",
        "event_changed",
      ],
      onboarding_progress_status: ["not_started", "in_progress", "completed", "waived"],
      participant_role: ["frontend", "backend", "fullstack", "design", "product"],
      platform_role: ["admin", "moderator"],
      team_status: ["forming", "active", "at_risk", "completed", "archived"],
      voyage_status: [
        "planning",
        "applications_open",
        "review",
        "matching",
        "active",
        "completed",
        "archived",
      ],
    },
  },
} as const;
