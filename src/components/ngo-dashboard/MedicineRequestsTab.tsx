
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";

interface MedicineRequest {
  id: string;
  medicine_name: string;
  quantity: number;
  medical_condition: string;
  status: string;
  requested_date: string;
  recipient_entity_id: string;
  recipient_name?: string;
  ngo_entity_id?: string;
}

const MedicineRequestsTab = () => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // In a real app, this would be an API call to fetch from the database
        // For this demo, we'll use mock data
        const mockRequests: MedicineRequest[] = [
          {
            id: "req-1",
            medicine_name: "Amoxicillin",
            quantity: 30,
            medical_condition: "Bacterial infection",
            status: "pending",
            requested_date: "2023-06-15",
            recipient_entity_id: "recipient-1",
            recipient_name: "John Doe"
          },
          {
            id: "req-2",
            medicine_name: "Paracetamol",
            quantity: 20,
            medical_condition: "Fever",
            status: "approved",
            requested_date: "2023-06-10",
            recipient_entity_id: "recipient-2",
            recipient_name: "Jane Smith",
            ngo_entity_id: user?.entity_id
          },
          {
            id: "req-3",
            medicine_name: "Ibuprofen",
            quantity: 15,
            medical_condition: "Pain relief",
            status: "rejected",
            requested_date: "2023-06-05",
            recipient_entity_id: "recipient-3",
            recipient_name: "Mark Johnson"
          },
          {
            id: "req-4",
            medicine_name: "Omeprazole",
            quantity: 30,
            medical_condition: "Acid reflux",
            status: "approved",
            requested_date: "2023-05-20",
            recipient_entity_id: "recipient-4",
            recipient_name: "Sarah Williams",
            ngo_entity_id: "ngo-456"
          },
        ];

        setRequests(mockRequests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medicine requests:", error);
        toast({
          title: "Error",
          description: "Failed to load medicine requests",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.entity_id]);

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would be an API call to update the status in the database
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { 
          ...req, 
          status: "approved", 
          ngo_entity_id: user?.entity_id 
        } : req
      )
    );

    toast({
      title: "Request Approved",
      description: "You have successfully approved this medicine request.",
    });
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
            <p>No medicine requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Medicine Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Medical Condition</th>
                  <th className="px-4 py-2 text-left">Recipient</th>
                  <th className="px-4 py-2 text-left">Request Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{request.medicine_name}</td>
                    <td className="px-4 py-3">{request.quantity}</td>
                    <td className="px-4 py-3">{request.medical_condition}</td>
                    <td className="px-4 py-3">{request.recipient_name}</td>
                    <td className="px-4 py-3">
                      {new Date(request.requested_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : request.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : request.status === "delivered"
                            ? "bg-purple-100 text-purple-800"
                            : request.status === "received"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {request.status === "pending" ? (
                        <Button 
                          size="sm" 
                          className="bg-medishare-blue hover:bg-medishare-blue/90"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                      ) : request.ngo_entity_id === user?.entity_id ? (
                        <span className="text-sm text-green-600">Accepted by you</span>
                      ) : request.status === "approved" ? (
                        <span className="text-sm text-gray-500">Accepted by another NGO</span>
                      ) : (
                        <span className="text-sm text-gray-500">{request.status}</span>
                      )}
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
