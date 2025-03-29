
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Example data - in a real app, this would come from an API
const medicineRequests = [
  {
    id: 1,
    medicineName: "Paracetamol",
    quantity: "100 tablets",
    requestDate: "2023-05-15",
    status: "approved",
    ngo: "HealthCare Foundation",
  },
  {
    id: 2,
    medicineName: "Amoxicillin",
    quantity: "50 capsules",
    requestDate: "2023-05-10",
    status: "pending",
    ngo: "Medical Relief NGO",
  },
  {
    id: 3,
    medicineName: "Insulin",
    quantity: "10 vials",
    requestDate: "2023-05-05",
    status: "rejected",
    reason: "Insufficient documentation provided",
    ngo: "Diabetes Care Network",
  },
  {
    id: 4,
    medicineName: "Vitamin B Complex",
    quantity: "60 tablets",
    requestDate: "2023-05-01",
    status: "approved",
    ngo: "Nutrition First",
  },
];

const MedicineRequestsTab = () => {
  const [requests, setRequests] = useState(medicineRequests);

  const handleStatusChange = (id: number, newStatus: string) => {
    // Find the request
    const requestToUpdate = requests.find(req => req.id === id);
    
    // Don't allow status change if request was rejected
    if (requestToUpdate?.status === "rejected") {
      toast({
        title: "Action not allowed",
        description: "Rejected requests cannot have their status changed.",
        variant: "destructive",
      });
      return;
    }
    
    // Update request status
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );

    toast({
      title: "Status updated",
      description: `Medicine request status changed to ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "uploaded":
        return <Badge className="bg-blue-500">Uploaded</Badge>;
      case "received":
        return <Badge className="bg-purple-500">Received</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
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
                <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                <p className="text-sm text-gray-500">NGO: {request.ngo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Requested on: {request.requestDate}
                </p>
                <div className="mt-2">{getStatusBadge(request.status)}</div>
                {request.reason && (
                  <p className="text-sm text-red-500 mt-1">{request.reason}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 justify-end">
                {/* Only show status change options if not rejected */}
                {request.status !== "rejected" && (
                  <Select
                    onValueChange={(value) => handleStatusChange(request.id, value)}
                    defaultValue={request.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uploaded">Uploaded</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
