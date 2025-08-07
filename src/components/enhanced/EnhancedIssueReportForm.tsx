import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Camera, Mic, MapPin, ChevronRight, Upload, Eye, EyeOff, 
  AlertTriangle, Info, CheckCircle, MicOff, Play, Pause,
  FileText, Video, Zap, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateIssue } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface EnhancedIssueReportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const issueCategories = [
  {
    id: 'sewage',
    label: 'Sewage & Drainage',
    description: 'Blocked drains, sewage overflow, water stagnation',
    icon: '🚰',
    defaultPriority: 3,
    subcategories: [
      'Blocked drainage',
      'Sewage overflow',
      'Broken manholes',
      'Water stagnation',
      'Foul odors'
    ]
  },
  {
    id: 'noise',
    label: 'Noise Pollution',
    description: 'Loud music, construction noise, traffic noise',
    icon: '🔊',
    defaultPriority: 2,
    subcategories: [
      'Loud music/parties',
      'Construction noise',
      'Traffic noise',
      'Industrial noise',
      'Early morning disturbance'
    ]
  },
  {
    id: 'construction',
    label: 'Illegal Construction',
    description: 'Unauthorized buildings, zoning violations',
    icon: '🏗️',
    defaultPriority: 4,
    subcategories: [
      'Unauthorized construction',
      'Building code violations',
      'Encroachment on public land',
      'Safety violations',
      'Incomplete construction'
    ]
  },
  {
    id: 'power',
    label: 'Power & Utilities',
    description: 'Power outages, damaged lines, transformer issues',
    icon: '⚡',
    defaultPriority: 3,
    subcategories: [
      'Power outages',
      'Damaged power lines',
      'Transformer issues',
      'Street light failures',
      'Electrical hazards'
    ]
  },
  {
    id: 'roads',
    label: 'Road & Transport',
    description: 'Potholes, traffic lights, road maintenance',
    icon: '🛣️',
    defaultPriority: 3,
    subcategories: [
      'Potholes',
      'Broken traffic lights',
      'Missing road signs',
      'Poor road surface',
      'Blocked roads'
    ]
  },
  {
    id: 'waste',
    label: 'Waste Management',
    description: 'Uncollected garbage, illegal dumping',
    icon: '🗑️',
    defaultPriority: 2,
    subcategories: [
      'Uncollected garbage',
      'Illegal dumping',
      'Overflowing bins',
      'Littering',
      'Hazardous waste'
    ]
  },
  {
    id: 'safety',
    label: 'Public Safety',
    description: 'Security concerns, unsafe conditions',
    icon: '🛡️',
    defaultPriority: 4,
    subcategories: [
      'Poor lighting',
      'Unsafe structures',
      'Security concerns',
      'Vandalism',
      'Public disturbance'
    ]
  },
  {
    id: 'environment',
    label: 'Environmental',
    description: 'Pollution, tree cutting, air quality',
    icon: '🌱',
    defaultPriority: 3,
    subcategories: [
      'Air pollution',
      'Water pollution',
      'Illegal tree cutting',
      'Soil contamination',
      'Wildlife disturbance'
    ]
  }
];

const priorityLevels = [
  { 
    id: 1, 
    label: 'Low', 
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Minor inconvenience, no immediate action needed'
  },
  { 
    id: 2, 
    label: 'Medium', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Moderate issue affecting quality of life'
  },
  { 
    id: 3, 
    label: 'High', 
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'Significant issue requiring prompt attention'
  },
  { 
    id: 4, 
    label: 'Urgent', 
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Serious issue affecting safety or health'
  },
  { 
    id: 5, 
    label: 'Emergency', 
    color: 'bg-red-200 text-red-900 border-red-300',
    description: 'Immediate danger, requires emergency response'
  }
];

export const EnhancedIssueReportForm: React.FC<EnhancedIssueReportFormProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    urgency_level: 2,
    location: null as { lat: number; lng: number } | null,
    address: '',
    landmark: '',
    images: [] as File[],
    documents: [] as File[],
    videos: [] as File[],
    audioUrl: '',
    isEmergency: false,
    contactInfo: {
      phone: '',
      email: '',
      preferredContact: 'none' as 'phone' | 'email' | 'none'
    },
    followUpPreference: true,
    additionalNotes: ''
  });

  const createIssueMutation = useCreateIssue();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = issueCategories.find(c => c.id === categoryId);
    setFormData(prev => ({ 
      ...prev, 
      category: categoryId,
      urgency_level: category?.defaultPriority || 2,
      subcategory: ''
    }));
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
          toast.error('Unable to get your location. You can enter the address manually.');
          setStep(3); // Allow manual entry
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
      setStep(3);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'documents' | 'videos') => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], ...newFiles]
      }));
    }
  };

  const removeFile = (index: number, type: 'images' | 'documents' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please provide a title for the issue');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please provide a description of the issue');
      return false;
    }
    if (!isAnonymous && formData.followUpPreference && 
        formData.contactInfo.preferredContact !== 'none' && 
        !formData.contactInfo[formData.contactInfo.preferredContact]) {
      toast.error('Please provide contact information for follow-up');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // TODO: Upload files to Supabase storage
      const imageUrls: string[] = [];
      const documentUrls: string[] = [];
      
      await createIssueMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        location: formData.location || { lat: 0, lng: 0 }, // Default location if not provided
        address: formData.address,
        image_urls: imageUrls,
        urgency_level: formData.urgency_level,
      });

      toast.success(
        isAnonymous 
          ? 'Anonymous report submitted successfully!' 
          : 'Issue reported successfully! You earned 10 civic credits.'
      );
      setStep(6); // Success step
    } catch (error) {
      toast.error('Failed to report issue. Please try again.');
      console.error('Error reporting issue:', error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsAnonymous(false);
    setAudioBlob(null);
    setFormData({
      category: '',
      subcategory: '',
      title: '',
      description: '',
      urgency_level: 2,
      location: null,
      address: '',
      landmark: '',
      images: [],
      documents: [],
      videos: [],
      audioUrl: '',
      isEmergency: false,
      contactInfo: {
        phone: '',
        email: '',
        preferredContact: 'none'
      },
      followUpPreference: true,
      additionalNotes: ''
    });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentCategory = issueCategories.find(c => c.id === formData.category);

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
        className="w-full bg-white rounded-t-xl shadow-xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-poppins font-semibold">
              {isAnonymous ? 'Anonymous Report' : 'Report Issue'}
            </h2>
            {formData.isEmergency && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Emergency
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="anonymous-toggle" className="text-sm">Anonymous</Label>
              <Switch
                id="anonymous-toggle"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                    step >= stepNum 
                      ? 'bg-primary text-white' 
                      : step === stepNum - 1 
                        ? 'bg-primary/20 text-primary border-2 border-primary' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div
                    className={`w-8 h-0.5 transition-colors ${
                      step > stepNum ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {step === 1 && 'Select Category'}
            {step === 2 && 'Set Location'}
            {step === 3 && 'Issue Details'}
            {step === 4 && 'Add Evidence'}
            {step === 5 && 'Review & Submit'}
            {step === 6 && 'Confirmation'}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div>
              <h3 className="font-semibold mb-4">What type of issue are you reporting?</h3>
              <div className="space-y-3">
                {issueCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {category.label}
                          </p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div>
              <h3 className="font-semibold mb-4">Where is this issue located?</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter street address or building name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="landmark">Nearby Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="e.g., Near ABC Mall, Opposite XYZ School"
                    className="mt-1"
                  />
                </div>
                
                <Button
                  onClick={handleLocationSelect}
                  className="w-full jiji-touch-target"
                  variant="outline"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {formData.location ? 'Update Current Location' : 'Use Current Location'}
                </Button>
                
                {formData.location && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Location captured: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setStep(3)}
                  className="w-full jiji-touch-target"
                  disabled={!formData.address.trim() && !formData.location}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Issue Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Provide details about the issue</h3>
              
              {/* Subcategory Selection */}
              {currentCategory && currentCategory.subcategories.length > 0 && (
                <div>
                  <Label>Specific Issue Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {currentCategory.subcategories.map((sub, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData(prev => ({ ...prev, subcategory: sub }))}
                        className={`px-3 py-2 rounded-lg text-sm text-left border transition-colors ${
                          formData.subcategory === sub 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief, clear description of the issue"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about the issue, when it started, how it affects you..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Priority Level</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, isEmergency: !prev.isEmergency }))}
                    className={formData.isEmergency ? 'text-red-600' : ''}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    {formData.isEmergency ? 'Emergency Mode' : 'Mark as Emergency'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {priorityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setFormData(prev => ({ ...prev, urgency_level: level.id }))}
                      className={`w-full px-3 py-3 rounded-lg text-left border transition-colors ${
                        formData.urgency_level === level.id 
                          ? `${level.color} border-current` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{level.label}</span>
                          <p className="text-xs opacity-75 mt-1">{level.description}</p>
                        </div>
                        {level.id >= 4 && <AlertTriangle className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Recording */}
              <div>
                <Label>Voice Note (Optional)</Label>
                <div className="mt-2 space-y-2">
                  {!audioBlob ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-full ${isRecording ? 'border-red-300 bg-red-50' : ''}`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording ({formatTime(recordingTime)})
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Record Voice Note
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Voice note recorded</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAudioBlob(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => setStep(4)}
                className="w-full jiji-touch-target"
                disabled={!formData.title.trim() || !formData.description.trim()}
              >
                Continue to Evidence
              </Button>
            </div>
          )}

          {/* Step 4: Evidence Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold">Add evidence to support your report</h3>
              
              {/* Photos */}
              <div>
                <Label>Photos</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="text-center">
                      <Camera className="w-6 h-6 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-1">Add photos of the issue</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'images')}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => removeFile(index, 'images')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <Label>Documents (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Relevant documents, permits, previous correspondence
                </p>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="text-center">
                      <FileText className="w-5 h-5 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Upload documents</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e, 'documents')}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'documents')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <Label>Videos (Optional)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="text-center">
                      <Video className="w-5 h-5 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Add videos</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'videos')}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.videos.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.videos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, 'videos')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information for Non-Anonymous Reports */}
              {!isAnonymous && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Follow-up Contact (Optional)</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="follow-up"
                        checked={formData.followUpPreference}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          followUpPreference: checked,
                          contactInfo: checked ? prev.contactInfo : { ...prev.contactInfo, preferredContact: 'none' }
                        }))}
                      />
                      <Label htmlFor="follow-up" className="text-sm">
                        I want to receive updates on this issue
                      </Label>
                    </div>

                    {formData.followUpPreference && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {(['none', 'phone', 'email'] as const).map((method) => (
                            <button
                              key={method}
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                contactInfo: { ...prev.contactInfo, preferredContact: method }
                              }))}
                              className={`px-3 py-2 rounded text-sm ${
                                formData.contactInfo.preferredContact === method
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-white border border-gray-300'
                              }`}
                            >
                              {method === 'none' ? 'No contact' : method === 'phone' ? 'Phone' : 'Email'}
                            </button>
                          ))}
                        </div>

                        {formData.contactInfo.preferredContact === 'phone' && (
                          <Input
                            placeholder="Phone number"
                            value={formData.contactInfo.phone}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              contactInfo: { ...prev.contactInfo, phone: e.target.value }
                            }))}
                          />
                        )}

                        {formData.contactInfo.preferredContact === 'email' && (
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={formData.contactInfo.email}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              contactInfo: { ...prev.contactInfo, email: e.target.value }
                            }))}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setStep(5)}
                className="w-full jiji-touch-target"
              >
                Review Report
              </Button>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review your report</h3>
              
              <div className="space-y-4">
                {/* Issue Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{formData.title}</h4>
                    <Badge className={priorityLevels.find(p => p.id === formData.urgency_level)?.color}>
                      {priorityLevels.find(p => p.id === formData.urgency_level)?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                  
                  {formData.subcategory && (
                    <div className="mt-2">
                      <Badge variant="outline">{formData.subcategory}</Badge>
                    </div>
                  )}
                </div>

                {/* Category and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <p className="text-sm font-medium">
                      {currentCategory?.label}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Location</Label>
                    <p className="text-sm font-medium">
                      {formData.address || 'GPS coordinates provided'}
                    </p>
                  </div>
                </div>

                {/* Evidence Summary */}
                <div>
                  <Label className="text-sm text-muted-foreground">Evidence Attached</Label>
                  <div className="flex items-center space-x-4 mt-1">
                    {formData.images.length > 0 && (
                      <span className="text-sm">📸 {formData.images.length} photos</span>
                    )}
                    {formData.documents.length > 0 && (
                      <span className="text-sm">📄 {formData.documents.length} documents</span>
                    )}
                    {formData.videos.length > 0 && (
                      <span className="text-sm">🎥 {formData.videos.length} videos</span>
                    )}
                    {audioBlob && (
                      <span className="text-sm">🎤 Voice note</span>
                    )}
                  </div>
                </div>

                {/* Anonymous/Contact Info */}
                <div className="p-3 border rounded-lg">
                  {isAnonymous ? (
                    <div className="flex items-center text-sm">
                      <EyeOff className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>This report will be submitted anonymously</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Shield className="w-4 h-4 mr-2 text-green-600" />
                        <span>Report linked to your account</span>
                      </div>
                      {formData.followUpPreference && formData.contactInfo.preferredContact !== 'none' && (
                        <p className="text-xs text-muted-foreground">
                          Updates will be sent via {formData.contactInfo.preferredContact}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Emergency Notice */}
                {formData.isEmergency && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-sm text-red-800">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Emergency report will be prioritized for immediate response</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(4)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 jiji-touch-target"
                  disabled={createIssueMutation.isPending}
                >
                  {createIssueMutation.isPending ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Report Submitted Successfully!</h3>
                <p className="text-muted-foreground mt-2">
                  {isAnonymous 
                    ? 'Your anonymous report has been submitted. Government officials will be notified to address the issue.'
                    : 'Your issue has been reported successfully and you earned 10 civic credits! Government officials will be notified and you\'ll receive updates on progress.'
                  }
                </p>
              </div>

              {!isAnonymous && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💰 You earned 10 civic credits for reporting this issue!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button onClick={resetForm} className="w-full jiji-touch-target">
                  Report Another Issue
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Back to Map
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};