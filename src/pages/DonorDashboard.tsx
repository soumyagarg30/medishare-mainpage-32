import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "@/components/WelcomeMessage";
import DashboardUserInfo from "@/components/DashboardUserInfo";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { 
  UserCircle,
  Donate,
  Clock,
  FileText,
  Coins,
  TrendingUp,
  Settings
} from "lucide-react";

// Sample donation history
const donationHistory = [
  {
    id: "DON001",
    date: "2023-12-01",
    amount: "₹5,000",
    ngo: "Health For All NGO",
    medicines: "Paracetamol, Bandages",
    status: "Completed"
  },
  {
    id: "DON002",
    date: "2023-12-15",
    amount: "₹10,000",
    ngo: "Medical Aid Foundation",
    medicines: "Insulin, Syringes",
    status: "Completed"
  },
  {
    id: "DON003",
    date: "2023-11-20",
    amount: "₹2,500",
    ngo: "Care NGO",
    medicines: "Vitamin C, Antiseptic",
    status: "Completed"
  }
];

// Sample impact data
const impactData = {
  medicinesDonated: "500+",
  patientsHelped: "100+",
  ngosSupported: "10+"
};

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
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="Donor" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
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
                      onClick={() => setActiveTab("donate")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donate" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Donate size={18} />
                      <span>Donate Medicines</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("history")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "history" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Clock size={18} />
                      <span>Donation History</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("impact")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <TrendingUp size={18} />
                      <span>Impact</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("tax")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "tax" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <FileText size={18} />
                      <span>Tax Benefits</span>
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
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {activeTab === "profile" && (
                <DashboardUserInfo user={user} userTypeTitle="Donor" />
              )}
              
              {activeTab === "donate" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donate Medicines</CardTitle>
                    <CardDescription>Make a donation to help those in need</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This section is under development. Please check back later.</p>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "history" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>View your past donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicines</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationHistory.map((donation) => (
                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm">{donation.id}</td>
                              <td className="px-4 py-4 text-sm">{donation.date}</td>
                              <td className="px-4 py-4 text-sm">{donation.amount}</td>
                              <td className="px-4 py-4 text-sm">{donation.ngo}</td>
                              <td className="px-4 py-4 text-sm">{donation.medicines}</td>
                              <td className="px-4 py-4 text-sm">{donation.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "impact" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                    <CardDescription>See the difference you're making</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-green-50 border-green-200">
                        <CardBody className="flex flex-col items-center justify-center p-4">
                          <Coins className="h-6 w-6 text-green-600 mb-2" />
                          <CardTitle className="text-2xl font-bold text-green-700">{impactData.medicinesDonated}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">Medicines Donated</CardDescription>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-blue-50 border-blue-200">
                        <CardBody className="flex flex-col items-center justify-center p-4">
                          <UserCircle className="h-6 w-6 text-blue-600 mb-2" />
                          <CardTitle className="text-2xl font-bold text-blue-700">{impactData.patientsHelped}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">Patients Helped</CardDescription>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-orange-50 border-orange-200">
                        <CardBody className="flex flex-col items-center justify-center p-4">
                          <Donate className="h-6 w-6 text-orange-600 mb-2" />
                          <CardTitle className="text-2xl font-bold text-orange-700">{impactData.ngosSupported}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">NGOs Supported</CardDescription>
                        </CardBody>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "tax" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Benefits</CardTitle>
                    <CardDescription>Learn about tax benefits for your donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Information on tax benefits will be available soon.</p>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Account settings management options will be available soon.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props} />
  )
);
CardBody.displayName = "CardBody";

export default DonorDashboard;
