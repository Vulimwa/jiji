
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import { useCampaigns } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const CampaignApproval: React.FC = () => {
  const { data: campaigns = [] } = useCampaigns();
  const queryClient = useQueryClient();

  const approveCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, approved }: { campaignId: string; approved: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .update({
          admin_approved: approved,
          approved_by: approved ? user.id : null,
          approval_date: approved ? new Date().toISOString() : null
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(`Campaign ${approved ? 'approved' : 'rejected'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update campaign: ${error.message}`);
    },
  });

  const pendingCampaigns = campaigns.filter(c => !c.admin_approved);
  const approvedCampaigns = campaigns.filter(c => c.admin_approved);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pending Approval
              <Badge variant="secondary">{pendingCampaigns.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Created: {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-muted-foreground">
                          Target: {campaign.target_signatures} signatures
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            approveCampaignMutation.mutate({ campaignId: campaign.id, approved: true })
                          }
                          disabled={approveCampaignMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            approveCampaignMutation.mutate({ campaignId: campaign.id, approved: false })
                          }
                          disabled={approveCampaignMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingCampaigns.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No campaigns pending approval
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Approved Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Approved Campaigns
              <Badge variant="secondary">{approvedCampaigns.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedCampaigns.slice(0, 5).map((campaign) => (
                <Card key={campaign.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {campaign.current_signatures}/{campaign.target_signatures} signatures
                        </span>
                        <span className="text-muted-foreground">
                          Approved: {campaign.approval_date ? new Date(campaign.approval_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {approvedCampaigns.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No approved campaigns yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
