import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import ImpactChart from "@/components/charts/ImpactChart";
import { 
  UserCircle,
  Gift,
  Clock,
  FileText,
  Coins,
  TrendingUp,
  Settings
} from "lucide-react";

// Sample donation history
const donationHistory = [
  {
    id: "DON001",
    date: "2023-12-01",
    amount: "₹5,000",
    ngo: "Health For All NGO",
    medicines: "Paracetamol, Bandages",
    status: "Completed"
  },
  {
    id: "DON002",
    date: "2023-12-15",
    amount: "₹10,000",
    ngo: "Medical Aid Foundation",
    medicines: "Insulin, Syringes",
    status: "Completed"
  },
  {
    id: "DON003",
    date: "2023-11-20",
    amount: "₹2,500",
    ngo: "Care NGO",
    medicines: "Vitamin C, Antiseptic",
    status: "Completed"
  }
];

// Sample impact data
const impactData = {
  medicinesDonated: "500+",
  patientsHelped: "100+",
  ngosSupported: "10+"
};

// Sample medicine categories for donation
const medicineCategories = [
  { value: "antibiotics", label: "Antibiotics" },
  { value: "painkillers", label: "Painkillers" },
  { value: "vitamins", label: "Vitamins" },
  { value: "insulin", label: "Insulin" },
  { value: "first-aid", label: "First Aid Supplies" },
  { value: "others", label: "Others" }
];

// Sample donation NGOs
const ngos = [
  { value: "health-for-all", label: "Health For All NGO" },
  { value: "medical-aid", label: "Medical Aid Foundation" },
  { value: "care-ngo", label: "Care NGO" },
  { value: "healing-hands", label: "Healing Hands" },
  { value: "med-share", label: "MedShare" }
];

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<Partial<UserData>>({});
  
  // Donation form state
  const [donationData, setDonationData] = useState({
    medicineName: "",
    category: "",
    quantity: "",
    expiryDate: "",
    ngo: "",
    description: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      
      if (!isAuth) {
        navigate("/sign-in");
        return;
      }
      
      const userData = getUser();
      if (!userData || userData.userType !== "donor") {
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

  const handleDonationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setDonationData(prev => ({ ...prev, [field]: value }));
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
      
      // Fixed: Using the toast method correctly
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
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
  
  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to a backend
    // Fixed: Using the toast method correctly
    toast({
      title: "Success",
      description: "Donation submitted successfully!",
    });
    
    // Reset form
    setDonationData({
      medicineName: "",
      category: "",
      quantity: "",
      expiryDate: "",
      ngo: "",
      description: ""
    });
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="Donor" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
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
                      onClick={() => setActiveTab("donate")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "donate" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Gift size={18} />
                      <span>Donate Medicines</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("history")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "history" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Clock size={18} />
                      <span>Donation History</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("impact")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <TrendingUp size={18} />
                      <span>Impact</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("tax")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "tax" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <FileText size={18} />
                      <span>Tax Benefits</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("settings")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "settings" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {activeTab === "profile" && (
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">Donor Information</CardTitle>
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
                      
                      {(user.organization || isEditing) && (
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
                      )}
                      
                      {(user.address || isEditing) && (
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
                      )}
                      
                      {(user.phoneNumber || isEditing) && (
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
                      )}
                      
                      {user.verificationId && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">GST Number</p>
                          <p className="text-base">{user.verificationId}</p>
                        </div>
                      )}
                      
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
              
              {activeTab === "donate" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donate Medicines</CardTitle>
                    <CardDescription>Help those in need by donating medicines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitDonation} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="medicineName" className="text-sm font-medium">
                            Medicine Name
                          </label>
                          <Input
                            id="medicineName"
                            name="medicineName"
                            value={donationData.medicineName}
                            onChange={handleDonationInputChange}
                            placeholder="Enter medicine name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium">
                            Category
                          </label>
                          <Select
                            value={donationData.category}
                            onValueChange={(value) => handleSelectChange(value, 'category')}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicineCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="quantity" className="text-sm font-medium">
                            Quantity
                          </label>
                          <Input
                            id="quantity"
                            name="quantity"
                            value={donationData.quantity}
                            onChange={handleDonationInputChange}
                            placeholder="e.g., 100 tablets"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="expiryDate" className="text-sm font-medium">
                            Expiry Date
                          </label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            type="date"
                            value={donationData.expiryDate}
                            onChange={handleDonationInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="ngo" className="text-sm font-medium">
                            NGO to Donate To
                          </label>
                          <Select
                            value={donationData.ngo}
                            onValueChange={(value) => handleSelectChange(value, 'ngo')}
                          >
                            <SelectTrigger id="ngo">
                              <SelectValue placeholder="Select NGO" />
                            </SelectTrigger>
                            <SelectContent>
                              {ngos.map((ngo) => (
                                <SelectItem key={ngo.value} value={ngo.value}>
                                  {ngo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Additional Details
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          value={donationData.description}
                          onChange={handleDonationInputChange}
                          placeholder="Add any additional details about your donation"
                          rows={4}
                        />
                      </div>

                      <div className="pt-4">
                        <Button type="submit" className="w-full md:w-auto">
                          Submit Donation
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "history" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>View your past donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicines</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationHistory.map((donation) => (
                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm">{donation.id}</td>
                              <td className="px-4 py-4 text-sm">{donation.date}</td>
                              <td className="px-4 py-4 text-sm">{donation.amount}</td>
                              <td className="px-4 py-4 text-sm">{donation.ngo}</td>
                              <td className="px-4 py-4 text-sm">{donation.medicines}</td>
                              <td className="px-4 py-4 text-sm">{donation.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "impact" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Impact</CardTitle>
                      <CardDescription>See the difference you're making</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-green-50 border-green-200">
                          <CardBody className="flex flex-col items-center justify-center p-4">
                            <Coins className="h-6 w-6 text-green-600 mb-2" />
                            <CardTitle className="text-2xl font-bold text-green-700">{impactData.medicinesDonated}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">Medicines Donated</CardDescription>
                          </CardBody>
                        </Card>
                        
                        <Card className="bg-blue-50 border-blue-200">
                          <CardBody className="flex flex-col items-center justify-center p-4">
                            <UserCircle className="h-6 w-6 text-blue-600 mb-2" />
                            <CardTitle className="text-2xl font-bold text-blue-700">{impactData.patientsHelped}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">Patients Helped</CardDescription>
                          </CardBody>
                        </Card>
                        
                        <Card className="bg-orange-50 border-orange-200">
                          <CardBody className="flex flex-col items-center justify-center p-4">
                            <Gift className="h-6 w-6 text-orange-600 mb-2" />
                            <CardTitle className="text-2xl font-bold text-orange-700">{impactData.ngosSupported}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">NGOs Supported</CardDescription>
                          </CardBody>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <ImpactChart title="Medicines Donated by Category" className="w-full" />
                </div>
              )}
              
              {activeTab === "tax" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Benefits for Medicine Donations</CardTitle>
                    <CardDescription>Learn how your donations can help reduce your tax burden</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Income Tax Deductions Under Section 80G</h3>
                      <p className="text-gray-600">
                        When you donate medicines through our platform to registered NGOs, you can claim tax deductions under Section 80G of the Income Tax Act. The deduction amount depends on the category of the organization and the type of donation.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Benefits for Corporate Donors</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Donations are eligible for Corporate Social Responsibility (CSR) spending as mandated under Companies Act, 2013.</li>
                        <li>Tax benefits under section 80G - 50% to 100% deduction depending on the receiving organization.</li>
                        <li>Reduced tax liability while making a positive social impact.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Documentation Required</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Donation receipt from the receiving NGO (automatically generated through our platform).</li>
                        <li>80G certificate of the receiving organization (available for download).</li>
                        <li>Your PAN details must be correctly provided during donation.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <h3 className="text-amber-800 font-medium mb-2">Important Note</h3>
                      <p className="text-amber-700 text-sm">
                        Tax benefits may vary based on changes in tax laws and the status of the receiving organization. We recommend consulting with a tax professional for specific advice related to your situation. The information provided here is for general guidance only and does not constitute professional tax advice.
                      </p>
                    </div>
                    
                    <div>
                      <Button variant="outline" className="mt-2">
                        Download Tax Benefit Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="notifications">
                      <TabsList className="mb-4">
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="notifications" className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <p className="text-sm text-gray-500 mb-4">Manage how you receive notifications</p>
                        
                        <div className="space-y-2">
                          <p>Notification settings will be available soon.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="security" className="space-y-4">
                        <h3 className="text-lg font-medium">Security Settings</h3>
                        <p className="text-sm text-gray-500 mb-4">Manage your account security</p>
                        
                        <div className="space-y-2">
                          <p>Security settings will be available soon.</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="privacy" className="space-y-4">
                        <h3 className="text-lg font-medium">Privacy Settings</h3>
                        <p className="text-sm text-gray-500 mb-4">Control your privacy preferences</p>
                        
                        <div className="space-y-2">
                          <p>Privacy settings will be available soon.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
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

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props} />
  )
);
CardBody.displayName = "CardBody";

export default DonorDashboard;
