import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, TrendingUp, MessageSquare, Star, Camera, Clock, CheckCircle, AlertCircle, Users, FileText } from 'lucide-react';
import { BudgetProposal } from '@/hooks/useBudgetData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  update_type: string;
  progress_percent: number | null;
  photo_urls: string[] | null;
  created_at: string;
  posted_by: string;
}

interface ProjectFeedback {
  id: string;
  proposal_id: string;
  feedback_text: string;
  rating: number;
  before_photo_url: string | null;
  after_photo_url: string | null;
  impact_story: string | null;
  created_at: string;
  user_id: string;
}

interface EnhancedProjectTrackerProps {
  proposals: BudgetProposal[] | undefined;
}

export const EnhancedProjectTracker: React.FC<EnhancedProjectTrackerProps> = ({ proposals }) => {
  const [selectedProject, setSelectedProject] = useState<BudgetProposal | null>(null);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdate[]>([]);
  const [projectFeedback, setProjectFeedback] = useState<ProjectFeedback[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const { toast } = useToast();

  const fundedProjects = proposals?.filter(p => p.status === 'funded') || [];

  useEffect(() => {
    if (selectedProject) {
      fetchProjectData(selectedProject.id);
    }
  }, [selectedProject]);

  const fetchProjectData = async (proposalId: string) => {
    try {
      // Fetch project updates
      const { data: updates, error: updatesError } = await supabase
        .from('project_updates')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setProjectUpdates(updates || []);

      // Fetch project feedback
      const { data: feedback, error: feedbackError } = await supabase
        .from('project_feedback')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      setProjectFeedback(feedback || []);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedProject) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Please log in to submit feedback", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('project_feedback')
        .insert({
          proposal_id: selectedProject.id,
          user_id: user.id,
          feedback_text: newFeedback,
          rating: newRating
        });

      if (error) throw error;

      toast({ title: "Feedback submitted successfully!" });
      setNewFeedback('');
      setNewRating(5);
      fetchProjectData(selectedProject.id);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({ title: "Failed to submit feedback", variant: "destructive" });
    }
  };

  const getStatusBadge = (project: BudgetProposal) => {
    const progress = project.current_progress || 0;
    if (progress === 0) return { status: 'Not Started', variant: 'outline' as const };
    if (progress < 25) return { status: 'Planning', variant: 'secondary' as const };
    if (progress < 50) return { status: 'In Progress', variant: 'default' as const };
    if (progress < 75) return { status: 'Nearing Completion', variant: 'default' as const };
    if (progress < 100) return { status: 'Final Stage', variant: 'default' as const };
    return { status: 'Completed', variant: 'default' as const };
  };

  const filteredProjects = fundedProjects.filter(project => {
    if (filter === 'all') return true;
    const { status } = getStatusBadge(project);
    return status.toLowerCase().includes(filter);
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.current_progress || 0) - (a.current_progress || 0);
      case 'votes':
        return (b.total_tokens || 0) - (a.total_tokens || 0);
      case 'recent':
      default:
        return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
    }
  });

  if (fundedProjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-4">Track Funded Projects</h3>
          <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto">
            <h4 className="font-semibold mb-2">No funded projects yet</h4>
            <p className="text-muted-foreground text-sm">
              Once the voting period ends and winning proposals are selected, 
              you'll be able to track their implementation progress here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Implementation Tracker</h2>
          <p className="text-muted-foreground">Monitor progress of community-funded projects</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Projects</option>
            <option value="planning">Planning</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="progress">Highest Progress</option>
            <option value="votes">Most Voted</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid gap-6">
        {sortedProjects.map((project) => {
          const progress = project.current_progress || 0;
          const { status, variant } = getStatusBadge(project);
          const avgRating = projectFeedback.filter(f => f.proposal_id === project.id)
            .reduce((acc, f) => acc + f.rating, 0) / projectFeedback.filter(f => f.proposal_id === project.id).length || 0;
          
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
                  <div className="text-right space-y-2">
                    <Badge variant={variant}>{status}</Badge>
                    <div className="text-sm text-muted-foreground">
                      KSh {project.estimated_cost.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Funded by Community Budget
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

                {/* Project Info */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Community Metrics */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{projectFeedback.filter(f => f.proposal_id === project.id).length} feedback</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{avgRating > 0 ? avgRating.toFixed(1) : 'No ratings'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project.total_tokens} votes</span>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {project.title}
                          <Badge variant={variant}>{status}</Badge>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="timeline">Timeline</TabsTrigger>
                          <TabsTrigger value="photos">Photos</TabsTrigger>
                          <TabsTrigger value="feedback">Community</TabsTrigger>
                        </TabsList>
                        
                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Location</Label>
                              <p className="text-sm text-muted-foreground">{project.address}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Budget</Label>
                              <p className="text-sm text-muted-foreground">KSh {project.estimated_cost.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Progress</Label>
                              <div className="space-y-1">
                                <Progress value={progress} className="h-2" />
                                <p className="text-sm text-muted-foreground">{progress}% complete</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Category</Label>
                              <p className="text-sm text-muted-foreground">{project.category}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          </div>
                        </TabsContent>
                        
                        {/* Timeline Tab */}
                        <TabsContent value="timeline" className="space-y-4">
                          <h4 className="font-medium">Project Updates</h4>
                          <div className="space-y-4">
                            {projectUpdates.length > 0 ? (
                              projectUpdates.map((update, index) => (
                                <div key={update.id} className="flex gap-3">
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{update.title}</div>
                                    <div className="text-muted-foreground text-xs mb-1">
                                      {new Date(update.created_at).toLocaleDateString()}
                                      {update.progress_percent && ` • ${update.progress_percent}% complete`}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{update.description}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No updates available yet.</p>
                            )}
                          </div>
                        </TabsContent>
                        
                        {/* Photos Tab */}
                        <TabsContent value="photos" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Before Photos</h4>
                              <div className="bg-muted/20 rounded-lg p-8 text-center">
                                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No before photos uploaded</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Progress Photos</h4>
                              <div className="bg-muted/20 rounded-lg p-8 text-center">
                                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No progress photos uploaded</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        {/* Community Feedback Tab */}
                        <TabsContent value="feedback" className="space-y-4">
                          <div className="space-y-4">
                            <div className="bg-muted/20 rounded-lg p-4">
                              <h4 className="font-medium mb-2">Leave Your Feedback</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="rating" className="text-sm">Rating</Label>
                                  <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className={`p-1 ${star <= newRating ? 'text-yellow-500' : 'text-gray-300'}`}
                                      >
                                        <Star className="h-4 w-4 fill-current" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="feedback" className="text-sm">Your Feedback</Label>
                                  <Textarea
                                    id="feedback"
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                    placeholder="Share your thoughts on this project..."
                                    className="mt-1"
                                  />
                                </div>
                                <Button onClick={submitFeedback} disabled={!newFeedback.trim()}>
                                  Submit Feedback
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Community Feedback</h4>
                              <div className="space-y-3">
                                {projectFeedback.length > 0 ? (
                                  projectFeedback.map((feedback) => (
                                    <div key={feedback.id} className="border rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="flex gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                              key={star} 
                                              className={`h-3 w-3 ${star <= feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(feedback.created_at).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm">{feedback.feedback_text}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No feedback yet. Be the first to share your thoughts!</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sortedProjects.filter(p => (p.current_progress || 0) === 100).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sortedProjects.filter(p => (p.current_progress || 0) > 0 && (p.current_progress || 0) < 100).length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {sortedProjects.filter(p => (p.current_progress || 0) === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Planning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sortedProjects.length > 0 
                  ? ((sortedProjects.reduce((acc, p) => acc + (p.current_progress || 0), 0) / sortedProjects.length).toFixed(1) + '%')
                  : '0%'
                }
              </div>
              <div className="text-sm text-muted-foreground">Avg Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};