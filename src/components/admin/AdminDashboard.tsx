
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Users, FileText, AlertTriangle, Calendar, Briefcase, Coins, Target, TrendingUp, MessageSquare } from 'lucide-react';
import { useCivicIssues, useCampaigns, useEvents, useZoningViolations, useGovernmentOfficials } from '@/hooks/useSupabaseData';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useStakeholderMatches } from '@/hooks/useCivicMatch';
import { IssueManagement } from './IssueManagement';
import { CampaignApproval } from './CampaignApproval';
import { EventApproval } from './EventApproval';
import { UserManagement } from './UserManagement';
import { ContentManagement } from './ContentManagement';

export const AdminDashboard: React.FC = () => {
  const { data: issues = [] } = useCivicIssues();
  const { data: campaigns = [] } = useCampaigns();
  const { data: events = [] } = useEvents();
  const { data: violations = [] } = useZoningViolations();
  const { data: officials = [] } = useGovernmentOfficials();
  const { currentCycle, proposals } = useBudgetData();

  const pendingCampaigns = campaigns.filter(c => !c.admin_approved);
  const pendingEvents = events.filter(e => !e.admin_approved);
  const unassignedIssues = issues.filter(i => !i.assigned_officer_id);
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || [];
  const activeProposals = proposals?.filter(p => p.status === 'approved') || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
              <p className="text-xs text-muted-foreground">
                {unassignedIssues.length} unassigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Campaigns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCampaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Proposals</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProposals.length}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cycle</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentCycle ? '1' : '0'}</div>
              <p className="text-xs text-muted-foreground">
                {currentCycle?.status || 'No active cycle'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Officials</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{officials.length}</div>
              <p className="text-xs text-muted-foreground">
                Government officials
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="civic-match">Civic Match</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <IssueManagement />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignApproval />
          </TabsContent>

          <TabsContent value="events">
            <EventApproval />
          </TabsContent>

          <TabsContent value="budget">
            <Card>
              <CardHeader>
                <CardTitle>Budget Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Current Cycle</h4>
                      <p className="text-2xl font-bold">{currentCycle?.title || 'No active cycle'}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {currentCycle?.status || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Total Budget</h4>
                      <p className="text-2xl font-bold">
                        KSh {(currentCycle?.total_budget || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For current cycle
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Active Proposals</h4>
                      <p className="text-2xl font-bold">{activeProposals.length}</p>
                      <p className="text-sm text-muted-foreground">
                        {pendingProposals.length} pending review
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recent Proposals</h4>
                    <div className="space-y-2">
                      {proposals?.slice(0, 5).map((proposal) => (
                        <div key={proposal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{proposal.title}</p>
                            <p className="text-sm text-muted-foreground">{proposal.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">KSh {proposal.estimated_cost.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{proposal.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="civic-match">
            <Card>
              <CardHeader>
                <CardTitle>Civic Match Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Total Issues</h4>
                      <p className="text-2xl font-bold">{issues.length}</p>
                      <p className="text-sm text-muted-foreground">Being analyzed</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Active Campaigns</h4>
                      <p className="text-2xl font-bold">{campaigns.length}</p>
                      <p className="text-sm text-muted-foreground">In system</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Stakeholder Categories</h4>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Configured</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold">Avg Impact Score</h4>
                      <p className="text-2xl font-bold">7.2</p>
                      <p className="text-sm text-muted-foreground">Out of 10</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
