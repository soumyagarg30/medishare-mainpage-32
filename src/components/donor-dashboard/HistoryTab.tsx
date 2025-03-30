
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface DonatedMedicine {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  expiry_date: string | null;
  status: string | null;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  date_added: string | null;
  ingredients: string | null;
  image_url: string | null;
  ngo_name?: string;
}

interface HistoryTabProps {
  donorEntityId: string;
}

const HistoryTab = ({ donorEntityId }: HistoryTabProps) => {
  const [donations, setDonations] = useState<DonatedMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, [donorEntityId]);

  const fetchDonations = async () => {
    if (!donorEntityId) {
      toast({
        title: "Error",
        description: "Donor information not found",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('donor_entity_id', donorEntityId);

      if (error) throw error;

      let donationsList: DonatedMedicine[] = data ? data.map(med => ({
        ...med,
        id: med.id.toString()
      })) : [];

      // Fetch NGO information for donations that have been approved
      for (let i = 0; i < donationsList.length; i++) {
        if (donationsList[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('name')
            .eq('entity_id', donationsList[i].ngo_entity_id)
            .single();

          if (!ngoError && ngoData) {
            donationsList[i].ngo_name = ngoData.name;
          }
        }
      }

      setDonations(donationsList);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error",
        description: "Failed to load donation history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'distributed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Donation History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8">
            <p>No donation history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Date Donated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.medicine_name || 'N/A'}</TableCell>
                    <TableCell>{donation.quantity || 'N/A'}</TableCell>
                    <TableCell>
                      {donation.expiry_date 
                        ? new Date(donation.expiry_date).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {donation.date_added 
                        ? new Date(donation.date_added).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getStatusBadgeClass(donation.status)
                        }`}
                      >
                        {donation.status 
                          ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) 
                          : 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {donation.ngo_name || (donation.status === 'approved' ? 'NGO' : 'Not Assigned')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
