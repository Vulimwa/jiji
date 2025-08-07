import React, { useState } from 'react';
import { Users, MapPin, Calendar, MessageSquare, Heart, Share2, Plus, Lightbulb, Vote, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StartDiscussionModal } from '@/components/StartDiscussionModal';
import { CreateEventModal } from '@/components/CreateEventModal';
import { ProposeInitiativeModal } from '@/components/ProposeInitiativeModal';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [discussionModalOpen, setDiscussionModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [initiativeModalOpen, setInitiativeModalOpen] = useState(false);

  const discussions = [
    {
      id: 1,
      title: "New Traffic Lights Needed at Junction",
      author: "Mary Wanjiku",
      category: "Infrastructure",
      replies: 23,
      lastActivity: "2 hours ago",
      location: "Kindaruma Road Junction"
    },
    {
      id: 2,
      title: "Community Clean-up Day Planning",
      author: "James Mwangi",
      category: "Environment",
      replies: 15,
      lastActivity: "5 hours ago",
      location: "Kilimani Park"
    },
    {
      id: 3,
      title: "Noise Complaints - Weekend Construction",
      author: "Sarah Otieno",
      category: "Quality of Life",
      replies: 31,
      lastActivity: "1 day ago",
      location: "Argwings Kodhek Road"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Monthly Community Meeting",
      date: "March 15, 2024",
      time: "6:00 PM",
      location: "Kilimani Primary School",
      organizer: "Residents Association",
      attendees: 45,
      maxAttendees: 100,
      category: "Meeting"
    },
    {
      id: 2,
      title: "Neighborhood Watch Training",
      date: "March 20, 2024",
      time: "2:00 PM",
      location: "Community Center",
      organizer: "Security Committee",
      attendees: 23,
      maxAttendees: 50,
      category: "Safety"
    },
    {
      id: 3,
      title: "Tree Planting Initiative",
      date: "March 25, 2024",
      time: "8:00 AM",
      location: "Kilimani Park",
      organizer: "Green Kilimani",
      attendees: 67,
      maxAttendees: 80,
      category: "Environment"
    }
  ];

  const initiatives = [
    {
      id: 1,
      title: "Install Speed Bumps on Residential Streets",
      description: "Proposal to install speed bumps to reduce vehicle speed in residential areas",
      supporters: 89,
      targetSupport: 100,
      category: "Safety",
      priority: "High",
      progress: 89
    },
    {
      id: 2,
      title: "Community Wi-Fi Hotspots",
      description: "Establish free Wi-Fi access points in public areas",
      supporters: 156,
      targetSupport: 200,
      category: "Technology",
      priority: "Medium",
      progress: 78
    },
    {
      id: 3,
      title: "Mobile Health Clinic Schedule",
      description: "Regular mobile health services for the community",
      supporters: 234,
      targetSupport: 300,
      category: "Health",
      priority: "High",
      progress: 78
    }
  ];

  const handleJoinEvent = (eventId: number) => {
    console.log('Joining event:', eventId);
    alert('Successfully joined the event! You will receive a confirmation email.');
  };

  const handleShareEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      navigator.share?.({
        title: event.title,
        text: `Join us for ${event.title} on ${event.date} at ${event.location}`,
        url: window.location.href
      }).catch(() => {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${event.title} - ${event.date} at ${event.location}. Join us!`);
        alert('Event details copied to clipboard!');
      });
    }
  };

  const handleSupportInitiative = (initiativeId: number) => {
    console.log('Supporting initiative:', initiativeId);
    alert('Thank you for your support! Your vote has been recorded.');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">My Community</h1>
        <p className="text-muted-foreground">Connect, discuss, and organize with your neighbors</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold">1,247</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Members</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">{discussions.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Discussions</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold">{events.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Upcoming Events</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold">{initiatives.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Initiatives</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={() => setDiscussionModalOpen(true)}
          className="h-16 bg-primary hover:bg-primary/90 flex-col"
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          Start Discussion
        </Button>
        <Button 
          onClick={() => setEventModalOpen(true)}
          variant="outline" 
          className="h-16 flex-col border-primary text-primary hover:bg-primary/10"
        >
          <Calendar className="w-6 h-6 mb-1" />
          Create Event
        </Button>
        <Button 
          onClick={() => setInitiativeModalOpen(true)}
          variant="outline" 
          className="h-16 flex-col border-yellow-500 text-yellow-600 hover:bg-yellow-50"
        >
          <Lightbulb className="w-6 h-6 mb-1" />
          Propose Initiative
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'discussions', label: 'Discussions' },
          { id: 'events', label: 'Events' },
          { id: 'initiatives', label: 'Initiatives' }
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

      {/* Tab Content */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          {discussions.map(discussion => (
            <div key={discussion.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>by {discussion.author}</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{discussion.location}</span>
                    </span>
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.lastActivity}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {discussion.category}
                </span>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Support
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span><strong>Date:</strong> {event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span><strong>Location:</strong> {event.location}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span><strong>Organizer:</strong> {event.organizer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span><strong>Attendees:</strong> {event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {event.category}
                </span>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleJoinEvent(event.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Join Event
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShareEvent(event.id)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'initiatives' && (
        <div className="space-y-4">
          {initiatives.map(initiative => (
            <div key={initiative.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{initiative.title}</h3>
                  <p className="text-muted-foreground mb-3">{initiative.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm mb-3">
                    <span className="flex items-center space-x-1">
                      <Vote className="w-4 h-4 text-gray-400" />
                      <span><strong>Supporters:</strong> {initiative.supporters}/{initiative.targetSupport}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span><strong>Progress:</strong> {initiative.progress}%</span>
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${initiative.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 items-end">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {initiative.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    initiative.priority === 'High' ? 'bg-red-100 text-red-700' :
                    initiative.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {initiative.priority} Priority
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleSupportInitiative(initiative.id)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Support Initiative
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <StartDiscussionModal
        isOpen={discussionModalOpen}
        onClose={() => setDiscussionModalOpen(false)}
      />
      
      <CreateEventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />
      
      <ProposeInitiativeModal
        isOpen={initiativeModalOpen}
        onClose={() => setInitiativeModalOpen(false)}
      />
    </div>
  );
};

export default CommunityPage;
