import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CollaborationGroup {
  id: string;
  title: string;
  description: string;
  issue_focus: string;
  address: string | null;
  group_type: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  max_members: number;
  logo_url: string | null;
  banner_url: string | null;
  tags: string[];
  privacy_settings: any;
  contact_info: any;
  achievements: any;
  is_verified: boolean;
}

export interface GroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  contribution_score: number;
}

export interface GroupTask {
  id: string;
  group_id: string;
  created_by: string;
  assigned_to?: string;
  title: string;
  description?: string;
  task_type: string;
  priority: string;
  status: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  attachments: string[];
  address?: string;
}

export const useCollaborationGroups = () => {
  return useQuery({
    queryKey: ['collaboration-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaboration_groups')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CollaborationGroup[];
    },
  });
};

export const useGroupMemberships = (groupId?: string) => {
  return useQuery({
    queryKey: ['group-memberships', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      const { data, error } = await supabase
        .from('group_memberships')
        .select(`
          *,
          user_profiles (
            full_name,
            profile_image_url
          )
        `)
        .eq('group_id', groupId)
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });
};

export const useGroupTasks = (groupId?: string) => {
  return useQuery({
    queryKey: ['group-tasks', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      const { data, error } = await supabase
        .from('group_tasks')
        .select(`
          *,
          created_by_profile:user_profiles!group_tasks_created_by_fkey (
            full_name,
            profile_image_url
          ),
          assigned_to_profile:user_profiles!group_tasks_assigned_to_fkey (
            full_name,
            profile_image_url
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GroupTask[];
    },
    enabled: !!groupId,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newGroup: any) => {
      const { data, error } = await supabase
        .from('collaboration_groups')
        .insert(newGroup)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration-groups'] });
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('group_memberships')
        .insert([{
          group_id: groupId,
          user_id: userId,
          role: 'member',
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collaboration-groups'] });
      queryClient.invalidateQueries({ queryKey: ['group-memberships', variables.groupId] });
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTask: any) => {
      const { data, error } = await supabase
        .from('group_tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-tasks', variables.group_id] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<GroupTask> }) => {
      const { data, error } = await supabase
        .from('group_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-tasks', data.group_id] });
    },
  });
};