
import React from 'react';
import { motion } from 'framer-motion';
import { X, Map, FileText, AlertTriangle, Users, Briefcase, Flag, Settings, User, Shield, BookOpen, Target, Coins, UsersRound, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JijiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isAdmin?: boolean;
}

const menuItems = [
  { id: 'map', label: 'Civic Map', icon: Map, description: 'View issues on map' },
  { id: 'reports', label: 'My Reports', icon: FileText, description: 'Track your submissions' },
  { id: 'zoning', label: 'Zoning Watch', icon: AlertTriangle, description: 'Report violations' },
  // { id: 'community', label: 'Community', icon: Users, description: 'Events & discussions' },
  { id: 'workers', label: 'Worker Hub', icon: Briefcase, description: 'Find local workers' },
  { id: 'budget', label: 'Community Budget', icon: Coins, description: 'Participatory budgeting' },

  // { id: 'collaboration', label: 'Collaboration Zone', icon: UsersRound, description: 'Self-organize around issues' },
  // { id: 'campaigns', label: 'Campaigns', icon: Flag, description: 'Community initiatives' },
  { id: 'civic-match', label: 'Civic Match', icon: Target, description: 'Strategic stakeholder engagement' },
  // { id: 'flash-challenges', label: 'Flash Challenges', icon: Zap, description: 'Rapid civic action challenges' },
  // { id: 'jiji-docs', label: 'JiJi Docs', icon: BookOpen, description: 'Civic document insights' },
  { id: 'profile', label: 'Profile', icon: User, description: 'Manage your profile' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'App preferences' },
];

export const JijiSidebar: React.FC<JijiSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange,
  isAdmin = false 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-poppins font-bold text-primary">JijiSauti</h2>
            <p className="text-sm text-muted-foreground">Civic Intelligence Platform</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="my-4 border-t"></div>
              <div className="px-3 mb-2">
                <Badge variant="destructive" className="text-xs">
                  Admin Access
                </Badge>
              </div>
              <button
                onClick={() => {
                  onSectionChange('admin');
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  activeSection === 'admin'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Shield className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">Admin Dashboard</div>
                  <div className={`text-xs ${activeSection === 'admin' ? 'text-destructive-foreground/70' : 'text-muted-foreground'}`}>
                    Platform management
                  </div>
                </div>
              </button>
            </>
          )}
        </nav>

          {/* Footer moved after admin section or after main menu if no admin */}
          {isAdmin ? (
            <div className="mt-6 pt-4 border-t">
              <div className="text-center px-4">
                <p className="text-xs text-muted-foreground">
                  JijiSauti v1.0.0
                </p>
                <p className="text-xs text-muted-foreground">
                  Building better communities together
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t">
              <div className="text-center px-4">
                <p className="text-xs text-muted-foreground">
                  JijiSauti v1.0.0
                </p>
                <p className="text-xs text-muted-foreground">
                  Building better communities together
                </p>
              </div>
            </div>
          )}
      </motion.div>
    </>
  );
};
