
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Check } from "lucide-react";

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
  const [acceptingIds, setAcceptingIds] = useState<Set<string>>(new Set());

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
        .eq('status', 'uploaded');
      
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
    
    // Add to accepting state to show loading indicator
    setAcceptingIds(prev => new Set(prev).add(medicineId));
    
    try {
      // Check if the status can be updated directly to assigned
      const { error } = await supabase
        .from('donated_meds')
        .update({
          ngo_entity_id: ngoEntityId,
          status: 'assigned'
        })
        .eq('id', parseInt(medicineId));
        
      if (error) {
        console.error("Error accepting medicine:", error);
        throw error;
      }
      
      toast({
        title: "Medicine Accepted",
        description: "You have successfully accepted this medicine donation.",
      });
      
      // Remove the accepted medicine from the list
      setMedicines(prev => prev.filter(medicine => medicine.id !== medicineId));
    } catch (error) {
      console.error("Error accepting medicine:", error);
      toast({
        title: "Error",
        description: "Failed to accept medicine donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove from accepting state
      setAcceptingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(medicineId);
        return newSet;
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.medicine_name || 'N/A'}</TableCell>
                    <TableCell>{medicine.quantity || 'N/A'}</TableCell>
                    <TableCell>
                      {medicine.expiry_date 
                        ? new Date(medicine.expiry_date).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{medicine.donor_name || 'Unknown'}</TableCell>
                    <TableCell>
                      {medicine.date_added 
                        ? new Date(medicine.date_added).toLocaleDateString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className="bg-medishare-blue hover:bg-medishare-blue/90"
                        onClick={() => handleAcceptMedicine(medicine.id)}
                        disabled={acceptingIds.has(medicine.id)}
                      >
                        {acceptingIds.has(medicine.id) ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Accept
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableMedicinesTab;
