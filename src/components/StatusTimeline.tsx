
import React from 'react';
import { Check, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface TimelineItem {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

interface StatusTimelineProps {
  items: TimelineItem[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ items }) => {
  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    switch (status.toLowerCase()) {
      case 'reported':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'acknowledged':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'resolved':
        return <Check className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(item.status, item.completed)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                {item.status}
              </h4>
              <span className="text-sm text-gray-400">{item.date}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          
          {index < items.length - 1 && (
            <div className="absolute left-[22px] top-8 w-0.5 h-8 bg-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
};
