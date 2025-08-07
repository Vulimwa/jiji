import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ZoningViolation {
  id: string;
  title: string;
  description: string;
  violation_type: string;
  address?: string;
  plot_number?: string;
  developer_name?: string;
  evidence_description?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'investigating' | 'confirmed' | 'resolved';
  image_urls?: string[];
  reporter_id?: string;
  is_anonymous: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export const useZoningViolations = () => {
  return useQuery({
    queryKey: ['zoning-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zoning_violations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
  });
};

export const useCreateZoningViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (violation: any) => {
      const { data, error } = await supabase
        .from('zoning_violations')
        .insert([violation])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zoning-violations'] });
    },
  });
};