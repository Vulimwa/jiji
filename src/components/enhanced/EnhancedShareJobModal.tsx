import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, DollarSign, Users, Map, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import maplibregl from 'maplibre-gl';

interface EnhancedShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedShareJobModal: React.FC<EnhancedShareJobModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget_min: '',
    budget_max: '',
    required_skills: [] as string[],
    urgency: 'normal',
    civic_credits_reward: 0,
    duration_estimate: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    contact_info: {
      phone: '',
      email: '',
      preferred_contact: 'phone'
    },
    deadline: '',
    is_urgent: false
  });

  const [currentSkill, setCurrentSkill] = useState('');

  const categories = [
    'Plumbing', 'Electrical', 'Construction', 'Painting', 'Cleaning', 
    'Landscaping', 'Maintenance', 'Security', 'Delivery', 'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-700' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700' },
    { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' }
  ];

  // Initialize map for location picking
  const initializeMap = () => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [36.8219, -1.2921], // Kilimani center
      zoom: 14,
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      
      // Remove existing marker
      if (marker.current) {
        marker.current.remove();
      }
      
      // Add new marker
      marker.current = new maplibregl.Marker({ color: '#3B82F6' })
        .setLngLat([lng, lat])
        .addTo(map.current!);
    });
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.required_skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit the job to your database
      const jobData = {
        ...formData,
        budget_min: parseFloat(formData.budget_min) || 0,
        budget_max: parseFloat(formData.budget_max) || 0,
        civic_credits_reward: formData.is_urgent ? Math.max(formData.civic_credits_reward, 50) : formData.civic_credits_reward,
        posted_by: 'current_user_id', // Replace with actual user ID
        status: 'open',
        is_user_created: true,
      };

      console.log('Creating job:', jobData);
      toast.success('Job posted successfully! It will appear in available jobs.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget_min: '',
        budget_max: '',
        required_skills: [],
        urgency: 'normal',
        civic_credits_reward: 0,
        duration_estimate: '',
        address: '',
        latitude: null,
        longitude: null,
        contact_info: {
          phone: '',
          email: '',
          preferred_contact: 'phone'
        },
        deadline: '',
        is_urgent: false
      });
      
      setStep(1);
      onClose();
    } catch (error) {
      toast.error('Failed to post job. Please try again.');
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-poppins font-bold text-primary">Share Job Opportunity</h2>
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
                    step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
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
              <h3 className="font-semibold mb-4">Job Details</h3>
              
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Need plumber for emergency repair"
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what needs to be done, timeline, and any special requirements..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration Estimate</Label>
                  <Input
                    id="duration"
                    value={formData.duration_estimate}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_estimate: e.target.value }))}
                    placeholder="e.g., 2 hours, 1 day"
                  />
                </div>
              </div>

              <div>
                <Label>Required Skills</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Enter a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.required_skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
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
              <h3 className="font-semibold mb-4">Budget & Location</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_min">Minimum Budget (KES)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="budget_max">Maximum Budget (KES)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Priority Level</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {urgencyLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                      className={`p-3 text-sm rounded border text-left ${
                        formData.urgency === level.value
                          ? level.color + ' border-current'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-orange-900">Mark as Urgent</h4>
                  <p className="text-sm text-orange-600">Increases visibility and civic credits</p>
                </div>
                <Switch
                  checked={formData.is_urgent}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      is_urgent: checked,
                      urgency: checked ? 'urgent' : 'normal',
                      civic_credits_reward: checked ? Math.max(prev.civic_credits_reward, 50) : prev.civic_credits_reward
                    }));
                  }}
                />
              </div>

              <div>
                <Label htmlFor="address">Location/Address *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter job location"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Pick Location on Map (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowMap(!showMap);
                      if (!showMap) {
                        setTimeout(initializeMap, 100);
                      }
                    }}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </Button>
                </div>
                {showMap && (
                  <div className="h-64 rounded-lg border overflow-hidden">
                    <div ref={mapContainer} className="w-full h-full" />
                  </div>
                )}
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-green-600 mt-2">
                    📍 Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={!formData.address.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Contact & Finalize</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.contact_info.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact_info: { ...prev.contact_info, phone: e.target.value }
                    }))}
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_info.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact_info: { ...prev.contact_info, email: e.target.value }
                    }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Application Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="civic_credits">Civic Credits Reward</Label>
                <Input
                  id="civic_credits"
                  type="number"
                  min="0"
                  value={formData.civic_credits_reward}
                  onChange={(e) => setFormData(prev => ({ ...prev, civic_credits_reward: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Optional: Reward workers with civic credits for completing this job
                </p>
              </div>

              {/* Job Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Job Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Budget:</strong> KES {formData.budget_min} - {formData.budget_max}</p>
                  <p><strong>Priority:</strong> {urgencyLevels.find(l => l.value === formData.urgency)?.label}</p>
                  <p><strong>Location:</strong> {formData.address}</p>
                  {formData.required_skills.length > 0 && (
                    <p><strong>Skills:</strong> {formData.required_skills.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={!formData.contact_info.phone.trim()}
                >
                  Post Job
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};