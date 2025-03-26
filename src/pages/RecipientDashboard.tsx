
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, List, MapPin, ShoppingBag, Clock, Activity } from "lucide-react";
import { isAuthenticated, getUser } from "@/utils/auth";
import MedicinesList from "@/components/medicines/MedicinesList";
import MedicineLocationsMap from "@/components/maps/MedicineLocationsMap";

const RecipientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("medicines");
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated and is a recipient
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        navigate("/sign-in");
        return;
      }
      
      const userData = getUser();
      if (!userData || userData.userType !== "recipient") {
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
              <h1 className="text-3xl font-bold text-medishare-dark">Recipient Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Find and request medicine donations
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Your recipient information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-medishare-blue/10 rounded-full p-3">
                    <UserCircle className="h-8 w-8 text-medishare-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name || "Recipient"}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{user.address || "No address provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Requested</CardTitle>
                <CardDescription>Medicines you've requested</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <ShoppingBag className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">5 Requests</h3>
                    <p className="text-sm text-gray-600">Active medicine requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Received</CardTitle>
                <CardDescription>Medicines received by you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">12 Medicines</h3>
                    <p className="text-sm text-gray-600">Received to date</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:w-[450px] mb-8">
              <TabsTrigger value="medicines" className="flex flex-col items-center gap-1 py-3">
                <List className="h-4 w-4" />
                <span>Available Medicines</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-3">
                <MapPin className="h-4 w-4" />
                <span>Map View</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex flex-col items-center gap-1 py-3">
                <Clock className="h-4 w-4" />
                <span>My Requests</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="medicines" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Available Medicines</CardTitle>
                  <CardDescription>Browse medicines available for donation</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicinesList userType="recipient" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map" className="mt-0">
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
            
            <TabsContent value="pending" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>My Medicine Requests</CardTitle>
                  <CardDescription>Medicines you have requested</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ShoppingBag className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">No Pending Requests</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't made any medicine requests yet.
                    </p>
                    <Button 
                      onClick={() => setActiveTab("medicines")}
                      className="bg-medishare-orange hover:bg-medishare-gold"
                    >
                      Browse Available Medicines
                    </Button>
                  </div>
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

export default RecipientDashboard;
