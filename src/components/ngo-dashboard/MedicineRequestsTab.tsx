
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MedicineRequest {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  need_by_date: string | null;
  status: string | null;
  recipient_entity_id: string;
  ngo_entity_id: string | null;
  recipient_name?: string;
}

interface MedicineRequestsTabProps {
  ngoEntityId: string;
}

const MedicineRequestsTab = ({ ngoEntityId }: MedicineRequestsTabProps) => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch medicine requests that don't have an NGO assigned
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .is('ngo_entity_id', null);
      
      if (error) throw error;
      
      // Convert all requests to have proper formatting
      let requestsList: MedicineRequest[] = data || [];
      
      // Fetch recipient information for each request
      for (let i = 0; i < requestsList.length; i++) {
        const { data: recipientData, error: recipientError } = await supabase
          .from('recipients')
          .select('name, org_name')
          .eq('entity_id', requestsList[i].recipient_entity_id)
          .single();
        
        if (!recipientError && recipientData) {
          requestsList[i].recipient_name = recipientData.org_name || recipientData.name;
        }
      }
      
      setRequests(requestsList);
    } catch (error) {
      console.error("Error fetching medicine requests:", error);
      toast({
        title: "Error",
        description: "Failed to load medicine requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('requested_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast({
        title: "Request Approved",
        description: "You have successfully approved this medicine request.",
      });
      
      // Remove the approved request from the displayed list
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error approving medicine request:", error);
      toast({
        title: "Error",
        description: "Failed to approve medicine request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p>No pending medicine requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Medicine Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Recipient</th>
                  <th className="px-4 py-2 text-left">Need By</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{request.medicine_name || 'N/A'}</td>
                    <td className="px-4 py-3">{request.quantity || 'N/A'}</td>
                    <td className="px-4 py-3">{request.recipient_name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      {request.need_by_date 
                        ? new Date(request.need_by_date).toLocaleDateString() 
                        : 'Not specified'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          !request.status || request.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : request.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status 
                          ? request.status.charAt(0).toUpperCase() + request.status.slice(1) 
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        className="bg-medishare-blue hover:bg-medishare-blue/90"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
