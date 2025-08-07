import React, { useState } from 'react';
import { Users, Plus, MapPin, Target, Calendar, Star, Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateGroupModal } from '@/components/CollaborationZone/CreateGroupModal';
import { GroupCard } from '@/components/CollaborationZone/GroupCard';
import { useCollaborationGroups } from '@/hooks/useCollaborationGroups';

const CollaborationZonePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: groups, isLoading } = useCollaborationGroups();

  const focusAreas = [
    'all',
    'Infrastructure',
    'Environment', 
    'SME Empowerment',
    'Security',
    'Health',
    'Education',
    'Transport'
  ];

  const filteredGroups = groups?.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFocus = selectedFocus === 'all' || group.issue_focus === selectedFocus;
    return matchesSearch && matchesFocus;
  }) || [];

  const stats = {
    totalGroups: groups?.length || 0,
    activeMembers: groups?.reduce((sum, group) => sum + (group.member_count || 0), 0) || 0,
    completedTasks: 127, // This would come from actual task data
    campaigns: 34 // This would come from actual campaign links
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Collaboration Zone</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join forces with your neighbors to tackle local challenges. Create or join community groups 
          working on issues that matter to you.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalGroups}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Groups</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.activeMembers}</span>
            </div>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.completedTasks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.campaigns}</span>
            </div>
            <p className="text-sm text-muted-foreground">Campaigns Supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search groups by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {focusAreas.map(focus => (
              <Button
                key={focus}
                variant={selectedFocus === focus ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFocus(focus)}
                className="capitalize"
              >
                {focus === 'all' ? 'All Issues' : focus}
              </Button>
            ))}
          </div>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedFocus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a community group!'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Call to Action Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Make a Difference?</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            Community organizing is more powerful when we work together. Start a group around 
            an issue you care about, or join existing efforts in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowCreateModal(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Start a Group
            </Button>
            <Button variant="outline" size="lg">
              <MapPin className="w-5 h-5 mr-2" />
              Browse by Area
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default CollaborationZonePage;