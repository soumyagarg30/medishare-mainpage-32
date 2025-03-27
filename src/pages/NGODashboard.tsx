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
  Package,
  Search,
  Clock,
  Bell,
  BarChart3,
  MapPin,
  CheckCircle2,
  Truck,
  Users
} from "lucide-react";

const availableMedicines = [
  {
    id: "MED001",
    name: "Paracetamol",
    quantity: "500 tablets",
    donor: "John Doe Pharmaceuticals",
    expiryDate: "2024-12-31",
    status: "Available"
  },
  {
    id: "MED002",
    name: "Insulin",
    quantity: "25 vials",
    donor: "MediCare Hospital",
    expiryDate: "2024-06-15",
    status: "Available"
  },
  {
    id: "MED003",
    name: "Vitamin C",
    quantity: "200 tablets",
    donor: "HealthPlus Clinic",
    expiryDate: "2024-10-20",
    status: "Reserved"
  }
];

const inventoryItems = [
  {
    id: "INV001",
    name: "Paracetamol",
    quantity: "350 tablets",
    receivedFrom: "John Doe Pharmaceuticals",
    receivedDate: "2023-11-10",
    expiryDate: "2024-12-31",
    status: "In Stock"
  },
  {
    id: "INV002",
    name: "Antibiotics",
    quantity: "100 capsules",
    receivedFrom: "MediCare Hospital",
    receivedDate: "2023-11-15",
    expiryDate: "2024-08-20",
    status: "In Stock"
  },
  {
    id: "INV003",
    name: "Insulin",
    quantity: "15 vials",
    receivedFrom: "MediCare Hospital",
    receivedDate: "2023-11-20",
    expiryDate: "2024-06-15",
    status: "Low Stock"
  }
];

const distributionHistory = [
  {
    id: "DIST001",
    medicine: "Paracetamol",
    quantity: "50 tablets",
    recipient: "City Hospital",
    date: "2023-12-01",
    status: "Delivered"
  },
  {
    id: "DIST002",
    medicine: "Antibiotics",
    quantity: "20 capsules",
    recipient: "Rural Health Camp",
    date: "2023-12-05",
    status: "In Transit"
  },
  {
    id: "DIST003",
    medicine: "Insulin",
    quantity: "5 vials",
    recipient: "Private Clinic",
    date: "2023-12-10",
    status: "Processing"
  }
];

const impactData = {
  totalMedicinesReceived: 1250,
  totalMedicinesDistributed: 850,
  beneficiariesServed: 345,
  activeDonors: 24
};

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="NGO Partner" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
                      onClick={() => setActiveTab("available")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "available" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Search size={18} />
                      <span>Available Medicines</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("inventory")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "inventory" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Package size={18} />
                      <span>Inventory Management</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("distribution")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "distribution" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Truck size={18} />
                      <span>Distribution</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("requests")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "requests" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Clock size={18} />
                      <span>Request Status</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("impact")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <BarChart3 size={18} />
                      <span>Impact Metrics</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("donors")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donors" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <MapPin size={18} />
                      <span>Donors Near Me</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "notifications" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-9">
              {activeTab === "profile" && (
                <DashboardUserInfo user={user} userTypeTitle="NGO Partner" />
              )}
              
              {activeTab === "available" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Medicines</CardTitle>
                    <CardDescription>Browse and request medicines from donors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <Input 
                              placeholder="Search available medicines..." 
                              className="pl-10" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-1/3">
                          <Select value={medicineType} onValueChange={setMedicineType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="paracetamol">Paracetamol</SelectItem>
                              <SelectItem value="insulin">Insulin</SelectItem>
                              <SelectItem value="antibiotic">Antibiotics</SelectItem>
                              <SelectItem value="vitamin">Vitamins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {filteredMedicines.length > 0 ? (
                          filteredMedicines.map((medicine) => (
                            <div key={medicine.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">{medicine.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      medicine.status === "Available" 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                      {medicine.status}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Quantity:</span> {medicine.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Expiry Date:</span> {medicine.expiryDate}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Donor:</span> {medicine.donor}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Button 
                                    className="bg-medishare-orange hover:bg-medishare-gold w-full md:w-auto"
                                    onClick={() => handleRequestMedicine(medicine)}
                                    disabled={medicine.status !== "Available"}
                                  >
                                    Request Medicine
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-gray-500">No medicines found matching your search.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "inventory" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Track and manage medicines in your inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Received From</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Received Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{item.id}</td>
                                <td className="px-4 py-4 text-sm font-medium">{item.name}</td>
                                <td className="px-4 py-4 text-sm">{item.quantity}</td>
                                <td className="px-4 py-4 text-sm">{item.receivedFrom}</td>
                                <td className="px-4 py-4 text-sm">{item.receivedDate}</td>
                                <td className="px-4 py-4 text-sm">{item.expiryDate}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === "In Stock" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-medishare-blue">
                                    Update
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                          + Add New Item
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "distribution" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Management</CardTitle>
                    <CardDescription>Track medicine distribution to recipients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Button className="bg-medishare-orange hover:bg-medishare-gold">
                        + Create New Distribution
                      </Button>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {distributionHistory.map((distribution) => (
                              <tr key={distribution.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{distribution.id}</td>
                                <td className="px-4 py-4 text-sm">{distribution.medicine}</td>
                                <td className="px-4 py-4 text-sm">{distribution.quantity}</td>
                                <td className="px-4 py-4 text-sm">{distribution.recipient}</td>
                                <td className="px-4 py-4 text-sm">{distribution.date}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    distribution.status === "Delivered" 
                                      ? "bg-green-100 text-green-800" 
                                      : distribution.status === "In Transit" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {distribution.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-medishare-blue">
                                    Update
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "requests" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Status</CardTitle>
                    <CardDescription>Track the status of your medicine requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">Paracetamol</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Approved
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Quantity:</span> 200 tablets
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Donor:</span> John Doe Pharmaceuticals
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Request Date:</span> 2023-12-01
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Expected Delivery:</span> 2023-12-10
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                              Track Delivery
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">Insulin</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Quantity:</span> 20 vials
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Donor:</span> MediCare Hospital
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Request Date:</span> 2023-12-05
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline">
                              Cancel Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "impact" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Metrics</CardTitle>
                    <CardDescription>Track your organization's impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-blue">{impactData.totalMedicinesReceived}</p>
                            <p className="text-sm text-gray-500 mt-1">Medicines Received</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-orange">{impactData.totalMedicinesDistributed}</p>
                            <p className="text-sm text-gray-500 mt-1">Medicines Distributed</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{impactData.beneficiariesServed}</p>
                            <p className="text-sm text-gray-500 mt-1">Beneficiaries Served</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{impactData.activeDonors}</p>
                            <p className="text-sm text-gray-500 mt-1">Active Donors</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <DistributionChart title="Medicine Distribution Trends" />
                      <ImpactChart title="Medicine Categories" />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "donors" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donors Near Me</CardTitle>
                    <CardDescription>Find donors in your area that have medicines available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <DonorsMap title="" className="border-0 shadow-none" />
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">John Doe Pharmaceuticals</h3>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                2.3 km away - Bandra, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Available Medicines: Antibiotics, Painkillers, Insulin
                              </p>
                            </div>
                            <Button className="h-9 bg-medishare-orange hover:bg-medishare-gold">
                              Contact
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">MediCare Hospital</h3>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                4.1 km away - Andheri, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Available Medicines: Asthma Inhalers, Diabetes Medication
                              </p>
                            </div>
                            <Button className="h-9 bg-medishare-orange hover:bg-medishare-gold">
                              Contact
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">HealthPlus Clinic</h3>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                3.8 km away - Juhu, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Available Medicines: Vitamin C, Antibiotic Ointment
                              </p>
                            </div>
                            <Button className="h-9 bg-medishare-orange hover:bg-medishare-gold">
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated with the latest alerts and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <CheckCircle2 size={18} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">Medicine Request Approved</h4>
                            <p className="text-sm text-gray-600 mt-1">Your request for Paracetamol from John Doe Pharmaceuticals has been approved.</p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Package size={18} className="text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">New Medicine Available</h4>
                            <p className="text-sm text-gray-600 mt-1">MediCare Hospital has added Insulin to available donations.</p>
                            <p className="text-xs text-gray-500 mt-2">Yesterday</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Bell size={18} className="text-yellow-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Low Stock Alert</h4>
                            <p className="text-sm text-gray-600 mt-1">Insulin inventory is running low. Consider requesting more.</p>
                            <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default NGODashboard;
