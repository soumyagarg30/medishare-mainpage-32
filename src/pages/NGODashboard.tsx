
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCircle, List, BarChart, MapPin, Package, Activity } from "lucide-react";
import { isAuthenticated, getUser } from "@/utils/auth";
import MedicinesList from "@/components/medicines/MedicinesList";
import MedicineLocationsMap from "@/components/maps/MedicineLocationsMap";
import DistributionChart from "@/components/charts/DistributionChart";

const NGODashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available");
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
                Find and request medicine donations for distribution
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
                <CardDescription>Medicines you've reserved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">5 Medicines</h3>
                    <p className="text-sm text-gray-600">Waiting for pickup</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distributed</CardTitle>
                <CardDescription>Medicines distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">103 Medicines</h3>
                    <p className="text-sm text-gray-600">Distributed to date</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <TabsList className="grid grid-cols-3 md:w-[450px]">
              <TabsTrigger value="available" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                <span>Available</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="available">
              <Card>
                <CardHeader>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>Explore medicines available for reservation</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="ngo" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Locations</CardTitle>
                  <CardDescription>Find medicines near you</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicineLocationsMap />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Analytics</CardTitle>
                  <CardDescription>Track your medicine distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <DistributionChart title="Distribution Analytics" />
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

export default NGODashboard;
