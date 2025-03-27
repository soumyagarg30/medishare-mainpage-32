
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/donor-dashboard/Sidebar";
import ProfileTab from "@/components/donor-dashboard/ProfileTab";
import DonateTab from "@/components/donor-dashboard/DonateTab";
import HistoryTab from "@/components/donor-dashboard/HistoryTab";
import ImpactTab from "@/components/donor-dashboard/ImpactTab";
import TaxBenefitsTab from "@/components/donor-dashboard/TaxBenefitsTab";
import SettingsTab from "@/components/donor-dashboard/SettingsTab";
import NearbyNGOsTab from "@/components/donor-dashboard/NearbyNGOsTab";
import LocationPermission from "@/components/LocationPermission";

const DonorDashboard = () => {
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
      if (!userData || userData.userType !== "donor") {
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

  return (
    <>
      <Navbar />
      <LocationPermission />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="Donor" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            <div className="md:col-span-9">
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "donate" && <DonateTab />}
              {activeTab === "history" && <HistoryTab />}
              {activeTab === "impact" && <ImpactTab />}
              {activeTab === "nearby" && <NearbyNGOsTab />}
              {activeTab === "tax" && <TaxBenefitsTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
