
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, Calendar, MapPin } from 'lucide-react';
import { useEvents } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const EventApproval: React.FC = () => {
  const { data: events = [] } = useEvents();
  const queryClient = useQueryClient();

  const approveEventMutation = useMutation({
    mutationFn: async ({ eventId, approved }: { eventId: string; approved: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_events')
        .update({
          admin_approved: approved,
          approved_by: approved ? user.id : null,
          approval_date: approved ? new Date().toISOString() : null
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(`Event ${approved ? 'approved' : 'rejected'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const pendingEvents = events.filter(e => !e.admin_approved);
  const approvedEvents = events.filter(e => e.admin_approved);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pending Approval
              <Badge variant="secondary">{pendingEvents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <Card key={event.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.event_date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Category: {event.category || 'General'}
                        </span>
                        <span className="text-muted-foreground">
                          Max: {event.max_attendees || 'Unlimited'} attendees
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            approveEventMutation.mutate({ eventId: event.id, approved: true })
                          }
                          disabled={approveEventMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            approveEventMutation.mutate({ eventId: event.id, approved: false })
                          }
                          disabled={approveEventMutation.isPending}
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
              
              {pendingEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No events pending approval
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Approved Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Approved Events
              <Badge variant="secondary">{approvedEvents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedEvents.slice(0, 5).map((event) => (
                <Card key={event.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {event.current_attendees}/{event.max_attendees || '∞'} registered
                        </span>
                        <span className="text-muted-foreground">
                          Approved: {event.approval_date ? new Date(event.approval_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {approvedEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No approved events yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
