import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FlashChallenge {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  goal_count: number;
  current_count: number;
  reward_points: number;
  reward_badge?: string;
  submission_types: string[];
  location_scope?: any;
  radius_meters: number;
  verification_method: string;
  status: string;
  created_at: string;
}

export interface FlashChallengeResponse {
  id: string;
  challenge_id: string;
  submission_type: string;
  submission_content: any;
  location?: any;
  verification_status: string;
  points_awarded: number;
  created_at: string;
}

export interface UserFlashStats {
  total_challenges_completed: number;
  total_points_earned: number;
  current_streak: number;
  longest_streak: number;
  badges_earned: string[];
  last_challenge_date?: string;
}

export const useActiveFlashChallenges = () => {
  return useQuery({
    queryKey: ['flash-challenges', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flash_challenges')
        .select('*')
        .eq('status', 'active')
        .gte('end_time', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FlashChallenge[];
    },
  });
};

export const useUserFlashStats = () => {
  return useQuery({
    queryKey: ['user-flash-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_flash_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserFlashStats | null;
    },
  });
};

export const useUserChallengeResponses = (challengeId?: string) => {
  return useQuery({
    queryKey: ['challenge-responses', challengeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('flash_challenge_responses')
        .select('*')
        .eq('user_id', user.id);

      if (challengeId) {
        query = query.eq('challenge_id', challengeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as FlashChallengeResponse[];
    },
    enabled: !!challengeId,
  });
};

export const useSubmitChallengeResponse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      challengeId,
      submissionType,
      content,
      location,
    }: {
      challengeId: string;
      submissionType: string;
      content: any;
      location?: { lat: number; lng: number };
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const submission = {
        challenge_id: challengeId,
        user_id: user.id,
        submission_type: submissionType,
        submission_content: content,
        location: location ? `POINT(${location.lng} ${location.lat})` : null,
      };

      const { data, error } = await supabase
        .from('flash_challenge_responses')
        .insert(submission)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-responses'] });
      queryClient.invalidateQueries({ queryKey: ['user-flash-stats'] });
      toast({
        title: "Response Submitted!",
        description: "Your flash challenge response has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateFlashChallenge = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (challenge: Partial<FlashChallenge>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const challengeData = {
        title: challenge.title!,
        description: challenge.description!,
        start_time: challenge.start_time!,
        end_time: challenge.end_time!,
        created_by: user.id,
        ...challenge,
      };

      const { data, error } = await supabase
        .from('flash_challenges')
        .insert(challengeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-challenges'] });
      toast({
        title: "Challenge Created!",
        description: "Your flash challenge has been created and is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};