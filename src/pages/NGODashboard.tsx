
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "@/components/WelcomeMessage";
import DashboardUserInfo from "@/components/DashboardUserInfo";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserCircle,
  Package2,
  Search,
  Clock,
  Bell,
  BarChart3,
  MapPin,
  CheckCircle2,
  Truck,
  Users
} from "lucide-react";
import DonorsMap from "@/components/maps/DonorsMap";
import ImpactChart from "@/components/charts/ImpactChart";
import DonationChart from "@/components/charts/DonationChart";

// Sample available medicines data
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

// Sample inventory items
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

// Sample distribution history
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

// Sample request status data
const requestStatusData = [
  {
    id: "REQ001",
    medicine: "Insulin",
    quantity: "10 vials",
    requestedFrom: "MediCare Hospital",
    requestDate: "2023-12-15",
    status: "Approved"
  },
  {
    id: "REQ002",
    medicine: "Antibiotics",
    quantity: "200 capsules",
    requestedFrom: "City Pharmacy",
    requestDate: "2023-12-18",
    status: "Pending"
  },
  {
    id: "REQ003",
    medicine: "Vitamins",
    quantity: "100 tablets",
    requestedFrom: "HealthPlus Clinic",
    requestDate: "2023-12-20",
    status: "Rejected"
  }
];

// Sample impact data
const impactData = {
  totalMedicinesReceived: 1250,
  totalMedicinesDistributed: 850,
  beneficiariesServed: 345,
  activeDonors: 24
};

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<Partial<UserData>>({});
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
      setEditableUserData({
        name: userData.name,
        organization: userData.organization,
        address: userData.address,
        phoneNumber: userData.phoneNumber
      });
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // In a real application, this would send the updated profile data to the backend
    if (user) {
      const updatedUser = { 
        ...user, 
        ...editableUserData 
      };
      
      // Update local storage for demo purposes
      // In a real app, you would make an API call here
      localStorage.setItem('medishare_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditableUserData({
        name: user.name,
        organization: user.organization,
        address: user.address,
        phoneNumber: user.phoneNumber
      });
    }
    setIsEditing(false);
  };

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
                      <Package2 size={18} />
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
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">NGO Partner Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleCancelEdit}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSaveProfile}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        {isEditing ? (
                          <Input
                            name="name"
                            value={editableUserData.name || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.name || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization</p>
                        {isEditing ? (
                          <Input
                            name="organization"
                            value={editableUserData.organization || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.organization || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        {isEditing ? (
                          <Input
                            name="address"
                            value={editableUserData.address || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.address || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        {isEditing ? (
                          <Input
                            name="phoneNumber"
                            value={editableUserData.phoneNumber || ""}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-base">{user.phoneNumber || "Not provided"}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">UID Number</p>
                        <p className="text-base">{user.verificationId || "Not provided"}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Created</p>
                        <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Verification Status</p>
                        <p className={`text-base ${user.verified ? "text-green-600" : "text-amber-600"}`}>
                          {user.verified ? "Verified" : "Pending Verification"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "available" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Medicines</CardTitle>
                    <CardDescription>Browse and request medicines from donors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Input placeholder="Search medicines..." className="max-w-sm" />
                        <Button variant="outline">Filter</Button>
                        <Button>Search</Button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {availableMedicines.map((medicine) => (
                              <tr key={medicine.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{medicine.id}</td>
                                <td className="px-4 py-4 text-sm font-medium">{medicine.name}</td>
                                <td className="px-4 py-4 text-sm">{medicine.quantity}</td>
                                <td className="px-4 py-4 text-sm">{medicine.donor}</td>
                                <td className="px-4 py-4 text-sm">{medicine.expiryDate}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    medicine.status === "Available" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-amber-100 text-amber-800"
                                  }`}>
                                    {medicine.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-medishare-blue">
                                    Request
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
                    <div className="space-y-6">
                      <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                        + Create New Request
                      </Button>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Requested From</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Request Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requestStatusData.map((request) => (
                              <tr key={request.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{request.id}</td>
                                <td className="px-4 py-4 text-sm font-medium">{request.medicine}</td>
                                <td className="px-4 py-4 text-sm">{request.quantity}</td>
                                <td className="px-4 py-4 text-sm">{request.requestedFrom}</td>
                                <td className="px-4 py-4 text-sm">{request.requestDate}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    request.status === "Approved" 
                                      ? "bg-green-100 text-green-800" 
                                      : request.status === "Pending" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {request.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-medishare-blue">
                                    Details
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <ImpactChart title="Medicines by Category" />
                      <DonationChart title="Monthly Donation Trends" />
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
                    <DonorsMap title="Nearby Donors" className="mb-6" />
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Available Medicines</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium">John Doe Pharmaceuticals</td>
                            <td className="px-4 py-4 text-sm">2.5 km</td>
                            <td className="px-4 py-4 text-sm">Antibiotics, Painkillers, Insulin</td>
                            <td className="px-4 py-4 text-sm">
                              <Button variant="ghost" size="sm" className="text-medishare-blue">
                                Contact
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium">MediCare Hospital</td>
                            <td className="px-4 py-4 text-sm">1.8 km</td>
                            <td className="px-4 py-4 text-sm">Asthma Inhalers, Diabetes Medication</td>
                            <td className="px-4 py-4 text-sm">
                              <Button variant="ghost" size="sm" className="text-medishare-blue">
                                Contact
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm font-medium">HealthPlus Clinic</td>
                            <td className="px-4 py-4 text-sm">3.2 km</td>
                            <td className="px-4 py-4 text-sm">Vitamin C, Antibiotic Ointment</td>
                            <td className="px-4 py-4 text-sm">
                              <Button variant="ghost" size="sm" className="text-medishare-blue">
                                Contact
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                            <Package2 size={18} className="text-green-500" />
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
