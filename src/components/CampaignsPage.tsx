import React, { useState } from 'react';
import { Heart, Users, Calendar, TrendingUp, Target, MapPin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';

const CampaignsPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const campaigns = [
    {
      id: 1,
      title: "Fix Potholes on Kindaruma Road",
      description: "Petition to repair dangerous potholes that damage vehicles and pose safety risks",
      organizer: "Kindaruma Residents",
      target: 500,
      current: 342,
      daysLeft: 12,
      category: "Infrastructure",
      location: "Kindaruma Road"
    },
    {
      id: 2,
      title: "Install Street Lights in Park Area",
      description: "Campaign for better lighting to improve safety during evening hours",
      organizer: "Safety Committee",
      target: 300,
      current: 187,
      daysLeft: 8,
      category: "Safety",
      location: "Kilimani Park"
    },
    {
      id: 3,
      title: "Community Wi-Fi Initiative",
      description: "Petition for free Wi-Fi hotspots in public spaces",
      organizer: "Digital Inclusion Group",
      target: 750,
      current: 423,
      daysLeft: 20,
      category: "Technology",
      location: "Multiple Locations"
    }
  ];

  const handleSupportCampaign = (campaignId: number) => {
    console.log('Supporting campaign:', campaignId);
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      alert(`Thank you for supporting "${campaign.title}"! Your signature has been recorded.`);
    }
  };

  const handleShareCampaign = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const shareText = `Help us ${campaign.title}! Sign the petition: ${window.location.href}`;
      
      if (navigator.share) {
        navigator.share({
          title: campaign.title,
          text: shareText,
          url: window.location.href
        }).catch(() => {
          navigator.clipboard.writeText(shareText);
          alert('Campaign link copied to clipboard!');
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Campaign link copied to clipboard!');
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">Community Campaigns</h1>
        <p className="text-muted-foreground">Organize and support initiatives that matter to your community</p>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Campaigns</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">2,341</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Supporters</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold">8</span>
          </div>
          <p className="text-sm text-muted-foreground">Successful</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold">4</span>
          </div>
          <p className="text-sm text-muted-foreground">This Month</p>
        </div>
      </div>

      {/* Create Campaign Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90" 
          size="lg"
        >
          <Target className="w-5 h-5 mr-2" />
          Start New Campaign
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'active', label: 'Active Campaigns' },
          { id: 'successful', label: 'Successful' },
          { id: 'my', label: 'My Campaigns' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.map(campaign => {
          const progress = Math.round((campaign.current / campaign.target) * 100);
          
          return (
            <div key={campaign.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-muted-foreground mb-3">{campaign.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>by {campaign.organizer}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{campaign.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{campaign.daysLeft} days left</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary">{campaign.current}</span>
                    <span className="text-sm text-muted-foreground">
                      of {campaign.target} signatures ({progress}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium ml-4">
                  {campaign.category}
                </span>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="bg-primary hover:bg-primary/90 flex-1"
                  onClick={() => handleSupportCampaign(campaign.id)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Support Campaign
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleShareCampaign(campaign.id)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

export default CampaignsPage;
