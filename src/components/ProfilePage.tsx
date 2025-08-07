import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Award, TrendingUp, Edit, Share2, Phone, Mail, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileEditModal } from '@/components/ProfileEditModal';

interface ProfilePageProps {
  // Define any props if needed
}

const ProfilePage = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const userData = {
    name: "James Kariuki",
    location: "Kilimani, Nairobi",
    memberSince: "2022-05-15",
    rating: 4.7,
    reviews: 85,
    phone: "+254 712 345 678",
    email: "james.kariuki@email.com"
  };

  const recentActivity = [
    { title: "Reported Pothole on Argwings Kodhek Road", date: "2 days ago" },
    { title: "Signed Petition for Green Space Preservation", date: "1 week ago" },
    { title: "Attended Community Meeting on Zoning Changes", date: "2 weeks ago" }
  ];

  const achievements = [
    { title: "Top Contributor", description: "Reported the most issues in Kilimani this month" },
    { title: "Active Citizen", description: "Participated in 5+ community campaigns" },
    { title: "Trusted Reporter", description: "95% of your reports have been verified" }
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-muted-foreground">View your profile information, activity, and achievements</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JK
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{userData.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Member since {new Date(userData.memberSince).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{userData.rating} ({userData.reviews} reviews)</span>
              </div>
              <Button variant="ghost" size="sm">
                View Reviews
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <Button 
            onClick={() => setEditModalOpen(true)}
            variant="outline" 
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold">{achievements.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Achievements</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">87%</span>
          </div>
          <p className="text-sm text-muted-foreground">Report Accuracy</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold">5</span>
          </div>
          <p className="text-sm text-muted-foreground">Years of Service</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          {recentActivity.map((activity, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
