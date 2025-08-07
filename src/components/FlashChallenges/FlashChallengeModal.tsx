import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, FileText, Star, MapPin } from 'lucide-react';
import { FlashChallenge, useSubmitChallengeResponse } from '@/hooks/useFlashChallenges';

interface FlashChallengeModalProps {
  challenge: FlashChallenge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FlashChallengeModal: React.FC<FlashChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose,
}) => {
  const [submissionType, setSubmissionType] = useState('photo');
  const [textContent, setTextContent] = useState('');
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const submitResponse = useSubmitChallengeResponse();

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
    if (!challenge) return;

    let content: any = {};

    switch (submissionType) {
      case 'photo':
        // In a real app, you'd handle file upload here
        content = { type: 'photo', description: textContent };
        break;
      case 'text':
        content = { type: 'text', content: textContent };
        break;
      case 'rating':
        content = { type: 'rating', rating, comment: textContent };
        break;
      case 'vote':
        content = { type: 'vote', choice: textContent };
        break;
      case 'checkin':
        content = { type: 'checkin', note: textContent };
        break;
    }

    await submitResponse.mutateAsync({
      challengeId: challenge.id,
      submissionType,
      content,
      location: location || undefined,
    });

    onClose();
    setTextContent('');
    setRating(5);
    setLocation(null);
  };

  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Participate in: {challenge.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {challenge.description}
          </p>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location (Optional)</Label>
            <div className="flex gap-2">
              <Button
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
                  Location captured
                </span>
              )}
            </div>
          </div>

          {/* Submission Type Tabs */}
          <Tabs value={submissionType} onValueChange={setSubmissionType}>
            <TabsList className="grid w-full grid-cols-5">
              {challenge.submission_types.includes('photo') && (
                <TabsTrigger value="photo">
                  <Camera className="w-4 h-4" />
                </TabsTrigger>
              )}
              {challenge.submission_types.includes('text') && (
                <TabsTrigger value="text">
                  <FileText className="w-4 h-4" />
                </TabsTrigger>
              )}
              {challenge.submission_types.includes('rating') && (
                <TabsTrigger value="rating">
                  <Star className="w-4 h-4" />
                </TabsTrigger>
              )}
              {challenge.submission_types.includes('vote') && (
                <TabsTrigger value="vote">Vote</TabsTrigger>
              )}
              {challenge.submission_types.includes('checkin') && (
                <TabsTrigger value="checkin">Check-in</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="photo" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Take a photo to document the situation
                </p>
                <Button variant="outline">
                  Take Photo / Upload Image
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo-description">Description</Label>
                <Textarea
                  id="photo-description"
                  placeholder="Describe what you're documenting..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-report">Your Report</Label>
                <Textarea
                  id="text-report"
                  placeholder="Write your detailed report here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                />
              </div>
            </TabsContent>

            <TabsContent value="rating" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating-value">Rating (1-10)</Label>
                <Input
                  id="rating-value"
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating-comment">Comment (Optional)</Label>
                <Textarea
                  id="rating-comment"
                  placeholder="Add any additional comments..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="vote" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vote-choice">Your Choice</Label>
                <Input
                  id="vote-choice"
                  placeholder="Enter your vote/choice..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="checkin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkin-note">Check-in Note</Label>
                <Textarea
                  id="checkin-note"
                  placeholder="What are you checking in about?"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitResponse.isPending}
              className="flex-1"
            >
              {submitResponse.isPending ? 'Submitting...' : 'Submit Response'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};