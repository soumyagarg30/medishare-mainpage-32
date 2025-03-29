
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser } from "@/utils/auth";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const donationSchema = z.object({
  medicine_name: z.string().min(1, "Medicine name is required"),
  quantity: z.string().min(1, "Quantity is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive number",
  }),
  expiry_date: z.date({
    required_error: "Expiry date is required",
  }).refine((date) => date > new Date(), {
    message: "Expiry date must be in the future",
  }),
  ingredients: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const DonateTab = () => {
  const [donorEntityId, setDonorEntityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      medicine_name: "",
      quantity: "",
      ingredients: "",
    },
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
      
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (values: DonationFormValues) => {
    if (!donorEntityId) {
      toast({
        title: "Error",
        description: "Donor information not found",
        variant: "destructive"
      });
      return;
    }
    
    if (!imageFile) {
      toast({
        title: "Missing Information",
        description: "Please upload an image of the medicine",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a unique file name using donor_entity_id and date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${donorEntityId}/${currentDate}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      console.log("Uploading file to path:", fileName);
      
      // Upload image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(fileName);
      
      const imageUrl = publicUrlData.publicUrl;
      console.log("Image URL:", imageUrl);
      
      // Insert donation record with image URL
      const { data: donationData, error: donationError } = await supabase
        .from('donated_meds')
        .insert({
          medicine_name: values.medicine_name,
          quantity: parseInt(values.quantity),
          expiry_date: values.expiry_date.toISOString().split('T')[0],
          ingredients: values.ingredients || null,
          donor_entity_id: donorEntityId,
          status: "uploaded",
          date_added: currentDate,
          image_url: imageUrl
        })
        .select('*')
        .single();
      
      if (donationError) {
        console.error("Donation insert error:", donationError);
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
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="medicine_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter medicine name" {...field} />
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
                      <Input 
                        type="number" 
                        placeholder="Enter quantity" 
                        min="1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <DatePicker 
                      date={field.value} 
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Medicine Image (JPG/JPEG/PNG)</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Medicine Preview" 
                        className="mt-2 rounded-md max-h-40 mx-auto" 
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">JPG, JPEG, or PNG</p>
                      <Input
                        id="image_file"
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleFileChange}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {!imageFile && (
                  <p className="text-sm text-destructive">Image is required</p>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the ingredients (optional)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto bg-medishare-blue" disabled={loading || !imageFile}>
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
        </Form>
      </CardContent>
    </Card>
  );
};

export default DonateTab;
