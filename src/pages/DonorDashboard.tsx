
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser, isAuthenticated, UserData } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import WelcomeMessage from "@/components/WelcomeMessage";
import DonateTab from "@/components/donor-dashboard/DonateTab";
import HistoryTab from "@/components/donor-dashboard/HistoryTab";
import ProfileTab from "@/components/donor-dashboard/ProfileTab";
import Sidebar from "@/components/donor-dashboard/Sidebar";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        navigate("/sign-in");
        return;
      }
      
      const currentUser = getUser();
      if (!currentUser || currentUser.userType !== "donor") {
        navigate("/sign-in");
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          {user && <WelcomeMessage user={user} userTypeTitle="Donor" />}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            
            <div className="md:col-span-9">
              {activeTab === "donations" && <HistoryTab />}
              {activeTab === "new-donation" && <DonateTab />}
              {activeTab === "profile" && user && <ProfileTab user={user} />}
              {activeTab === "notifications" && (
                <div className="text-center py-8 text-gray-500">
                  <p>No notifications available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
