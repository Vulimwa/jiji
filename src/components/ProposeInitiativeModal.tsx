
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lightbulb, Target, Users, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProposeInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposeInitiativeModal: React.FC<ProposeInitiativeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goals: '',
    targetSupport: '',
    estimatedCost: '',
    timeline: '',
    category: 'infrastructure',
    priority: 'medium'
  });

  const categories = [
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'environment', label: 'Environment' },
    { id: 'safety', label: 'Safety & Security' },
    { id: 'education', label: 'Education' },
    { id: 'health', label: 'Health' },
    { id: 'economic', label: 'Economic Development' }
  ];

  const priorities = [
    { id: 'high', label: 'High Priority', color: 'text-red-600' },
    { id: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { id: 'low', label: 'Low Priority', color: 'text-green-600' }
  ];

  const handleSubmit = () => {
    console.log('Proposing initiative:', formData);
    setFormData({
      title: '',
      description: '',
      goals: '',
      targetSupport: '',
      estimatedCost: '',
      timeline: '',
      category: 'infrastructure',
      priority: 'medium'
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
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Propose Initiative</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 2 && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-semibold mb-4">Basic Information</h3>
              
              <div>
                <Label htmlFor="title">Initiative Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your proposal?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full mt-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <div className="mt-2 space-y-2">
                  {priorities.map(priority => (
                    <label key={priority.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.id}
                        checked={formData.priority === priority.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="text-primary focus:ring-primary"
                      />
                      <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your initiative in detail..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold mb-4">Implementation Details</h3>
              
              <div>
                <Label htmlFor="goals">Expected Outcomes *</Label>
                <div className="flex items-start space-x-2 mt-1">
                  <Target className="w-5 h-5 text-gray-400 mt-2" />
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    placeholder="What do you hope to achieve?"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetSupport">Target Support</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="w-5 h-5 text-gray-400" />
                  <Input
                    id="targetSupport"
                    value={formData.targetSupport}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetSupport: e.target.value }))}
                    placeholder="How many supporters needed?"
                    type="number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="estimatedCost">Estimated Cost (KES)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <Input
                    id="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                    placeholder="Rough cost estimate"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="e.g., 3-6 months"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!formData.goals.trim()}
                >
                  Submit Proposal
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
