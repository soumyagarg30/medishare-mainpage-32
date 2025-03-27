
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCircle,
  Package2,
  Search,
  Clock,
  Bell,
  BarChart3,
  MapPin,
  Settings,
  Users,
  Truck
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
          <button 
            onClick={() => setActiveTab("profile")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "profile" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <UserCircle size={18} />
            <span>Profile</span>
          </button>
          <button 
            onClick={() => setActiveTab("requests")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "requests" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Search size={18} />
            <span>Requests</span>
          </button>
          <button 
            onClick={() => setActiveTab("inventory")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "inventory" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Package2 size={18} />
            <span>Inventory Management</span>
          </button>
          <button 
            onClick={() => setActiveTab("distribution")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "distribution" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Truck size={18} />
            <span>Distribution</span>
          </button>
          <button 
            onClick={() => setActiveTab("donors")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donors" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <MapPin size={18} />
            <span>Donors Near Me</span>
          </button>
          <button 
            onClick={() => setActiveTab("recipients")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "recipients" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Users size={18} />
            <span>Recipients</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "analytics" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveTab("settings")} 
            className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "settings" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
