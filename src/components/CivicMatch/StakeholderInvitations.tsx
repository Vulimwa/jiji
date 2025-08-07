import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Check, X, Clock, ExternalLink } from 'lucide-react';
import { useStakeholderInvitations, useUpdateInvitationResponse } from '@/hooks/useCivicMatch';
import { toast } from 'sonner';

export const StakeholderInvitations: React.FC = () => {
  const { data: invitations, isLoading } = useStakeholderInvitations();
  const updateResponse = useUpdateInvitationResponse();

  const handleResponse = async (invitationId: string, action: 'participated' | 'declined') => {
    try {
      await updateResponse.mutateAsync({
        invitationId,
        responseAction: action,
      });
      
      toast.success(
        action === 'participated' 
          ? 'Marked as participated' 
          : 'Invitation declined'
      );
    } catch (error) {
      toast.error('Failed to update response');
      console.error('Error updating invitation response:', error);
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      civic_issue: 'Civic Issue',
      campaign: 'Campaign',
      community_event: 'Community Event',
      discussion: 'Discussion',
    };
    return labels[type] || type;
  };

  const getStatusColor = (invitation: any) => {
    if (invitation.response_action === 'participated') return 'bg-green-100 text-green-800';
    if (invitation.response_action === 'declined') return 'bg-red-100 text-red-800';
    if (invitation.viewed_at) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (invitation: any) => {
    if (invitation.response_action === 'participated') return 'Participated';
    if (invitation.response_action === 'declined') return 'Declined';
    if (invitation.viewed_at) return 'Viewed';
    return 'New';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Stakeholder Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Stakeholder Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No stakeholder invitations yet</p>
            <p className="text-sm">You'll receive invitations for relevant civic activities in your area.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Stakeholder Invitations
          <Badge variant="secondary" className="ml-auto">
            {invitations.filter(inv => !inv.response_action).length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getContentTypeLabel(invitation.content_type)}
                    </Badge>
                    <Badge className={getStatusColor(invitation)}>
                      {getStatusText(invitation)}
                    </Badge>
                  </div>
                  <h4 className="font-medium">
                    You've been identified as a relevant stakeholder
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Content ID: {invitation.content_id}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>

              {invitation.invitation_message && (
                <div className="bg-muted p-3 rounded text-sm">
                  <p className="font-medium mb-1">Message:</p>
                  <p>{invitation.invitation_message}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Sent: {new Date(invitation.sent_at).toLocaleDateString()}
                </span>
                <span>
                  Method: {invitation.invitation_method}
                </span>
              </div>

              {!invitation.response_action && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleResponse(invitation.id, 'participated')}
                    disabled={updateResponse.isPending}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Mark as Participated
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResponse(invitation.id, 'declined')}
                    disabled={updateResponse.isPending}
                    className="flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Decline
                  </Button>
                </div>
              )}

              {invitation.response_action && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2">
                  <Clock className="h-3 w-3" />
                  Responded: {new Date(invitation.responded_at || '').toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};