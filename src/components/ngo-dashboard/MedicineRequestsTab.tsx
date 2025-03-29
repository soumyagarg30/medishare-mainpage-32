
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  reason?: string | null;
  requester?: string; // This will be populated from the recipients table
}

// We're not actually using ngoEntityId in this component currently,
// so we can make it optional to avoid breaking existing usage
interface MedicineRequestsTabProps {
  ngoEntityId?: string;
}

const MedicineRequestsTab: React.FC<MedicineRequestsTabProps> = ({ ngoEntityId }) => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MedicineRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicineRequests();
  }, [ngoEntityId]);

  const fetchMedicineRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch medicine requests from the requested_meds table
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .eq('status', 'uploaded'); // Get requests that are in uploaded status
      
      if (error) {
        throw error;
      }
      
      const requestsWithRecipients: MedicineRequest[] = [];
      
      // For each request, fetch the recipient information
      for (const request of data || []) {
        const { data: recipientData, error: recipientError } = await supabase
          .from('recipients')
          .select('name, org_name')
          .eq('entity_id', request.recipient_entity_id)
          .single();
        
        const requesterName = recipientData ? 
          (recipientData.org_name || recipientData.name) : 
          'Unknown Requester';
        
        requestsWithRecipients.push({
          ...request,
          requester: requesterName
        });
      }
      
      setRequests(requestsWithRecipients);
    } catch (error) {
      console.error('Error fetching medicine requests:', error);
      toast({
        title: "Error",
        description: "Failed to load medicine requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (selectedRequest) {
      try {
        const { error } = await supabase
          .from('requested_meds')
          .update({
            status: 'rejected',
            reason: rejectReason
          })
          .eq('id', selectedRequest.id);
        
        if (error) throw error;
        
        // Update the local state
        setRequests(
          requests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "rejected", reason: rejectReason }
              : req
          )
        );

        toast({
          title: "Request rejected",
          description: `Medicine request from ${selectedRequest.requester} has been rejected.`,
        });

        setRejectReason("");
        setRejectDialogOpen(false);
      } catch (error) {
        console.error('Error rejecting request:', error);
        toast({
          title: "Error",
          description: "Failed to reject the request",
          variant: "destructive"
        });
      }
    }
  };

  const handleAccept = async () => {
    if (selectedRequest && ngoEntityId) {
      try {
        const { error } = await supabase
          .from('requested_meds')
          .update({
            status: 'approved',
            ngo_entity_id: ngoEntityId
          })
          .eq('id', selectedRequest.id);
        
        if (error) throw error;
        
        // Update the local state
        setRequests(
          requests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "approved", ngo_entity_id: ngoEntityId }
              : req
          )
        );

        toast({
          title: "Request accepted",
          description: `Medicine request from ${selectedRequest.requester} has been approved.`,
        });

        setAcceptDialogOpen(false);
      } catch (error) {
        console.error('Error accepting request:', error);
        toast({
          title: "Error",
          description: "Failed to accept the request",
          variant: "destructive"
        });
      }
    } else if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information is missing. Please update your profile.",
        variant: "destructive"
      });
      setAcceptDialogOpen(false);
    }
  };

  const getPriorityBadge = (needByDate: string | null) => {
    if (!needByDate) return <Badge className="bg-green-500">Low</Badge>;
    
    const today = new Date();
    const needBy = new Date(needByDate);
    const daysUntilNeedBy = Math.ceil((needBy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilNeedBy <= 7) {
      return <Badge className="bg-red-500">Critical</Badge>;
    } else if (daysUntilNeedBy <= 14) {
      return <Badge className="bg-orange-500">High</Badge>;
    } else if (daysUntilNeedBy <= 30) {
      return <Badge className="bg-yellow-500">Medium</Badge>;
    } else {
      return <Badge className="bg-green-500">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
      case "uploaded":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Medicine Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">Loading medicine requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No medicine requests available at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md"
                >
                  <div>
                    <h3 className="font-medium">{request.medicine_name}</h3>
                    <p className="text-sm text-gray-500">Requester: {request.requester}</p>
                    <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                    <div className="mt-2">{getPriorityBadge(request.need_by_date)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Needed by: {request.need_by_date ? new Date(request.need_by_date).toLocaleDateString() : 'Not specified'}
                    </p>
                    <div className="mt-2">{getStatusBadge(request.status)}</div>
                    {request.reason && (
                      <p className="text-sm text-red-500 mt-1">Reason: {request.reason}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 justify-end">
                    {(request.status === "pending" || request.status === "uploaded") && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAcceptDialogOpen(true);
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectDialogOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Medicine Request</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              You are about to reject the medicine request for{" "}
              <span className="font-medium">{selectedRequest?.medicine_name}</span> from{" "}
              <span className="font-medium">{selectedRequest?.requester}</span>.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for rejection:</label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this request..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Accept Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Medicine Request</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              You are about to accept the medicine request for{" "}
              <span className="font-medium">{selectedRequest?.medicine_name}</span> from{" "}
              <span className="font-medium">{selectedRequest?.requester}</span>.
            </p>
            <p className="mt-4">
              This will allow the requester to receive {selectedRequest?.quantity} of {selectedRequest?.medicine_name}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAccept}>
              Accept Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicineRequestsTab;
