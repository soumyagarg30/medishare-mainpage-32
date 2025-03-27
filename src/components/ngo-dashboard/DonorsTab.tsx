
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DonorsMap from "@/components/maps/DonorsMap";

const nearbyDonors = [
  {
    id: "D001",
    name: "John Doe Pharmaceuticals",
    distance: "2.5 km",
    medicines: "Antibiotics, Painkillers, Insulin",
    contact: "+1 555-123-4567"
  },
  {
    id: "D002",
    name: "MediCare Hospital",
    distance: "1.8 km",
    medicines: "Asthma Inhalers, Diabetes Medication",
    contact: "+1 555-234-5678"
  },
  {
    id: "D003",
    name: "HealthPlus Clinic",
    distance: "3.2 km",
    medicines: "Vitamin C, Antibiotic Ointment",
    contact: "+1 555-345-6789"
  }
];

const DonorsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donors Near Me</CardTitle>
          <CardDescription>Find donors in your area that have medicines available</CardDescription>
        </CardHeader>
        <CardContent>
          <DonorsMap title="Nearby Donors" className="mb-6 h-96" />
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Available Medicines</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {nearbyDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">{donor.name}</td>
                    <td className="px-4 py-4 text-sm">{donor.distance}</td>
                    <td className="px-4 py-4 text-sm max-w-[200px] truncate">{donor.medicines}</td>
                    <td className="px-4 py-4 text-sm">{donor.contact}</td>
                    <td className="px-4 py-4 text-sm">
                      <Button variant="ghost" size="sm" className="text-medishare-blue">
                        Contact
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorsTab;
