
import React, { useState } from 'react';
import { Menu, Bell, LogIn, LogOut, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JijiSidebar } from '@/components/JijiSidebar';
import { CivicMap } from '@/components/CivicMap';
import { EnhancedIssueReportForm } from '@/components/enhanced/EnhancedIssueReportForm';
import { MyReports } from '@/components/MyReports';
import { AuthModal } from '@/components/AuthModal';
import { NotificationCenter } from '@/components/NotificationCenter';
import { QuickActions } from '@/components/QuickActions';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { SearchBar } from '@/components/SearchBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/components/AuthProvider';
import CommunityPage from '@/components/CommunityPage';
import WorkerHub from '@/components/WorkerHub';
import CampaignsPage from '@/components/CampaignsPage';
import ZoningWatch from '@/components/ZoningWatch';
import SettingsPage from '@/components/SettingsPage';
import ProfilePage from '@/components/ProfilePage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DataProvider, useDataContext } from '@/components/DataProvider';
import JiJiDocs from '@/components/JiJiDocs';
import CivicMatchPage from '@/components/CivicMatchPage';
import CollaborationZonePage from '@/components/CollaborationZonePage';
import BudgetPage from '@/components/BudgetPage';
import { FlashChallengesPage } from '@/components/FlashChallenges/FlashChallengesPage';
import { useToast } from '@/hooks/use-toast';

const IndexContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('map');
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const { userProfile, userType, isAdmin, isLoading } = useDataContext();
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuthContext();
  const { toast } = useToast();

  console.log('Index render:', { isLoading, authLoading, isAuthenticated, userProfile, userType });

  // Add loading state with timeout fallback
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading JijiSauti...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Auth: {authLoading ? 'loading' : 'ready'} | Data: {isLoading ? 'loading' : 'ready'}
          </p>
        </div>
      </div>
    );
  }

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully."
      });
      setActiveSection('map');
    }
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleFilterToggle = () => {
    console.log('Toggle filters');
  };

  const renderContent = () => {
    // Admin access
    if (activeSection === 'admin' && isAdmin) {
      return (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      );
    }

    switch (activeSection) {
      case 'map':
        return <CivicMap onReportIssue={() => setReportFormOpen(true)} />;
      case 'reports':
        return (
          <ProtectedRoute>
            <MyReports />
          </ProtectedRoute>
        );
      case 'zoning':
        return <ZoningWatch />;
      case 'community':
        return <CommunityPage />;
      case 'collaboration':
        return (
          <ProtectedRoute>
            <CollaborationZonePage />
          </ProtectedRoute>
        );
      case 'workers':
        return <WorkerHub />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'jiji-docs':
        return <JiJiDocs />;
      case 'civic-match':
        return (
          <ProtectedRoute>
            <CivicMatchPage />
          </ProtectedRoute>
        );
      case 'flash-challenges':
        return (
          <ProtectedRoute>
            <FlashChallengesPage />
          </ProtectedRoute>
        );
      case 'budget':
        return (
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        );
      case 'settings':
        return (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        );
      default:
        return <CivicMap onReportIssue={() => setReportFormOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Header */}
      <header className="bg-white border-b shadow-sm relative z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="jiji-touch-target"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-poppins font-bold text-primary">JijiSauti</h1>
              <p className="text-xs text-muted-foreground">Kilimani Community</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search Bar */}
            <SearchBar 
              onSearch={handleSearch}
              onFilterToggle={handleFilterToggle}
            />
            
            {/* Admin Access Button */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveSection('admin')}
                className="jiji-touch-target"
                title="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </Button>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(true)}
                  className="jiji-touch-target"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {userProfile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                  {userType && (
                    <span className="text-xs text-muted-foreground capitalize">
                      {userType.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="jiji-touch-target"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAuthModalOpen(true)}
                className="jiji-touch-target"
              >
                <LogIn className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {renderContent()}
      </main>

      {/* Quick Actions - Floating Buttons */}
      <QuickActions 
        onReportIssue={() => setReportFormOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Sidebar */}
      <JijiSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isAdmin={isAdmin}
      />

      {/* Issue Report Form */}
      <EnhancedIssueReportForm
        isOpen={reportFormOpen}
        onClose={() => setReportFormOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

const Index = () => {
  return (
    <DataProvider>
      <IndexContent />
    </DataProvider>
  );
};

export default Index;
