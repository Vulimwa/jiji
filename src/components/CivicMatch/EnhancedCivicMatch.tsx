import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  UserPlus,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { StakeholderHeatmap } from './StakeholderHeatmap';
import { StakeholderInvitations } from './StakeholderInvitations';
import { MicroTaskforceCard } from './MicroTaskforceCard';
import { CreateTaskforceModal } from './CreateTaskforceModal';
import { GroupRecommendations } from './GroupRecommendations';
import { useMicroTaskforces } from '@/hooks/useMicroTaskforces';

interface EnhancedCivicMatchProps {
  selectedContentId?: string;
  selectedContentType?: 'civic_issue' | 'campaign' | 'community_event' | 'discussion';
}

export const EnhancedCivicMatch: React.FC<EnhancedCivicMatchProps> = ({
  selectedContentId,
  selectedContentType = 'civic_issue',
}) => {
  const [showCreateTaskforce, setShowCreateTaskforce] = useState(false);
  const { data: taskforces = [] } = useMicroTaskforces();

  // Filter taskforces related to current content
  const relatedTaskforces = taskforces.filter(tf => 
    (selectedContentType === 'civic_issue' && tf.issue_id === selectedContentId) ||
    (selectedContentType === 'campaign' && tf.campaign_id === selectedContentId)
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Features Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Smart Matching</p>
                <p className="text-xs text-muted-foreground">
                  AI-powered stakeholder recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm font-medium">Micro Taskforces</p>
                <p className="text-xs text-muted-foreground">
                  Form focused action groups
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium">Real-time Chat</p>
                <p className="text-xs text-muted-foreground">
                  Coordinate with neighbors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Impact Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Measure civic engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Content Tabs */}
      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
          <TabsTrigger value="taskforces">Micro Taskforces</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="invitations">My Invitations</TabsTrigger>
          <TabsTrigger value="organize">Organize</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          {selectedContentId ? (
            <StakeholderHeatmap
              contentType={selectedContentType}
              contentId={selectedContentId}
              title="Stakeholder Impact Analysis"
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select Content to Analyze</h3>
                <p className="text-muted-foreground">
                  Choose a civic issue, campaign, or event to see stakeholder analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="taskforces" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Micro Taskforces</h3>
              <p className="text-sm text-muted-foreground">
                Small, focused groups working on specific issues
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateTaskforce(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Taskforce
            </Button>
          </div>

          {relatedTaskforces.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {relatedTaskforces.map((taskforce) => (
                <MicroTaskforceCard 
                  key={taskforce.id} 
                  taskforce={taskforce} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Taskforces Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a micro taskforce for this issue
                </p>
                <Button 
                  onClick={() => setShowCreateTaskforce(true)}
                  variant="outline"
                >
                  Create First Taskforce
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <GroupRecommendations 
            contentId={selectedContentId}
            contentType={selectedContentType}
          />
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <StakeholderInvitations />
        </TabsContent>

        <TabsContent value="organize" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Form a Taskforce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a focused group to tackle specific aspects of this issue
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Coordinate local action</li>
                  <li>• Share resources and updates</li>
                  <li>• Plan community meetings</li>
                  <li>• Track progress together</li>
                </ul>
                <Button 
                  onClick={() => setShowCreateTaskforce(true)}
                  className="w-full"
                >
                  Create Taskforce
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Organize an Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Host a community meeting or action event
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Town hall meetings</li>
                  <li>• Community cleanups</li>
                  <li>• Awareness campaigns</li>
                  <li>• Petition drives</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Taskforce Modal */}
      <CreateTaskforceModal
        isOpen={showCreateTaskforce}
        onClose={() => setShowCreateTaskforce(false)}
        issueId={selectedContentType === 'civic_issue' ? selectedContentId : undefined}
        campaignId={selectedContentType === 'campaign' ? selectedContentId : undefined}
      />
    </div>
  );
};