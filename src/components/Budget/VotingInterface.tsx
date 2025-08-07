import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coins, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { BudgetProposal, UserBudgetTokens, BudgetVote, useBudgetData } from '@/hooks/useBudgetData';

interface VotingInterfaceProps {
  proposals: BudgetProposal[] | undefined;
  userTokens: UserBudgetTokens | null;
  userVotes: BudgetVote[] | undefined;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  proposals,
  userTokens,
  userVotes
}) => {
  const { castVote } = useBudgetData();
  const [tokenAllocations, setTokenAllocations] = useState<Record<string, number>>({});
  
  // Initialize token allocations from existing votes
  React.useEffect(() => {
    if (userVotes) {
      const allocations = userVotes.reduce((acc, vote) => {
        acc[vote.proposal_id] = vote.tokens_allocated;
        return acc;
      }, {} as Record<string, number>);
      setTokenAllocations(allocations);
    }
  }, [userVotes]);

  const totalAllocated = Object.values(tokenAllocations).reduce((sum, tokens) => sum + tokens, 0);
  const tokensRemaining = (userTokens?.tokens_total || 0) - totalAllocated;

  const handleTokenChange = (proposalId: string, tokens: number[]) => {
    setTokenAllocations(prev => ({
      ...prev,
      [proposalId]: tokens[0]
    }));
  };

  const handleVoteSubmit = async (proposalId: string) => {
    const tokensAllocated = tokenAllocations[proposalId] || 0;
    if (tokensAllocated > 0) {
      await castVote.mutateAsync({ proposalId, tokensAllocated });
    }
  };

  if (!userTokens) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">
            Please sign in to participate in community budgeting.
          </p>
        </CardContent>
      </Card>
    );
  }

  const approvedProposals = proposals?.filter(p => p.status === 'approved') || [];

  return (
    <div className="space-y-6">
      {/* Token Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Your Voting Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{userTokens.tokens_total}</div>
              <div className="text-sm text-muted-foreground">Total Tokens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{totalAllocated}</div>
              <div className="text-sm text-muted-foreground">Allocated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{tokensRemaining}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting Interface */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Cast Your Votes</h2>
        <p className="text-muted-foreground">
          Allocate your tokens to the projects you want to see funded. You can distribute
          your {userTokens.tokens_total} tokens across multiple projects or focus on a few priorities.
        </p>

        {approvedProposals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Proposals Available</h3>
              <p className="text-muted-foreground">
                There are currently no approved proposals available for voting.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedProposals.map((proposal) => {
              const currentAllocation = tokenAllocations[proposal.id] || 0;
              const maxAllocation = Math.min(tokensRemaining + currentAllocation, userTokens.tokens_total);
              const hasVoted = userVotes?.some(v => v.proposal_id === proposal.id);

              return (
                <Card key={proposal.id} className="relative">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Project Header */}
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
                          <div className="text-xs text-muted-foreground">total votes</div>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{proposal.description}</p>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          Estimated Cost: KSh {proposal.estimated_cost.toLocaleString()}
                        </span>
                        {hasVoted && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Voted</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Token Allocation */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Allocate Tokens:</span>
                          <span className="text-sm text-muted-foreground">
                            {currentAllocation} / {maxAllocation} tokens
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Slider
                            value={[currentAllocation]}
                            onValueChange={(value) => handleTokenChange(proposal.id, value)}
                            max={maxAllocation}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>{maxAllocation}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            {currentAllocation > 0 && (
                              <span className="text-primary font-medium">
                                {currentAllocation} token{currentAllocation !== 1 ? 's' : ''} allocated
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={() => handleVoteSubmit(proposal.id)}
                            disabled={currentAllocation === 0 || castVote.isPending}
                            size="sm"
                          >
                            {hasVoted ? 'Update Vote' : 'Cast Vote'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Voting Summary */}
      {totalAllocated > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Voting Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(tokenAllocations)
                .filter(([, tokens]) => tokens > 0)
                .map(([proposalId, tokens]) => {
                  const proposal = proposals?.find(p => p.id === proposalId);
                  return (
                    <div key={proposalId} className="flex justify-between items-center py-2">
                      <span className="font-medium">{proposal?.title}</span>
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-primary" />
                        <span>{tokens}</span>
                      </div>
                    </div>
                  );
                })}
              <Separator />
              <div className="flex justify-between items-center font-bold">
                <span>Total Allocated:</span>
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span>{totalAllocated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};