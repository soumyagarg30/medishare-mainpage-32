
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MedicineRequest {
  id: string;
  medicine_name: string;
  quantity: number;
  need_by_date: string;
  status: string;
  recipient_entity_id: string;
  ngo_entity_id: string | null;
  recipient_name?: string;
  recipient_address?: string;
  recipient_phone?: string;
}

interface RecipientDetails {
  name: string;
  address: string | null;
  phone: string | null;
}

const MedicineRequestsTab = ({ ngoEntityId }: { ngoEntityId: string | null }) => {
  const [medicineRequests, setMedicineRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicineRequests = async () => {
    try {
      console.log("Fetching medicine requests");
      // Fetch all medicine requests with status "uploaded"
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .eq('status', 'uploaded')
        .is('ngo_entity_id', null);
      
      if (error) {
        throw error;
      }
      
      console.log("Fetched medicine requests:", data);
      let requests: MedicineRequest[] = data || [];
      
      // For each request, fetch recipient details
      for (let i = 0; i < requests.length; i++) {
        const { data: recipientData, error: recipientError } = await supabase
          .from('recipients')
          .select('*')
          .eq('entity_id', requests[i].recipient_entity_id)
          .single();
        
        if (!recipientError && recipientData) {
          requests[i].recipient_name = recipientData.name || '';
          requests[i].recipient_address = recipientData.address || '';
          requests[i].recipient_phone = recipientData.phone || '';
        }
      }
      
      setMedicineRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicine requests:', error);
      toast({
        title: "Error",
        description: "Failed to load medicine requests",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log(`Approving request ${requestId} with NGO entity ID ${ngoEntityId}`);
      
      // Update the request with ngo_entity_id and status
      const { data, error } = await supabase
        .from('requested_meds')
        .update({ 
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', requestId)
        .select();
      
      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      
      console.log("Update successful:", data);
      
      toast({
        title: "Success",
        description: "Medicine request approved successfully"
      });
      
      // Update the local state to remove the approved request
      setMedicineRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve medicine request",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription for medicine requests
  useEffect(() => {
    fetchMedicineRequests();

    // Subscribe to changes on the requested_meds table
    const channel = supabase
      .channel('medicine-requests-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'requested_meds',
          filter: 'status=eq.uploaded'
        }, 
        (payload) => {
          console.log('New medicine request:', payload);
          // Fetch the new request with recipient details
          fetchRequestWithRecipientDetails(payload.new as MedicineRequest);
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requested_meds'
        },
        (payload) => {
          console.log('Medicine request updated:', payload);
          // Update the request in the local state
          if (payload.new.ngo_entity_id) {
            setMedicineRequests(prev => prev.filter(req => req.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    console.log("Subscribed to real-time updates");

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ngoEntityId]);

  const fetchRequestWithRecipientDetails = async (request: MedicineRequest) => {
    try {
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .select('*')
        .eq('entity_id', request.recipient_entity_id)
        .single();
      
      if (recipientError) {
        console.error('Error fetching recipient details:', recipientError);
        return;
      }

      const requestWithDetails: MedicineRequest = {
        ...request,
        recipient_name: recipientData.name || '',
        recipient_address: recipientData.address || '',
        recipient_phone: recipientData.phone || ''
      };

      // Add the new request to the state
      setMedicineRequests(prev => [...prev, requestWithDetails]);
    } catch (error) {
      console.error('Error fetching request with details:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Requests from Recipients</CardTitle>
        <CardDescription>Review and manage medicine requests from recipients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-6">Loading medicine requests...</div>
          ) : medicineRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Needed By</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicineRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.medicine_name}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{new Date(request.need_by_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{request.recipient_name}</p>
                        {request.recipient_address && <p className="text-gray-500">{request.recipient_address}</p>}
                        {request.recipient_phone && <p className="text-gray-500">{request.recipient_phone}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <Check size={16} />
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 flex flex-col items-center text-gray-500">
              <AlertTriangle className="h-12 w-12 text-amber-400 mb-2" />
              <p className="text-lg font-medium">No Medicine Requests</p>
              <p className="mt-1">There are currently no medicine requests from recipients that need your approval.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
