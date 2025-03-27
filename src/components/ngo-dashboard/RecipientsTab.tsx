
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RecipientsTab = () => {
  const recipients = [
    {
      id: 1,
      name: "Government Hospital Thane",
      type: "Hospital",
      medicinesReceived: 12,
      lastDelivery: "2023-06-08",
      status: "Active"
    },
    {
      id: 2,
      name: "Sahyadri Old Age Home",
      type: "Care Home",
      medicinesReceived: 8,
      lastDelivery: "2023-06-02",
      status: "Active"
    },
    {
      id: 3,
      name: "Rural Health Camp - Raigad",
      type: "Health Camp",
      medicinesReceived: 5,
      lastDelivery: "2023-05-25",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Primary Health Center - Karjat",
      type: "Government Clinic",
      medicinesReceived: 15,
      lastDelivery: "2023-06-10",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recipients</CardTitle>
          <Button>Add Recipient</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recipients.map((recipient) => (
              <Card key={recipient.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{recipient.name}</h4>
                    <p className="text-sm text-gray-500">Type: {recipient.type}</p>
                    <p className="text-sm text-gray-500">Medicines Received: {recipient.medicinesReceived}</p>
                    <p className="text-sm text-gray-500">Last Delivery: {recipient.lastDelivery}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={recipient.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {recipient.status}
                    </Badge>
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

export default RecipientsTab;
