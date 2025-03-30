
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";

interface DonatedMedicine {
  id: string;
  medicine_name: string;
  quantity: number;
  expiry_date: string;
  status: string;
  donor_entity_id: string;
  donor_name?: string;
  ngo_entity_id?: string;
}

const AvailableMedicinesTab = () => {
  const [medicines, setMedicines] = useState<DonatedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        // In a real app, this would be an API call to fetch from the database
        // For this demo, we'll use mock data
        const mockMedicines: DonatedMedicine[] = [
          {
            id: "med-1",
            medicine_name: "Amoxicillin",
            quantity: 100,
            expiry_date: "2024-12-31",
            status: "available",
            donor_entity_id: "donor-1",
            donor_name: "Apollo Hospital"
          },
          {
            id: "med-2",
            medicine_name: "Paracetamol",
            quantity: 200,
            expiry_date: "2024-10-15",
            status: "available",
            donor_entity_id: "donor-2",
            donor_name: "City Pharmacy"
          },
          {
            id: "med-3",
            medicine_name: "Ibuprofen",
            quantity: 150,
            expiry_date: "2024-11-20",
            status: "accepted",
            donor_entity_id: "donor-3",
            donor_name: "National Medical Store",
            ngo_entity_id: user?.entity_id
          },
          {
            id: "med-4",
            medicine_name: "Omeprazole",
            quantity: 75,
            expiry_date: "2024-09-30",
            status: "accepted",
            donor_entity_id: "donor-4",
            donor_name: "Health First Clinic",
            ngo_entity_id: "ngo-456"
          }
        ];

        setMedicines(mockMedicines);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donated medicines:", error);
        toast({
          title: "Error",
          description: "Failed to load donated medicines",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [user?.entity_id]);

  const handleAcceptMedicine = (medicineId: string) => {
    // In a real app, this would be an API call to update the status in the database
    setMedicines((prevMedicines) =>
      prevMedicines.map((med) =>
        med.id === medicineId ? { 
          ...med, 
          status: "accepted", 
          ngo_entity_id: user?.entity_id 
        } : med
      )
    );

    toast({
      title: "Medicine Accepted",
      description: "You have successfully accepted this medicine donation.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Medicines</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medishare-blue"></div>
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-8">
            <p>No medicines available at this time</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Medicine Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Expiry Date</th>
                  <th className="px-4 py-2 text-left">Donor</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{medicine.medicine_name}</td>
                    <td className="px-4 py-3">{medicine.quantity}</td>
                    <td className="px-4 py-3">
                      {new Date(medicine.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{medicine.donor_name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          medicine.status === "available"
                            ? "bg-green-100 text-green-800"
                            : medicine.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : medicine.status === "distributed"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {medicine.status === "available" ? (
                        <Button 
                          size="sm" 
                          className="bg-medishare-blue hover:bg-medishare-blue/90"
                          onClick={() => handleAcceptMedicine(medicine.id)}
                        >
                          Accept
                        </Button>
                      ) : medicine.ngo_entity_id === user?.entity_id ? (
                        <span className="text-sm text-green-600">Accepted by you</span>
                      ) : (
                        <span className="text-sm text-gray-500">Accepted by another NGO</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableMedicinesTab;
