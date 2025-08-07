import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MapPin, 
  MessageCircle, 
  Calendar,
  Crown,
  UserPlus
} from 'lucide-react';
import { MicroTaskforce, useJoinTaskforce, useTaskforceMemberships } from '@/hooks/useMicroTaskforces';

interface MicroTaskforceCardProps {
  taskforce: MicroTaskforce;
}

export const MicroTaskforceCard: React.FC<MicroTaskforceCardProps> = ({
  taskforce,
}) => {
  const joinTaskforce = useJoinTaskforce();
  const { data: memberships = [] } = useTaskforceMemberships(taskforce.id);

  const handleJoin = () => {
    joinTaskforce.mutate(taskforce.id);
  };

  const getStatusColor = () => {
    switch (taskforce.status) {
      case 'active': return 'bg-success';
      case 'completed': return 'bg-primary';
      case 'paused': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {taskforce.title}
          </CardTitle>
          <Badge variant="outline" className={getStatusColor()}>
            {taskforce.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{taskforce.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Members */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Members
            </span>
            <span className="font-medium">
              {taskforce.current_members} / {taskforce.max_members}
            </span>
          </div>
          
          {memberships.length > 0 && (
            <div className="flex -space-x-2">
              {memberships.slice(0, 5).map((membership: any) => (
                <Avatar key={membership.id} className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={membership.user_profiles?.profile_image_url} />
                  <AvatarFallback className="text-xs">
                    {membership.user_profiles?.full_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {memberships.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{memberships.length - 5}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        {taskforce.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Within {taskforce.radius_meters}m radius</span>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {taskforce.chat_enabled && (
            <Badge variant="secondary" className="text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Badge>
          )}
          {taskforce.sms_enabled && (
            <Badge variant="secondary" className="text-xs">
              SMS Updates
            </Badge>
          )}
        </div>

        {/* Created Info */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Created {new Date(taskforce.created_at).toLocaleDateString()}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleJoin}
          disabled={joinTaskforce.isPending || taskforce.current_members >= taskforce.max_members}
          className="w-full"
          variant="outline"
        >
          {joinTaskforce.isPending ? (
            "Joining..."
          ) : taskforce.current_members >= taskforce.max_members ? (
            "Full"
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Join Taskforce
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};