
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const recipients = [
  {
    id: "REC001",
    name: "City Hospital",
    type: "Healthcare Facility",
    location: "Downtown, City Center",
    contactPerson: "Dr. Jane Smith",
    phoneNumber: "+1 555-123-4567",
    medicinesNeeded: "Antibiotics, Pain Relievers, Insulin"
  },
  {
    id: "REC002",
    name: "Rural Health Camp",
    type: "Health Camp",
    location: "Westside Village, 20 km",
    contactPerson: "Dr. Robert Johnson",
    phoneNumber: "+1 555-234-5678",
    medicinesNeeded: "Vitamins, Vaccines, Antibiotic Ointment"
  },
  {
    id: "REC003",
    name: "Children's Care Center",
    type: "Non-profit Organization",
    location: "North District, City",
    contactPerson: "Mary Williams",
    phoneNumber: "+1 555-345-6789",
    medicinesNeeded: "Children's Medications, Cough Syrup, Fever Reducers"
  }
];

const distributionHistory = [
  {
    id: "DIST001",
    recipient: "City Hospital",
    date: "2023-12-01",
    medicines: "Paracetamol (500 tablets), Antibiotics (200 capsules)",
    status: "Delivered"
  },
  {
    id: "DIST002",
    recipient: "Rural Health Camp",
    date: "2023-12-05",
    medicines: "Vitamins (100 bottles), First Aid Supplies",
    status: "In Transit"
  },
  {
    id: "DIST003",
    recipient: "Children's Care Center",
    date: "2023-12-10",
    medicines: "Fever Reducers (50 bottles), Cough Syrup (30 bottles)",
    status: "Processing"
  }
];

const RecipientsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registered Recipients</CardTitle>
          <CardDescription>Manage your distribution partners and recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Input placeholder="Search recipients..." className="max-w-sm" />
              <Button variant="outline">Filter</Button>
              <Button>Search</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact Person</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicines Needed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((recipient) => (
                    <tr key={recipient.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">{recipient.id}</td>
                      <td className="px-4 py-4 text-sm font-medium">{recipient.name}</td>
                      <td className="px-4 py-4 text-sm">{recipient.type}</td>
                      <td className="px-4 py-4 text-sm">{recipient.location}</td>
                      <td className="px-4 py-4 text-sm">{recipient.contactPerson}</td>
                      <td className="px-4 py-4 text-sm">{recipient.medicinesNeeded}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="text-medishare-blue">
                            Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-medishare-orange">
                            Distribute
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Distributions</CardTitle>
          <CardDescription>History of medicine distributions to recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicines</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {distributionHistory.map((distribution) => (
                  <tr key={distribution.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">{distribution.id}</td>
                    <td className="px-4 py-4 text-sm font-medium">{distribution.recipient}</td>
                    <td className="px-4 py-4 text-sm">{distribution.date}</td>
                    <td className="px-4 py-4 text-sm">{distribution.medicines}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        distribution.status === "Delivered" 
                          ? "bg-green-100 text-green-800" 
                          : distribution.status === "In Transit" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {distribution.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Button variant="ghost" size="sm" className="text-medishare-blue">
                        View Details
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

export default RecipientsTab;
