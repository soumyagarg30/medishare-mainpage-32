
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DonationChart from "@/components/charts/DonationChart";
import MedicineCategoryChart from "@/components/charts/MedicineCategoryChart";
import ImpactChart from "@/components/charts/ImpactChart";
import { UserCircle, Package, CalendarClock, MapPin, Plus, List, PieChart, Activity } from "lucide-react";
import { isAuthenticated, getUser } from "@/utils/auth";
import AddMedicineForm from "@/components/medicines/AddMedicineForm";
import MedicinesList from "@/components/medicines/MedicinesList";
import MedicineLocationsMap from "@/components/maps/MedicineLocationsMap";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
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
              className="mt-4 md:mt-0 bg-medishare-orange hover:bg-medishare-gold flex items-center gap-2"
              onClick={() => setActiveTab("donate")}
            >
              <Plus className="h-4 w-4" />
              Donate Medicine
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Your donor information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-medishare-blue/10 rounded-full p-3">
                    <UserCircle className="h-8 w-8 text-medishare-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name || "Donor"}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{user.organization || "No organization"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Donations</CardTitle>
                <CardDescription>Your medicine donation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-medishare-orange/10 rounded-full p-3">
                    <Package className="h-8 w-8 text-medishare-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold">12 Medicines</h3>
                    <p className="text-sm text-gray-600">Donated this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impact</CardTitle>
                <CardDescription>Lives impacted through your donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">~45 Patients</h3>
                    <p className="text-sm text-gray-600">Helped through donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 md:w-[600px] mb-8">
              <TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-3">
                <PieChart className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="donate" className="flex flex-col items-center gap-1 py-3">
                <Plus className="h-4 w-4" />
                <span>Donate</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex flex-col items-center gap-1 py-3">
                <List className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-3">
                <MapPin className="h-4 w-4" />
                <span>Map</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Donation Activity</CardTitle>
                    <CardDescription>Your donation history over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <DonationChart />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Medicine Categories</CardTitle>
                    <CardDescription>Types of medicine donated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <MedicineCategoryChart />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact</CardTitle>
                    <CardDescription>Lives touched through your donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ImpactChart />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Expirations</CardTitle>
                    <CardDescription>Medicines expiring soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CalendarClock className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Azithromycin - 20 tablets</p>
                          <p className="text-sm text-gray-600">Expires in 10 days</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarClock className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Paracetamol - 15 strips</p>
                          <p className="text-sm text-gray-600">Expires in 5 days</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="donate" className="mt-0">
              <AddMedicineForm />
            </TabsContent>
            
            <TabsContent value="inventory" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Inventory</CardTitle>
                  <CardDescription>All medicines you have donated</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="donor" donorId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Locations</CardTitle>
                  <CardDescription>Geographic view of available medicines</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicineLocationsMap />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
