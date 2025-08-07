import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Zap, Trophy } from 'lucide-react';
import { FlashChallenge } from '@/hooks/useFlashChallenges';

interface FlashChallengeCardProps {
  challenge: FlashChallenge;
  onParticipate: (challenge: FlashChallenge) => void;
  hasParticipated?: boolean;
}

export const FlashChallengeCard: React.FC<FlashChallengeCardProps> = ({
  challenge,
  onParticipate,
  hasParticipated = false,
}) => {
  const timeRemaining = new Date(challenge.end_time).getTime() - Date.now();
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  const progress = Math.min((challenge.current_count / challenge.goal_count) * 100, 100);
  const isExpired = timeRemaining <= 0;
  const isCompleted = challenge.current_count >= challenge.goal_count;

  const getStatusColor = () => {
    if (isExpired) return 'bg-destructive';
    if (isCompleted) return 'bg-success';
    if (timeRemaining < 3600000) return 'bg-warning'; // Less than 1 hour
    return 'bg-primary';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isCompleted) return 'Completed';
    if (timeRemaining < 3600000) return 'Urgent';
    return 'Active';
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {challenge.title}
          </CardTitle>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{challenge.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Progress
            </span>
            <span className="font-medium">
              {challenge.current_count} / {challenge.goal_count}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Time Remaining */}
        {!isExpired && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {hours > 0 ? `${hours}h ` : ''}
              {minutes}m remaining
            </span>
          </div>
        )}

        {/* Location */}
        {challenge.location_scope && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Within {challenge.radius_meters}m radius</span>
          </div>
        )}

        {/* Reward */}
        <div className="flex items-center gap-1 text-sm">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-medium">
            {challenge.reward_points} civic points
            {challenge.reward_badge && ` + ${challenge.reward_badge} badge`}
          </span>
        </div>

        {/* Submission Types */}
        <div className="flex flex-wrap gap-1">
          {challenge.submission_types.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onParticipate(challenge)}
          disabled={isExpired || hasParticipated}
          className="w-full"
          variant={hasParticipated ? "outline" : "default"}
        >
          {hasParticipated 
            ? "Already Participated" 
            : isExpired 
            ? "Challenge Expired" 
            : "Participate Now"
          }
        </Button>
      </CardContent>
    </Card>
  );
};