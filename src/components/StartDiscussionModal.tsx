
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare, Users, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StartDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartDiscussionModal: React.FC<StartDiscussionModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [location, setLocation] = useState('');

  const categories = [
    { id: 'general', label: 'General Discussion' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'safety', label: 'Safety & Security' },
    { id: 'environment', label: 'Environment' },
    { id: 'business', label: 'Local Business' },
    { id: 'events', label: 'Community Events' }
  ];

  const handleSubmit = () => {
    console.log('Starting discussion:', { title, description, category, location });
    setTitle('');
    setDescription('');
    setCategory('general');
    setLocation('');
    onClose();
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
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Start Discussion</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="title">Discussion Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Tag className="w-5 h-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-5 h-5 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Specific area in Kilimani"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about the discussion topic..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Users className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Community Guidelines</p>
                <ul className="space-y-1 text-xs">
                  <li>• Keep discussions respectful and constructive</li>
                  <li>• Focus on community issues and solutions</li>
                  <li>• Avoid personal attacks or inappropriate content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!title.trim() || !description.trim()}
            >
              Start Discussion
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
