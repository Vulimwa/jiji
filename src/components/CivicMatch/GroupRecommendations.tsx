import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  MapPin,
  TrendingUp,
  Heart,
  ExternalLink
} from 'lucide-react';

interface GroupRecommendationsProps {
  contentId?: string;
  contentType?: string;
}

export const GroupRecommendations: React.FC<GroupRecommendationsProps> = ({
  contentId,
  contentType,
}) => {
  // Mock recommendations - in real app this would come from an API
  const recommendations = [
    {
      id: '1',
      type: 'group',
      title: 'Water & Sanitation Taskforce',
      description: '12 people near you working on water infrastructure issues',
      reason: 'Based on your location and issue interests',
      score: 95,
      members: 12,
      distance: '0.3km',
      icon: Users,
    },
    {
      id: '2',
      type: 'petition',
      title: 'Petition: Fix Marcus Garvey Road Drainage',
      description: '234 signatures needed to reach city council',
      reason: 'Related to your reported sewage issue',
      score: 88,
      signatures: 766,
      target: 1000,
      icon: FileText,
    },
    {
      id: '3',
      type: 'event',
      title: 'Community Cleanup Drive',
      description: 'Saturday morning cleanup at Marcus Garvey Park',
      reason: 'Perfect for hands-on civic engagement',
      score: 82,
      date: '2024-12-21',
      attendees: 23,
      icon: Calendar,
    },
    {
      id: '4',
      type: 'resident',
      title: 'Connect with Sarah M.',
      description: 'Active resident who has organized 3 successful campaigns',
      reason: 'Lives 200m away, similar interests',
      score: 76,
      distance: '0.2km',
      campaigns: 3,
      icon: Users,
    },
  ];

  if (!contentId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-muted-foreground">
            Select a civic issue, campaign, or event to see personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered suggestions based on your location, interests, and civic activity
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          
          return (
            <Card key={rec.id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rec.score}% match
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {rec.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {rec.type === 'group' && (
                      <>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {rec.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {rec.distance}
                        </span>
                      </>
                    )}
                    
                    {rec.type === 'petition' && (
                      <>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {rec.signatures} / {rec.target} signatures
                        </span>
                      </>
                    )}
                    
                    {rec.type === 'event' && (
                      <>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(rec.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {rec.attendees} attending
                        </span>
                      </>
                    )}
                    
                    {rec.type === 'resident' && (
                      <>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {rec.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {rec.campaigns} campaigns
                        </span>
                      </>
                    )}
                  </div>

                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    {rec.type === 'group' && 'Join Group'}
                    {rec.type === 'petition' && 'Sign Petition'}
                    {rec.type === 'event' && 'Attend Event'}
                    {rec.type === 'resident' && 'Connect'}
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};