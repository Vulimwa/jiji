import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStakeholderMatches, useImpactScore } from '@/hooks/useCivicMatch';

interface StakeholderHeatmapProps {
  contentType: 'civic_issue' | 'campaign' | 'community_event' | 'discussion';
  contentId: string;
  title: string;
}

export const StakeholderHeatmap: React.FC<StakeholderHeatmapProps> = ({
  contentType,
  contentId,
  title,
}) => {
  const { data: matches, isLoading: matchesLoading } = useStakeholderMatches(contentType, contentId);
  const { data: impactScore, isLoading: scoreLoading } = useImpactScore(contentType, contentId);

  if (matchesLoading || scoreLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Civic Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stakeholderTypes = matches?.reduce((acc, match) => {
    const userType = match.user_profiles?.user_type || 'unknown';
    acc[userType] = (acc[userType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const userTypeLabels: Record<string, string> = {
    resident: 'Residents',
    vendor: 'Vendors',
    boda_driver: 'Boda Drivers',
    hawker: 'Hawkers',
    youth_leader: 'Youth Leaders',
    landowner: 'Landowners',
    security_guard: 'Security Guards',
    business_owner: 'Business Owners',
    official: 'Officials',
    admin: 'Administrators',
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="h-4 w-4" />;
    if (score >= 0.4) return <MapPin className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Civic Match Analysis: {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impact Score Overview */}
        {impactScore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getScoreColor(impactScore.overall_impact_score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Overall Impact</p>
                  <p className="text-2xl font-bold">
                    {Math.round(impactScore.overall_impact_score * 100)}%
                  </p>
                </div>
                {getScoreIcon(impactScore.overall_impact_score)}
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stakeholders</p>
                  <p className="text-2xl font-bold">
                    {impactScore.engaged_stakeholders}/{impactScore.total_stakeholders}
                  </p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Diversity Score</p>
                  <p className="text-2xl font-bold">
                    {Math.round(impactScore.stakeholder_diversity_score * 100)}%
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Stakeholder Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Who's at the Table</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stakeholderTypes).map(([type, count]) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {userTypeLabels[type] || type}
                <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Voices */}
        {impactScore?.missing_voice_alerts && impactScore.missing_voice_alerts.length > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Missing Voices</h4>
                <ul className="space-y-1">
                  {impactScore.missing_voice_alerts.map((alert, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      • {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Decision Maker Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            impactScore?.decision_maker_engagement ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm">
            {impactScore?.decision_maker_engagement 
              ? 'Decision makers are engaged' 
              : 'Decision makers not yet engaged'
            }
          </span>
        </div>

        {/* Geographic Coverage */}
        {impactScore && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Geographic Coverage</span>
              <span>{Math.round(impactScore.geographic_coverage_score * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${impactScore.geographic_coverage_score * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Stakeholder Matches */}
        {matches && matches.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Matched Stakeholders</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {matches.slice(0, 10).map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {match.user_profiles?.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {match.user_profiles?.full_name || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userTypeLabels[match.user_profiles?.user_type] || match.user_profiles?.user_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round(match.relevance_score * 100)}%
                    </p>
                    {match.distance_meters && (
                      <p className="text-xs text-muted-foreground">
                        {match.distance_meters < 1000
                          ? `${match.distance_meters}m`
                          : `${Math.round(match.distance_meters / 1000)}km`
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};