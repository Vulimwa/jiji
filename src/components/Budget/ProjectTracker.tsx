import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, TrendingUp, MessageSquare, Star } from 'lucide-react';
import { BudgetProposal } from '@/hooks/useBudgetData';

interface ProjectTrackerProps {
  proposals: BudgetProposal[] | undefined;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({ proposals }) => {
  const fundedProjects = proposals || [];

  if (fundedProjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Funded Projects Yet</h3>
          <p className="text-muted-foreground">
            Once the voting period ends and projects are selected for funding,
            you'll be able to track their implementation progress here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mock progress data - in real implementation, this would come from project_updates table
  const getProjectProgress = (projectId: string) => {
    // Mock data for demonstration
    const mockProgress = Math.floor(Math.random() * 100);
    return mockProgress;
  };

  const getProjectStatus = (progress: number) => {
    if (progress === 0) return 'Not Started';
    if (progress < 25) return 'Planning';
    if (progress < 50) return 'In Progress';
    if (progress < 75) return 'Nearing Completion';
    if (progress < 100) return 'Final Stage';
    return 'Completed';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Implementation Tracker</h2>
        <Badge variant="secondary">
          {fundedProjects.length} Active Project{fundedProjects.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-6">
        {fundedProjects.map((project) => {
          const progress = getProjectProgress(project.id);
          const status = getProjectStatus(progress);
          
          return (
            <Card key={project.id} className="hover-scale">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {project.address}
                      </div>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                      {status}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      KSh {project.estimated_cost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Implementation Progress</span>
                    <span className="text-muted-foreground">{progress}% complete</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* Project Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Mock Updates Timeline */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Recent Updates</h4>
                  <div className="space-y-3">
                    {progress > 0 && (
                      <div className="flex gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Project Kickoff Meeting</div>
                          <div className="text-muted-foreground">
                            Initial planning and stakeholder alignment completed
                          </div>
                          <div className="text-xs text-muted-foreground">2 days ago</div>
                        </div>
                      </div>
                    )}
                    
                    {progress > 25 && (
                      <div className="flex gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Permits Obtained</div>
                          <div className="text-muted-foreground">
                            All necessary permits and approvals secured
                          </div>
                          <div className="text-xs text-muted-foreground">5 days ago</div>
                        </div>
                      </div>
                    )}
                    
                    {progress > 50 && (
                      <div className="flex gap-3 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Construction Started</div>
                          <div className="text-muted-foreground">
                            Ground work and initial construction phase begun
                          </div>
                          <div className="text-xs text-muted-foreground">1 week ago</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Community Engagement */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{Math.floor(Math.random() * 20 + 5)} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{(Math.random() * 2 + 3).toFixed(1)} rating</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Leave Feedback
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(Math.random() * 3)}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(Math.random() * 3 + 1)}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.floor(Math.random() * 2 + 1)}
              </div>
              <div className="text-sm text-muted-foreground">Planning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(Math.random() * 30 + 60).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};