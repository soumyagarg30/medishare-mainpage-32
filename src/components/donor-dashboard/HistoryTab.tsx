
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample donation history
const donationHistory = [
  {
    id: "DON001",
    date: "2023-12-01",
    amount: "₹5,000",
    ngo: "Health For All NGO",
    medicines: "Paracetamol, Bandages",
    status: "Completed"
  },
  {
    id: "DON002",
    date: "2023-12-15",
    amount: "₹10,000",
    ngo: "Medical Aid Foundation",
    medicines: "Insulin, Syringes",
    status: "Completed"
  },
  {
    id: "DON003",
    date: "2023-11-20",
    amount: "₹2,500",
    ngo: "Care NGO",
    medicines: "Vitamin C, Antiseptic",
    status: "Completed"
  }
];

const HistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>View your past donations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NGO</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Medicines</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((donation) => (
                <tr key={donation.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{donation.id}</td>
                  <td className="px-4 py-4 text-sm">{donation.date}</td>
                  <td className="px-4 py-4 text-sm">{donation.amount}</td>
                  <td className="px-4 py-4 text-sm">{donation.ngo}</td>
                  <td className="px-4 py-4 text-sm">{donation.medicines}</td>
                  <td className="px-4 py-4 text-sm">{donation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
