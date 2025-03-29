
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser } from "@/utils/auth";

const DonateTab = () => {
  const [donorEntityId, setDonorEntityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  
  const [newDonation, setNewDonation] = useState({
    medicine_name: "",
    quantity: "",
    expiry_date: "",
    ingredients: "",
    image_file: null as File | null
  });

  useEffect(() => {
    const fetchDonorId = async () => {
      const user = getUser();
      if (user && user.email) {
        const { data, error } = await supabase
          .from('users')
          .select('entity_id')
          .eq('email', user.email)
          .single();
        
        if (!error && data) {
          setDonorEntityId(data.entity_id);
          console.log("Donor entity ID fetched:", data.entity_id);
          
          // Fetch recent donations for this donor
          fetchRecentDonations(data.entity_id);
          
          // Set up real-time subscription for this donor's donations
          const donationsChannel = supabase
            .channel('donated_meds_changes')
            .on('postgres_changes', {
              event: '*', 
              schema: 'public',
              table: 'donated_meds',
              filter: `donor_entity_id=eq.${data.entity_id}`
            }, (payload) => {
              console.log('Real-time update received:', payload);
              fetchRecentDonations(data.entity_id);
            })
            .subscribe();
            
          return () => {
            supabase.removeChannel(donationsChannel);
          };
        } else {
          console.error('Error fetching donor ID:', error);
          toast({
            title: "Error",
            description: "Failed to load donor information",
            variant: "destructive"
          });
        }
      }
    };

    fetchDonorId();
  }, []);
  
  const fetchRecentDonations = async (entityId: string) => {
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('donor_entity_id', entityId)
        .order('date_added', { ascending: false })
        .limit(3);
        
      if (error) {
        throw error;
      }
      
      setRecentDonations(data || []);
    } catch (err) {
      console.error("Error fetching recent donations:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDonation(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setNewDonation(prev => ({
      ...prev,
      expiry_date: date ? date.toISOString().split('T')[0] : ''
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image/jpeg|image/jpg|image/png')) {
        toast({
          title: "Invalid File",
          description: "Please upload a JPG, JPEG, or PNG image",
          variant: "destructive"
        });
        return;
      }
      
      setNewDonation(prev => ({
        ...prev,
        image_file: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorEntityId) {
      toast({
        title: "Error",
        description: "Donor information not found",
        variant: "destructive"
      });
      return;
    }
    
    if (!newDonation.medicine_name || !newDonation.quantity || !newDonation.expiry_date || !newDonation.image_file) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and upload an image",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting to submit donation with donor ID:", donorEntityId);
      
      // Generate a unique file name using donor_entity_id and date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileExt = newDonation.image_file.name.split('.').pop();
      const fileName = `${donorEntityId}/${currentDate}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      console.log("Uploading image to path:", fileName);
      
      // Upload image to Supabase storage with upsert set to true
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(fileName, newDonation.image_file, {
          cacheControl: '3600',
          upsert: true // Changed from false to true
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Image uploaded successfully, data:", uploadData);
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;
      console.log("Generated public URL:", imageUrl);
      
      // Insert donation record with image URL
      const { data: donationData, error: donationError } = await supabase
        .from('donated_meds')
        .insert({
          medicine_name: newDonation.medicine_name,
          quantity: parseInt(newDonation.quantity),
          expiry_date: newDonation.expiry_date,
          ingredients: newDonation.ingredients,
          donor_entity_id: donorEntityId,
          status: "uploaded",
          date_added: currentDate,
          image_url: imageUrl
        });
      
      if (donationError) {
        console.error("Database insert error:", donationError);
        throw donationError;
      }
      
      toast({
        title: "Success",
        description: "Medicine donation submitted successfully"
      });
      
      // Reset form
      setNewDonation({
        medicine_name: "",
        quantity: "",
        expiry_date: "",
        ingredients: "",
        image_file: null
      });
      setImagePreview(null);
      
      // Refresh recent donations
      fetchRecentDonations(donorEntityId);
      
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: "Error",
        description: "Failed to submit medicine donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donate Medicines</CardTitle>
        <CardDescription>Help those in need by donating medicines</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="medicine_name" className="text-sm font-medium">
                Medicine Name
              </label>
              <Input
                id="medicine_name"
                name="medicine_name"
                value={newDonation.medicine_name}
                onChange={handleInputChange}
                placeholder="Enter medicine name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newDonation.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expiry_date" className="text-sm font-medium">
                Expiry Date
              </label>
              <DatePicker 
                date={newDonation.expiry_date ? new Date(newDonation.expiry_date) : undefined}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image_file" className="text-sm font-medium">
                Medicine Image (JPG/JPEG/PNG)
              </label>
              <Input
                id="image_file"
                name="image_file"
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
                required
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Medicine Preview" 
                  className="mt-2 rounded-md max-h-40" 
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="ingredients" className="text-sm font-medium">
              Ingredients
            </label>
            <Textarea
              id="ingredients"
              name="ingredients"
              value={newDonation.ingredients}
              onChange={handleInputChange}
              placeholder="List the ingredients (optional)"
              rows={4}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full md:w-auto bg-medishare-blue" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Donation"
              )}
            </Button>
          </div>
        </form>

        {recentDonations.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Recent Donations</h3>
            <div className="space-y-3">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{donation.medicine_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {donation.quantity}</p>
                      <p className="text-sm text-gray-600">Added: {new Date(donation.date_added).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      donation.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                      donation.status === 'received' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonateTab;
