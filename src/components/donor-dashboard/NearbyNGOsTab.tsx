
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DonationMap from "@/components/maps/DonationMap";
import { Button } from "@/components/ui/button";

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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Nearby NGOs List</h3>
                <Button variant="outline" size="sm">Refresh</Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine Needs</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">City Hospital</td>
                      <td className="px-4 py-4 text-sm">2.3 km</td>
                      <td className="px-4 py-4 text-sm">Antibiotics, Painkillers</td>
                      <td className="px-4 py-4 text-sm">+91 9876543210</td>
                      <td className="px-4 py-4 text-sm">
                        <Button size="sm">Donate</Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">Community Clinic</td>
                      <td className="px-4 py-4 text-sm">1.7 km</td>
                      <td className="px-4 py-4 text-sm">First Aid Supplies, Diabetes Medication</td>
                      <td className="px-4 py-4 text-sm">+91 9876543211</td>
                      <td className="px-4 py-4 text-sm">
                        <Button size="sm">Donate</Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">Rural Health Center</td>
                      <td className="px-4 py-4 text-sm">4.5 km</td>
                      <td className="px-4 py-4 text-sm">Asthma Inhalers, Vitamins</td>
                      <td className="px-4 py-4 text-sm">+91 9876543212</td>
                      <td className="px-4 py-4 text-sm">
                        <Button size="sm">Donate</Button>
                      </td>
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
