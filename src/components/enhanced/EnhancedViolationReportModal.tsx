import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, MapPin, Building2, Upload, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateZoningViolation } from '@/hooks/useZoningViolations';
import { toast } from 'sonner';
import maplibregl from 'maplibre-gl';

interface EnhancedViolationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedViolationReportModal: React.FC<EnhancedViolationReportModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  
  const [formData, setFormData] = useState({
    violationType: '',
    location: '',
    plot_number: '',
    developerName: '',
    buildingDescription: '',
    evidenceDescription: '',
    images: [] as string[],
    severity: 'medium',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const createViolation = useCreateZoningViolation();

  const violationTypes = [
    'Height Limit Exceeded',
    'Zoning Misuse',
    'Inadequate Parking',
    'Building Without Permit',
    'Environmental Violation',
    'Safety Code Violation'
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
      marker.current = new maplibregl.Marker({ color: '#E91E63' })
        .setLngLat([lng, lat])
        .addTo(map.current!);
    });
  };

  const handleSubmit = async () => {
    try {
      await createViolation.mutateAsync({
        title: `${formData.violationType} - ${formData.location}`,
        description: formData.buildingDescription,
        violation_type: formData.violationType,
        address: formData.location,
        plot_number: formData.plot_number,
        developer_name: formData.developerName,
        evidence_description: formData.evidenceDescription,
        severity: formData.severity,
        latitude: formData.latitude,
        longitude: formData.longitude,
        is_anonymous: isAnonymous,
        image_urls: formData.images,
      });

      toast.success('Zoning violation reported successfully!');
      
      // Reset form and close
      setFormData({
        violationType: '',
        location: '',
        plot_number: '',
        developerName: '',
        buildingDescription: '',
        evidenceDescription: '',
        images: [],
        severity: 'medium',
        latitude: null,
        longitude: null,
      });
      setStep(1);
      setIsAnonymous(false);
      onClose();
    } catch (error) {
      toast.error('Failed to report violation. Please try again.');
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
          <h2 className="text-xl font-poppins font-bold text-red-600">Report Zoning Violation</h2>
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
                    step >= stepNum ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-red-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="px-6 py-3 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Anonymous Reporting</h4>
              <p className="text-sm text-blue-600">Report without revealing your identity</p>
            </div>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
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

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={!formData.violationType}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Location Information</h3>
              
              <div>
                <Label htmlFor="location">Address/Location *</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter exact address or area description"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="plot_number">Plot Number (Optional)</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <Input
                    id="plot_number"
                    value={formData.plot_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, plot_number: e.target.value }))}
                    placeholder="e.g., LR 209/7/89"
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
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={!formData.location.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
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
                <Label htmlFor="developerName">Developer/Owner Name (Optional)</Label>
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

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={!formData.buildingDescription.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Review & Submit</h3>
              
              <div className="bg-red-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-red-800">{formData.violationType}</h4>
                  <p className="text-sm text-red-600 mt-1">{formData.location}</p>
                  {formData.plot_number && (
                    <p className="text-sm text-red-600">Plot: {formData.plot_number}</p>
                  )}
                </div>
                
                <div className="text-sm">
                  <p><strong>Building:</strong> {formData.buildingDescription}</p>
                  {formData.developerName && (
                    <p><strong>Developer:</strong> {formData.developerName}</p>
                  )}
                  <p><strong>Severity:</strong> <span className="capitalize">{formData.severity}</span></p>
                  <p><strong>Anonymous:</strong> {isAnonymous ? 'Yes' : 'No'}</p>
                  {formData.latitude && formData.longitude && (
                    <p><strong>GPS Location:</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important:</strong> False reports may result in account suspension. 
                  Please ensure all information is accurate.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={createViolation.isPending}
                >
                  {createViolation.isPending ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};