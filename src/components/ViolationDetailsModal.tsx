
import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Building2, AlertTriangle, Camera, Eye, TrendingUp, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViolationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  violation: {
    id: number;
    title: string;
    location: string;
    developer: string;
    violationType: string;
    reportedDate: string;
    status: string;
    severity: string;
    evidence: number;
    witnesses: number;
    description: string;
    assignedOfficer?: string;
    officerContact?: string;
    responseTimeHours?: number;
    expectedResolution?: string;
  } | null;
}

export const ViolationDetailsModal: React.FC<ViolationDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  violation 
}) => {
  if (!isOpen || !violation) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Investigation': return 'bg-blue-100 text-blue-700';
      case 'Confirmed Violation': return 'bg-red-100 text-red-700';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Violation Details</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{violation.title}</h3>
              <p className="text-gray-600">{violation.description}</p>
            </div>
            <div className="flex flex-col space-y-2 items-end ml-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(violation.severity)}`}>
                {violation.severity} Risk
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(violation.status)}`}>
                {violation.status}
              </span>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{violation.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Developer</p>
                  <p className="font-medium">{violation.developer}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reported Date</p>
                  <p className="font-medium">{violation.reportedDate}</p>
                </div>
              </div>

              {violation.assignedOfficer && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned Officer</p>
                    <p className="font-medium">{violation.assignedOfficer}</p>
                    {violation.officerContact && (
                      <p className="text-xs text-gray-400">{violation.officerContact}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Violation Type</p>
                  <p className="font-medium">{violation.violationType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Camera className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Evidence</p>
                  <p className="font-medium">{violation.evidence} photos/videos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Community Reports</p>
                  <p className="font-medium">{violation.witnesses} witnesses</p>
                </div>
              </div>

              {violation.responseTimeHours !== undefined && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Response Time</p>
                    <p className="font-medium">
                      {violation.responseTimeHours < 24 
                        ? `${violation.responseTimeHours} hours`
                        : `${Math.round(violation.responseTimeHours / 24)} days`
                      }
                    </p>
                  </div>
                </div>
              )}

              {violation.expectedResolution && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Expected Resolution</p>
                    <p className="font-medium">{violation.expectedResolution}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Investigation Timeline
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Violation Reported</p>
                  <p className="text-sm text-gray-500">{violation.reportedDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Investigation Started</p>
                  <p className="text-sm text-gray-500">County planning office reviewing case</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-gray-500">Awaiting Developer Response</p>
                  <p className="text-sm text-gray-400">Next update expected within 7 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4">Evidence & Documentation</h4>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Add Evidence
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <TrendingUp className="w-4 h-4 mr-2" />
              Track Updates
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
