
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, List, BarChart, Package, Gift, ExternalLink } from "lucide-react";
import { isAuthenticated, getUser } from "@/utils/auth";
import AddMedicineForm from "@/components/medicines/AddMedicineForm";
import MedicinesList from "@/components/medicines/MedicinesList";
import DonationChart from "@/components/charts/DonationChart";
import MedicineCategoryChart from "@/components/charts/MedicineCategoryChart";
import ImpactChart from "@/components/charts/ImpactChart";
import { getDonorMedicines } from "@/utils/medicineUtils";

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated and is a donor
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        navigate("/sign-in");
        return;
      }
      
      const userData = getUser();
      if (!userData || userData.userType !== "donor") {
        navigate("/sign-in");
        return;
      }
      
      setUser(userData);
      loadDonorMedicines(userData.id);
    };
    
    const loadDonorMedicines = async (donorId: string) => {
      try {
        setLoading(true);
        const result = await getDonorMedicines(donorId);
        if (result.success && result.data) {
          setMedicines(result.data);
        }
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // If user data is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medishare-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-medishare-dark">Donor Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your medicine donations and track your impact
              </p>
            </div>
            <Button 
              onClick={() => setActiveTab("donate")}
              className="mt-4 md:mt-0 bg-medishare-orange hover:bg-medishare-gold flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Donate Medicine
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Donations</CardTitle>
                <CardDescription>Your contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{medicines.length}</h3>
                    <p className="text-sm text-gray-600">Donated medicines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available</CardTitle>
                <CardDescription>Medicines available for donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Gift className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {medicines.filter(m => m.status === 'available').length}
                    </h3>
                    <p className="text-sm text-gray-600">Ready for distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Donated</CardTitle>
                <CardDescription>Successfully donated medicines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <ExternalLink className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {medicines.filter(m => m.status === 'donated').length}
                    </h3>
                    <p className="text-sm text-gray-600">Medicines donated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:w-[500px]">
              <TabsTrigger value="dashboard" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                <span>My Donations</span>
              </TabsTrigger>
              <TabsTrigger value="donate" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <span>Donate</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Donation Activity</CardTitle>
                    <CardDescription>Your donation history over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DonationChart title="Donation Activity" />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Medicine Categories</CardTitle>
                    <CardDescription>Types of medicines you've donated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MedicineCategoryChart title="Medicine Categories" />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Your Impact</CardTitle>
                    <CardDescription>People you've helped</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImpactChart title="Your Impact" />
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Your most recent medicine donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="donor" donorId={user?.id} showActions={false} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>My Donations</CardTitle>
                  <CardDescription>All medicines you have donated</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="donor" donorId={user?.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="donate">
              <AddMedicineForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
