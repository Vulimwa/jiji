import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { BudgetCycle, BudgetProposal } from '@/hooks/useBudgetData';

interface BudgetDashboardProps {
  currentCycle: BudgetCycle | null;
  proposals: BudgetProposal[] | undefined;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ 
  currentCycle, 
  proposals 
}) => {
  if (!currentCycle) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Active Budget Cycle</h3>
          <p className="text-muted-foreground">
            Check back later for upcoming participatory budgeting opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalVotes = proposals?.reduce((sum, p) => sum + (p.total_tokens || 0), 0) || 0;
  const fundedProjects = proposals?.filter(p => p.status === 'funded') || [];
  const totalFundedCost = fundedProjects.reduce((sum, p) => sum + p.estimated_cost, 0);
  const budgetProgress = (totalFundedCost / currentCycle.total_budget) * 100;

  const categoryBreakdown = proposals?.reduce((acc, proposal) => {
    acc[proposal.category] = (acc[proposal.category] || 0) + (proposal.total_tokens || 0);
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Budget Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Allocated Budget</span>
                <span className="font-medium">
                  KSh {totalFundedCost.toLocaleString()} / KSh {currentCycle.total_budget.toLocaleString()}
                </span>
              </div>
              <Progress value={budgetProgress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {budgetProgress.toFixed(1)}% of total budget allocated
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {fundedProjects.length}
                </div>
                <div className="text-xs text-muted-foreground">Funded Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {proposals?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Proposals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Total Community Votes</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Participation Rate</span>
                <Badge variant="secondary">
                  {totalVotes > 0 ? 'Active' : 'Starting'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Cycle Status</span>
                <Badge variant={currentCycle.status === 'voting' ? 'default' : 'outline'}>
                  {currentCycle.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Community voting preferences by project category
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCategories.length > 0 ? (
              sortedCategories.map(([category, votes]) => {
                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No voting data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Budget Cycle Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div className="flex-1">
                <div className="font-medium">Submissions Open</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(currentCycle.start_date).toLocaleDateString()} - {' '}
                  {new Date(currentCycle.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                currentCycle.status === 'voting' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="font-medium">Voting Period</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(currentCycle.voting_start).toLocaleDateString()} - {' '}
                  {new Date(currentCycle.voting_end).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                currentCycle.status === 'completed' ? 'bg-purple-500' : 'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="font-medium">Implementation</div>
                <div className="text-sm text-muted-foreground">
                  Projects funded and implementation begins
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};