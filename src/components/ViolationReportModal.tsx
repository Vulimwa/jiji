
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, MapPin, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ViolationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ViolationReportModal: React.FC<ViolationReportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    violationType: '',
    location: '',
    developerName: '',
    buildingDescription: '',
    evidenceDescription: '',
    images: [] as string[],
    severity: 'medium',
    reporterContact: ''
  });

  const violationTypes = [
    'Height Limit Exceeded',
    'Zoning Misuse',
    'Inadequate Parking',
    'Building Without Permit',
    'Environmental Violation',
    'Safety Code Violation'
  ];

  const handleSubmit = () => {
    console.log('Reporting violation:', formData);
    // Reset form and close
    setFormData({
      violationType: '',
      location: '',
      developerName: '',
      buildingDescription: '',
      evidenceDescription: '',
      images: [],
      severity: 'medium',
      reporterContact: ''
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
          <h2 className="text-xl font-poppins font-bold text-red-600">Report Zoning Violation</h2>
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
                    step >= stepNum ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-red-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Violation Details</h3>
              
              <div>
                <Label>Type of Violation *</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {violationTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, violationType: type }))}
                      className={`p-3 text-sm rounded border text-left ${
                        formData.violationType === type
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter exact address or plot number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="developerName">Developer/Owner Name</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <Input
                    id="developerName"
                    value={formData.developerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, developerName: e.target.value }))}
                    placeholder="If known"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={!formData.violationType || !formData.location}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Evidence & Description</h3>
              
              <div>
                <Label htmlFor="buildingDescription">Building Description *</Label>
                <Textarea
                  id="buildingDescription"
                  value={formData.buildingDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, buildingDescription: e.target.value }))}
                  placeholder="Describe the building and the violation you observed..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="evidenceDescription">Evidence Description</Label>
                <Textarea
                  id="evidenceDescription"
                  value={formData.evidenceDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, evidenceDescription: e.target.value }))}
                  placeholder="Describe what evidence you have (photos, measurements, etc.)"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label>Severity Level</Label>
                <div className="flex space-x-2 mt-2">
                  {[
                    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
                    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                    { id: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-200' }
                  ].map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData(prev => ({ ...prev, severity: level.id }))}
                      className={`px-3 py-1.5 text-sm rounded border ${
                        formData.severity === level.id 
                          ? level.color 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Upload Evidence Photos</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photos</p>
                  <input type="file" multiple accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={!formData.buildingDescription.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Review & Submit</h3>
              
              <div className="bg-red-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-red-800">{formData.violationType}</h4>
                  <p className="text-sm text-red-600 mt-1">{formData.location}</p>
                </div>
                
                <div className="text-sm">
                  <p><strong>Building:</strong> {formData.buildingDescription}</p>
                  {formData.developerName && (
                    <p><strong>Developer:</strong> {formData.developerName}</p>
                  )}
                  <p><strong>Severity:</strong> <span className="capitalize">{formData.severity}</span></p>
                </div>
              </div>

              <div>
                <Label htmlFor="reporterContact">Your Contact (Optional)</Label>
                <Input
                  id="reporterContact"
                  value={formData.reporterContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
                  placeholder="Email or phone for follow-up"
                  className="mt-1"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important:</strong> False reports may result in account suspension. 
                  Please ensure all information is accurate.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-red-500 hover:bg-red-600">
                  Submit Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
