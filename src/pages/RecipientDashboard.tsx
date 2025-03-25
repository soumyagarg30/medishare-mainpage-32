
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
  UserCircle,
  Search,
  Clock,
  Bell,
  FileText,
  Upload,
  MapPin,
  CheckCircle2,
  Package, 
  X
} from "lucide-react";

// Sample medicine list data
const availableMedicines = [
  {
    id: "MED001",
    name: "Paracetamol",
    quantity: "500 tablets",
    ngo: "Health For All NGO",
    location: "Bandra, Mumbai",
    distance: "2.3 km"
  },
  {
    id: "MED002",
    name: "Insulin",
    quantity: "25 vials",
    ngo: "Medical Aid Foundation",
    location: "Andheri, Mumbai",
    distance: "4.5 km"
  },
  {
    id: "MED003",
    name: "Vitamin C",
    quantity: "200 tablets",
    ngo: "Care NGO",
    location: "Dadar, Mumbai",
    distance: "3.8 km"
  }
];

// Sample request history
const requestHistory = [
  {
    id: "REQ001",
    medicine: "Paracetamol",
    quantity: "50 tablets",
    requestDate: "2023-12-01",
    ngo: "Health For All NGO",
    status: "Approved",
    deliveryDate: "2023-12-05"
  },
  {
    id: "REQ002",
    medicine: "Insulin",
    quantity: "5 vials",
    requestDate: "2023-12-10",
    ngo: "Medical Aid Foundation",
    status: "Pending",
    deliveryDate: null
  },
  {
    id: "REQ003",
    medicine: "Antibiotics",
    quantity: "30 tablets",
    requestDate: "2023-11-15",
    ngo: "Care NGO",
    status: "Delivered",
    deliveryDate: "2023-11-20"
  }
];

const RecipientDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [medicineType, setMedicineType] = useState("all");
  const [fileUploaded, setFileUploaded] = useState(false);
  
  const filteredMedicines = availableMedicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (medicineType === "all" || medicine.name.toLowerCase().includes(medicineType.toLowerCase()))
  );
  
  const handleRequest = (medicine) => {
    if (!fileUploaded) {
      toast({
        title: "Prescription Required",
        description: "Please upload a prescription before requesting medicine.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Request Sent",
      description: `Your request for ${medicine.name} has been sent to ${medicine.ngo}.`,
    });
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUploaded(true);
      toast({
        title: "Prescription Uploaded",
        description: "Your prescription has been uploaded successfully.",
      });
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-medishare-dark mb-6">Recipient Dashboard</h1>
          
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
                        <UserCircle size={18} />
                        <span>Profile</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="browse" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Search size={18} />
                        <span>Browse Medicines</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="requests" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Clock size={18} />
                        <span>Request Status</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <Bell size={18} />
                        <span>Notifications</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history" 
                        className="flex items-center justify-start gap-2 px-4 py-3 data-[state=active]:bg-medishare-blue/10 data-[state=active]:text-medishare-blue"
                      >
                        <FileText size={18} />
                        <span>Transaction History</span>
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
                    <CardTitle>Recipient Profile</CardTitle>
                    <CardDescription>Manage your personal or institutional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Full Name / Institution Name</label>
                          <Input id="name" placeholder="John Doe / City Hospital" defaultValue="City Hospital" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                          <Input id="email" type="email" placeholder="contact@cityhospital.org" defaultValue="contact@cityhospital.org" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input id="phone" placeholder="+91 9876543210" defaultValue="+91 9876543210" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="digilocker" className="text-sm font-medium">DigiLocker ID</label>
                          <Input id="digilocker" placeholder="Your DigiLocker ID" defaultValue="DL12345678" readOnly />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Textarea id="address" placeholder="123 Main St, City, State" defaultValue="78 Hospital Road, Dadar, Mumbai, Maharashtra" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="medicalNeeds" className="text-sm font-medium">Regular Medical Needs (Optional)</label>
                        <Textarea 
                          id="medicalNeeds" 
                          placeholder="List any regular medications you need" 
                          defaultValue="Insulin, Blood Pressure Medication, Antibiotics" 
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
              
              <TabsContent value="browse" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Browse Available Medicines</CardTitle>
                    <CardDescription>Search for available medicines and submit requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-800">Upload Prescription</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              Please upload a valid prescription before requesting medicines.
                            </p>
                          </div>
                          <div>
                            <label className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 rounded-md hover:bg-amber-50">
                                <Upload size={16} className="text-amber-600" />
                                <span className="text-sm text-amber-700">Upload</span>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*, application/pdf"
                                onChange={handleFileUpload}
                              />
                            </label>
                          </div>
                        </div>
                        {fileUploaded && (
                          <div className="mt-2 flex items-center gap-2 text-green-600">
                            <CheckCircle2 size={16} />
                            <span className="text-sm">Prescription uploaded successfully!</span>
                          </div>
                        )}
                      </div>
                      
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
                                      <span className="font-medium">NGO:</span> {medicine.ngo}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Location:</span> {medicine.location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <MapPin className="h-4 w-4 inline mr-1" />
                                      {medicine.distance} away
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
              
              <TabsContent value="requests" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Status</CardTitle>
                    <CardDescription>Track the status of your medicine requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requestHistory.map((request) => (
                        <div 
                          key={request.id} 
                          className={`p-4 border rounded-lg ${
                            request.status === "Approved" 
                              ? "bg-blue-50 border-blue-200" 
                              : request.status === "Delivered" 
                              ? "bg-green-50 border-green-200"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{request.medicine}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  request.status === "Approved" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : request.status === "Pending" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Quantity:</span> {request.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">NGO:</span> {request.ngo}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Request Date:</span> {request.requestDate}
                                </p>
                                {request.deliveryDate && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Delivery Date:</span> {request.deliveryDate}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button 
                                variant={request.status === "Delivered" ? "outline" : "default"}
                                className={request.status === "Delivered" ? "" : "bg-medishare-blue hover:bg-medishare-blue/90"}
                              >
                                {request.status === "Delivered" ? "View Details" : "Track Request"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                            <p className="text-sm text-gray-600 mt-1">Your request for Insulin has been approved by Medical Aid Foundation.</p>
                            <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
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
                            <p className="text-sm text-gray-600 mt-1">Paracetamol is now available from Health For All NGO.</p>
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
                            <h4 className="font-medium">Reminder</h4>
                            <p className="text-sm text-gray-600 mt-1">Your prescription will expire in 7 days. Please upload a new one.</p>
                            <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View your past medicine requests and receipts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestHistory.map((request) => (
                            <tr key={request.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm">{request.id}</td>
                              <td className="px-4 py-4 text-sm">{request.medicine}</td>
                              <td className="px-4 py-4 text-sm">{request.quantity}</td>
                              <td className="px-4 py-4 text-sm">{request.ngo}</td>
                              <td className="px-4 py-4 text-sm">{request.requestDate}</td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  request.status === "Delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : request.status === "Approved" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm">
                                {request.status === "Delivered" && (
                                  <Button variant="ghost" size="sm" className="text-medishare-blue">
                                    <FileText className="h-4 w-4 mr-1" /> Download
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default RecipientDashboard;
