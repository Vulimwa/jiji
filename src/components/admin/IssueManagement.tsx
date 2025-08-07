
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, User, Calendar } from 'lucide-react';
import { useCivicIssues, useGovernmentOfficials } from '@/hooks/useSupabaseData';
import { civicIssuesService } from '@/lib/supabase-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const IssueManagement: React.FC = () => {
  const { data: issues = [] } = useCivicIssues();
  const { data: officials = [] } = useGovernmentOfficials();
  const queryClient = useQueryClient();

  const assignOfficialMutation = useMutation({
    mutationFn: ({ issueId, officialId }: { issueId: string; officialId: string }) =>
      civicIssuesService.assignOfficialToIssue(issueId, officialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['civic-issues'] });
      toast.success('Official assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign official: ${error.message}`);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (level: number) => {
    if (level >= 4) return 'bg-red-100 text-red-800';
    if (level >= 3) return 'bg-orange-100 text-orange-800';
    if (level >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Issue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card key={issue.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(issue.urgency_level || 1)}>
                          Priority {issue.urgency_level}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {issue.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{(issue as any).user_profiles?.full_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{issue.address || 'Location provided'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      {!issue.assigned_officer_id ? (
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(officialId) =>
                              assignOfficialMutation.mutate({ issueId: issue.id, officialId })
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Assign Official" />
                            </SelectTrigger>
                            <SelectContent>
                              {officials.map((official) => (
                                <SelectItem key={official.id} value={official.id}>
                                  {(official as any).user_profiles?.full_name} - {official.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p className="font-medium">Assigned to:</p>
                          <p className="text-muted-foreground">
                            {(issue as any).government_officials?.department} - {(issue as any).government_officials?.position}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
