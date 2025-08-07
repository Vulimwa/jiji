
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Mic, MapPin, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateIssue } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface IssueReportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: 'sewage', label: 'Sewage & Drainage', description: 'Blocked drains, sewage overflow' },
  { id: 'noise', label: 'Noise Pollution', description: 'Loud music, construction noise' },
  { id: 'construction', label: 'Illegal Construction', description: 'Unauthorized buildings, violations' },
  { id: 'power', label: 'Power Issues', description: 'Outages, damaged lines' },
  { id: 'roads', label: 'Road Problems', description: 'Potholes, traffic lights' },
  { id: 'waste', label: 'Waste Management', description: 'Uncollected garbage, littering' },
  { id: 'lighting', label: 'Street Lighting', description: 'Broken or missing lights' },
  { id: 'drainage', label: 'Drainage Issues', description: 'Poor drainage, flooding' },
  { id: 'other', label: 'Other Issues', description: 'Any other civic concerns' },
];

const priorityLevels = [
  { id: 1, label: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 2, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 3, label: 'High', color: 'bg-orange-100 text-orange-800' },
  { id: 4, label: 'Urgent', color: 'bg-red-100 text-red-800' },
  { id: 5, label: 'Critical', color: 'bg-red-200 text-red-900' },
];

export const IssueReportForm: React.FC<IssueReportFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    urgency_level: 2,
    location: null as { lat: number; lng: number } | null,
    address: '',
    images: [] as string[],
    audioUrl: '',
  });

  const createIssueMutation = useCreateIssue();

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    setStep(2);
  };

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setStep(3);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please try again.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In production, upload to Supabase storage
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.location) {
      toast.error('Location is required');
      return;
    }

    try {
      await createIssueMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        location: formData.location,
        address: formData.address,
        image_urls: formData.images,
        urgency_level: formData.urgency_level,
      });

      toast.success('Issue reported successfully! You earned 10 civic credits.');
      setStep(5); // Success step
    } catch (error) {
      toast.error('Failed to report issue. Please try again.');
      console.error('Error reporting issue:', error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      category: '',
      title: '',
      description: '',
      urgency_level: 2,
      location: null,
      address: '',
      images: [],
      audioUrl: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full bg-white rounded-t-xl shadow-xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-poppins font-semibold">Report Issue</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-8 h-0.5 ${
                      step > stepNum ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {step === 1 && (
            <div>
              <h3 className="font-semibold mb-4">What type of issue are you reporting?</h3>
              <div className="space-y-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.label}</p>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-semibold mb-4">Where is this issue located?</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address (Optional)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter street address or landmark"
                    className="mt-1"
                  />
                </div>
                
                <Button
                  onClick={handleLocationSelect}
                  className="w-full jiji-touch-target"
                  variant="outline"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Use Current Location
                </Button>
                
                {formData.location && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      Location captured: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Provide details about the issue</h3>
              
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details about the issue"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Priority Level</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {priorityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData(prev => ({ ...prev, urgency_level: level.id }))}
                      className={`px-3 py-2 rounded-lg text-sm text-center ${
                        formData.urgency_level === level.id ? level.color : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Add Photos (Optional)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="text-center">
                      <Camera className="w-6 h-6 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-1">Tap to add photos</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full aspect-square object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStep(4)}
                className="w-full jiji-touch-target"
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review your report</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{formData.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Category:</span>
                  <span className="text-sm font-medium">
                    {categories.find(c => c.id === formData.category)?.label}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Priority:</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    priorityLevels.find(p => p.id === formData.urgency_level)?.color
                  }`}>
                    {priorityLevels.find(p => p.id === formData.urgency_level)?.label}
                  </span>
                </div>

                {formData.address && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Address:</span>
                    <span className="text-sm font-medium">{formData.address}</span>
                  </div>
                )}

                {formData.images.length > 0 && (
                  <div>
                    <span className="text-sm">Photos attached: {formData.images.length}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full jiji-touch-target"
                disabled={createIssueMutation.isPending}
              >
                {createIssueMutation.isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Report Submitted!</h3>
                <p className="text-muted-foreground mt-2">
                  Your issue has been reported successfully and you earned 10 civic credits! 
                  Government officials will be notified and you'll receive updates on progress.
                </p>
              </div>

              <Button onClick={resetForm} className="w-full jiji-touch-target">
                Report Another Issue
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
