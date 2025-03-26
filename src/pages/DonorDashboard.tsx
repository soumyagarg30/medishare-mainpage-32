import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationPermission from "@/components/LocationPermission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { 
  UserCircle, 
  Package, 
  History, 
  BarChart3, 
  Bell, 
  MapPin,
  Upload,
  Calendar,
  FileText,
  Lock,
  Phone,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { extractMedicineInfo, validateMedicineData } from "@/utils/ocrUtils";
import { validateMedicineSubmission } from "@/utils/auth";

// Sample donation data
const donationHistory = [
  {
    id: "DON-001",
    medicineName: "Paracetamol",
    quantity: "100 tablets",
    expiryDate: "2024-12-31",
    status: "Distributed",
    date: "2023-10-15",
    ngo: "Health For All NGO"
  },
  {
    id: "DON-002",
    medicineName: "Amoxicillin",
    quantity: "50 capsules",
    expiryDate: "2024-08-20",
    status: "Collected by NGO",
    date: "2023-11-05",
    ngo: "Medical Aid Foundation"
  },
  {
    id: "DON-003",
    medicineName: "Insulin",
    quantity: "10 vials",
    expiryDate: "2024-06-15",
    status: "Pending Approval",
    date: "2023-12-01",
    ngo: "Pending"
  }
];

// Sample impact data
const impactData = {
  totalDonations: 15,
  medicinesDistributed: 850,
  beneficiariesImpacted: 345,
  ngosSupported: 8
};

// Donation form schema
const donationFormSchema = z.object({
  medicineName: z.string().min(1, { message: "Medicine name is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  expiryDate: z.string().min(1, { message: "Expiry date is required" }),
  description: z.string().optional(),
  medicineImage: z.string().optional(),
  activeIngredients: z.array(z.string()).optional(),
});

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [imagePreview, setImagePreview] = useState(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationType, setVerificationType] = useState("phone");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingChanges, setPendingChanges] = useState({});
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [showOcrAlert, setShowOcrAlert] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      medicineName: "",
      quantity: "",
      expiryDate: "",
      description: "",
      medicineImage: "",
      activeIngredients: [],
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        form.setValue("medicineImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageWithOCR = async () => {
    if (!imagePreview) {
      toast({
        title: "No image selected",
        description: "Please upload an image of the medicine first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingOCR(true);
    try {
      const extractedData = await extractMedicineInfo(imagePreview as string);
      
      if (extractedData) {
        const validation = validateMedicineData(extractedData);
        
        // Set the form values with the extracted data
        form.setValue("medicineName", extractedData.medicineName);
        form.setValue("expiryDate", extractedData.expiryDate);
        form.setValue("activeIngredients", extractedData.activeIngredients);
        
        setOcrResults(extractedData);
        setShowOcrAlert(true);
        
        // If validation suggests corrections, show them
        if (!validation.isValid && validation.suggestions) {
          toast({
            title: "Validation Notice",
            description: "Some extracted data may need verification. Please review the suggestions.",
            variant: "default",
          });
          
          // Apply any suggested corrections
          if (validation.suggestions.medicineName) {
            form.setValue("medicineName", validation.suggestions.medicineName);
          }
          if (validation.suggestions.activeIngredients) {
            form.setValue("activeIngredients", validation.suggestions.activeIngredients);
          }
        } else {
          toast({
            title: "OCR Successful",
            description: "Medicine information extracted successfully.",
          });
        }
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        title: "OCR Failed",
        description: "Failed to process image. Please enter details manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const handleSaveProfile = (formData) => {
    setShowVerificationDialog(true);
    setPendingChanges(formData);
  };

  const handleVerificationSubmit = () => {
    if (verificationCode === "123456" || verificationCode === "password") {
      console.log("Applying changes:", pendingChanges);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setShowVerificationDialog(false);
      setVerificationCode("");
    } else {
      toast({
        title: "Verification failed",
        description: "The verification code or password you entered is incorrect.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data) => {
    const validation = validateMedicineSubmission({
      name: data.medicineName,
      quantity: data.quantity,
      expiryDate: data.expiryDate,
    });

    if (!validation.isValid && validation.errors) {
      // Display errors for each field
      Object.entries(validation.errors).forEach(([field, message]) => {
        form.setError(field as any, { message });
      });
      return;
    }

    console.log("Donation submitted:", data);
    toast({
      title: "Donation submitted successfully!",
      description: "Your donation has been recorded and is pending approval.",
    });
    form.reset();
    setImagePreview(null);
    setOcrResults(null);
    setShowOcrAlert(false);
  };

  return (
    <>
      <Navbar />
      <LocationPermission />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-medishare-dark mb-6">Donor Dashboard</h1>
          
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
                      <Package size={18} />
                      <span>Donate Medicines</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("history")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "history" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <History size={18} />
                      <span>Donation History</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("impact")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "impact" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <BarChart3 size={18} />
                      <span>Impact Metrics</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("notifications")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "notifications" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <Bell size={18} />
                      <span>Notifications</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab("nearby")} 
                      className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === "nearby" ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
                    >
                      <MapPin size={18} />
                      <span>Nearby NGOs</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-9">
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Management</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { 
                      e.preventDefault(); 
                      const formElement = e.target as HTMLFormElement;
                      const nameInput = formElement.querySelector('#name') as HTMLInputElement;
                      const emailInput = formElement.querySelector('#email') as HTMLInputElement;
                      const phoneInput = formElement.querySelector('#phone') as HTMLInputElement;
                      const addressInput = formElement.querySelector('#address') as HTMLTextAreaElement;
                      
                      handleSaveProfile({ 
                        name: nameInput.value, 
                        email: emailInput.value, 
                        phone: phoneInput.value, 
                        address: addressInput.value 
                      }); 
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                          <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                          <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input id="phone" placeholder="+91 9876543210" defaultValue="+91 9876543210" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="gst" className="text-sm font-medium">GST Number</label>
                          <div className="relative">
                            <Input id="gst" placeholder="22AAAAA0000A1Z5" defaultValue="22AAAAA0000A1Z5" readOnly className="pr-10 bg-gray-100" />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          </div>
                          <p className="text-xs text-gray-500">GST Number cannot be modified</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Textarea id="address" placeholder="123 Main St, City, State" defaultValue="123 Main St, Mumbai, Maharashtra" />
                      </div>
                      
                      <Button type="submit" className="bg-medishare-blue hover:bg-medishare-blue/90">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "donate" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donate Medicines</CardTitle>
                    <CardDescription>Upload details of medicines you want to donate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Upload Medicine Image</label>
                          <div className="flex flex-col items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              {imagePreview ? (
                                <div className="w-full h-full p-2 flex items-center justify-center">
                                  <img
                                    src={imagePreview}
                                    alt="Medicine preview"
                                    className="max-h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                                </div>
                              )}
                              <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={processImageWithOCR}
                              disabled={!imagePreview || isProcessingOCR}
                              className="flex items-center justify-center gap-2"
                            >
                              {isProcessingOCR ? 
                                <Loader2 className="h-4 w-4 animate-spin" /> : 
                                <Camera className="h-4 w-4" />
                              }
                              {isProcessingOCR ? "Processing..." : "Extract Medicine Info (OCR)"}
                            </Button>
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setImagePreview(null);
                                form.setValue("medicineImage", "");
                                setOcrResults(null);
                                setShowOcrAlert(false);
                              }}
                              disabled={!imagePreview}
                              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              Clear Image
                            </Button>
                          </div>
                        </div>
                        
                        {showOcrAlert && ocrResults && (
                          <Alert className="bg-green-50 border-green-200 text-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>OCR Processing Successful</AlertTitle>
                            <AlertDescription>
                              We've detected the following information:
                              <ul className="mt-2 list-disc list-inside text-sm">
                                <li><strong>Medicine Name:</strong> {ocrResults.medicineName}</li>
                                <li><strong>Expiry Date:</strong> {ocrResults.expiryDate}</li>
                                <li><strong>Active Ingredients:</strong> {ocrResults.activeIngredients.join(", ")}</li>
                              </ul>
                              <p className="mt-2 text-sm">Please verify this information is correct before submitting.</p>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="medicineName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Medicine Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Paracetamol" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 100 tablets" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 opacity-50" />
                                  <Input type="date" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="activeIngredients"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Active Ingredients</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter active ingredients, separated by commas"
                                  value={field.value ? field.value.join(", ") : ""}
                                  onChange={(e) => {
                                    const ingredients = e.target.value
                                      .split(",")
                                      .map(item => item.trim())
                                      .filter(item => item.length > 0);
                                    field.onChange(ingredients);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional details about the medicines" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="bg-medishare-orange hover:bg-medishare-gold">
                          Submit Donation
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "history" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Donation History</CardTitle>
                    <CardDescription>View all your past donations and their current status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donationHistory.map((donation) => (
                            <tr key={donation.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm">{donation.id}</td>
                              <td className="px-4 py-4 text-sm">{donation.medicineName}</td>
                              <td className="px-4 py-4 text-sm">{donation.quantity}</td>
                              <td className="px-4 py-4 text-sm">{donation.expiryDate}</td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  donation.status === "Distributed" 
                                    ? "bg-green-100 text-green-800" 
                                    : donation.status === "Collected by NGO" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {donation.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm">{donation.ngo}</td>
                              <td className="px-4 py-4 text-sm">
                                {donation.status !== "Pending Approval" && (
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
              )}
              
              {activeTab === "impact" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Metrics</CardTitle>
                    <CardDescription>See the impact of your donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-blue">{impactData.totalDonations}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Donations</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-medishare-orange">{impactData.medicinesDistributed}</p>
                            <p className="text-sm text-gray-500 mt-1">Medicines Distributed</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{impactData.beneficiariesImpacted}</p>
                            <p className="text-sm text-gray-500 mt-1">Beneficiaries Impacted</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{impactData.ngosSupported}</p>
                            <p className="text-sm text-gray-500 mt-1">NGOs Supported</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-gray-500">Donation Trends Chart (Will be implemented with Recharts)</p>
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
                            <Bell size={18} className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">Donation Status Update</h4>
                            <p className="text-sm text-gray-600 mt-1">Your donation of Paracetamol has been collected by Health For All NGO.</p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Bell size={18} className="text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">New NGO Nearby</h4>
                            <p className="text-sm text-gray-600 mt-1">Medical Relief Foundation has joined MediShare in your area.</p>
                            <p className="text-xs text-gray-500 mt-2">Yesterday</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Bell size={18} className="text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Donation Request</h4>
                            <p className="text-sm text-gray-600 mt-1">Care NGO is looking for Insulin donations in your area.</p>
                            <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "nearby" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby NGOs</CardTitle>
                    <CardDescription>Find NGOs in your area that need medicine donations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                        <p className="text-gray-500">Map View (Will be implemented with a mapping library)</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg">Health For All NGO</h3>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                2.3 km away - Bandra, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Urgently needs: Antibiotics, Painkillers, Insulin
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
                              <h3 className="font-medium text-lg">Medical Aid Foundation</h3>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                4.1 km away - Andheri, Mumbai
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                Urgently needs: Asthma Inhalers, Diabetes Medication
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
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Identity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                variant={verificationType === "phone" ? "default" : "outline"}
                className={verificationType === "phone" ? "bg-medishare-blue hover:bg-medishare-blue/90" : ""}
                onClick={() => setVerificationType("phone")}
              >
                <Phone className="mr-2 h-4 w-4" />
                OTP Verification
              </Button>
              <Button 
                variant={verificationType === "password" ? "default" : "outline"}
                className={verificationType === "password" ? "bg-medishare-blue hover:bg-medishare-blue/90" : ""}
                onClick={() => setVerificationType("password")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Password
              </Button>
            </div>
            
            {verificationType === "phone" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">We've sent a 6-digit code to your registered phone number.</p>
                <Input 
                  placeholder="Enter 6-digit code" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="text-xs text-gray-400">(For demo, use code: 123456)</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Enter your password to confirm changes.</p>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="text-xs text-gray-400">(For demo, use: password)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
