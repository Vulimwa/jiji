import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, Users, TrendingUp, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { StakeholderHeatmap } from '@/components/CivicMatch/StakeholderHeatmap';
import { StakeholderInvitations } from '@/components/CivicMatch/StakeholderInvitations';
import { EnhancedCivicMatch } from '@/components/CivicMatch/EnhancedCivicMatch';
import { useStakeholderCategories } from '@/hooks/useCivicMatch';
import { useCivicIssues } from '@/hooks/useSupabaseData';

const CivicMatchPage: React.FC = () => {
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<'civic_issue' | 'campaign' | 'community_event' | 'discussion'>('civic_issue');
  
  const { data: categories, isLoading: categoriesLoading } = useStakeholderCategories();
  const { data: civicIssues, isLoading: issuesLoading } = useCivicIssues();

  const handleSelectContent = (id: string, type: 'civic_issue' | 'campaign' | 'community_event' | 'discussion') => {
    setSelectedContentId(id);
    setSelectedContentType(type);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Civic Match</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Strategic stakeholder engagement that ensures the right voices are heard 
          for every civic issue, campaign, and community initiative.
        </p>
      </div>

      {/* Key Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Smart Targeting</h3>
            <p className="text-xs text-muted-foreground">Auto-match relevant stakeholders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Geographic Relevance</h3>
            <p className="text-xs text-muted-foreground">Location-based stakeholder matching</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Impact Scoring</h3>
            <p className="text-xs text-muted-foreground">Measure stakeholder engagement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Missing Voices</h3>
            <p className="text-xs text-muted-foreground">Identify underrepresented groups</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Civic Match Integration */}
      <EnhancedCivicMatch 
        selectedContentId={selectedContentId}
        selectedContentType={selectedContentType}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Content Analysis</TabsTrigger>
          <TabsTrigger value="invitations">My Invitations</TabsTrigger>
          <TabsTrigger value="categories">Stakeholder Categories</TabsTrigger>
        </TabsList>

        {/* Content Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Content to Analyze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Civic Issues</h4>
                  {issuesLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {civicIssues?.slice(0, 10).map((issue) => (
                        <div
                          key={issue.id}
                          className={`p-3 border rounded cursor-pointer transition-colors ${
                            selectedContentId === issue.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handleSelectContent(issue.id, 'civic_issue')}
                        >
                          <h5 className="font-medium text-sm">{issue.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {issue.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {issue.priority_votes} votes
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Analysis */}
            <div className="lg:col-span-2">
              {selectedContentId ? (
                <StakeholderHeatmap
                  contentType={selectedContentType}
                  contentId={selectedContentId}
                  title={civicIssues?.find(i => i.id === selectedContentId)?.title || 'Selected Content'}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium text-lg mb-2">Select Content to Analyze</h3>
                    <p className="text-muted-foreground">
                      Choose a civic issue, campaign, or event from the left to see 
                      its stakeholder analysis and impact score.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <StakeholderInvitations />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Different stakeholder types and their relevance to various civic issues.
              </p>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories?.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Relevant Issues:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.issue_categories.map((cat, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Keywords:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.relevance_keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                                {category.relevance_keywords.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{category.relevance_keywords.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CivicMatchPage;