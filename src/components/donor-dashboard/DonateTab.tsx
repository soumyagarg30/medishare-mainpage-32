
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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

const DonateTab = () => {
  const [donationData, setDonationData] = useState({
    medicineName: "",
    category: "",
    quantity: "",
    expiryDate: "",
    ngo: "",
    description: ""
  });

  const handleDonationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setDonationData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to a backend
    toast.success("Donation submitted successfully!");
    
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

  return (
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
  );
};

export default DonateTab;
