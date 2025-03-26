
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DistributionChart from "@/components/charts/DistributionChart";
import { UserCircle, ListChecks, MapPin, Users, PieChart, Activity } from "lucide-react";
import { isAuthenticated, getUser } from "@/utils/auth";
import MedicinesList from "@/components/medicines/MedicinesList";
import MedicineLocationsMap from "@/components/maps/MedicineLocationsMap";

const NGODashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("medicines");
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated and is an NGO
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
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
              <h1 className="text-3xl font-bold text-medishare-dark">NGO Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Reserve medicines and manage distribution
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Your NGO information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-medishare-blue/10 rounded-full p-3">
                    <UserCircle className="h-8 w-8 text-medishare-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.organization || user.name || "NGO"}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{user.address || "No address provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Reserved</CardTitle>
                <CardDescription>Medicines reserved by your NGO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-medishare-orange/10 rounded-full p-3">
                    <ListChecks className="h-8 w-8 text-medishare-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold">8 Medicines</h3>
                    <p className="text-sm text-gray-600">Currently reserved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impact</CardTitle>
                <CardDescription>People helped through your efforts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">~120 People</h3>
                    <p className="text-sm text-gray-600">Helped via your NGO</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[450px] mb-8">
              <TabsTrigger value="medicines" className="flex flex-col items-center gap-1 py-3">
                <ListChecks className="h-4 w-4" />
                <span>Available Medicines</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-3">
                <MapPin className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex flex-col items-center gap-1 py-3">
                <PieChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="medicines" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>Browse and reserve medicines for distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="ngo" />
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
            
            <TabsContent value="analytics" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribution Activity</CardTitle>
                    <CardDescription>Medicine distribution over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <DistributionChart />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Statistics</CardTitle>
                    <CardDescription>People helped by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Elderly</span>
                        </div>
                        <span className="font-medium">42 people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Children</span>
                        </div>
                        <span className="font-medium">35 people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm">Adults</span>
                        </div>
                        <span className="font-medium">28 people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm">Special Needs</span>
                        </div>
                        <span className="font-medium">15 people</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Most Distributed</CardTitle>
                    <CardDescription>Top distributed medicines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-medishare-orange/10 rounded-full p-2">
                          <Activity className="h-5 w-5 text-medishare-orange" />
                        </div>
                        <div>
                          <p className="font-medium">Antibiotics</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-medishare-orange h-1.5 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-medishare-blue/10 rounded-full p-2">
                          <Activity className="h-5 w-5 text-medishare-blue" />
                        </div>
                        <div>
                          <p className="font-medium">Painkillers</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-medishare-blue h-1.5 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 rounded-full p-2">
                          <Activity className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Vitamins</p>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NGODashboard;
