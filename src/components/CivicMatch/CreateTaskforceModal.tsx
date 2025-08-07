import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { MapPin, Users, MessageCircle, Smartphone } from 'lucide-react';
import { useCreateMicroTaskforce } from '@/hooks/useMicroTaskforces';

interface CreateTaskforceModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId?: string;
  campaignId?: string;
}

export const CreateTaskforceModal: React.FC<CreateTaskforceModalProps> = ({
  isOpen,
  onClose,
  issueId,
  campaignId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState([20]);
  const [radiusMeters, setRadiusMeters] = useState([500]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const createTaskforce = useCreateMicroTaskforce();

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    await createTaskforce.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      issue_id: issueId,
      campaign_id: campaignId,
      location: location ? `POINT(${location.lng} ${location.lat})` : undefined,
      radius_meters: radiusMeters[0],
      max_members: maxMembers[0],
      chat_enabled: chatEnabled,
      sms_enabled: smsEnabled,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setMaxMembers([20]);
    setRadiusMeters([500]);
    setChatEnabled(true);
    setSmsEnabled(false);
    setLocation(null);
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Create Micro Taskforce
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Taskforce Name</Label>
              <Input
                id="title"
                placeholder="e.g., Marcus Garvey Road Water Committee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the goals and activities of this taskforce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <Label>Location & Radius</Label>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" />
                {isGettingLocation ? 'Getting...' : 'Use Current Location'}
              </Button>
              {location && (
                <span className="text-sm text-muted-foreground flex items-center">
                  Location set ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Radius: {radiusMeters[0]}m</Label>
              <Slider
                value={radiusMeters}
                onValueChange={setRadiusMeters}
                max={2000}
                min={100}
                step={50}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Members within this radius will be prioritized for invitations
              </p>
            </div>
          </div>

          {/* Group Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Maximum Members: {maxMembers[0]}</Label>
              <Slider
                value={maxMembers}
                onValueChange={setMaxMembers}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <Label htmlFor="chat-enabled">Enable Chat</Label>
                </div>
                <Switch
                  id="chat-enabled"
                  checked={chatEnabled}
                  onCheckedChange={setChatEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Allow members to communicate through in-app chat
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <Label htmlFor="sms-enabled">SMS Notifications</Label>
                </div>
                <Switch
                  id="sms-enabled"
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Send important updates via SMS (requires phone verification)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createTaskforce.isPending || !title.trim() || !description.trim()}
              className="flex-1"
            >
              {createTaskforce.isPending ? 'Creating...' : 'Create Taskforce'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};