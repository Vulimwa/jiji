
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Upload, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  violationId?: number;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({ 
  isOpen, 
  onClose, 
  violationId 
}) => {
  const [evidenceType, setEvidenceType] = useState<'photo' | 'video' | 'document'>('photo');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    console.log('Adding evidence:', { evidenceType, description, location, violationId });
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
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Add Evidence</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Evidence Type Selection */}
          <div>
            <Label className="text-sm font-medium">Evidence Type</Label>
            <div className="flex space-x-2 mt-2">
              {[
                { id: 'photo', label: 'Photo', icon: Camera },
                { id: 'video', label: 'Video', icon: Camera },
                { id: 'document', label: 'Document', icon: FileText }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setEvidenceType(type.id as any)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    evidenceType === type.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium">Upload {evidenceType}</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <input type="file" className="hidden" accept={
                evidenceType === 'photo' ? 'image/*' : 
                evidenceType === 'video' ? 'video/*' : 
                '.pdf,.doc,.docx'
              } />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Specific Location</Label>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-5 h-5 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was this evidence captured?"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this evidence shows..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              Add Evidence
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
