import React from 'react';
import { Users, MapPin, Star, Calendar, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollaborationGroup } from '@/hooks/useCollaborationGroups';

interface GroupCardProps {
  group: CollaborationGroup;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {group.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getIssueFocusColor(group.issue_focus)}>
                {group.issue_focus}
              </Badge>
              {group.is_verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Star className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {group.description}
        </p>
        
        {/* Location */}
        {group.address && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{group.address}</span>
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{group.member_count}</span>
              <span className="text-muted-foreground">members</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">
                Since {formatDate(group.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {group.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{group.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Activity Indicator */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>Active community</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">
              Join Group
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};