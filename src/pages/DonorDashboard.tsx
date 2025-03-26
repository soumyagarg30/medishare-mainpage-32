
import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Package, History, Settings } from "lucide-react";

const DonorDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <ProtectedRoute allowedRoles={["donor", "admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 px-4 md:px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <header className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                    <p className="text-gray-500">Donor Dashboard</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-medishare-orange text-medishare-orange hover:bg-medishare-orange hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            </header>
            
            <Tabs defaultValue="donations" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="donations" className="mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Donations</CardTitle>
                      <CardDescription>Manage your medicine donations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full bg-medishare-orange hover:bg-medishare-gold">
                          <Plus className="mr-2 h-4 w-4" /> Donate Medicines
                        </Button>
                        
                        <div className="border rounded-lg p-4 text-center">
                          <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">No active donations yet</p>
                          <p className="text-sm text-gray-400">When you donate medicines, they'll appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>View your past medicine donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 text-center">
                      <History className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No donation history yet</p>
                      <p className="text-sm text-gray-400">Your donation history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <div className="mt-1 p-2 border rounded-md">{user?.name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <div className="mt-1 p-2 border rounded-md">{user?.email}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <div className="mt-1 p-2 border rounded-md capitalize">{user?.role}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-medishare-orange hover:bg-medishare-gold">
                      Edit Profile
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email updates about your donations</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-medishare-orange focus:ring-medishare-orange"
                            defaultChecked
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Receive text message updates</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="sms-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-medishare-orange focus:ring-medishare-orange"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-medishare-orange hover:bg-medishare-gold">
                      Save Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DonorDashboard;
