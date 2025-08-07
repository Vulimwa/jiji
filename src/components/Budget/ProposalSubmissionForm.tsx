import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Upload, Mic, MicOff } from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useToast } from '@/hooks/use-toast';

interface ProposalSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  cycleId?: string;
}

const PROPOSAL_CATEGORIES = [
  'Infrastructure',
  'Safety',
  'Environment',
  'Education',
  'Healthcare',
  'Recreation',
  'Transportation',
  'Community Services',
  'Technology',
  'Other'
];

export const ProposalSubmissionForm: React.FC<ProposalSubmissionFormProps> = ({
  isOpen,
  onClose,
  cycleId
}) => {
  const { submitProposal } = useBudgetData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimated_cost: '',
    address: '',
    category: '',
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: 'Location Captured',
            description: 'Your location has been added to the proposal.',
          });
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please enter the address manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleVoiceRecording = () => {
    // Voice recording functionality would be implemented here
    // For now, just toggle the recording state
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      description: isRecording ? 'Voice note saved' : 'Speak your proposal description',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cycleId) {
      toast({
        title: 'Error',
        description: 'No active budget cycle found.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await submitProposal.mutateAsync({
        cycle_id: cycleId,
        title: formData.title,
        description: formData.description,
        estimated_cost: parseFloat(formData.estimated_cost),
        address: formData.address,
        category: formData.category,
        status: 'pending',
        submitted_by: '', // This will be set in the mutation
        image_urls: [],
      });
      
      onClose();
      setFormData({
        title: '',
        description: '',
        estimated_cost: '',
        address: '',
        category: '',
      });
      setLocation(null);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const isFormValid = formData.title && formData.description && formData.estimated_cost && 
                     formData.address && formData.category;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Community Project Proposal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="Give your project a clear, descriptive title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project category" />
              </SelectTrigger>
              <SelectContent>
                {PROPOSAL_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Project Description *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVoiceRecording}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Voice Note
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your project in detail. What problem does it solve? How will it benefit the community?"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              required
            />
            {isRecording && (
              <div className="text-sm text-red-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Recording in progress...
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="address">Project Location *</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                placeholder="Enter the project address or location"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Use GPS
              </Button>
            </div>
            {location && (
              <div className="text-sm text-green-600">
                Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
            )}
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost">Estimated Cost (KSh) *</Label>
            <Input
              id="cost"
              type="number"
              placeholder="Enter estimated project cost"
              value={formData.estimated_cost}
              onChange={(e) => handleInputChange('estimated_cost', e.target.value)}
              min="0"
              step="1000"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Supporting Images (Optional)</Label>
            <Card className="border-2 border-dashed border-muted-foreground/25">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Upload photos that show the current situation or location
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || submitProposal.isPending}
            >
              {submitProposal.isPending ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};