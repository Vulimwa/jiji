import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, MapPin, Target, FileText, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateGroup } from '@/hooks/useCollaborationGroups';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_focus: '',
    address: '',
    group_type: 'public',
    tags: [] as string[],
    tagInput: '',
  });

  const { toast } = useToast();
  const createGroupMutation = useCreateGroup();

  const focusAreas = [
    'Infrastructure',
    'Environment', 
    'SME Empowerment',
    'Security',
    'Health',
    'Education',
    'Transport',
    'Housing',
    'Youth Development',
    'Senior Services'
  ];

  const suggestedGroups = [
    {
      title: 'Drainage Taskforce',
      description: 'Fix flooding issues in our area',
      focus: 'Infrastructure',
      reason: 'Based on 12 drainage reports in your area'
    },
    {
      title: 'Street Vendors Association',
      description: 'Support informal workers and vendors',
      focus: 'SME Empowerment',
      reason: 'Based on vendor activity near you'
    },
    {
      title: 'Noise Pollution Watch',
      description: 'Address noise complaints collectively',
      focus: 'Environment',
      reason: 'Based on 8 noise violation reports nearby'
    }
  ];

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a group",
          variant: "destructive"
        });
        return;
      }

      if (!formData.title || !formData.description || !formData.issue_focus) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await createGroupMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        issue_focus: formData.issue_focus,
        address: formData.address || null,
        group_type: formData.group_type,
        created_by: user.id,
        tags: formData.tags,
        privacy_settings: {
          join_approval_required: formData.group_type === 'private',
          public_activity: formData.group_type === 'public'
        }
      });

      toast({
        title: "Group created successfully!",
        description: "Your community group has been created and is now live"
      });

      onClose();
      setFormData({
        title: '',
        description: '',
        issue_focus: '',
        address: '',
        group_type: 'public',
        tags: [],
        tagInput: '',
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error creating group",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const useSuggestion = (suggestion: any) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      description: suggestion.description,
      issue_focus: suggestion.focus
    });
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
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Create Community Group</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Form Section */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-2">Group Name *</label>
                <Input
                  placeholder="e.g., Kilimani Drainage Taskforce"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  placeholder="Describe what your group aims to achieve..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              {/* Issue Focus */}
              <div>
                <label className="block text-sm font-medium mb-2">Issue Focus *</label>
                <div className="grid grid-cols-2 gap-2">
                  {focusAreas.map(focus => (
                    <Button
                      key={focus}
                      type="button"
                      variant={formData.issue_focus === focus ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({...formData, issue_focus: focus})}
                      className="justify-start text-xs"
                    >
                      {focus}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="e.g., Wood Avenue, Kilimani"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-sm font-medium mb-2">Group Type</label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.group_type === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({...formData, group_type: 'public'})}
                    className="flex-1"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Public
                  </Button>
                  <Button
                    type="button"
                    variant={formData.group_type === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({...formData, group_type: 'private'})}
                    className="flex-1"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Private
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Add tags..."
                    value={formData.tagInput}
                    onChange={(e) => setFormData({...formData, tagInput: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createGroupMutation.isPending}
              >
                {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </form>
          </div>

          {/* Suggestions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Suggested Groups
            </h3>
            
            <div className="space-y-3">
              {suggestedGroups.map((suggestion, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => useSuggestion(suggestion)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {suggestion.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.focus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">💡 Tips for Success</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Choose a clear, specific name</li>
                <li>• Focus on one main issue area</li>
                <li>• Include your neighborhood/area</li>
                <li>• Make goals actionable</li>
                <li>• Start with friends and neighbors</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};