
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WelcomeMessage from "@/components/WelcomeMessage";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/donor-dashboard/Sidebar";
import ProfileTab from "@/components/donor-dashboard/ProfileTab";
import HistoryTab from "@/components/donor-dashboard/HistoryTab";
import ImpactTab from "@/components/donor-dashboard/ImpactTab";
import TaxBenefitsTab from "@/components/donor-dashboard/TaxBenefitsTab";
import SettingsTab from "@/components/donor-dashboard/SettingsTab";
import LocationPermission from "@/components/LocationPermission";
import AnalyticsTab from "@/components/donor-dashboard/AnalyticsTab";
import NearbyNGOsTab from "@/components/donor-dashboard/NearbyNGOsTab";
import NotificationsTab from "@/components/donor-dashboard/NotificationsTab";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, ChevronDown, ChevronUp, Package, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface DonatedMedicine {
  id: string;
  medicine_name: string;
  quantity: number;
  expiry_date: string;
  date_added: string;
  ingredients: string;
  status: string;
  image_url: string;
  ngo_entity_id: string | null;
  ngo_name?: string;
  ngo_address?: string;
  ngo_phone?: string;
}

const DonateTab = () => {
  const [donatedMedicines, setDonatedMedicines] = useState<DonatedMedicine[]>([]);
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [newDonation, setNewDonation] = useState({
    medicine_name: "",
    quantity: 0,
    expiry_date: "",
    ingredients: "",
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      fetchDonatedMedicines(userData.id);
    }
  }, []);

  const fetchDonatedMedicines = async (donorId: string) => {
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('donor_entity_id', donorId);
      
      if (error) {
        throw error;
      }
      
      let medicines = data || [];
      
      // For each medicine, fetch NGO details if available
      for (let i = 0; i < medicines.length; i++) {
        if (medicines[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('*')
            .eq('entity_id', medicines[i].ngo_entity_id)
            .single();
          
          if (!ngoError && ngoData) {
            medicines[i].ngo_name = ngoData.name;
            medicines[i].ngo_address = ngoData.address;
            medicines[i].ngo_phone = ngoData.phone;
          }
        }
      }
      
      setDonatedMedicines(medicines);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donated medicines:', error);
      toast({
        title: "Error",
        description: "Failed to load your donated medicines",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file (JPG, JPEG, PNG)",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDonation(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setNewDonation(prev => ({
      ...prev,
      expiry_date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const uploadImage = async (file: File, donorId: string): Promise<string> => {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const fileName = `${donorId}/${dateString}_${file.name}`;
    
    let bucketExists = false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      bucketExists = buckets?.some(bucket => bucket.name === 'ocr-images') ?? false;
      
      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('ocr-images', {
          public: true
        });
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
      throw new Error('Failed to prepare storage for image upload');
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from('ocr-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('ocr-images')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!newDonation.medicine_name || !newDonation.quantity || !newDonation.expiry_date) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Please upload an image of the medicine",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload image to Supabase storage
      const imageUrl = await uploadImage(uploadedImage, user.id);
      
      // Add donation to database
      const { error } = await supabase
        .from('donated_meds')
        .insert({
          medicine_name: newDonation.medicine_name,
          quantity: newDonation.quantity,
          expiry_date: newDonation.expiry_date,
          ingredients: newDonation.ingredients,
          donor_entity_id: user.id,
          date_added: new Date().toISOString().split('T')[0],
          status: 'uploaded',
          image_url: imageUrl
        });
      
      if (error) throw error;
      
      // Reset form
      setNewDonation({
        medicine_name: "",
        quantity: 0,
        expiry_date: "",
        ingredients: ""
      });
      setUploadedImage(null);
      setImagePreview(null);
      
      toast({
        title: "Success",
        description: "Medicine donation submitted successfully"
      });
      
      // Refresh donated medicines
      fetchDonatedMedicines(user.id);
      
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: "Error",
        description: "Failed to submit medicine donation",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-medishare-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donate Medicine</CardTitle>
          <CardDescription>Fill this form to donate medicines</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitDonation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medicine_name">Medicine Name</Label>
              <Input 
                id="medicine_name" 
                name="medicine_name" 
                value={newDonation.medicine_name}
                onChange={handleDonationChange}
                placeholder="Enter medicine name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number"
                value={newDonation.quantity || ''}
                onChange={handleDonationChange}
                placeholder="Enter quantity"
                min={1}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <DatePicker 
                date={newDonation.expiry_date ? new Date(newDonation.expiry_date) : undefined}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (Optional)</Label>
              <Textarea 
                id="ingredients" 
                name="ingredients" 
                value={newDonation.ingredients}
                onChange={handleDonationChange}
                placeholder="Enter ingredients information"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicine_image">Medicine Image</Label>
              <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  id="medicine_image"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                />
                <label htmlFor="medicine_image" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Preview" className="max-h-48 max-w-full mx-auto rounded-md" />
                      <p className="text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload an image of the medicine (JPG, JPEG, PNG)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-medishare-orange hover:bg-medishare-gold"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : "Donate Medicine"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>My Donated Medicines</CardTitle>
          <CardDescription>View all your medicine donations</CardDescription>
        </CardHeader>
        <CardContent>
          {donatedMedicines.length > 0 ? (
            <div className="space-y-4">
              {donatedMedicines.map((medicine) => (
                <div key={medicine.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className={`p-4 cursor-pointer ${
                      medicine.status === 'uploaded' ? 'bg-amber-50' : 
                      medicine.status === 'collected' ? 'bg-green-50' : 'bg-white'
                    }`}
                    onClick={() => setExpandedMedicine(expandedMedicine === medicine.id ? null : medicine.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="md:flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{medicine.medicine_name}</h3>
                          <span 
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              medicine.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                              medicine.status === 'collected' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          <p className="text-sm text-gray-600"><span className="font-medium">Quantity:</span> {medicine.quantity}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Expiry Date:</span> {new Date(medicine.expiry_date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Date Donated:</span> {new Date(medicine.date_added).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {medicine.image_url && (
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={medicine.image_url} 
                            alt={medicine.medicine_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center">
                        {expandedMedicine === medicine.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedMedicine === medicine.id && (
                    <div className="p-4 border-t bg-gray-50">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">NGO Details</h4>
                      {medicine.ngo_entity_id && medicine.ngo_name ? (
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">NGO Name:</span> {medicine.ngo_name}</p>
                          {medicine.ngo_address && <p><span className="font-medium">Address:</span> {medicine.ngo_address}</p>}
                          {medicine.ngo_phone && <p><span className="font-medium">Contact:</span> {medicine.ngo_phone}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No NGO has been assigned to this donation yet.</p>
                      )}
                      
                      {medicine.ingredients && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Ingredients</h4>
                          <p className="text-sm text-gray-600">{medicine.ingredients}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't donated any medicines yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [locationRequested, setLocationRequested] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/sign-in");
      return;
    }
    
    const userData = getUser();
    if (!userData || userData.userType !== "donor") {
      navigate("/sign-in");
      return;
    }
    
    setUser(userData);

    // Check if we should prompt for location permission
    const locationPermissionAsked = localStorage.getItem("locationPermissionAsked");
    if (!locationPermissionAsked && !locationRequested) {
      setLocationRequested(true);
      // Let the component render first before showing the toast
      setTimeout(() => {
        toast({
          title: "Enable Location",
          description: "Please enable location to see nearby NGOs",
          variant: "default",
        });
      }, 1000);
    }
  }, [navigate, locationRequested]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <LocationPermission />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <WelcomeMessage user={user} userTypeTitle="Donor" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-9">
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "donate" && <DonateTab />}
              {activeTab === "history" && <HistoryTab />}
              {activeTab === "impact" && <ImpactTab />}
              {activeTab === "tax" && <TaxBenefitsTab />}
              {activeTab === "settings" && <SettingsTab />}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "nearby" && <NearbyNGOsTab />}
              {activeTab === "notifications" && <NotificationsTab />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
