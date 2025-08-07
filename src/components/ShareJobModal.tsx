
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Share2, Copy, MessageSquare, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareJobModal: React.FC<ShareJobModalProps> = ({ isOpen, onClose }) => {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'sms'>('link');
  const [message, setMessage] = useState('I found a great job opportunity that might interest you!');
  const [recipients, setRecipients] = useState('');

  const jobDetails = {
    title: "Community Garden Maintenance",
    payment: "KES 8,000",
    location: "Kilimani Park",
    description: "Monthly maintenance of community garden including weeding, watering, and general upkeep."
  };

  const handleCopyLink = () => {
    const jobLink = `${window.location.origin}/jobs/123`;
    navigator.clipboard.writeText(jobLink);
    alert('Job link copied to clipboard!');
  };

  const handleShare = () => {
    const shareText = `${message}\n\n${jobDetails.title}\nPayment: ${jobDetails.payment}\nLocation: ${jobDetails.location}\n\n${jobDetails.description}`;
    
    if (shareMethod === 'link' && navigator.share) {
      navigator.share({
        title: jobDetails.title,
        text: shareText,
        url: `${window.location.origin}/jobs/123`
      }).catch(() => {
        handleCopyLink();
      });
    } else {
      console.log('Sharing via', shareMethod, 'to:', recipients);
      alert(`Job shared successfully via ${shareMethod}!`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Share Job Opportunity</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{jobDetails.title}</h3>
            <div className="text-sm space-y-1">
              <p><strong>Payment:</strong> {jobDetails.payment}</p>
              <p><strong>Location:</strong> {jobDetails.location}</p>
              <p className="text-gray-600">{jobDetails.description}</p>
            </div>
          </div>

          {/* Share Method Selection */}
          <div>
            <Label className="text-sm font-medium">Share Method</Label>
            <div className="flex space-x-2 mt-2">
              {[
                { id: 'link', label: 'Copy Link', icon: Copy },
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'sms', label: 'SMS', icon: Phone }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setShareMethod(method.id as any)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    shareMethod === method.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients (for email/sms) */}
          {shareMethod !== 'link' && (
            <div>
              <Label htmlFor="recipients">
                {shareMethod === 'email' ? 'Email Addresses' : 'Phone Numbers'}
              </Label>
              <Input
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder={shareMethod === 'email' ? 'email1@example.com, email2@example.com' : '+254701234567, +254701234568'}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple entries with commas</p>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={shareMethod === 'link' ? handleCopyLink : handleShare} 
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {shareMethod === 'link' ? 'Copy Link' : `Share via ${shareMethod.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
