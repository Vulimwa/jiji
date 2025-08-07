import React, { useState } from 'react';
import { User, Star, MapPin, Phone, Award, Briefcase, TrendingUp, CreditCard, Share2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkerRegistrationModal } from '@/components/WorkerRegistrationModal';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { ShareJobModal } from '@/components/ShareJobModal';

const WorkerHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workerRegistered, setWorkerRegistered] = useState(true);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [shareJobModalOpen, setShareJobModalOpen] = useState(false);

  const workerProfile = {
    name: "James Kariuki",
    rating: 4.8,
    reviews: 127,
    skills: ["Plumbing", "Electrical", "General Repairs"],
    location: "Kilimani, Nairobi",
    phone: "+254 712 345 678",
    civicCredits: 850,
    completedJobs: 94,
    badgeLevel: "Gold Citizen"
  };

  const availableJobs = [
    {
      id: 1,
      title: "Fix Water Leak at Community Center",
      description: "Emergency plumbing repair needed",
      payment: "KES 5,000",
      civicCredits: 50,
      location: "Kilimani Community Center",
      urgency: "High",
      postedBy: "County Government"
    },
    {
      id: 2,
      title: "Street Light Installation",
      description: "Install 5 new LED street lights",
      payment: "KES 15,000",
      civicCredits: 100,
      location: "Kindaruma Road",
      urgency: "Medium",
      postedBy: "Residents Association"
    },
    {
      id: 3,
      title: "Community Garden Maintenance",
      description: "Monthly maintenance of community garden",
      payment: "KES 8,000",
      civicCredits: 75,
      location: "Kilimani Park",
      urgency: "Low",
      postedBy: "Environmental Committee"
    }
  ];

  const achievements = [
    { icon: "🏆", title: "Top Rated Worker", description: "Maintained 4.8+ rating for 6 months" },
    { icon: "⚡", title: "Quick Responder", description: "Responded to 95% of jobs within 2 hours" },
    { icon: "🌟", title: "Community Champion", description: "Completed 10+ civic improvement projects" },
    { icon: "🔧", title: "Multi-Skilled", description: "Certified in 3+ skill categories" }
  ];

  const recentJobs = [
    { title: "Repaired School Gate", date: "2 days ago", payment: "KES 3,500", rating: 5 },
    { title: "Fixed Community Tap", date: "1 week ago", payment: "KES 2,800", rating: 5 },
    { title: "Painted Bus Stop", date: "2 weeks ago", payment: "KES 4,200", rating: 4 }
  ];

  const handleApplyForJob = (jobId: number) => {
    console.log('Applying for job:', jobId);
    alert('Application submitted successfully! You will be notified if selected.');
  };

  const handleBrowseJobs = () => {
    setActiveTab('jobs');
  };

  const handleUpdateProfile = () => {
    setProfileEditModalOpen(true);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">Worker Hub</h1>
        <p className="text-muted-foreground">Digital platform for informal workers and civic participation</p>
      </div>

      {workerRegistered ? (
        <>
          {/* Worker Profile Card */}
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-lg p-6 text-white mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{workerProfile.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{workerProfile.rating} ({workerProfile.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{workerProfile.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {workerProfile.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white/20 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{workerProfile.civicCredits}</div>
                <div className="text-sm opacity-90">Civic Credits</div>
                <div className="text-sm bg-white/20 rounded px-2 py-1 mt-1">
                  {workerProfile.badgeLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{workerProfile.completedJobs}</span>
              </div>
              <p className="text-sm text-muted-foreground">Jobs Completed</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">KES 125K</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">12</span>
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'jobs', label: 'Available Jobs' },
              { id: 'history', label: 'Job History' },
              { id: 'achievements', label: 'Achievements' }
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-16 flex-col bg-primary hover:bg-primary/90"
                    onClick={handleBrowseJobs}
                  >
                    <Briefcase className="w-6 h-6 mb-1" />
                    Browse Jobs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col"
                    onClick={handleUpdateProfile}
                  >
                    <Edit className="w-6 h-6 mb-1" />
                    Update Profile
                  </Button>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShareJobModalOpen(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Job Opportunity
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentJobs.map((job, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{job.payment}</p>
                        <div className="flex items-center">
                          {[...Array(job.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {availableJobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </span>
                        <span className="text-muted-foreground">by {job.postedBy}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.urgency === 'High' ? 'bg-red-100 text-red-700' :
                      job.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {job.urgency} Priority
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment</p>
                        <p className="font-semibold text-green-600">{job.payment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Civic Credits</p>
                        <p className="font-semibold text-primary">+{job.civicCredits}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleApplyForJob(job.id)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md mx-auto">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Join the Worker Hub</h2>
            <p className="text-muted-foreground mb-6">
              Register as an informal worker to access job opportunities and build your civic profile
            </p>
            <Button 
              onClick={() => setRegistrationModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90" 
              size="lg"
            >
              Register as Worker
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <WorkerRegistrationModal 
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
      />
      
      <ProfileEditModal 
        isOpen={profileEditModalOpen}
        onClose={() => setProfileEditModalOpen(false)}
      />
      
      <ShareJobModal 
        isOpen={shareJobModalOpen}
        onClose={() => setShareJobModalOpen(false)}
      />
    </div>
  );
};

export default WorkerHub;
