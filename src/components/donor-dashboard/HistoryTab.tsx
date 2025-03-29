
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUser } from "@/utils/auth";

interface DonatedMedicine {
  id: number;
  medicine_name: string;
  quantity: number;
  expiry_date: string;
  date_added: string;
  status: string;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  image_url: string | null;
  ingredients: string | null;
  ngo_name?: string;
  ngo_address?: string;
  ngo_phone?: string;
}

const HistoryTab = () => {
  const [donatedMedicines, setDonatedMedicines] = useState<DonatedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDonation, setExpandedDonation] = useState<number | null>(null);
  const [donorEntityId, setDonorEntityId] = useState<string | null>(null);

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
          fetchDonatedMedicines(data.entity_id);
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

  const fetchDonatedMedicines = async (donorId: string) => {
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('donor_entity_id', donorId);
      
      if (error) {
        throw error;
      }
      
      let medicines = data as DonatedMedicine[];
      
      // For each donation, fetch NGO details if available
      for (let i = 0; i < medicines.length; i++) {
        if (medicines[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('*')
            .eq('entity_id', medicines[i].ngo_entity_id)
            .single();
          
          if (!ngoError && ngoData) {
            medicines[i].ngo_name = ngoData.name || '';
            medicines[i].ngo_address = ngoData.address || '';
            medicines[i].ngo_phone = ngoData.phone || '';
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

  // Set up real-time subscription for donated medicines
  useEffect(() => {
    if (!donorEntityId) return;
    
    const channel = supabase
      .channel('donated-meds-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'donated_meds',
          filter: `donor_entity_id=eq.${donorEntityId}`
        }, 
        (payload) => {
          console.log('New donation:', payload);
          // Fetch NGO details for the new donation
          fetchDonationWithNGODetails(payload.new as DonatedMedicine);
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'donated_meds',
          filter: `donor_entity_id=eq.${donorEntityId}`
        },
        (payload) => {
          console.log('Donation updated:', payload);
          // Update the donation in the local state
          updateDonationInState(payload.new as DonatedMedicine);
        }
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [donorEntityId]);

  const fetchDonationWithNGODetails = async (donation: DonatedMedicine) => {
    try {
      if (donation.ngo_entity_id) {
        const { data: ngoData, error: ngoError } = await supabase
          .from('intermediary_ngo')
          .select('*')
          .eq('entity_id', donation.ngo_entity_id)
          .single();
        
        if (!ngoError && ngoData) {
          donation.ngo_name = ngoData.name || '';
          donation.ngo_address = ngoData.address || '';
          donation.ngo_phone = ngoData.phone || '';
        }
      }
      
      setDonatedMedicines(prev => [...prev, donation]);
    } catch (error) {
      console.error('Error fetching donation with NGO details:', error);
    }
  };

  const updateDonationInState = async (updatedDonation: DonatedMedicine) => {
    try {
      let donationWithNGO = {...updatedDonation};
      
      if (updatedDonation.ngo_entity_id) {
        const { data: ngoData, error: ngoError } = await supabase
          .from('intermediary_ngo')
          .select('*')
          .eq('entity_id', updatedDonation.ngo_entity_id)
          .single();
        
        if (!ngoError && ngoData) {
          donationWithNGO.ngo_name = ngoData.name || '';
          donationWithNGO.ngo_address = ngoData.address || '';
          donationWithNGO.ngo_phone = ngoData.phone || '';
        }
      }
      
      setDonatedMedicines(prev => 
        prev.map(donation => 
          donation.id === updatedDonation.id ? donationWithNGO : donation
        )
      );
    } catch (error) {
      console.error('Error updating donation in state:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>View your past donations</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading donation history...</div>
        ) : donatedMedicines.length > 0 ? (
          <div className="space-y-4">
            {donatedMedicines.map((donation) => (
              <div key={donation.id} className="border rounded-lg overflow-hidden">
                <div 
                  className={`p-4 cursor-pointer ${
                    donation.status === 'uploaded' ? 'bg-amber-50' : 
                    donation.status === 'received' ? 'bg-green-50' : 'bg-white'
                  }`}
                  onClick={() => setExpandedDonation(expandedDonation === donation.id ? null : donation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{donation.medicine_name}</h3>
                        <span 
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            donation.status === 'uploaded' ? 'bg-amber-100 text-amber-800' : 
                            donation.status === 'received' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p><span className="font-medium">Quantity:</span> {donation.quantity}</p>
                        <p><span className="font-medium">Expiry Date:</span> {new Date(donation.expiry_date).toLocaleDateString()}</p>
                        <p><span className="font-medium">Date Added:</span> {new Date(donation.date_added).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      {expandedDonation === donation.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedDonation === donation.id && (
                  <div className="p-4 border-t bg-gray-50">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">NGO Details</h4>
                    {donation.ngo_entity_id && donation.ngo_name ? (
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">NGO Name:</span> {donation.ngo_name}</p>
                        {donation.ngo_address && <p><span className="font-medium">Address:</span> {donation.ngo_address}</p>}
                        {donation.ngo_phone && <p><span className="font-medium">Contact:</span> {donation.ngo_phone}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No NGO has been assigned to this donation yet.</p>
                    )}
                    {donation.ingredients && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Ingredients</h4>
                        <p className="text-sm">{donation.ingredients}</p>
                      </div>
                    )}
                    {donation.image_url && (
                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Medicine Image</h4>
                        <img 
                          src={donation.image_url} 
                          alt={`${donation.medicine_name} image`} 
                          className="mt-1 max-w-xs rounded-md" 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>You haven't donated any medicines yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
