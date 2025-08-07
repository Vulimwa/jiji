import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StakeholderMatch {
  id: string;
  content_type: 'civic_issue' | 'campaign' | 'community_event' | 'discussion';
  content_id: string;
  stakeholder_id: string;
  relevance_score: number;
  match_reasons: string[];
  distance_meters?: number;
  invited_at?: string;
  responded_at?: string;
  response_type?: 'viewed' | 'engaged' | 'participated' | 'ignored';
  created_at: string;
  updated_at: string;
}

export interface ImpactScore {
  id: string;
  content_type: 'civic_issue' | 'campaign' | 'community_event' | 'discussion';
  content_id: string;
  total_stakeholders: number;
  engaged_stakeholders: number;
  stakeholder_diversity_score: number;
  geographic_coverage_score: number;
  decision_maker_engagement: boolean;
  missing_voice_alerts: string[];
  overall_impact_score: number;
  calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface StakeholderCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  relevance_keywords: string[];
  issue_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface StakeholderInvitation {
  id: string;
  content_type: 'civic_issue' | 'campaign' | 'community_event' | 'discussion';
  content_id: string;
  stakeholder_id: string;
  invitation_method: 'platform' | 'sms' | 'email';
  invitation_message?: string;
  sent_at: string;
  viewed_at?: string;
  responded_at?: string;
  response_action?: 'participated' | 'declined' | 'ignored';
  created_at: string;
}

// Hook to get stakeholder categories
export const useStakeholderCategories = () => {
  return useQuery({
    queryKey: ['stakeholder-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stakeholder_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as StakeholderCategory[];
    },
  });
};

// Hook to get stakeholder matches for content
export const useStakeholderMatches = (contentType: string, contentId: string) => {
  return useQuery({
    queryKey: ['stakeholder-matches', contentType, contentId],
    queryFn: async () => {
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
      return data as (StakeholderMatch & { user_profiles: any })[];
    },
    enabled: !!(contentType && contentId),
  });
};

// Hook to get impact score for content
export const useImpactScore = (contentType: string, contentId: string) => {
  return useQuery({
    queryKey: ['impact-score', contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impact_scores')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - return null
          return null;
        }
        throw error;
      }
      return data as ImpactScore;
    },
    enabled: !!(contentType && contentId),
  });
};

// Hook to get user's stakeholder invitations
export const useStakeholderInvitations = () => {
  return useQuery({
    queryKey: ['stakeholder-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stakeholder_invitations')
        .select('*')
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      return data as StakeholderInvitation[];
    },
  });
};

// Mutation to update stakeholder match response
export const useUpdateStakeholderResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      matchId,
      responseType,
    }: {
      matchId: string;
      responseType: 'viewed' | 'engaged' | 'participated' | 'ignored';
    }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakeholder-matches'] });
      queryClient.invalidateQueries({ queryKey: ['impact-score'] });
    },
  });
};

// Mutation to update invitation response
export const useUpdateInvitationResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      invitationId,
      responseAction,
    }: {
      invitationId: string;
      responseAction: 'participated' | 'declined' | 'ignored';
    }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stakeholder-invitations'] });
    },
  });
};

// Function to calculate stakeholder matches (this would typically be called server-side)
export const calculateStakeholderMatches = async (
  contentType: string,
  contentId: string,
  location?: { lat: number; lng: number },
  category?: string,
  tags?: string[]
) => {
  try {
    // Get all active users with location data
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('*')
      .not('primary_location', 'is', null);
    
    if (usersError) throw usersError;
    
    // Get stakeholder categories for matching
    const { data: categories, error: categoriesError } = await supabase
      .from('stakeholder_categories')
      .select('*');
    
    if (categoriesError) throw categoriesError;
    
    const validMatches: {
      content_type: string;
      content_id: string;
      stakeholder_id: string;
      relevance_score: number;
      match_reasons: string[];
      distance_meters?: number;
    }[] = [];
    
    for (const user of users) {
      let relevanceScore = 0;
      const matchReasons: string[] = [];
      let distanceMeters: number | undefined;
      
      // Geographic relevance
      if (location && user.primary_location && typeof user.primary_location === 'object' && 'coordinates' in user.primary_location) {
        // Calculate distance (simplified - in production use PostGIS functions)
        const coords = user.primary_location.coordinates as number[];
        const distance = calculateDistance(
          location.lat,
          location.lng,
          coords[1],
          coords[0]
        );
        
        distanceMeters = Math.round(distance * 1000); // Convert to meters
        
        if (distanceMeters <= (user.service_radius || 1000)) {
          relevanceScore += 0.4;
          matchReasons.push('geographic_proximity');
        }
      }
      
      // User type relevance
      if (category && categories) {
        const relevantCategory = categories.find(cat => 
          cat.issue_categories.includes(category.toLowerCase())
        );
        
        if (relevantCategory) {
          // Check if user type matches category
          const userTypeMapping: Record<string, string[]> = {
            'Residents': ['resident'],
            'Vendors': ['vendor', 'hawker'],
            'Boda Drivers': ['boda_driver'],
            'Security Guards': ['security_guard'],
            'Business Owners': ['business_owner'],
            'Youth Leaders': ['youth_leader'],
            'Landowners': ['landowner'],
          };
          
          if (userTypeMapping[relevantCategory.name]?.includes(user.user_type)) {
            relevanceScore += 0.3;
            matchReasons.push('user_type_match');
          }
        }
      }
      
      // Interests/tags relevance
      if (tags && user.interests) {
        const commonInterests = tags.filter(tag => 
          user.interests.some((interest: string) => 
            interest.toLowerCase().includes(tag.toLowerCase())
          )
        );
        
        if (commonInterests.length > 0) {
          relevanceScore += 0.2 * (commonInterests.length / tags.length);
          matchReasons.push('interest_match');
        }
      }
      
      // Stakeholder tags relevance
      if (user.stakeholder_tags && user.stakeholder_tags.length > 0) {
        relevanceScore += 0.1;
        matchReasons.push('stakeholder_tag');
      }
      
      // Only include matches with some relevance
      if (relevanceScore > 0.1) {
        validMatches.push({
          content_type: contentType,
          content_id: contentId,
          stakeholder_id: user.id,
          relevance_score: Math.min(relevanceScore, 1), // Cap at 1.0
          match_reasons: matchReasons,
          distance_meters: distanceMeters,
        });
      }
    }
    
    // Insert matches into database
    if (validMatches.length > 0) {
      const { error: insertError } = await supabase
        .from('stakeholder_matches')
        .insert(validMatches);
      
      if (insertError) throw insertError;
    }
    
    // Calculate and store impact score
    await calculateImpactScore(contentType, contentId);
    
    return validMatches;
  } catch (error) {
    console.error('Error calculating stakeholder matches:', error);
    throw error;
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate impact score for content
export const calculateImpactScore = async (contentType: string, contentId: string) => {
  try {
    const { data: matches, error: matchesError } = await supabase
      .from('stakeholder_matches')
      .select('*, user_profiles!stakeholder_id(user_type)')
      .eq('content_type', contentType)
      .eq('content_id', contentId);
    
    if (matchesError) throw matchesError;
    
    const totalStakeholders = matches.length;
    const engagedStakeholders = matches.filter(m => m.response_type).length;
    
    // Calculate diversity score based on different user types represented
    const userTypes = new Set(matches.map(m => m.user_profiles?.user_type).filter(Boolean));
    const stakeholderDiversityScore = Math.min(userTypes.size / 7, 1); // Max 7 main types
    
    // Calculate geographic coverage (simplified)
    const geographicCoverageScore = Math.min(
      matches.filter(m => m.distance_meters && m.distance_meters <= 1000).length / Math.max(totalStakeholders, 1),
      1
    );
    
    // Check for decision maker engagement
    const decisionMakerEngagement = matches.some(m => 
      m.user_profiles?.user_type === 'official' && m.response_type
    );
    
    // Identify missing voices
    const missingVoiceAlerts: string[] = [];
    const representedTypes = Array.from(userTypes);
    
    if (!representedTypes.includes('resident')) {
      missingVoiceAlerts.push('No local residents engaged');
    }
    if (!representedTypes.includes('official')) {
      missingVoiceAlerts.push('No government officials involved');
    }
    if (totalStakeholders < 5) {
      missingVoiceAlerts.push('Low stakeholder participation');
    }
    
    // Calculate overall impact score
    const overallImpactScore = (
      (engagedStakeholders / Math.max(totalStakeholders, 1)) * 0.4 +
      stakeholderDiversityScore * 0.3 +
      geographicCoverageScore * 0.2 +
      (decisionMakerEngagement ? 0.1 : 0)
    );
    
    const impactScore = {
      content_type: contentType,
      content_id: contentId,
      total_stakeholders: totalStakeholders,
      engaged_stakeholders: engagedStakeholders,
      stakeholder_diversity_score: stakeholderDiversityScore,
      geographic_coverage_score: geographicCoverageScore,
      decision_maker_engagement: decisionMakerEngagement,
      missing_voice_alerts: missingVoiceAlerts,
      overall_impact_score: overallImpactScore,
    };
    
    // Upsert impact score
    const { error: upsertError } = await supabase
      .from('impact_scores')
      .upsert(impactScore, {
        onConflict: 'content_type,content_id',
      });
    
    if (upsertError) throw upsertError;
    
    return impactScore;
  } catch (error) {
    console.error('Error calculating impact score:', error);
    throw error;
  }
};