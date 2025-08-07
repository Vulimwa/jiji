
import React, { useState } from 'react';
import { Bell, Shield, MapPin, Smartphone, Globe, Palette, Volume2, Eye, Key, Download, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    issueUpdates: true,
    campaignAlerts: true,
    communityEvents: false,
    weeklyDigest: true,
    smsAlerts: false,
    emailAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    locationSharing: true,
    activityTracking: false,
    dataCollection: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'system',
    mapStyle: 'standard',
    soundEffects: true,
    hapticFeedback: true
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const togglePrivacy = (key: string) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const togglePreference = (key: string) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleChangePassword = () => {
    const newPassword = prompt('Enter your new password:');
    if (newPassword) {
      console.log('Changing password...');
      alert('Password changed successfully! Please log in again with your new password.');
    }
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
    // Simulate data export
    const userData = {
      profile: { name: 'User', email: 'user@example.com' },
      issues_reported: 5,
      campaigns_supported: 12,
      export_date: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `jiji_sauti_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Your data has been exported and downloaded!');
  };

  const handleContactSupport = () => {
    const message = prompt('Please describe your issue or question:');
    if (message) {
      console.log('Contacting support with message:', message);
      alert('Thank you! Your message has been sent to our support team. We will respond within 24 hours.');
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.'
    );
    
    if (confirmation) {
      const finalConfirmation = prompt('Please type "DELETE" to confirm account deletion:');
      if (finalConfirmation === 'DELETE') {
        console.log('Deleting account...');
        alert('Your account has been scheduled for deletion. You will receive a confirmation email within 24 hours.');
      } else {
        alert('Account deletion cancelled - confirmation text did not match.');
      }
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', { notifications, privacy, preferences });
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences</p>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Choose what updates you want to receive</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Issue Updates</h3>
              <p className="text-sm text-muted-foreground">Get notified when your reported issues are updated</p>
            </div>
            <Switch 
              checked={notifications.issueUpdates}
              onCheckedChange={() => toggleNotification('issueUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Campaign Alerts</h3>
              <p className="text-sm text-muted-foreground">Notifications about campaigns you support</p>
            </div>
            <Switch 
              checked={notifications.campaignAlerts}
              onCheckedChange={() => toggleNotification('campaignAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Community Events</h3>
              <p className="text-sm text-muted-foreground">Updates about local community events</p>
            </div>
            <Switch 
              checked={notifications.communityEvents}
              onCheckedChange={() => toggleNotification('communityEvents')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Weekly Digest</h3>
              <p className="text-sm text-muted-foreground">Weekly summary of community activity</p>
            </div>
            <Switch 
              checked={notifications.weeklyDigest}
              onCheckedChange={() => toggleNotification('weeklyDigest')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Alerts</h3>
              <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
            </div>
            <Switch 
              checked={notifications.smsAlerts}
              onCheckedChange={() => toggleNotification('smsAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Alerts</h3>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              checked={notifications.emailAlerts}
              onCheckedChange={() => toggleNotification('emailAlerts')}
            />
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Control your privacy and data sharing</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Public Profile</h3>
              <p className="text-sm text-muted-foreground">Make your profile visible to other community members</p>
            </div>
            <Switch 
              checked={privacy.profileVisible}
              onCheckedChange={() => togglePrivacy('profileVisible')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Location Sharing</h3>
              <p className="text-sm text-muted-foreground">Share your location for better issue reporting</p>
            </div>
            <Switch 
              checked={privacy.locationSharing}
              onCheckedChange={() => togglePrivacy('locationSharing')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Activity Tracking</h3>
              <p className="text-sm text-muted-foreground">Allow analytics to improve app experience</p>
            </div>
            <Switch 
              checked={privacy.activityTracking}
              onCheckedChange={() => togglePrivacy('activityTracking')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Collection</h3>
              <p className="text-sm text-muted-foreground">Share anonymous data for community insights</p>
            </div>
            <Switch 
              checked={privacy.dataCollection}
              onCheckedChange={() => togglePrivacy('dataCollection')}
            />
          </div>
        </div>
      </div>

      {/* App Preferences Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">App Preferences</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Customize your app experience</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
              <option value="ki">Kikuyu</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">Choose your display theme</p>
              </div>
            </div>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-medium">Map Style</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred map appearance</p>
              </div>
            </div>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option value="standard">Standard</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Sound Effects</h3>
              <p className="text-sm text-muted-foreground">Play sounds for app interactions</p>
            </div>
            <Switch 
              checked={preferences.soundEffects}
              onCheckedChange={() => togglePreference('soundEffects')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Haptic Feedback</h3>
              <p className="text-sm text-muted-foreground">Vibration feedback for touch interactions</p>
            </div>
            <Switch 
              checked={preferences.hapticFeedback}
              onCheckedChange={() => togglePreference('hapticFeedback')}
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
        </div>
        
        <div className="p-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleChangePassword}
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleContactSupport}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pb-6">
        <Button 
          className="w-full bg-primary hover:bg-primary/90" 
          size="lg"
          onClick={handleSaveSettings}
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
