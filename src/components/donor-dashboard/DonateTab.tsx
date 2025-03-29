
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
      // Generate a unique file name using donor_entity_id and date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileExt = newDonation.image_file.name.split('.').pop();
      const fileName = `${donorEntityId}/${currentDate}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Check if storage bucket exists, create if it doesn't
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('ocr-images');
      
      if (bucketError && bucketError.message.includes('not found')) {
        const { error: createBucketError } = await supabase.storage.createBucket('ocr-images', {
          public: true
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      } else if (bucketError) {
        throw bucketError;
      }
      
      // Upload image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(filePath, newDonation.image_file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
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
        })
        .select('*')
        .single();
      
      if (donationError) {
        throw donationError;
      }
      
      // TODO: Call OCR API with the image URL (endpoint will be provided later)
      // const ocrResponse = await fetch('OCR_API_ENDPOINT_HERE', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ imageUrl })
      // });
      
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
      
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: "Error",
        description: "Failed to submit medicine donation",
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
      </CardContent>
    </Card>
  );
};

export default DonateTab;
