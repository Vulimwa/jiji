import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  Vote, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Star
} from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import { ProposalSubmissionForm } from '@/components/Budget/ProposalSubmissionForm';
import { VotingInterface } from '@/components/Budget/VotingInterface';
import { EnhancedProjectTracker } from '@/components/Budget/EnhancedProjectTracker';
import { BudgetDashboard } from '@/components/Budget/BudgetDashboard';

const BudgetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  const { 
    currentCycle, 
    proposals, 
    userTokens, 
    userVotes,
    isLoading 
  } = useBudgetData();

  const cycleStatus = currentCycle?.status || 'draft';
  const isVotingOpen = cycleStatus === 'voting';
  const isSubmissionOpen = cycleStatus === 'open_submissions';

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Coins className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Community Budget</h1>
            <p className="text-muted-foreground">
              {currentCycle?.title || 'Participatory Budgeting Platform'}
            </p>
          </div>
        </div>

        {/* Current Cycle Status */}
        {currentCycle && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge 
              variant={isVotingOpen ? 'default' : isSubmissionOpen ? 'secondary' : 'outline'}
              className="px-3 py-1"
            >
              {cycleStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            
            {userTokens && (
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {userTokens.tokens_available} tokens available
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {isVotingOpen ? 'Voting ends' : 'Submissions end'}: {' '}
                {new Date(
                  isVotingOpen ? currentCycle.voting_end : currentCycle.end_date
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{proposals?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Active Proposals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Vote className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {proposals?.reduce((sum, p) => sum + (p.total_tokens || 0), 0) || 0}
            </div>
            <div className="text-xs text-muted-foreground">Total Votes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {new Set(userVotes?.map(v => v.user_id)).size || 0}
            </div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              KSh {(currentCycle?.total_budget || 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Budget</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="tracking">Project Tracking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <BudgetDashboard currentCycle={currentCycle} proposals={proposals} />
        </TabsContent>

        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Community Proposals</h2>
            {isSubmissionOpen && (
              <Button 
                onClick={() => setShowSubmissionForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Submit Proposal
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-20 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              proposals?.map((proposal) => (
                <Card key={proposal.id} className="hover-scale">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">{proposal.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{proposal.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {proposal.address}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold">
                            <Coins className="h-4 w-4 text-primary" />
                            {proposal.total_tokens}
                          </div>
                          <div className="text-xs text-muted-foreground">votes</div>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{proposal.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">Cost: </span>
                          KSh {proposal.estimated_cost.toLocaleString()}
                        </div>
                        <Badge 
                          variant={
                            proposal.status === 'approved' ? 'default' : 
                            proposal.status === 'funded' ? 'secondary' : 'outline'
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting">
          {isVotingOpen ? (
            <VotingInterface 
              proposals={proposals} 
              userTokens={userTokens}
              userVotes={userVotes}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Voting Not Active</h3>
                <p className="text-muted-foreground">
                  {cycleStatus === 'completed' 
                    ? 'This budget cycle has been completed.' 
                    : 'Voting will open once the proposal submission period ends.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Project Tracking Tab */}
        <TabsContent value="tracking">
          <EnhancedProjectTracker proposals={proposals} />
        </TabsContent>
      </Tabs>

      {/* Proposal Submission Modal */}
      <ProposalSubmissionForm 
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        cycleId={currentCycle?.id}
      />
    </div>
  );
};

export default BudgetPage;