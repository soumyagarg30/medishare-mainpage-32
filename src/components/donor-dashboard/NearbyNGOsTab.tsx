
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DonationMap from "@/components/maps/DonationMap";

const NearbyNGOsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NGOs Near Me</CardTitle>
          <CardDescription>Find NGOs in your area that need donations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <DonationMap title="NGOs Near You" className="w-full" />

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Nearby NGOs List</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine Needs</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">City Hospital</td>
                      <td className="px-4 py-4 text-sm">2.3 km</td>
                      <td className="px-4 py-4 text-sm">Antibiotics, Painkillers</td>
                      <td className="px-4 py-4 text-sm">+91 9876543210</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">Community Clinic</td>
                      <td className="px-4 py-4 text-sm">1.7 km</td>
                      <td className="px-4 py-4 text-sm">First Aid Supplies, Diabetes Medication</td>
                      <td className="px-4 py-4 text-sm">+91 9876543211</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">Rural Health Center</td>
                      <td className="px-4 py-4 text-sm">4.5 km</td>
                      <td className="px-4 py-4 text-sm">Asthma Inhalers, Vitamins</td>
                      <td className="px-4 py-4 text-sm">+91 9876543212</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyNGOsTab;
