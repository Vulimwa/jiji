
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Briefcase, MapPin, Star, Upload, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WorkerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkerRegistrationModal: React.FC<WorkerRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    services: [] as string[],
    experience: '',
    location: '',
    description: '',
    availability: 'full-time',
    profileImage: '',
    certifications: [] as string[]
  });

  const availableServices = [
    'Plumbing', 'Electrical Work', 'Carpentry', 'Painting', 'Masonry',
    'Gardening', 'Cleaning', 'Security', 'Catering', 'Tailoring',
    'Phone Repair', 'Computer Repair', 'Welding', 'Automotive'
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = () => {
    console.log('Registering worker:', formData);
    // Reset form and close
    setFormData({
      fullName: '',
      phone: '',
      idNumber: '',
      services: [],
      experience: '',
      location: '',
      description: '',
      availability: 'full-time',
      profileImage: '',
      certifications: []
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
          <h2 className="text-xl font-poppins font-bold">Worker Registration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
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
              <h3 className="font-semibold mb-4">Personal Information</h3>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 712 345 678"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="idNumber">National ID Number *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder="Enter your ID number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Kilimani, Nairobi"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.fullName.trim() || !formData.phone.trim() || !formData.idNumber.trim()}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Services & Skills</h3>
              
              <div>
                <Label>Select Your Services *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {availableServices.map(service => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-2 text-sm rounded border text-left ${
                        formData.services.includes(service)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formData.services.length} services
                </p>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="e.g., 5 years"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Availability</Label>
                <div className="flex space-x-2 mt-2">
                  {['full-time', 'part-time', 'weekends'].map(availability => (
                    <button
                      key={availability}
                      onClick={() => setFormData(prev => ({ ...prev, availability }))}
                      className={`px-3 py-1.5 text-sm rounded border capitalize ${
                        formData.availability === availability
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {availability.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1"
                  disabled={formData.services.length === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Profile Details</h3>
              
              <div>
                <Label htmlFor="description">About Your Services</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your experience, specializations, and what makes you unique..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label>Profile Photo (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload profile photo</p>
                  <input type="file" accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>📋 Next Step:</strong> Document verification will be required to complete your registration.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Review & Submit</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium">{formData.fullName}</h4>
                  <p className="text-sm text-muted-foreground">{formData.phone}</p>
                  <p className="text-sm text-muted-foreground">{formData.location}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Services:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.services.map(service => (
                      <span key={service} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Availability:</span>
                  <span className="font-medium capitalize">{formData.availability.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  <strong>🎉 Welcome to JijiSauti Worker Hub!</strong> You'll receive your digital ID within 48 hours after verification.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                  Complete Registration
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
