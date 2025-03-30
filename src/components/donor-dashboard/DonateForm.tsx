
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DonateFormProps {
  donorEntityId: string;
  onSuccess: () => void;
}

interface DonateFormData {
  medicineName: string;
  quantity: number;
  expiryDate: string;
  ingredients: string;
  imageFile?: File | null;
}

const DonateForm = ({ donorEntityId, onSuccess }: DonateFormProps) => {
  const [formData, setFormData] = useState<DonateFormData>({
    medicineName: "",
    quantity: 0,
    expiryDate: "",
    ingredients: "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorEntityId) {
      toast({
        title: "Error",
        description: "Donor information not found. Please sign in again.",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!formData.medicineName || formData.quantity <= 0 || !formData.expiryDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if one was provided
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `ocr-images/${fileName}`;

        const { error: uploadError, data: fileData } = await supabase.storage
          .from('ocr-images')
          .upload(filePath, formData.imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('ocr-images')
          .getPublicUrl(filePath);

        if (data) {
          imageUrl = data.publicUrl;
        }
      }

      // Record the donation in the database
      const { error: insertError } = await supabase
        .from('donated_meds')
        .insert({
          medicine_name: formData.medicineName,
          quantity: formData.quantity,
          expiry_date: formData.expiryDate,
          ingredients: formData.ingredients,
          image_url: imageUrl,
          donor_entity_id: donorEntityId,
          date_added: new Date().toISOString(),
          status: 'uploaded'
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Donation Successful",
        description: "Your medicine donation has been recorded.",
      });

      // Reset form and call onSuccess
      onSuccess();
    } catch (error) {
      console.error('Error processing donation:', error);
      toast({
        title: "Error",
        description: "Failed to process your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="medicineName">Medicine Name <span className="text-red-500">*</span></Label>
        <Input
          id="medicineName"
          name="medicineName"
          value={formData.medicineName}
          onChange={handleInputChange}
          placeholder="Enter the name of the medicine"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={handleNumberInputChange}
          placeholder="Enter the quantity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date <span className="text-red-500">*</span></Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredients</Label>
        <Textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleInputChange}
          placeholder="List the active ingredients"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Medicine Image</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Medicine preview" 
                className="mx-auto h-32 object-contain rounded-md" 
              />
              <button 
                type="button"
                onClick={() => {
                  setFormData({...formData, imageFile: null});
                  setImagePreview(null);
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Remove image
              </button>
            </div>
          ) : (
            <label 
              htmlFor="image" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
            </label>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading ? "Processing..." : "Donate Medicine"}
      </Button>
    </form>
  );
};

export default DonateForm;
