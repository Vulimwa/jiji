import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BudgetCycle {
  id: string;
  title: string;
  description: string;
  total_budget: number;
  start_date: string;
  end_date: string;
  voting_start: string;
  voting_end: string;
  status: 'draft' | 'open_submissions' | 'review' | 'voting' | 'completed';
  tokens_per_user: number;
  created_at: string;
}

export interface BudgetProposal {
  id: string;
  cycle_id: string;
  title: string;
  description: string;
  estimated_cost: number;
  address: string;
  category: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'completed';
  submitted_by: string;
  image_urls: string[];
  voice_url?: string;
  total_tokens: number;
  created_at: string;
  updated_at?: string;
  current_progress?: number;
}

export interface UserBudgetTokens {
  id: string;
  user_id: string;
  cycle_id: string;
  tokens_total: number;
  tokens_used: number;
  tokens_available: number;
}

export interface BudgetVote {
  id: string;
  cycle_id: string;
  proposal_id: string;
  user_id: string;
  tokens_allocated: number;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  proposal_id: string;
  title: string;
  description: string;
  progress_percent?: number;
  photo_urls: string[];
  update_type: 'general' | 'milestone' | 'completion' | 'delay' | 'budget_change';
  created_at: string;
}

export const useBudgetData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current active budget cycle
  const { data: currentCycle, isLoading: cycleLoading } = useQuery({
    queryKey: ['current-budget-cycle'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_cycles')
        .select('*')
        .in('status', ['open_submissions', 'voting', 'completed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as BudgetCycle | null;
    },
  });

  // Get proposals for current cycle
  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ['budget-proposals', currentCycle?.id],
    queryFn: async () => {
      if (!currentCycle?.id) return [];
      
      const { data, error } = await supabase
        .from('budget_proposals')
        .select('*')
        .eq('cycle_id', currentCycle.id)
        .order('total_tokens', { ascending: false });

      if (error) throw error;
      return data as BudgetProposal[];
    },
    enabled: !!currentCycle?.id,
  });

  // Get user's token allocation for current cycle
  const { data: userTokens } = useQuery({
    queryKey: ['user-budget-tokens', currentCycle?.id],
    queryFn: async () => {
      if (!currentCycle?.id) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Try to get existing tokens
      let { data, error } = await supabase
        .from('user_budget_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_id', currentCycle.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      // If no tokens exist, allocate them
      if (!data) {
        const { error: allocateError } = await supabase.rpc('allocate_user_tokens', {
          user_id_param: user.id,
          cycle_id_param: currentCycle.id
        });

        if (allocateError) throw allocateError;

        // Fetch the newly created tokens
        const { data: newData, error: fetchError } = await supabase
          .from('user_budget_tokens')
          .select('*')
          .eq('user_id', user.id)
          .eq('cycle_id', currentCycle.id)
          .single();

        if (fetchError) throw fetchError;
        data = newData;
      }

      return data as UserBudgetTokens;
    },
    enabled: !!currentCycle?.id,
  });

  // Get user's votes for current cycle
  const { data: userVotes } = useQuery({
    queryKey: ['user-budget-votes', currentCycle?.id],
    queryFn: async () => {
      if (!currentCycle?.id) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('budget_votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_id', currentCycle.id);

      if (error) throw error;
      return data as BudgetVote[];
    },
    enabled: !!currentCycle?.id,
  });

  // Submit a new proposal
  const submitProposal = useMutation({
    mutationFn: async (proposal: Omit<BudgetProposal, 'id' | 'created_at' | 'updated_at' | 'total_tokens'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('budget_proposals')
        .insert({
          ...proposal,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-proposals'] });
      toast({
        title: 'Proposal Submitted',
        description: 'Your proposal has been submitted for review.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Cast votes
  const castVote = useMutation({
    mutationFn: async ({ proposalId, tokensAllocated }: { proposalId: string; tokensAllocated: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentCycle?.id) throw new Error('Not authenticated or no active cycle');

      const { data, error } = await supabase
        .from('budget_votes')
        .upsert({
          cycle_id: currentCycle.id,
          proposal_id: proposalId,
          user_id: user.id,
          tokens_allocated: tokensAllocated
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['user-budget-tokens'] });
      queryClient.invalidateQueries({ queryKey: ['user-budget-votes'] });
      toast({
        title: 'Vote Cast',
        description: 'Your vote has been recorded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Vote Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    currentCycle,
    proposals,
    userTokens,
    userVotes,
    isLoading: cycleLoading || proposalsLoading,
    submitProposal,
    castVote,
  };
};