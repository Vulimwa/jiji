
import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleReports = [
  {
    id: 'JJ123456',
    title: 'Broken sewage pipe on Argwings Kodhek Road',
    category: 'Sewage & Drainage',
    status: 'in-progress',
    priority: 'high',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-17T14:20:00Z',
    votes: 15,
    county_response: 'Our team has assessed the issue and repairs are scheduled for next week.',
    images: 1
  },
  {
    id: 'JJ123455',
    title: 'Noise pollution from construction site',
    category: 'Noise Pollution',
    status: 'acknowledged',
    priority: 'medium',
    created_at: '2024-01-12T08:15:00Z',
    updated_at: '2024-01-13T16:45:00Z',
    votes: 8,
    county_response: 'We have contacted the construction company regarding noise regulations.',
    images: 2
  },
  {
    id: 'JJ123454',
    title: 'Frequent power outages in Phase 3',
    category: 'Power Issues',
    status: 'resolved',
    priority: 'urgent',
    created_at: '2024-01-08T19:20:00Z',
    updated_at: '2024-01-10T11:30:00Z',
    votes: 23,
    county_response: 'Faulty transformer has been replaced. Power supply restored.',
    images: 0
  }
];

const statusConfig = {
  'reported': { label: 'Reported', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  'acknowledged': { label: 'Acknowledged', icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'in-progress': { label: 'In Progress', icon: AlertCircle, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'resolved': { label: 'Resolved', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' }
};

const priorityConfig = {
  'low': 'text-green-600 bg-green-50',
  'medium': 'text-yellow-600 bg-yellow-50',
  'high': 'text-orange-600 bg-orange-50',
  'urgent': 'text-red-600 bg-red-50'
};

export const MyReports: React.FC = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-poppins font-bold">My Reports</h2>
        <div className="text-sm text-muted-foreground">
          {sampleReports.length} total reports
        </div>
      </div>

      <div className="space-y-4">
        {sampleReports.map((report) => {
          const StatusIcon = statusConfig[report.status as keyof typeof statusConfig].icon;
          
          return (
            <div key={report.id} className="bg-card border rounded-lg p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.category} • ID: {report.id}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[report.status as keyof typeof statusConfig].color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig[report.status as keyof typeof statusConfig].label}
                  </div>
                  
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityConfig[report.priority as keyof typeof priorityConfig]}`}>
                    {report.priority.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Dates and Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(report.created_at)}
                  </div>
                  <div>
                    {report.votes} votes
                  </div>
                  {report.images > 0 && (
                    <div>
                      {report.images} photo{report.images > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                <div className="text-xs">
                  Updated {formatDate(report.updated_at)}
                </div>
              </div>

              {/* County Response */}
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
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {report.status !== 'resolved' && (
                  <Button variant="outline" size="sm">
                    Add Update
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sampleReports.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No reports yet</h3>
          <p className="text-muted-foreground text-sm">
            When you report issues, they'll appear here for tracking.
          </p>
        </div>
      )}
    </div>
  );
};
