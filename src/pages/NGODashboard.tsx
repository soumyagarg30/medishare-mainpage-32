
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/ngo-dashboard/Sidebar";
import ProfileTab from "@/components/ngo-dashboard/ProfileTab";
import RequestsTab from "@/components/ngo-dashboard/RequestsTab";
import InventoryTab from "@/components/ngo-dashboard/InventoryTab";
import DonorsTab from "@/components/ngo-dashboard/DonorsTab";
import RecipientsTab from "@/components/ngo-dashboard/RecipientsTab";
import AnalyticsTab from "@/components/ngo-dashboard/AnalyticsTab";
import SettingsTab from "@/components/ngo-dashboard/SettingsTab";

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      
      if (!isAuth) {
        navigate("/sign-in");
        return;
      }
      
      const userData = getUser();
      if (!userData || userData.userType !== "ngo") {
        navigate("/sign-in");
        return;
      }
      
      setUser(userData);
    };
    
    checkAuth();
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile": return <ProfileTab user={user} />;
      case "requests": return <RequestsTab />;
      case "inventory": return <InventoryTab />;
      case "donors": return <DonorsTab />;
      case "recipients": return <RecipientsTab />;
      case "analytics": return <AnalyticsTab />;
      case "settings": return <SettingsTab />;
      default: return <ProfileTab user={user} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="NGO Partner" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NGODashboard;
