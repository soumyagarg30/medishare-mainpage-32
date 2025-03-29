
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Example data - in a real app, this would come from an API
const initialRequests = [
  {
    id: 1,
    requester: "City Hospital",
    medicineName: "Paracetamol",
    quantity: "1000 tablets",
    requestDate: "2023-05-15",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    requester: "Rural Clinic",
    medicineName: "Amoxicillin",
    quantity: "500 capsules",
    requestDate: "2023-05-10",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    requester: "Community Health Center",
    medicineName: "Insulin",
    quantity: "50 vials",
    requestDate: "2023-05-05",
    status: "approved",
    priority: "critical",
  },
  {
    id: 4,
    requester: "School Clinic",
    medicineName: "Vitamin B Complex",
    quantity: "200 tablets",
    requestDate: "2023-05-01",
    status: "rejected",
    priority: "low",
    reason: "Out of stock",
  },
];

const MedicineRequestsTab = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const handleReject = () => {
    if (selectedRequest) {
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
    }
  };

  const handleAccept = () => {
    if (selectedRequest) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "approved" }
            : req
        )
      );

      toast({
        title: "Request accepted",
        description: `Medicine request from ${selectedRequest.requester} has been approved.`,
      });

      setAcceptDialogOpen(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
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
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md"
              >
                <div>
                  <h3 className="font-medium">{request.medicineName}</h3>
                  <p className="text-sm text-gray-500">Requester: {request.requester}</p>
                  <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                  <div className="mt-2">{getPriorityBadge(request.priority)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Requested on: {request.requestDate}
                  </p>
                  <div className="mt-2">{getStatusBadge(request.status)}</div>
                  {request.reason && (
                    <p className="text-sm text-red-500 mt-1">Reason: {request.reason}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                  {request.status === "pending" && (
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
              <span className="font-medium">{selectedRequest?.medicineName}</span> from{" "}
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
              <span className="font-medium">{selectedRequest?.medicineName}</span> from{" "}
              <span className="font-medium">{selectedRequest?.requester}</span>.
            </p>
            <p className="mt-4">
              This will allow the requester to receive {selectedRequest?.quantity} of {selectedRequest?.medicineName}.
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
