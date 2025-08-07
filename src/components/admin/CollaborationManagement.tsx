import React, { useState } from 'react';
import { Users2, Star, MapPin, Calendar, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCollaborationGroups } from '@/hooks/useCollaborationGroups';

export const CollaborationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: groups, isLoading } = useCollaborationGroups();

  const filteredGroups = groups?.filter(group =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.issue_focus.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalGroups: groups?.length || 0,
    verifiedGroups: groups?.filter(g => g.is_verified).length || 0,
    activeMembers: groups?.reduce((sum, group) => sum + (group.member_count || 0), 0) || 0,
    pendingApproval: groups?.filter(g => g.status === 'pending').length || 0,
  };

  const getIssueFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'infrastructure': return 'bg-blue-100 text-blue-700';
      case 'environment': return 'bg-green-100 text-green-700';
      case 'sme empowerment': return 'bg-purple-100 text-purple-700';
      case 'security': return 'bg-red-100 text-red-700';
      case 'health': return 'bg-pink-100 text-pink-700';
      case 'education': return 'bg-yellow-100 text-yellow-700';
      case 'transport': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-yellow-100 text-yellow-700';
      case 'disbanded': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users2 className="w-6 h-6 mr-2 text-primary" />
            Collaboration Groups Management
          </h2>
          <p className="text-muted-foreground">Monitor and manage community organizing groups</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                <p className="text-3xl font-bold">{stats.totalGroups}</p>
              </div>
              <Users2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Groups</p>
                <p className="text-3xl font-bold">{stats.verifiedGroups}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-3xl font-bold">{stats.activeMembers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-3xl font-bold">{stats.pendingApproval}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Groups</CardTitle>
          <CardDescription>Find and manage collaboration groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Search groups by name or focus area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Groups</CardTitle>
          <CardDescription>Manage community organizing groups and their activities</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="space-y-4">
              {filteredGroups.map(group => (
                <div key={group.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">{group.title}</h3>
                        {group.is_verified && (
                          <Badge className="bg-green-100 text-green-700">
                            <Star className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1">{group.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Badge className={getIssueFocusColor(group.issue_focus)}>
                        {group.issue_focus}
                      </Badge>
                    </div>
                    
                    {group.address && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{group.address}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Users2 className="w-4 h-4" />
                      <span>{group.member_count} members</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(group.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {group.tags && group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {group.tags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {group.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{group.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No groups found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No collaboration groups have been created yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};