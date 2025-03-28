
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MapPin, Clock, CheckCircle } from "lucide-react";

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "Urgent Medicine Need",
    description: "Community Clinic (1.7 km away) urgently needs diabetes medication.",
    time: "10 minutes ago",
    icon: Bell,
    read: false
  },
  {
    id: 2,
    type: "nearby",
    title: "New NGO Near You",
    description: "Rural Medical Center has been added to NGOs near you (3.2 km away).",
    time: "2 hours ago",
    icon: MapPin,
    read: false
  },
  {
    id: 3,
    type: "reminder",
    title: "Donation Reminder",
    description: "You have scheduled a medicine donation for tomorrow at City Hospital.",
    time: "1 day ago",
    icon: Clock,
    read: true
  },
  {
    id: 4,
    type: "success",
    title: "Donation Received",
    description: "Your donation of antibiotics has been received by Health For All NGO.",
    time: "3 days ago",
    icon: CheckCircle,
    read: true
  }
];

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Stay updated with donation needs and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border rounded-lg flex items-start gap-4 ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}
            >
              <div className={`p-2 rounded-full ${
                notification.type === 'urgent' ? 'bg-red-100 text-red-600' :
                notification.type === 'nearby' ? 'bg-green-100 text-green-600' :
                notification.type === 'reminder' ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <notification.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
