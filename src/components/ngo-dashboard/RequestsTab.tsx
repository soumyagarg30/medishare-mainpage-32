
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample available medicines data
const availableMedicines = [
  {
    id: "MED001",
    name: "Paracetamol",
    quantity: "500 tablets",
    donor: "John Doe Pharmaceuticals",
    expiryDate: "2024-12-31",
    status: "Available"
  },
  {
    id: "MED002",
    name: "Insulin",
    quantity: "25 vials",
    donor: "MediCare Hospital",
    expiryDate: "2024-06-15",
    status: "Available"
  },
  {
    id: "MED003",
    name: "Vitamin C",
    quantity: "200 tablets",
    donor: "HealthPlus Clinic",
    expiryDate: "2024-10-20",
    status: "Reserved"
  }
];

// Sample request status data
const requestStatusData = [
  {
    id: "REQ001",
    medicine: "Insulin",
    quantity: "10 vials",
    requestedFrom: "MediCare Hospital",
    requestDate: "2023-12-15",
    status: "Approved"
  },
  {
    id: "REQ002",
    medicine: "Antibiotics",
    quantity: "200 capsules",
    requestedFrom: "City Pharmacy",
    requestDate: "2023-12-18",
    status: "Pending"
  },
  {
    id: "REQ003",
    medicine: "Vitamins",
    quantity: "100 tablets",
    requestedFrom: "HealthPlus Clinic",
    requestDate: "2023-12-20",
    status: "Rejected"
  }
];

const RequestsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Medicines</CardTitle>
          <CardDescription>Browse and request medicines from donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Input placeholder="Search medicines..." className="max-w-sm" />
              <Button variant="outline">Filter</Button>
              <Button>Search</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Donor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availableMedicines.map((medicine) => (
                    <tr key={medicine.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">{medicine.id}</td>
                      <td className="px-4 py-4 text-sm font-medium">{medicine.name}</td>
                      <td className="px-4 py-4 text-sm">{medicine.quantity}</td>
                      <td className="px-4 py-4 text-sm">{medicine.donor}</td>
                      <td className="px-4 py-4 text-sm">{medicine.expiryDate}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          medicine.status === "Available" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {medicine.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-medishare-blue">
                          Request
                        </Button>
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
          <CardTitle>Request Status</CardTitle>
          <CardDescription>Track the status of your medicine requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
              + Create New Request
            </Button>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Requested From</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Request Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestStatusData.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">{request.id}</td>
                      <td className="px-4 py-4 text-sm font-medium">{request.medicine}</td>
                      <td className="px-4 py-4 text-sm">{request.quantity}</td>
                      <td className="px-4 py-4 text-sm">{request.requestedFrom}</td>
                      <td className="px-4 py-4 text-sm">{request.requestDate}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "Approved" 
                            ? "bg-green-100 text-green-800" 
                            : request.status === "Pending" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-medishare-blue">
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsTab;
