
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  CheckSquare, 
  Activity, 
  BarChart3, 
  Package, 
  Bell, 
  FileText,
  CheckCircle2,
  X,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Search
} from "lucide-react";

// Sample user management data
const userRequests = [
  {
    id: "USER001",
    name: "John Doe Pharmaceuticals",
    type: "Donor",
    email: "contact@johndoepharma.com",
    verification: "GST: 22AAAAA0000A1Z5",
    registeredDate: "2023-12-01",
    status: "Pending"
  },
  {
    id: "USER002",
    name: "Health For All NGO",
    type: "NGO",
    email: "contact@healthforall.org",
    verification: "UID: NGO12345678",
    registeredDate: "2023-12-02",
    status: "Pending"
  },
  {
    id: "USER003",
    name: "City Hospital",
    type: "Recipient",
    email: "admin@cityhospital.org",
    verification: "DigiLocker: DL12345678",
    registeredDate: "2023-12-03",
    status: "Pending"
  },
];

const approvedUsers = [
  {
    id: "USER004",
    name: "MediCare Hospital",
    type: "Donor",
    email: "contact@medicare.com",
    verification: "GST: 22BBBBB0000B1Z5",
    registeredDate: "2023-11-15",
    status: "Approved"
  },
  {
    id: "USER005",
    name: "Medical Aid Foundation",
    type: "NGO",
    email: "info@medicalaid.org",
    verification: "UID: NGO87654321",
    registeredDate: "2023-11-20",
    status: "Approved"
  }
];

// Sample medicine approval data
const medicineApprovals = [
  {
    id: "MED001",
    name: "Paracetamol",
    quantity: "500 tablets",
    donor: "John Doe Pharmaceuticals",
    expiryDate: "2024-12-31",
    donationDate: "2023-12-01",
    status: "Pending"
  },
  {
    id: "MED002",
    name: "Insulin",
    quantity: "25 vials",
    donor: "MediCare Hospital",
    expiryDate: "2024-06-15",
    donationDate: "2023-12-02",
    status: "Pending"
  },
  {
    id: "MED003",
    name: "Antibiotic Ointment",
    quantity: "100 tubes",
    donor: "HealthPlus Clinic",
    expiryDate: "2025-02-28",
    donationDate: "2023-12-03",
    status: "Pending"
  }
];

// Sample transaction data
const transactionData = [
  {
    id: "TXN001",
    medicine: "Paracetamol",
    quantity: "100 tablets",
    donor: "John Doe Pharmaceuticals",
    ngo: "Health For All NGO",
    recipient: "City Hospital",
    date: "2023-12-05",
    status: "Completed"
  },
  {
    id: "TXN002",
    medicine: "Insulin",
    quantity: "10 vials",
    donor: "MediCare Hospital",
    ngo: "Medical Aid Foundation",
    recipient: "Rural Health Camp",
    date: "2023-12-08",
    status: "In Progress"
  }
];

// Sample metrics data
const metricsData = {
  totalUsers: 156,
  totalDonors: 52,
  totalNGOs: 38,
  totalRecipients: 66,
  totalMedicines: 845,
  totalTransactions: 312,
  donationsApproved: 278,
  donationsRejected: 34
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleApproveUser = (user) => {
    toast({
      title: "User Approved",
      description: `${user.name} has been approved successfully.`,
    });
  };
  
  const handleRejectUser = (user) => {
    toast({
      title: "User Rejected",
      description: `${user.name} has been rejected.`,
    });
  };
  
  const handleApproveMedicine = (medicine) => {
    toast({
      title: "Medicine Approved",
      description: `${medicine.name} donation has been approved successfully.`,
    });
  };
  
  const handleRejectMedicine = (medicine) => {
    toast({
      title: "Medicine Rejected",
      description: `${medicine.name} donation has been rejected.`,
    });
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-medishare-dark mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
                    <button 
                      onClick={() => setActiveTab("users")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "users" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Users size={18} />
                      <span>User Management</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("medicines")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "medicines" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <CheckSquare size={18} />
                      <span>Medicine Approval</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("transactions")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "transactions" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Activity size={18} />
                      <span>Transaction Monitoring</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("analytics")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "analytics" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <BarChart3 size={18} />
                      <span>Analytics & Reports</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("inventory")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "inventory" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Package size={18} />
                      <span>Inventory Oversight</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "notifications" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("audit")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "audit" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <FileText size={18} />
                      <span>Audit Logs</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {activeTab === "users" && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Approve or reject user registrations after verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Pending Approvals</h3>
                        <div className="w-1/3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input 
                              placeholder="Search users..." 
                              className="pl-9 h-9" 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Verification</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userRequests.map((user) => (
                              <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{user.id}</td>
                                <td className="px-4 py-4 text-sm font-medium">{user.name}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.type === "Donor" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : user.type === "NGO" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-purple-100 text-purple-800"
                                  }`}>
                                    {user.type}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">{user.email}</td>
                                <td className="px-4 py-4 text-sm">{user.verification}</td>
                                <td className="px-4 py-4 text-sm">{user.registeredDate}</td>
                                <td className="px-4 py-4 text-sm">
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-transparent"
                                      onClick={() => {}}
                                    >
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-transparent text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleApproveUser(user)}
                                    >
                                      <UserCheck className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleRejectUser(user)}
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Approved Users</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Verification</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {approvedUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-4 text-sm">{user.id}</td>
                                  <td className="px-4 py-4 text-sm font-medium">{user.name}</td>
                                  <td className="px-4 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      user.type === "Donor" 
                                        ? "bg-blue-100 text-blue-800" 
                                        : user.type === "NGO" 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-purple-100 text-purple-800"
                                    }`}>
                                      {user.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-sm">{user.email}</td>
                                  <td className="px-4 py-4 text-sm">{user.verification}</td>
                                  <td className="px-4 py-4 text-sm">{user.registeredDate}</td>
                                  <td className="px-4 py-4 text-sm">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-transparent text-gray-500"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "medicines" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medicine Approval</CardTitle>
                    <CardDescription>Approve or reject donated medicines based on uploaded details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Pending Medicine Approvals</h3>
                        <div className="w-1/3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input 
                              placeholder="Search medicines..." 
                              className="pl-9 h-9" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {medicineApprovals.map((medicine) => (
                          <div key={medicine.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-lg">{medicine.name}</h3>
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1 mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Quantity:</span> {medicine.quantity}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Donor:</span> {medicine.donor}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Expiry:</span> {medicine.expiryDate}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Donation Date:</span> {medicine.donationDate}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  className="bg-transparent text-gray-600"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="bg-transparent text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleApproveMedicine(medicine)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleRejectMedicine(medicine)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "transactions" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Monitoring</CardTitle>
                    <CardDescription>Track all transactions between donors, NGOs, and recipients</CardDescription>
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
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionData.map((transaction) => (
                              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{transaction.id}</td>
                                <td className="px-4 py-4 text-sm">{transaction.medicine}</td>
                                <td className="px-4 py-4 text-sm">{transaction.quantity}</td>
                                <td className="px-4 py-4 text-sm">{transaction.donor}</td>
                                <td className="px-4 py-4 text-sm">{transaction.ngo}</td>
                                <td className="px-4 py-4 text-sm">{transaction.recipient}</td>
                                <td className="px-4 py-4 text-sm">{transaction.date}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    transaction.status === "Completed" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {transaction.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-gray-500">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Showing 2 of 312 transactions</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>Previous</Button>
                          <Button variant="outline" size="sm">Next</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics & Reports</CardTitle>
                    <CardDescription>Overview of platform metrics and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-medishare-blue">{metricsData.totalUsers}</p>
                              <p className="text-sm text-gray-500 mt-1">Total Users</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-medishare-orange">{metricsData.totalMedicines}</p>
                              <p className="text-sm text-gray-500 mt-1">Total Medicines</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-green-600">{metricsData.totalTransactions}</p>
                              <p className="text-sm text-gray-500 mt-1">Total Transactions</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-purple-600">{metricsData.donationsApproved}</p>
                              <p className="text-sm text-gray-500 mt-1">Donations Approved</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Donation Trends Chart Placeholder */}
                        <Card className="col-span-1 md:col-span-2">
                          <CardHeader>
                            <CardTitle className="text-lg">Donation Trends</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                              <p className="text-gray-500">Donation Trends Chart (Will be implemented with Recharts)</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* User Distribution Chart Placeholder */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">User Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                              <p className="text-gray-500">User Distribution Chart</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                              <div>
                                <p className="text-lg font-bold text-blue-600">{metricsData.totalDonors}</p>
                                <p className="text-xs text-gray-500">Donors</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-green-600">{metricsData.totalNGOs}</p>
                                <p className="text-xs text-gray-500">NGOs</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-purple-600">{metricsData.totalRecipients}</p>
                                <p className="text-xs text-gray-500">Recipients</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Approval Rates Chart Placeholder */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Approval Rates</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                              <p className="text-gray-500">Approval Rates Chart</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                              <div>
                                <p className="text-lg font-bold text-green-600">{metricsData.donationsApproved}</p>
                                <p className="text-xs text-gray-500">Approved</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-red-600">{metricsData.donationsRejected}</p>
                                <p className="text-xs text-gray-500">Rejected</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Full Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "inventory" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Oversight</CardTitle>
                    <CardDescription>Monitor overall medicine availability across all NGOs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGOs</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Average Expiry</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm font-medium">Paracetamol</td>
                              <td className="px-4 py-4 text-sm">1,250 tablets</td>
                              <td className="px-4 py-4 text-sm">8 NGOs</td>
                              <td className="px-4 py-4 text-sm">2024-10-15</td>
                              <td className="px-4 py-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Sufficient
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm font-medium">Insulin</td>
                              <td className="px-4 py-4 text-sm">45 vials</td>
                              <td className="px-4 py-4 text-sm">4 NGOs</td>
                              <td className="px-4 py-4 text-sm">2024-06-30</td>
                              <td className="px-4 py-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Low Stock
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm font-medium">Antibiotics</td>
                              <td className="px-4 py-4 text-sm">320 tablets</td>
                              <td className="px-4 py-4 text-sm">6 NGOs</td>
                              <td className="px-4 py-4 text-sm">2024-08-15</td>
                              <td className="px-4 py-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Sufficient
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm font-medium">Vitamin C</td>
                              <td className="px-4 py-4 text-sm">150 tablets</td>
                              <td className="px-4 py-4 text-sm">3 NGOs</td>
                              <td className="px-4 py-4 text-sm">2024-09-20</td>
                              <td className="px-4 py-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Critical Low
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>System alerts and important updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Bell size={18} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">New Registration</h4>
                            <p className="text-sm text-gray-600 mt-1">A new NGO has registered and is awaiting approval.</p>
                            <p className="text-xs text-gray-500 mt-2">15 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Package size={18} className="text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Medicine Donation</h4>
                            <p className="text-sm text-gray-600 mt-1">John Doe Pharmaceuticals has submitted a new donation.</p>
                            <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Clock size={18} className="text-yellow-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Expiring Inventory</h4>
                            <p className="text-sm text-gray-600 mt-1">Some medicines will expire in the next 30 days. Review needed.</p>
                            <p className="text-xs text-gray-500 mt-2">3 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "audit" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>Track system activities for compliance and security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Timestamp</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Details</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">IP Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">2023-12-05 10:15 AM</td>
                            <td className="px-4 py-4 text-sm">admin@medishare.org</td>
                            <td className="px-4 py-4 text-sm">User Approval</td>
                            <td className="px-4 py-4 text-sm">Approved registration of Health For All NGO</td>
                            <td className="px-4 py-4 text-sm">192.168.1.1</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">2023-12-05 09:32 AM</td>
                            <td className="px-4 py-4 text-sm">admin@medishare.org</td>
                            <td className="px-4 py-4 text-sm">Medicine Approval</td>
                            <td className="px-4 py-4 text-sm">Approved Paracetamol donation from John Doe Pharmaceuticals</td>
                            <td className="px-4 py-4 text-sm">192.168.1.1</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">2023-12-04 04:45 PM</td>
                            <td className="px-4 py-4 text-sm">admin@medishare.org</td>
                            <td className="px-4 py-4 text-sm">Login</td>
                            <td className="px-4 py-4 text-sm">Successful admin login</td>
                            <td className="px-4 py-4 text-sm">192.168.1.1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500">Showing 3 of 1,245 logs</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
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

export default AdminDashboard;
