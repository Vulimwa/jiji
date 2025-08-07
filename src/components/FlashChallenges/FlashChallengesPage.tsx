import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FlashChallengeCard } from './FlashChallengeCard';
import { FlashChallengeModal } from './FlashChallengeModal';
import { Zap, Trophy, Flame, Target, Clock } from 'lucide-react';
import { 
  useActiveFlashChallenges, 
  useUserFlashStats,
  useUserChallengeResponses,
  FlashChallenge 
} from '@/hooks/useFlashChallenges';

export const FlashChallengesPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<FlashChallenge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: challenges = [], isLoading } = useActiveFlashChallenges();
  const { data: userStats } = useUserFlashStats();
  const { data: userResponses = [] } = useUserChallengeResponses();

  const handleParticipate = (challenge: FlashChallenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const getParticipatedChallengeIds = () => {
    return new Set(userResponses.map(response => response.challenge_id));
  };

  const participatedIds = getParticipatedChallengeIds();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="w-8 h-8 text-primary" />
          Flash Challenges
        </h1>
        <p className="text-muted-foreground">
          Rapid civic action challenges happening now in your community
        </p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{userStats.total_challenges_completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Points Earned</p>
                  <p className="text-2xl font-bold">{userStats.total_points_earned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.current_streak}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Badges</p>
                  <p className="text-2xl font-bold">{userStats.badges_earned.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Challenge Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Active Challenges
            <Badge variant="secondary">{challenges.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary">{participatedIds.size}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {challenges.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Challenges</h3>
                <p className="text-muted-foreground">
                  Check back soon for new flash challenges in your area!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <FlashChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onParticipate={handleParticipate}
                  hasParticipated={participatedIds.has(challenge.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges
              .filter(challenge => participatedIds.has(challenge.id))
              .map((challenge) => (
                <FlashChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onParticipate={handleParticipate}
                  hasParticipated={true}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Participation Modal */}
      <FlashChallengeModal
        challenge={selectedChallenge}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChallenge(null);
        }}
      />
    </div>
  );
};