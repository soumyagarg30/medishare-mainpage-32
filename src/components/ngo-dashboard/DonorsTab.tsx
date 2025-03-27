
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DonorsTab = () => {
  const donors = [
    {
      id: 1,
      name: "AstraZeneca India",
      type: "Corporate",
      totalDonations: 15,
      lastDonation: "2023-06-10",
      status: "Active"
    },
    {
      id: 2,
      name: "Cipla Ltd.",
      type: "Pharmaceutical",
      totalDonations: 22,
      lastDonation: "2023-06-05",
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Anil Sharma",
      type: "Individual",
      totalDonations: 8,
      lastDonation: "2023-05-28",
      status: "Inactive"
    },
    {
      id: 4,
      name: "Sun Pharma",
      type: "Pharmaceutical",
      totalDonations: 30,
      lastDonation: "2023-06-12",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donor Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donors.map((donor) => (
              <Card key={donor.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{donor.name}</h4>
                    <p className="text-sm text-gray-500">Type: {donor.type}</p>
                    <p className="text-sm text-gray-500">Total Donations: {donor.totalDonations}</p>
                    <p className="text-sm text-gray-500">Last Donation: {donor.lastDonation}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={donor.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {donor.status}
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

export default DonorsTab;
