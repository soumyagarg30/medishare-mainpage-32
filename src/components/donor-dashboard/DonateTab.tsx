
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser } from "@/utils/auth";
import DonateForm from "./DonateForm";
import DonationSuccess from "./DonationSuccess";

const DonateTab = () => {
  const [donorEntityId, setDonorEntityId] = useState<string | null>(null);
  const [donationSuccess, setDonationSuccess] = useState(false);

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

  const handleDonationSuccess = () => {
    setDonationSuccess(true);
  };

  const handleDonateAnother = () => {
    setDonationSuccess(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Donate Medicine</CardTitle>
        <CardDescription>Complete the form to donate unused medicine</CardDescription>
      </CardHeader>
      <CardContent>
        {donationSuccess ? (
          <DonationSuccess onDonateAnother={handleDonateAnother} />
        ) : (
          donorEntityId ? (
            <DonateForm 
              donorEntityId={donorEntityId} 
              onSuccess={handleDonationSuccess} 
            />
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default DonateTab;
