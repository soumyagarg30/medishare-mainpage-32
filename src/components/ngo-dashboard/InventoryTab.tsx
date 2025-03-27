
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sample inventory items
const inventoryItems = [
  {
    id: "INV001",
    name: "Paracetamol",
    quantity: "350 tablets",
    receivedFrom: "John Doe Pharmaceuticals",
    receivedDate: "2023-11-10",
    expiryDate: "2024-12-31",
    status: "In Stock"
  },
  {
    id: "INV002",
    name: "Antibiotics",
    quantity: "100 capsules",
    receivedFrom: "MediCare Hospital",
    receivedDate: "2023-11-15",
    expiryDate: "2024-08-20",
    status: "In Stock"
  },
  {
    id: "INV003",
    name: "Insulin",
    quantity: "15 vials",
    receivedFrom: "MediCare Hospital",
    receivedDate: "2023-11-20",
    expiryDate: "2024-06-15",
    status: "Low Stock"
  }
];

// Sample distribution history
const distributionHistory = [
  {
    id: "DIST001",
    medicine: "Paracetamol",
    quantity: "50 tablets",
    recipient: "City Hospital",
    date: "2023-12-01",
    status: "Delivered"
  },
  {
    id: "DIST002",
    medicine: "Antibiotics",
    quantity: "20 capsules",
    recipient: "Rural Health Camp",
    date: "2023-12-05",
    status: "In Transit"
  },
  {
    id: "DIST003",
    medicine: "Insulin",
    quantity: "5 vials",
    recipient: "Private Clinic",
    date: "2023-12-10",
    status: "Processing"
  }
];

const InventoryTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Track and manage medicines in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Received From</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Received Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">{item.id}</td>
                      <td className="px-4 py-4 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-4 text-sm">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm">{item.receivedFrom}</td>
                      <td className="px-4 py-4 text-sm">{item.receivedDate}</td>
                      <td className="px-4 py-4 text-sm">{item.expiryDate}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "In Stock" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-medishare-blue">
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-medishare-blue hover:bg-medishare-blue/90">
                + Add New Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribution Management</CardTitle>
          <CardDescription>Track medicine distribution to recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button className="bg-medishare-orange hover:bg-medishare-gold">
              + Create New Distribution
            </Button>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicine</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {distributionHistory.map((distribution) => (
                    <tr key={distribution.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">{distribution.id}</td>
                      <td className="px-4 py-4 text-sm">{distribution.medicine}</td>
                      <td className="px-4 py-4 text-sm">{distribution.quantity}</td>
                      <td className="px-4 py-4 text-sm">{distribution.recipient}</td>
                      <td className="px-4 py-4 text-sm">{distribution.date}</td>
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
                          Update
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

export default InventoryTab;
