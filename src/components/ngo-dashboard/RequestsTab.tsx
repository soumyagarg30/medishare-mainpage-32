
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RequestsTab = () => {
  const requests = [
    {
      id: 1,
      type: "Antibiotics",
      quantity: 50,
      urgency: "High",
      date: "2023-06-15",
      status: "Pending"
    },
    {
      id: 2,
      type: "Painkillers",
      quantity: 100,
      urgency: "Medium",
      date: "2023-06-10",
      status: "Approved"
    },
    {
      id: 3,
      type: "Insulin",
      quantity: 30,
      urgency: "High",
      date: "2023-06-05",
      status: "Fulfilled"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Donation Requests</CardTitle>
          <Button>Create New Request</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{request.type}</h4>
                    <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                    <p className="text-sm text-gray-500">Requested on: {request.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      request.status === "Fulfilled" 
                        ? "bg-green-100 text-green-800" 
                        : request.status === "Approved" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-amber-100 text-amber-800"
                    }>
                      {request.status}
                    </Badge>
                    <p className={`text-sm mt-1 ${
                      request.urgency === "High" 
                        ? "text-red-600" 
                        : request.urgency === "Medium" 
                          ? "text-amber-600" 
                          : "text-green-600"
                    }`}>
                      {request.urgency} urgency
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsTab;
