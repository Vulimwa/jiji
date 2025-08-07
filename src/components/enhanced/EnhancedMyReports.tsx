import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, MessageSquare, Plus, Eye, Edit, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCivicIssues } from '@/hooks/useSupabaseData';
import { useZoningViolations } from '@/hooks/useZoningViolations';

const statusConfig = {
  'reported': { label: 'Reported', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  'acknowledged': { label: 'Acknowledged', icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'in-progress': { label: 'In Progress', icon: AlertCircle, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'resolved': { label: 'Resolved', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  'pending': { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  'investigating': { label: 'Investigating', icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'confirmed': { label: 'Confirmed', icon: CheckCircle, color: 'text-red-600 bg-red-50 border-red-200' },
};

const priorityConfig = {
  'low': 'text-green-600 bg-green-50',
  'medium': 'text-yellow-600 bg-yellow-50',
  'high': 'text-orange-600 bg-orange-50',
  'urgent': 'text-red-600 bg-red-50'
};

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportType: 'issue' | 'violation';
  reportTitle: string;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, reportId, reportType, reportTitle }) => {
  const [updateText, setUpdateText] = useState('');
  const [updateType, setUpdateType] = useState('progress');

  const handleSubmit = async () => {
    // Here you would submit the update to the database
    console.log('Submitting update:', { reportId, reportType, updateText, updateType });
    onClose();
    setUpdateText('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Report: {reportTitle}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Update Type</label>
            <div className="flex space-x-2 mt-2">
              {[
                { id: 'progress', label: 'Progress' },
                { id: 'clarification', label: 'Clarification' },
                { id: 'evidence', label: 'Evidence' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setUpdateType(type.id)}
                  className={`px-3 py-1.5 text-sm rounded border ${
                    updateType === type.id 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Update Description</label>
            <Textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Provide additional information, clarification, or evidence..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!updateText.trim()}
            >
              Submit Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
  reportType: 'issue' | 'violation';
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report, reportType }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{report?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{report?.description}</p>
          </div>

          {reportType === 'violation' && (
            <div>
              <h4 className="font-medium mb-2">Violation Type</h4>
              <p className="text-sm text-muted-foreground">{report?.violation_type}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Location</h4>
            <p className="text-sm text-muted-foreground">{report?.address}</p>
            {report?.plot_number && (
              <p className="text-sm text-muted-foreground">Plot: {report.plot_number}</p>
            )}
          </div>

          {report?.image_urls && report.image_urls.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Evidence Photos</h4>
              <div className="grid grid-cols-3 gap-2">
                {report.image_urls.map((url: string, index: number) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {report?.county_response && (
            <div>
              <h4 className="font-medium mb-2">Official Response</h4>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">{report.county_response}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Status Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Reported: {new Date(report?.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Last Update: {new Date(report?.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const EnhancedMyReports: React.FC = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedReportType, setSelectedReportType] = useState<'issue' | 'violation'>('issue');

  const { data: issues = [] } = useCivicIssues();
  const { data: violations = [] } = useZoningViolations();

  // Filter to show only user's reports (you'd filter by reporter_id in real implementation)
  const userIssues = issues.filter((issue: any) => true); // Replace with actual user filter
  const userViolations = violations.filter((violation: any) => true); // Replace with actual user filter

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = (report: any, type: 'issue' | 'violation') => {
    setSelectedReport(report);
    setSelectedReportType(type);
    setDetailsModalOpen(true);
  };

  const handleAddUpdate = (report: any, type: 'issue' | 'violation') => {
    setSelectedReport(report);
    setSelectedReportType(type);
    setUpdateModalOpen(true);
  };

  const ReportCard = ({ report, type }: { report: any; type: 'issue' | 'violation' }) => {
    const status = type === 'issue' ? report.status : report.status;
    const StatusIcon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock;
    
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground line-clamp-2">
                {report.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {type === 'issue' ? report.category : report.violation_type} • ID: {report.id.slice(0, 8)}
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <Badge 
                variant="outline" 
                className={statusConfig[status as keyof typeof statusConfig]?.color}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[status as keyof typeof statusConfig]?.label}
              </Badge>
              
              {type === 'violation' && (
                <Badge 
                  variant="outline"
                  className={`${
                    report.severity === 'high' ? 'text-red-600 bg-red-50 border-red-200' :
                    report.severity === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                    'text-green-600 bg-green-50 border-green-200'
                  }`}
                >
                  {report.severity?.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          {/* Dates and Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(report.created_at)}
              </div>
              {type === 'issue' && report.priority_votes && (
                <div>
                  {report.priority_votes} votes
                </div>
              )}
              {report.is_anonymous && (
                <Badge variant="secondary" className="text-xs">
                  Anonymous
                </Badge>
              )}
            </div>
            
            <div className="text-xs">
              Updated {formatDate(report.updated_at)}
            </div>
          </div>

          {/* Official Response */}
          {report.county_response && (
            <div className="bg-accent rounded-lg p-3 mb-3">
              <p className="text-sm font-medium mb-1">Official Response:</p>
              <p className="text-sm text-muted-foreground">
                {report.county_response}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleViewDetails(report, type)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {status !== 'resolved' && status !== 'confirmed' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddUpdate(report, type)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-poppins font-bold">My Reports</h2>
        <div className="text-sm text-muted-foreground">
          {userIssues.length + userViolations.length} total reports
        </div>
      </div>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="issues">
            Civic Issues ({userIssues.length})
          </TabsTrigger>
          <TabsTrigger value="violations">
            Zoning Violations ({userViolations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {userIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No civic issues reported yet</h3>
              <p className="text-muted-foreground text-sm">
                When you report civic issues, they'll appear here for tracking.
              </p>
            </div>
          ) : (
            userIssues.map((issue: any) => (
              <ReportCard key={issue.id} report={issue} type="issue" />
            ))
          )}
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {userViolations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No zoning violations reported yet</h3>
              <p className="text-muted-foreground text-sm">
                When you report zoning violations, they'll appear here for tracking.
              </p>
            </div>
          ) : (
            userViolations.map((violation: any) => (
              <ReportCard key={violation.id} report={violation} type="violation" />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        reportId={selectedReport?.id || ''}
        reportType={selectedReportType}
        reportTitle={selectedReport?.title || ''}
      />

      <ReportDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        report={selectedReport}
        reportType={selectedReportType}
      />
    </div>
  );
};