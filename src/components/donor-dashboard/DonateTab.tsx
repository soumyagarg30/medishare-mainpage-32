
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonorId = async () => {
      try {
        setIsLoading(true);
        const user = getUser();
        
        if (!user || !user.email) {
          toast({
            title: "Authentication Error",
            description: "Please sign in to access this feature",
            variant: "destructive"
          });
          return;
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('entity_id')
          .eq('email', user.email)
          .single();
        
        if (error) {
          console.error('Error fetching donor ID:', error);
          throw error;
        }
        
        if (data) {
          setDonorEntityId(data.entity_id);
        } else {
          toast({
            title: "Error",
            description: "Donor profile not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error in fetchDonorId:', error);
        toast({
          title: "Error",
          description: "Failed to load donor information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
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
          isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
            </div>
          ) : (
            donorEntityId ? (
              <DonateForm 
                donorEntityId={donorEntityId} 
                onSuccess={handleDonationSuccess} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Unable to load your donor profile. Please try refreshing the page.</p>
              </div>
            )
          )
        )}
      </CardContent>
    </Card>
  );
};

export default DonateTab;
