
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

interface DonatedMedicine {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  expiry_date: string | null;
  status: string | null;
  donor_entity_id: string;
  ngo_entity_id: string | null;
  date_added: string | null;
  ingredients: string | null;
  image_url: string | null;
  donor_name?: string;
}

interface AvailableMedicinesTabProps {
  ngoEntityId: string;
}

const AvailableMedicinesTab = ({ ngoEntityId }: AvailableMedicinesTabProps) => {
  const [medicines, setMedicines] = useState<DonatedMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      // Fetch medicines that are uploaded and not assigned to any NGO
      const { data, error } = await supabase
        .from('donated_meds')
        .select('*')
        .eq('status', 'uploaded')
        .is('ngo_entity_id', null);
      
      if (error) throw error;
      
      // Convert all medicines to have string IDs for consistency
      let medicinesList: DonatedMedicine[] = data ? data.map(med => ({
        ...med,
        id: med.id.toString()
      })) : [];
      
      // Fetch donor information for each medicine
      for (let i = 0; i < medicinesList.length; i++) {
        const { data: donorData, error: donorError } = await supabase
          .from('donors')
          .select('name, org_name')
          .eq('entity_id', medicinesList[i].donor_entity_id)
          .single();
        
        if (!donorError && donorData) {
          medicinesList[i].donor_name = donorData.org_name || donorData.name;
        }
      }
      
      setMedicines(medicinesList);
    } catch (error) {
      console.error("Error fetching available medicines:", error);
      toast({
        title: "Error",
        description: "Failed to load available medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMedicine = async (medicineId: string) => {
    if (!ngoEntityId) {
      toast({
        title: "Error",
        description: "NGO information not found",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('donated_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'approved'
        })
        .eq('id', parseInt(medicineId));
        
      if (error) throw error;
      
      toast({
        title: "Medicine Accepted",
        description: "You have successfully accepted this medicine donation.",
      });
      
      // Remove the accepted medicine from the displayed list
      setMedicines(prevMedicines => 
        prevMedicines.filter(med => med.id !== medicineId)
      );
    } catch (error) {
      console.error("Error accepting medicine:", error);
      toast({
        title: "Error",
        description: "Failed to accept medicine donation",
        variant: "destructive",
      });
    }
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
                  <th className="px-4 py-2 text-left">Date Added</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{medicine.medicine_name || 'N/A'}</td>
                    <td className="px-4 py-3">{medicine.quantity || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {medicine.expiry_date 
                        ? new Date(medicine.expiry_date).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">{medicine.donor_name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      {medicine.date_added 
                        ? new Date(medicine.date_added).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          medicine.status === "uploaded"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {medicine.status 
                          ? medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1) 
                          : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        className="bg-medishare-blue hover:bg-medishare-blue/90"
                        onClick={() => handleAcceptMedicine(medicine.id)}
                      >
                        Accept
                      </Button>
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
