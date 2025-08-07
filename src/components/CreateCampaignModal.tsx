
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Target, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetSignatures: 100,
    location: '',
    meetingDate: '',
    tags: [] as string[],
    imageUrl: ''
  });

  const categories = [
    'Infrastructure', 'Environment', 'Safety', 'Education', 'Healthcare', 'Transportation'
  ];

  const handleSubmit = () => {
    console.log('Creating campaign:', formData);
    // Reset form and close
    setFormData({
      title: '',
      description: '',
      category: '',
      targetSignatures: 100,
      location: '',
      meetingDate: '',
      tags: [],
      imageUrl: ''
    });
    setStep(1);
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
          <h2 className="text-xl font-poppins font-bold">Create Campaign</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Campaign Details</h3>
              
              <div>
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Fix Broken Street Lights on Kindaruma Road"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue and what you want to achieve..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFormData(prev => ({ ...prev, category }))}
                      className={`p-2 text-sm rounded border text-left ${
                        formData.category === category
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Campaign Goals</h3>
              
              <div>
                <Label htmlFor="targetSignatures">Target Signatures</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <Input
                    id="targetSignatures"
                    type="number"
                    value={formData.targetSignatures}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      targetSignatures: parseInt(e.target.value) || 100 
                    }))}
                    min="10"
                    max="10000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Campaign Location</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Kindaruma Road, Kilimani"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meetingDate">Community Meeting Date (Optional)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <Input
                    id="meetingDate"
                    type="datetime-local"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, meetingDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Review & Launch</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium">{formData.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Category:</span>
                  <span className="font-medium">{formData.category || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Target Signatures:</span>
                  <span className="font-medium">{formData.targetSignatures}</span>
                </div>
                
                {formData.location && (
                  <div className="flex justify-between text-sm">
                    <span>Location:</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>📋 Next Steps:</strong> Your campaign will be reviewed and published within 24 hours. 
                  You'll receive notifications as people sign your petition.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                  Launch Campaign
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
