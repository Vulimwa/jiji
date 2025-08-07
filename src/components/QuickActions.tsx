
import React from 'react';
import { Camera, MessageSquare, Users, Megaphone, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onReportIssue: () => void;
  onOpenNotifications: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onReportIssue, 
  onOpenNotifications 
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-40">
      {/* Notification Button */}
      <Button
        onClick={onOpenNotifications}
        className="w-14 h-14 rounded-full bg-gray-600 hover:bg-gray-700 shadow-lg"
        size="icon"
      >
        <Bell className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">3</span>
        </div>
      </Button>

      {/* Report Issue Button */}
      <Button
        onClick={onReportIssue}
        className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg jiji-touch-target"
        size="icon"
      >
        <Camera className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
};
