import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MicroTaskforce {
  id: string;
  title: string;
  description: string;
  issue_id?: string;
  campaign_id?: string;
  location?: any;
  radius_meters: number;
  max_members: number;
  current_members: number;
  status: string;
  chat_enabled: boolean;
  sms_enabled: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskforceMembership {
  id: string;
  taskforce_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  status: string;
}

export interface TaskforceActivity {
  id: string;
  taskforce_id: string;
  user_id: string;
  activity_type: string;
  content: string;
  metadata: any;
  created_at: string;
}

export const useMicroTaskforces = (location?: { lat: number; lng: number }) => {
  return useQuery({
    queryKey: ['micro-taskforces', location],
    queryFn: async () => {
      let query = supabase
        .from('micro_taskforces')
        .select('*')
        .eq('status', 'active');

      // If location provided, filter by proximity
      if (location) {
        // Note: This would need PostGIS functions for proper distance filtering
        // For now, just return all active taskforces
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as MicroTaskforce[];
    },
  });
};

export const useTaskforceMemberships = (taskforceId: string) => {
  return useQuery({
    queryKey: ['taskforce-memberships', taskforceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('taskforce_memberships')
        .select(`
          *,
          user_profiles!inner(id, full_name, profile_image_url)
        `)
        .eq('taskforce_id', taskforceId)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });
};

export const useTaskforceActivities = (taskforceId: string) => {
  return useQuery({
    queryKey: ['taskforce-activities', taskforceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('taskforce_activities')
        .select(`
          *,
          user_profiles!inner(id, full_name, profile_image_url)
        `)
        .eq('taskforce_id', taskforceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TaskforceActivity[];
    },
  });
};

export const useCreateMicroTaskforce = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskforce: Partial<MicroTaskforce>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const taskforceData = {
        title: taskforce.title!,
        description: taskforce.description!,
        created_by: user.id,
        ...taskforce,
      };

      const { data, error } = await supabase
        .from('micro_taskforces')
        .insert(taskforceData)
        .select()
        .single();

      if (error) throw error;

      // Automatically join the creator as admin
      await supabase
        .from('taskforce_memberships')
        .insert({
          taskforce_id: data.id,
          user_id: user.id,
          role: 'admin',
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['micro-taskforces'] });
      toast({
        title: "Taskforce Created!",
        description: "Your micro-taskforce has been created successfully.",
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

export const useJoinTaskforce = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskforceId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('taskforce_memberships')
        .insert({
          taskforce_id: taskforceId,
          user_id: user.id,
          role: 'member',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['micro-taskforces'] });
      queryClient.invalidateQueries({ queryKey: ['taskforce-memberships'] });
      toast({
        title: "Joined Taskforce!",
        description: "You have successfully joined the taskforce.",
      });
    },
    onError: (error) => {
      toast({
        title: "Join Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const usePostActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      taskforceId,
      activityType,
      content,
      metadata = {},
    }: {
      taskforceId: string;
      activityType: string;
      content: string;
      metadata?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('taskforce_activities')
        .insert({
          taskforce_id: taskforceId,
          user_id: user.id,
          activity_type: activityType,
          content,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['taskforce-activities', variables.taskforceId] 
      });
      toast({
        title: "Activity Posted!",
        description: "Your activity has been posted to the taskforce.",
      });
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};