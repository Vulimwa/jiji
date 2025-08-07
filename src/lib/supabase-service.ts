
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, sanitizeHTML, validateEmail, validateRequired, validateMaxLength } from '@/lib/security';
import type { Database } from '@/integrations/supabase/types';

// Type definitions
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type CivicIssue = Database['public']['Tables']['civic_issues']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CommunityEvent = Database['public']['Tables']['community_events']['Row'];
type ZoningViolation = Database['public']['Tables']['zoning_violations']['Row'];
type WorkerRegistry = Database['public']['Tables']['worker_registry']['Row'];
type GovernmentOfficial = Database['public']['Tables']['government_officials']['Row'];
type CMSContent = Database['public']['Tables']['cms_content']['Row'];

// User Profile Service
export const userProfileService = {
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(updates: Partial<UserProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserType(): Promise<'resident' | 'informal_worker' | 'official' | 'admin' | null> {
    const profile = await this.getCurrentProfile();
    return profile?.user_type || null;
  }
};

// Civic Issues Service
export const civicIssuesService = {
  async getAllIssues() {
    const { data, error } = await supabase
      .from('civic_issues')
      .select(`
        *,
        user_profiles!civic_issues_reporter_id_fkey(full_name),
        government_officials!civic_issues_assigned_officer_id_fkey(department, position)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createIssue(issue: {
    title: string;
    description: string;
    category: Database['public']['Enums']['issue_category'];
    location: { lat: number; lng: number };
    address?: string;
    image_urls?: string[];
    urgency_level?: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Validate and sanitize inputs
    if (!validateRequired(issue.title) || !validateMaxLength(issue.title, 200)) {
      throw new Error('Title is required and must be less than 200 characters');
    }
    if (!validateRequired(issue.description) || !validateMaxLength(issue.description, 2000)) {
      throw new Error('Description is required and must be less than 2000 characters');
    }

    const sanitizedTitle = sanitizeHTML(issue.title);
    const sanitizedDescription = sanitizeHTML(issue.description);
    const sanitizedAddress = issue.address ? sanitizeHTML(issue.address) : undefined;

    const { data, error } = await supabase
      .from('civic_issues')
      .insert({
        title: sanitizedTitle,
        description: sanitizedDescription,
        category: issue.category,
        location: `POINT(${issue.location.lng} ${issue.location.lat})`,
        address: sanitizedAddress,
        image_urls: issue.image_urls,
        urgency_level: issue.urgency_level,
        reporter_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Award civic credits
    await supabase.rpc('update_civic_credits', {
      user_uuid: user.id,
      credit_amount: 10,
      transaction_description: 'Issue reported',
      transaction_related_id: data.id,
      transaction_related_type: 'civic_issue'
    });

    return data;
  },

  async assignOfficialToIssue(issueId: string, officialId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('assign_official_to_issue', {
      issue_uuid: issueId,
      official_uuid: officialId,
      assigned_by_uuid: user.id
    });

    if (error) throw error;
    return data;
  }
};

// Campaigns Service
export const campaignsService = {
  async getApprovedCampaigns() {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        user_profiles!campaigns_creator_id_fkey(full_name)
      `)
      .eq('admin_approved', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCampaign(campaign: {
    title: string;
    description: string;
    goals?: string;
    target_signatures?: number;
    deadline?: string;
    category?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Validate and sanitize inputs
    if (!validateRequired(campaign.title) || !validateMaxLength(campaign.title, 200)) {
      throw new Error('Title is required and must be less than 200 characters');
    }
    if (!validateRequired(campaign.description) || !validateMaxLength(campaign.description, 5000)) {
      throw new Error('Description is required and must be less than 5000 characters');
    }

    const sanitizedCampaign = {
      ...campaign,
      title: sanitizeHTML(campaign.title),
      description: sanitizeHTML(campaign.description),
      goals: campaign.goals ? sanitizeHTML(campaign.goals) : undefined,
      category: campaign.category ? sanitizeInput(campaign.category) : undefined,
      creator_id: user.id
    };

    const { data, error } = await supabase
      .from('campaigns')
      .insert(sanitizedCampaign)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async signCampaign(campaignId: string, comment?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('campaign_signatures')
      .insert({
        campaign_id: campaignId,
        user_id: user.id,
        signature_type: 'signature',
        comment
      })
      .select()
      .single();

    if (error) throw error;

    // Update campaign signature count
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('current_signatures')
      .eq('id', campaignId)
      .single();
      
    if (campaign) {
      await supabase
        .from('campaigns')
        .update({ current_signatures: (campaign.current_signatures || 0) + 1 })
        .eq('id', campaignId);
    }

    return data;
  }
};

// Events Service
export const eventsService = {
  async getApprovedEvents() {
    const { data, error } = await supabase
      .from('community_events')
      .select(`
        *,
        user_profiles!community_events_organizer_id_fkey(full_name)
      `)
      .eq('admin_approved', true)
      .eq('is_public', true)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createEvent(event: {
    title: string;
    description: string;
    event_date: string;
    address: string;
    category?: string;
    max_attendees?: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('community_events')
      .insert({
        ...event,
        organizer_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Zoning Violations Service
export const zoningViolationsService = {
  async getAllViolations() {
    const { data, error } = await supabase
      .from('zoning_violations')
      .select(`
        *,
        user_profiles!zoning_violations_reporter_id_fkey(full_name),
        government_officials!zoning_violations_assigned_investigator_id_fkey(department, position)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async reportViolation(violation: {
    title: string;
    description: string;
    violation_type: string;
    location: { lat: number; lng: number };
    address?: string;
    developer_name?: string;
    evidence_urls?: string[];
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('zoning_violations')
      .insert({
        ...violation,
        reporter_id: user.id,
        location: `POINT(${violation.location.lng} ${violation.location.lat})`
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Worker Registry Service
export const workerRegistryService = {
  async getVerifiedWorkers() {
    const { data, error } = await supabase
      .from('worker_registry')
      .select(`
        *,
        user_profiles!worker_registry_user_id_fkey(full_name, phone)
      `)
      .eq('verification_status', 'verified')
      .eq('is_available', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  async registerAsWorker(workerData: {
    services: string[];
    specializations?: string[];
    hourly_rate?: number;
    daily_rate?: number;
    location?: { lat: number; lng: number };
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const locationPoint = workerData.location 
      ? `POINT(${workerData.location.lng} ${workerData.location.lat})`
      : null;

    const { data, error } = await supabase
      .from('worker_registry')
      .insert({
        ...workerData,
        user_id: user.id,
        location: locationPoint
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Government Officials Service
export const governmentOfficialsService = {
  async getAllOfficials() {
    const { data, error } = await supabase
      .from('government_officials')
      .select(`
        *,
        user_profiles!government_officials_user_id_fkey(full_name, phone)
      `)
      .eq('is_active', true)
      .order('department', { ascending: true });

    if (error) throw error;
    return data;
  }
};

// CMS Content Service
export const cmsContentService = {
  async getPublishedContent(contentType?: string) {
    let query = supabase
      .from('cms_content')
      .select(`
        *,
        user_profiles!cms_content_author_id_fkey(full_name)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createContent(content: {
    content_type: string;
    title: string;
    content: any;
    tags?: string[];
    featured?: boolean;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cms_content')
      .insert({
        ...content,
        author_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Notifications Service
export const notificationsService = {
  async getUserNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return data;
  }
};

// Civic Match Service
export const civicMatchService = {
  async getStakeholderCategories() {
    const { data, error } = await supabase
      .from('stakeholder_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getStakeholderMatches(contentType: string, contentId: string) {
    const { data, error } = await supabase
      .from('stakeholder_matches')
      .select(`
        *,
        user_profiles!stakeholder_id (
          id,
          full_name,
          user_type,
          profile_image_url
        )
      `)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('relevance_score', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getImpactScore(contentType: string, contentId: string) {
    const { data, error } = await supabase
      .from('impact_scores')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateStakeholderResponse(matchId: string, responseType: string) {
    const { data, error } = await supabase
      .from('stakeholder_matches')
      .update({
        response_type: responseType,
        responded_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createStakeholderInvitation(invitation: {
    content_type: string;
    content_id: string;
    stakeholder_id: string;
    invitation_method?: string;
    invitation_message?: string;
  }) {
    const { data, error } = await supabase
      .from('stakeholder_invitations')
      .insert(invitation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInvitationResponse(invitationId: string, responseAction: string) {
    const { data, error } = await supabase
      .from('stakeholder_invitations')
      .update({
        response_action: responseAction,
        responded_at: new Date().toISOString(),
      })
      .eq('id', invitationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserInvitations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('stakeholder_invitations')
      .select('*')
      .eq('stakeholder_id', user.id)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Admin Settings Service
export const adminSettingsService = {
  async getPublicSettings() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('is_public', true);

    if (error) throw error;
    return data;
  },

  async getAllSettings() {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateSetting(settingKey: string, value: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('admin_settings')
      .update({
        setting_value: value,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', settingKey)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
