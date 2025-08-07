export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      budget_cycles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          tokens_per_user: number
          total_budget: number
          updated_at: string
          voting_end: string
          voting_start: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          tokens_per_user?: number
          total_budget?: number
          updated_at?: string
          voting_end: string
          voting_start: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          tokens_per_user?: number
          total_budget?: number
          updated_at?: string
          voting_end?: string
          voting_start?: string
        }
        Relationships: []
      }
      budget_proposals: {
        Row: {
          address: string | null
          category: string
          created_at: string
          cycle_id: string
          description: string
          estimated_cost: number
          id: string
          image_urls: string[] | null
          location: unknown | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_by: string | null
          title: string
          total_tokens: number
          updated_at: string
          voice_url: string | null
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          cycle_id: string
          description: string
          estimated_cost: number
          id?: string
          image_urls?: string[] | null
          location?: unknown | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          title: string
          total_tokens?: number
          updated_at?: string
          voice_url?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          cycle_id?: string
          description?: string
          estimated_cost?: number
          id?: string
          image_urls?: string[] | null
          location?: unknown | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_by?: string | null
          title?: string
          total_tokens?: number
          updated_at?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_proposals_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "budget_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_votes: {
        Row: {
          created_at: string
          cycle_id: string
          id: string
          proposal_id: string
          tokens_allocated: number
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          id?: string
          proposal_id: string
          tokens_allocated: number
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          id?: string
          proposal_id?: string
          tokens_allocated?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_votes_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "budget_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_votes_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "budget_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_signatures: {
        Row: {
          amount: number | null
          campaign_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          signature_type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          campaign_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          signature_type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          campaign_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          signature_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_signatures_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          address: string | null
          admin_approved: boolean | null
          approval_date: string | null
          approved_by: string | null
          category: string | null
          created_at: string | null
          creator_id: string | null
          current_amount: number | null
          current_signatures: number | null
          deadline: string | null
          description: string
          goals: string | null
          id: string
          image_urls: string[] | null
          is_public: boolean | null
          location: unknown | null
          petition_text: string | null
          required_documents: string[] | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          tags: string[] | null
          target_amount: number | null
          target_signatures: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_approved?: boolean | null
          approval_date?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_amount?: number | null
          current_signatures?: number | null
          deadline?: string | null
          description: string
          goals?: string | null
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: unknown | null
          petition_text?: string | null
          required_documents?: string[] | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          tags?: string[] | null
          target_amount?: number | null
          target_signatures?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_approved?: boolean | null
          approval_date?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          current_amount?: number | null
          current_signatures?: number | null
          deadline?: string | null
          description?: string
          goals?: string | null
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: unknown | null
          petition_text?: string | null
          required_documents?: string[] | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          tags?: string[] | null
          target_amount?: number | null
          target_signatures?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      civic_credits_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          related_id: string | null
          related_type: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      civic_issues: {
        Row: {
          address: string | null
          assigned_officer_id: string | null
          audio_url: string | null
          category: Database["public"]["Enums"]["issue_category"]
          county_response: string | null
          created_at: string | null
          description: string
          expected_resolution_date: string | null
          first_response_at: string | null
          id: string
          image_urls: string[] | null
          is_public: boolean | null
          location: unknown
          metadata: Json | null
          officer_assigned_at: string | null
          priority_votes: number | null
          reporter_id: string | null
          resolution_date: string | null
          resolution_images: string[] | null
          resolution_notes: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          urgency_level: number | null
        }
        Insert: {
          address?: string | null
          assigned_officer_id?: string | null
          audio_url?: string | null
          category: Database["public"]["Enums"]["issue_category"]
          county_response?: string | null
          created_at?: string | null
          description: string
          expected_resolution_date?: string | null
          first_response_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location: unknown
          metadata?: Json | null
          officer_assigned_at?: string | null
          priority_votes?: number | null
          reporter_id?: string | null
          resolution_date?: string | null
          resolution_images?: string[] | null
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          urgency_level?: number | null
        }
        Update: {
          address?: string | null
          assigned_officer_id?: string | null
          audio_url?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          county_response?: string | null
          created_at?: string | null
          description?: string
          expected_resolution_date?: string | null
          first_response_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: unknown
          metadata?: Json | null
          officer_assigned_at?: string | null
          priority_votes?: number | null
          reporter_id?: string | null
          resolution_date?: string | null
          resolution_images?: string[] | null
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          urgency_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "civic_issues_assigned_officer_id_fkey"
            columns: ["assigned_officer_id"]
            isOneToOne: false
            referencedRelation: "government_officials"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content: {
        Row: {
          author_id: string | null
          content: Json
          content_type: string
          created_at: string | null
          featured: boolean | null
          id: string
          metadata: Json | null
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: Json
          content_type: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json
          content_type?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          metadata?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collaboration_groups: {
        Row: {
          achievements: Json | null
          address: string | null
          banner_url: string | null
          contact_info: Json | null
          created_at: string
          created_by: string
          description: string
          group_type: string
          id: string
          is_verified: boolean | null
          issue_focus: string
          location: unknown | null
          logo_url: string | null
          max_members: number | null
          member_count: number | null
          privacy_settings: Json | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          achievements?: Json | null
          address?: string | null
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          created_by: string
          description: string
          group_type?: string
          id?: string
          is_verified?: boolean | null
          issue_focus: string
          location?: unknown | null
          logo_url?: string | null
          max_members?: number | null
          member_count?: number | null
          privacy_settings?: Json | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          achievements?: Json | null
          address?: string | null
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          created_by?: string
          description?: string
          group_type?: string
          id?: string
          is_verified?: boolean | null
          issue_focus?: string
          location?: unknown | null
          logo_url?: string | null
          max_members?: number | null
          member_count?: number | null
          privacy_settings?: Json | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_groups_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          address: string
          admin_approved: boolean | null
          agenda: string | null
          approval_date: string | null
          approved_by: string | null
          category: string | null
          contact_info: Json | null
          created_at: string | null
          current_attendees: number | null
          description: string
          end_date: string | null
          event_date: string
          id: string
          image_urls: string[] | null
          is_public: boolean | null
          location: unknown | null
          max_attendees: number | null
          organizer_id: string | null
          registration_fee: number | null
          registration_required: boolean | null
          requirements: string[] | null
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          admin_approved?: boolean | null
          agenda?: string | null
          approval_date?: string | null
          approved_by?: string | null
          category?: string | null
          contact_info?: Json | null
          created_at?: string | null
          current_attendees?: number | null
          description: string
          end_date?: string | null
          event_date: string
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: unknown | null
          max_attendees?: number | null
          organizer_id?: string | null
          registration_fee?: number | null
          registration_required?: boolean | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          admin_approved?: boolean | null
          agenda?: string | null
          approval_date?: string | null
          approved_by?: string | null
          category?: string | null
          contact_info?: Json | null
          created_at?: string | null
          current_attendees?: number | null
          description?: string
          end_date?: string | null
          event_date?: string
          id?: string
          image_urls?: string[] | null
          is_public?: boolean | null
          location?: unknown | null
          max_attendees?: number | null
          organizer_id?: string | null
          registration_fee?: number | null
          registration_required?: boolean | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          attachments: string[] | null
          author_id: string | null
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          likes_count: number | null
          parent_reply_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          author_id?: string | null
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          author_id?: string | null
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          address: string | null
          admin_approved: boolean | null
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          location: unknown | null
          reply_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          address?: string | null
          admin_approved?: boolean | null
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          location?: unknown | null
          reply_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          address?: string | null
          admin_approved?: boolean | null
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          location?: unknown | null
          reply_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      document_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by: string | null
          category: string | null
          created_at: string
          document_title: string
          document_type: string | null
          id: string
          is_featured: boolean | null
          question: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          created_at?: string
          document_title: string
          document_type?: string | null
          id?: string
          is_featured?: boolean | null
          question: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          answered_by?: string | null
          category?: string | null
          created_at?: string
          document_title?: string
          document_type?: string | null
          id?: string
          is_featured?: boolean | null
          question?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attendance_status: string | null
          event_id: string | null
          id: string
          notes: string | null
          payment_status: string | null
          registration_date: string | null
          user_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          registration_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_challenge_responses: {
        Row: {
          challenge_id: string
          created_at: string | null
          id: string
          location: unknown | null
          points_awarded: number | null
          submission_content: Json
          submission_type: string
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          id?: string
          location?: unknown | null
          points_awarded?: number | null
          submission_content: Json
          submission_type: string
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          id?: string
          location?: unknown | null
          points_awarded?: number | null
          submission_content?: Json
          submission_type?: string
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flash_challenge_responses_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "flash_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_challenges: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_count: number | null
          description: string
          end_time: string
          goal_count: number | null
          id: string
          location_scope: unknown | null
          radius_meters: number | null
          reward_badge: string | null
          reward_points: number | null
          start_time: string
          status: string | null
          submission_types: string[] | null
          title: string
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_count?: number | null
          description: string
          end_time: string
          goal_count?: number | null
          id?: string
          location_scope?: unknown | null
          radius_meters?: number | null
          reward_badge?: string | null
          reward_points?: number | null
          start_time: string
          status?: string | null
          submission_types?: string[] | null
          title: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_count?: number | null
          description?: string
          end_time?: string
          goal_count?: number | null
          id?: string
          location_scope?: unknown | null
          radius_meters?: number | null
          reward_badge?: string | null
          reward_points?: number | null
          start_time?: string
          status?: string | null
          submission_types?: string[] | null
          title?: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      government_officials: {
        Row: {
          assigned_by: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          department: string
          id: string
          is_active: boolean | null
          jurisdiction_area: unknown | null
          office_address: string | null
          position: string
          specializations: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          department: string
          id?: string
          is_active?: boolean | null
          jurisdiction_area?: unknown | null
          office_address?: string | null
          position: string
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          department?: string
          id?: string
          is_active?: boolean | null
          jurisdiction_area?: unknown | null
          office_address?: string | null
          position?: string
          specializations?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      group_activities: {
        Row: {
          activity_type: string
          comments_count: number | null
          content: string | null
          created_at: string
          group_id: string
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          metadata: Json | null
          related_content_id: string | null
          related_content_type: string | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          comments_count?: number | null
          content?: string | null
          created_at?: string
          group_id: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          metadata?: Json | null
          related_content_id?: string | null
          related_content_type?: string | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          comments_count?: number | null
          content?: string | null
          created_at?: string
          group_id?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          metadata?: Json | null
          related_content_id?: string | null
          related_content_type?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "collaboration_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_campaigns: {
        Row: {
          campaign_id: string
          group_id: string
          id: string
          linked_at: string
          linked_by: string
          notes: string | null
          relationship_type: string
        }
        Insert: {
          campaign_id: string
          group_id: string
          id?: string
          linked_at?: string
          linked_by: string
          notes?: string | null
          relationship_type?: string
        }
        Update: {
          campaign_id?: string
          group_id?: string
          id?: string
          linked_at?: string
          linked_by?: string
          notes?: string | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_campaigns_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_campaigns_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "collaboration_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_campaigns_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_impact_scores: {
        Row: {
          badges_earned: string[] | null
          calculation_date: string
          campaigns_supported: number | null
          community_engagement_score: number | null
          created_at: string
          group_id: string
          id: string
          impact_rating: string | null
          issues_addressed: number | null
          meetings_held: number | null
          tasks_completed: number | null
        }
        Insert: {
          badges_earned?: string[] | null
          calculation_date?: string
          campaigns_supported?: number | null
          community_engagement_score?: number | null
          created_at?: string
          group_id: string
          id?: string
          impact_rating?: string | null
          issues_addressed?: number | null
          meetings_held?: number | null
          tasks_completed?: number | null
        }
        Update: {
          badges_earned?: string[] | null
          calculation_date?: string
          campaigns_supported?: number | null
          community_engagement_score?: number | null
          created_at?: string
          group_id?: string
          id?: string
          impact_rating?: string | null
          issues_addressed?: number | null
          meetings_held?: number | null
          tasks_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_impact_scores_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "collaboration_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_memberships: {
        Row: {
          contribution_score: number | null
          group_id: string
          id: string
          invited_by: string | null
          joined_at: string
          last_active_at: string | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          contribution_score?: number | null
          group_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          last_active_at?: string | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          contribution_score?: number | null
          group_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          last_active_at?: string | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "collaboration_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_recommendations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          reason: string | null
          recommendation_type: string
          score: number | null
          status: string | null
          target_id: string | null
          target_type: string | null
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          recommendation_type: string
          score?: number | null
          status?: string | null
          target_id?: string | null
          target_type?: string | null
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string | null
          recommendation_type?: string
          score?: number | null
          status?: string | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_tasks: {
        Row: {
          actual_hours: number | null
          address: string | null
          assigned_to: string | null
          attachments: string[] | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          group_id: string
          id: string
          location: unknown | null
          priority: string
          status: string
          tags: string[] | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          address?: string | null
          assigned_to?: string | null
          attachments?: string[] | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          group_id: string
          id?: string
          location?: unknown | null
          priority?: string
          status?: string
          tags?: string[] | null
          task_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          address?: string | null
          assigned_to?: string | null
          attachments?: string[] | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          group_id?: string
          id?: string
          location?: unknown | null
          priority?: string
          status?: string
          tags?: string[] | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_tasks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "collaboration_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_scores: {
        Row: {
          calculated_at: string | null
          content_id: string
          content_type: string
          created_at: string
          decision_maker_engagement: boolean | null
          engaged_stakeholders: number | null
          geographic_coverage_score: number | null
          id: string
          missing_voice_alerts: string[] | null
          overall_impact_score: number | null
          stakeholder_diversity_score: number | null
          total_stakeholders: number | null
          updated_at: string
        }
        Insert: {
          calculated_at?: string | null
          content_id: string
          content_type: string
          created_at?: string
          decision_maker_engagement?: boolean | null
          engaged_stakeholders?: number | null
          geographic_coverage_score?: number | null
          id?: string
          missing_voice_alerts?: string[] | null
          overall_impact_score?: number | null
          stakeholder_diversity_score?: number | null
          total_stakeholders?: number | null
          updated_at?: string
        }
        Update: {
          calculated_at?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          decision_maker_engagement?: boolean | null
          engaged_stakeholders?: number | null
          geographic_coverage_score?: number | null
          id?: string
          missing_voice_alerts?: string[] | null
          overall_impact_score?: number | null
          stakeholder_diversity_score?: number | null
          total_stakeholders?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      issue_comments: {
        Row: {
          attachments: string[] | null
          comment: string
          created_at: string | null
          id: string
          is_official_response: boolean | null
          issue_id: string | null
          user_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          comment: string
          created_at?: string | null
          id?: string
          is_official_response?: boolean | null
          issue_id?: string | null
          user_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          comment?: string
          created_at?: string | null
          id?: string
          is_official_response?: boolean | null
          issue_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "civic_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_votes: {
        Row: {
          created_at: string | null
          id: string
          issue_id: string | null
          user_id: string | null
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          issue_id?: string | null
          user_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "civic_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          estimated_duration: string | null
          id: string
          job_id: string | null
          proposed_rate: number | null
          status: string | null
          worker_id: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          estimated_duration?: string | null
          id?: string
          job_id?: string | null
          proposed_rate?: number | null
          status?: string | null
          worker_id?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          estimated_duration?: string | null
          id?: string
          job_id?: string | null
          proposed_rate?: number | null
          status?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          address: string | null
          admin_approved: boolean | null
          applications_deadline: string | null
          budget_max: number | null
          budget_min: number | null
          category: string | null
          civic_credits_reward: number | null
          created_at: string | null
          description: string
          duration_estimate: string | null
          id: string
          images: string[] | null
          job_type: string | null
          location: unknown | null
          posted_by: string | null
          required_skills: string[] | null
          selected_worker_id: string | null
          status: string | null
          title: string
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          address?: string | null
          admin_approved?: boolean | null
          applications_deadline?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          civic_credits_reward?: number | null
          created_at?: string | null
          description: string
          duration_estimate?: string | null
          id?: string
          images?: string[] | null
          job_type?: string | null
          location?: unknown | null
          posted_by?: string | null
          required_skills?: string[] | null
          selected_worker_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          address?: string | null
          admin_approved?: boolean | null
          applications_deadline?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string | null
          civic_credits_reward?: number | null
          created_at?: string | null
          description?: string
          duration_estimate?: string | null
          id?: string
          images?: string[] | null
          job_type?: string | null
          location?: unknown | null
          posted_by?: string | null
          required_skills?: string[] | null
          selected_worker_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_selected_worker_id_fkey"
            columns: ["selected_worker_id"]
            isOneToOne: false
            referencedRelation: "worker_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_taskforces: {
        Row: {
          campaign_id: string | null
          chat_enabled: boolean | null
          created_at: string | null
          created_by: string
          current_members: number | null
          description: string
          id: string
          issue_id: string | null
          location: unknown | null
          max_members: number | null
          radius_meters: number | null
          sms_enabled: boolean | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          created_by: string
          current_members?: number | null
          description: string
          id?: string
          issue_id?: string | null
          location?: unknown | null
          max_members?: number | null
          radius_meters?: number | null
          sms_enabled?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          chat_enabled?: boolean | null
          created_at?: string | null
          created_by?: string
          current_members?: number | null
          description?: string
          id?: string
          issue_id?: string | null
          location?: unknown | null
          max_members?: number | null
          radius_meters?: number | null
          sms_enabled?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "micro_taskforces_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_taskforces_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "civic_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          related_id: string | null
          related_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_feedback: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          created_at: string
          feedback_text: string | null
          id: string
          impact_story: string | null
          proposal_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          impact_story?: string | null
          proposal_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          impact_story?: string | null
          proposal_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_feedback_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "budget_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          created_at: string
          description: string
          id: string
          photo_urls: string[] | null
          posted_by: string | null
          progress_percent: number | null
          proposal_id: string
          title: string
          update_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          photo_urls?: string[] | null
          posted_by?: string | null
          progress_percent?: number | null
          proposal_id: string
          title: string
          update_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          photo_urls?: string[] | null
          posted_by?: string | null
          progress_percent?: number | null
          proposal_id?: string
          title?: string
          update_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "budget_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stakeholder_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          issue_categories: string[] | null
          name: string
          relevance_keywords: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          issue_categories?: string[] | null
          name: string
          relevance_keywords?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          issue_categories?: string[] | null
          name?: string
          relevance_keywords?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      stakeholder_invitations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          invitation_message: string | null
          invitation_method: string | null
          responded_at: string | null
          response_action: string | null
          sent_at: string | null
          stakeholder_id: string
          viewed_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          invitation_message?: string | null
          invitation_method?: string | null
          responded_at?: string | null
          response_action?: string | null
          sent_at?: string | null
          stakeholder_id: string
          viewed_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          invitation_message?: string | null
          invitation_method?: string | null
          responded_at?: string | null
          response_action?: string | null
          sent_at?: string | null
          stakeholder_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stakeholder_invitations_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholder_matches: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          distance_meters: number | null
          id: string
          invited_at: string | null
          match_reasons: string[] | null
          relevance_score: number | null
          responded_at: string | null
          response_type: string | null
          stakeholder_id: string
          updated_at: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          distance_meters?: number | null
          id?: string
          invited_at?: string | null
          match_reasons?: string[] | null
          relevance_score?: number | null
          responded_at?: string | null
          response_type?: string | null
          stakeholder_id: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          distance_meters?: number | null
          id?: string
          invited_at?: string | null
          match_reasons?: string[] | null
          relevance_score?: number | null
          responded_at?: string | null
          response_type?: string | null
          stakeholder_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stakeholder_matches_stakeholder_id_fkey"
            columns: ["stakeholder_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      taskforce_activities: {
        Row: {
          activity_type: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          taskforce_id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          taskforce_id: string
          user_id: string
        }
        Update: {
          activity_type?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          taskforce_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taskforce_activities_taskforce_id_fkey"
            columns: ["taskforce_id"]
            isOneToOne: false
            referencedRelation: "micro_taskforces"
            referencedColumns: ["id"]
          },
        ]
      }
      taskforce_memberships: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          taskforce_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          taskforce_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          taskforce_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taskforce_memberships_taskforce_id_fkey"
            columns: ["taskforce_id"]
            isOneToOne: false
            referencedRelation: "micro_taskforces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          related_id: string | null
          related_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          related_id?: string | null
          related_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          related_id?: string | null
          related_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_budget_tokens: {
        Row: {
          created_at: string
          cycle_id: string
          id: string
          tokens_available: number | null
          tokens_total: number
          tokens_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          id?: string
          tokens_available?: number | null
          tokens_total?: number
          tokens_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          id?: string
          tokens_available?: number | null
          tokens_total?: number
          tokens_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_budget_tokens_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "budget_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_flash_stats: {
        Row: {
          badges_earned: string[] | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_challenge_date: string | null
          longest_streak: number | null
          total_challenges_completed: number | null
          total_points_earned: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_challenge_date?: string | null
          longest_streak?: number | null
          total_challenges_completed?: number | null
          total_points_earned?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_challenge_date?: string | null
          longest_streak?: number | null
          total_challenges_completed?: number | null
          total_points_earned?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          bio: string | null
          civic_credits: number | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string
          gender: string | null
          id: string
          interests: string[] | null
          is_verified: boolean | null
          location: unknown | null
          notification_preferences: Json | null
          occupation: string | null
          phone: string | null
          primary_location: unknown | null
          privacy_settings: Json | null
          profile_image_url: string | null
          service_radius: number | null
          stakeholder_tags: string[] | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
          verification_documents: string[] | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          civic_credits?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          id: string
          interests?: string[] | null
          is_verified?: boolean | null
          location?: unknown | null
          notification_preferences?: Json | null
          occupation?: string | null
          phone?: string | null
          primary_location?: unknown | null
          privacy_settings?: Json | null
          profile_image_url?: string | null
          service_radius?: number | null
          stakeholder_tags?: string[] | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          verification_documents?: string[] | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          civic_credits?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          is_verified?: boolean | null
          location?: unknown | null
          notification_preferences?: Json | null
          occupation?: string | null
          phone?: string | null
          primary_location?: unknown | null
          privacy_settings?: Json | null
          profile_image_url?: string | null
          service_radius?: number | null
          stakeholder_tags?: string[] | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          verification_documents?: string[] | null
        }
        Relationships: []
      }
      violation_evidence: {
        Row: {
          created_at: string | null
          description: string | null
          evidence_type: string | null
          file_url: string
          id: string
          location: unknown | null
          submitted_by: string | null
          timestamp_taken: string | null
          verification_date: string | null
          verified_by: string | null
          violation_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evidence_type?: string | null
          file_url: string
          id?: string
          location?: unknown | null
          submitted_by?: string | null
          timestamp_taken?: string | null
          verification_date?: string | null
          verified_by?: string | null
          violation_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evidence_type?: string | null
          file_url?: string
          id?: string
          location?: unknown | null
          submitted_by?: string | null
          timestamp_taken?: string | null
          verification_date?: string | null
          verified_by?: string | null
          violation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "violation_evidence_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "government_officials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violation_evidence_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "zoning_violations"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_registry: {
        Row: {
          availability_schedule: Json | null
          certifications: string[] | null
          created_at: string | null
          daily_rate: number | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          languages: string[] | null
          location: unknown | null
          portfolio_images: string[] | null
          rating: number | null
          service_radius: number | null
          services: string[]
          specializations: string[] | null
          tools_equipment: string[] | null
          total_jobs: number | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
          verification_date: string | null
          verification_status:
            | Database["public"]["Enums"]["worker_verification_status"]
            | null
          verified_by: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          location?: unknown | null
          portfolio_images?: string[] | null
          rating?: number | null
          service_radius?: number | null
          services: string[]
          specializations?: string[] | null
          tools_equipment?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          verification_status?:
            | Database["public"]["Enums"]["worker_verification_status"]
            | null
          verified_by?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          location?: unknown | null
          portfolio_images?: string[] | null
          rating?: number | null
          service_radius?: number | null
          services?: string[]
          specializations?: string[] | null
          tools_equipment?: string[] | null
          total_jobs?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_date?: string | null
          verification_status?:
            | Database["public"]["Enums"]["worker_verification_status"]
            | null
          verified_by?: string | null
        }
        Relationships: []
      }
      worker_reviews: {
        Row: {
          created_at: string | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          job_id: string | null
          rating: number | null
          review_text: string | null
          reviewer_id: string | null
          worker_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          job_id?: string | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
          worker_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          job_id?: string | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_reviews_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "worker_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      zoning_violations: {
        Row: {
          address: string | null
          assigned_investigator_id: string | null
          building_description: string | null
          created_at: string | null
          description: string
          developer_name: string | null
          evidence_description: string | null
          evidence_urls: string[] | null
          id: string
          investigation_notes: string | null
          location: unknown
          official_response: string | null
          reporter_contact: string | null
          reporter_id: string | null
          resolution_date: string | null
          severity: Database["public"]["Enums"]["violation_severity"] | null
          status: Database["public"]["Enums"]["violation_status"] | null
          title: string
          updated_at: string | null
          violation_type: string
          witness_count: number | null
        }
        Insert: {
          address?: string | null
          assigned_investigator_id?: string | null
          building_description?: string | null
          created_at?: string | null
          description: string
          developer_name?: string | null
          evidence_description?: string | null
          evidence_urls?: string[] | null
          id?: string
          investigation_notes?: string | null
          location: unknown
          official_response?: string | null
          reporter_contact?: string | null
          reporter_id?: string | null
          resolution_date?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"] | null
          status?: Database["public"]["Enums"]["violation_status"] | null
          title: string
          updated_at?: string | null
          violation_type: string
          witness_count?: number | null
        }
        Update: {
          address?: string | null
          assigned_investigator_id?: string | null
          building_description?: string | null
          created_at?: string | null
          description?: string
          developer_name?: string | null
          evidence_description?: string | null
          evidence_urls?: string[] | null
          id?: string
          investigation_notes?: string | null
          location?: unknown
          official_response?: string | null
          reporter_contact?: string | null
          reporter_id?: string | null
          resolution_date?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"] | null
          status?: Database["public"]["Enums"]["violation_status"] | null
          title?: string
          updated_at?: string | null
          violation_type?: string
          witness_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "zoning_violations_assigned_investigator_id_fkey"
            columns: ["assigned_investigator_id"]
            isOneToOne: false
            referencedRelation: "government_officials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      allocate_user_tokens: {
        Args: { user_id_param: string; cycle_id_param: string }
        Returns: undefined
      }
      assign_official_to_issue: {
        Args: {
          issue_uuid: string
          official_uuid: string
          assigned_by_uuid: string
        }
        Returns: boolean
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lng1: number; lat2: number; lng2: number }
        Returns: number
      }
      calculate_response_time_hours: {
        Args: { reported_at: string; first_response: string }
        Returns: number
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_civic_credits: {
        Args: {
          user_uuid: string
          credit_amount: number
          transaction_description: string
          transaction_related_id?: string
          transaction_related_type?: string
        }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed" | "cancelled"
      content_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "rejected"
        | "published"
      event_status: "planned" | "ongoing" | "completed" | "cancelled"
      issue_category:
        | "sewage"
        | "noise"
        | "construction"
        | "power"
        | "roads"
        | "waste"
        | "lighting"
        | "drainage"
        | "other"
      issue_status:
        | "reported"
        | "acknowledged"
        | "in-progress"
        | "resolved"
        | "closed"
      notification_type: "info" | "warning" | "success" | "error" | "update"
      user_type:
        | "resident"
        | "informal_worker"
        | "official"
        | "admin"
        | "vendor"
        | "boda_driver"
        | "hawker"
        | "youth_leader"
        | "landowner"
        | "security_guard"
        | "business_owner"
      violation_severity: "low" | "medium" | "high" | "critical"
      violation_status:
        | "reported"
        | "under_investigation"
        | "confirmed"
        | "resolved"
        | "dismissed"
      worker_verification_status:
        | "pending"
        | "verified"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed", "cancelled"],
      content_status: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "published",
      ],
      event_status: ["planned", "ongoing", "completed", "cancelled"],
      issue_category: [
        "sewage",
        "noise",
        "construction",
        "power",
        "roads",
        "waste",
        "lighting",
        "drainage",
        "other",
      ],
      issue_status: [
        "reported",
        "acknowledged",
        "in-progress",
        "resolved",
        "closed",
      ],
      notification_type: ["info", "warning", "success", "error", "update"],
      user_type: [
        "resident",
        "informal_worker",
        "official",
        "admin",
        "vendor",
        "boda_driver",
        "hawker",
        "youth_leader",
        "landowner",
        "security_guard",
        "business_owner",
      ],
      violation_severity: ["low", "medium", "high", "critical"],
      violation_status: [
        "reported",
        "under_investigation",
        "confirmed",
        "resolved",
        "dismissed",
      ],
      worker_verification_status: [
        "pending",
        "verified",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
