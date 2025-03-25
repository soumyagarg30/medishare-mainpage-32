
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Building, 
  Search, 
  Package, 
  Users, 
  MapPin, 
  BarChart3, 
  Bell,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";

// Sample available medicines data
const availableMedicines = [
  {
    id: "MED-001",
    name: "Paracetamol",
    quantity: "500 tablets",
    expiryDate: "2024-12-31",
    donor: "John Doe Pharmaceuticals",
    location: "Bandra, Mumbai",
    distance: "2.3 km"
  },
  {
    id: "MED-002",
    name: "Insulin",
    quantity: "25 vials",
    expiryDate: "2024-06-15",
    donor: "MediCare Hospital",
    location: "Andheri, Mumbai",
    distance: "4.5 km"
  },
  {
    id: "MED-003",
    name: "Antibiotic Ointment",
    quantity: "100 tubes",
    expiryDate: "2025-02-28",
    donor: "HealthPlus Clinic",
    location: "Dadar, Mumbai",
    distance: "3.8 km"
  }
];

// Sample inventory data
const inventoryData = [
  {
    id: "INV-001",
    medicine: "Paracetamol",
    quantity: "200 tablets",
    expiryDate: "2024-10-15",
    received: "2023-11-05",
    donor: "John Doe Pharmaceuticals",
    status: "In Stock"
  },
  {
    id: "INV-002",
    medicine: "Vitamin C",
    quantity: "150 tablets",
    expiryDate: "2024-08-20",
    received: "2023-10-12",
    donor: "MediCare Hospital",
    status: "Low Stock"
  },
  {
    id: "INV-003",
    medicine: "Antibiotic Ointment",
    quantity: "30 tubes",
    expiryDate: "2024-05-30",
    received: "2023-12-01",
    donor: "HealthPlus Clinic",
    status: "Distributed"
  }
];

// Sample distribution data
const distributionData = [
  {
    id: "DIST-001",
    recipient: "City Hospital",
    medicine: "Paracetamol",
    quantity: "100 tablets",
    date: "2023-12-15",
    status: "Completed"
  },
  {
    id: "DIST-002",
    recipient: "Rural Health Camp",
    medicine: "Vitamin C",
    quantity: "50 tablets",
    date: "2023-11-20",
    status: "In Transit"
  }
];

// Sample requests data
const requestsData = [
  {
    id: "REQ-001",
    medicine: "Insulin",
    quantity: "10 vials",
    donor: "MediCare Hospital",
    requestDate: "2023-12-01",
    status: "Approved"
  },
  {
    id: "REQ-002",
    medicine: "Antibiotics",
    quantity: "200 tablets",
    donor: "HealthPlus Clinic",
    requestDate: "2023-12-05",
    status: "Pending"
  }
];

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineType, setMedicineType] = useState("all");
  
  const filteredMedicines = availableMedicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (medicineType === "all" || medicine.name.toLowerCase().includes(medicineType.toLowerCase()))
  );
  
  const handleRequest = (medicine) => {
    toast({
      title: "Request Sent",
      description: `Your request for ${medicine.name} has been sent to the donor.`,
    });
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-medishare-dark mb-6">NGO Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-0">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    orientation="vertical" 
                    className="w-full"
                  >
                    <TabsList className="flex flex-col h-auto items-stretch gap-2 bg-transparent">
                      <TabsTrigger 
                        value="profile" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Building size={18} />
                        <span>Profile</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="search" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Search size={18} />
                        <span>Search Medicines</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="inventory" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Package size={18} />
                        <span>Inventory</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="donors" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Users size={18} />
                        <span>Donors</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="location" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <MapPin size={18} />
                        <span>Location Matching</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="distribution" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <BarChart3 size={18} />
                        <span>Distribution</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Bell size={18} />
                        <span>Notifications</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Profile</CardTitle>
                    <CardDescription>Manage your NGO information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="orgName" className="text-sm font-medium">Organization Name</label>
                          <Input id="orgName" placeholder="Health For All NGO" defaultValue="Health For All NGO" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                          <Input id="email" type="email" placeholder="contact@healthforall.org" defaultValue="contact@healthforall.org" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input id="phone" placeholder="+91 9876543210" defaultValue="+91 9876543210" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="uid" className="text-sm font-medium">UID Number</label>
                          <Input id="uid" placeholder="NGO12345678" defaultValue="NGO12345678" readOnly />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Textarea id="address" placeholder="123 Main St, City, State" defaultValue="45 Health Avenue, Bandra, Mumbai, Maharashtra" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Organization Description</label>
                        <Textarea 
                          id="description" 
                          placeholder="Brief description of your organization" 
                          defaultValue="Health For All is a non-profit organization dedicated to providing medical assistance to underprivileged communities." 
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <Button type="button" className="bg-medishare-blue hover:bg-medishare-blue/90">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="search" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Available Medicines</CardTitle>
                    <CardDescription>Find and request medicines from donors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <Input 
                              placeholder="Search medicines..." 
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
                                  <h3 className="font-medium text-lg">{medicine.name}</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Quantity:</span> {medicine.quantity}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Expiry:</span> {medicine.expiryDate}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Donor:</span> {medicine.donor}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Location:</span> {medicine.location}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Button 
                                    className="bg-medishare-orange hover:bg-medishare-gold w-full md:w-auto"
                                    onClick={() => handleRequest(medicine)}
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
              </TabsContent>
              
              <TabsContent value="inventory" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Track and manage medicine inventory</CardDescription>
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
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Received</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryData.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{item.id}</td>
                                <td className="px-4 py-4 text-sm">{item.medicine}</td>
                                <td className="px-4 py-4 text-sm">{item.quantity}</td>
                                <td className="px-4 py-4 text-sm">{item.expiryDate}</td>
                                <td className="px-4 py-4 text-sm">{item.received}</td>
                                <td className="px-4 py-4 text-sm">{item.donor}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === "In Stock" 
                                      ? "bg-green-100 text-green-800" 
                                      : item.status === "Low Stock" 
                                      ? "bg-yellow-100 text-yellow-800" 
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                          Add New Inventory
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="donors" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Donor Interaction</CardTitle>
                    <CardDescription>View and communicate with donors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg">John Doe Pharmaceuticals</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              Bandra, Mumbai
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Recent Donations:</span> Paracetamol, Antibiotics
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline" className="mr-2">Message</Button>
                            <Button className="bg-medishare-blue hover:bg-medishare-blue/90">View History</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg">MediCare Hospital</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              Andheri, Mumbai
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Recent Donations:</span> Insulin, Vitamin C
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline" className="mr-2">Message</Button>
                            <Button className="bg-medishare-blue hover:bg-medishare-blue/90">View History</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg">HealthPlus Clinic</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              Dadar, Mumbai
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Recent Donations:</span> Antibiotic Ointment
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline" className="mr-2">Message</Button>
                            <Button className="bg-medishare-blue hover:bg-medishare-blue/90">View History</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Location-Based Matching</CardTitle>
                    <CardDescription>Find nearby donors with available medicines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Map placeholder */}
                      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                        <p className="text-gray-500">Map View (Will be implemented with a mapping library)</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg">John Doe Pharmaceuticals</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                2.3 km away - Bandra, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Available:</span> Paracetamol, Antibiotics
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Button className="bg-medishare-orange hover:bg-medishare-gold">
                                View Medicines
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg">MediCare Hospital</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                4.5 km away - Andheri, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Available:</span> Insulin, Vitamin C
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Button className="bg-medishare-orange hover:bg-medishare-gold">
                                View Medicines
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="distribution" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Records</CardTitle>
                    <CardDescription>Track medicine distribution to recipients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-medishare-blue">253</p>
                              <p className="text-sm text-gray-500 mt-1">Total Medicines Distributed</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-medishare-orange">47</p>
                              <p className="text-sm text-gray-500 mt-1">Recipients Served</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-green-600">84%</p>
                              <p className="text-sm text-gray-500 mt-1">Distribution Efficiency</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {distributionData.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm">{item.id}</td>
                                <td className="px-4 py-4 text-sm">{item.recipient}</td>
                                <td className="px-4 py-4 text-sm">{item.medicine}</td>
                                <td className="px-4 py-4 text-sm">{item.quantity}</td>
                                <td className="px-4 py-4 text-sm">{item.date}</td>
                                <td className="px-4 py-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === "Completed" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Button variant="ghost" size="sm" className="text-gray-500">
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                          New Distribution
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
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
                            <h4 className="font-medium text-blue-800">Request Approved</h4>
                            <p className="text-sm text-gray-600 mt-1">Your request for Insulin from MediCare Hospital has been approved.</p>
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
                            <h4 className="font-medium">Pending Request</h4>
                            <p className="text-sm text-gray-600 mt-1">Your request for Antibiotics from HealthPlus Clinic is pending approval.</p>
                            <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X size={18} className="text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Request Declined</h4>
                            <p className="text-sm text-gray-600 mt-1">Your request for Vitamins from City Pharmaceuticals was declined.</p>
                            <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NGODashboard;
