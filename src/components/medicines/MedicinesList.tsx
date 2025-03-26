
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, MapPin, Package, Info, Loader2 } from "lucide-react";
import { Medicine, getAvailableMedicines, updateMedicineStatus } from "@/utils/medicineUtils";
import { formatDistance } from "date-fns";
import { getUser } from "@/utils/auth";
import { toast } from "@/hooks/use-toast";

interface MedicinesListProps {
  userType?: "donor" | "ngo" | "recipient" | "admin";
  showActions?: boolean;
  donorId?: string;
}

const MedicinesList: React.FC<MedicinesListProps> = ({ 
  userType, 
  showActions = true,
  donorId 
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const loadMedicines = async () => {
    setLoading(true);
    try {
      const result = await getAvailableMedicines();
      if (result.success && result.data) {
        setMedicines(result.data);
      } else {
        setError(result.message || "Failed to load medicines");
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, [donorId]);

  const handleReserveMedicine = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await updateMedicineStatus(id, 'reserved');
      if (result.success) {
        toast({
          title: "Medicine Reserved",
          description: "You have successfully reserved this medicine.",
        });
        // Refresh the list
        loadMedicines();
      } else {
        toast({
          title: "Reservation Failed",
          description: result.message || "Failed to reserve medicine.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error reserving medicine:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'antibiotics':
        return "bg-blue-100 text-blue-800";
      case 'painkillers':
        return "bg-red-100 text-red-800";
      case 'vitamins':
        return "bg-green-100 text-green-800";
      case 'antidiabetic':
        return "bg-purple-100 text-purple-800";
      case 'cardiovascular':
        return "bg-pink-100 text-pink-800";
      case 'respiratory':
        return "bg-indigo-100 text-indigo-800";
      case 'gastrointestinal':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-medishare-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Info className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Error Loading Medicines</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">No Medicines Available</h3>
        <p className="text-gray-600">
          There are currently no medicines available for donation.
        </p>
      </div>
    );
  }

  const user = getUser();
  const canReserve = user && user.userType === "ngo";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicines.map((medicine) => (
        <Card key={medicine.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{medicine.name}</CardTitle>
              <Badge className={getCategoryColor(medicine.category)}>
                {medicine.category.charAt(0).toUpperCase() + medicine.category.slice(1)}
              </Badge>
            </div>
            <CardDescription>
              Posted {formatDistance(new Date(medicine.created_at), new Date(), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Expires on: <span className="font-medium">{new Date(medicine.expiry_date).toLocaleDateString()}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Pill className="h-4 w-4 text-gray-400" />
              <span>Quantity: <span className="font-medium">{medicine.quantity}</span></span>
            </div>
            {medicine.location && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="flex-1">{medicine.location}</span>
              </div>
            )}
            {medicine.description && (
              <div className="text-sm mt-2 text-gray-600">
                {medicine.description.length > 100 
                  ? `${medicine.description.substring(0, 100)}...` 
                  : medicine.description
                }
              </div>
            )}
          </CardContent>
          {showActions && canReserve && (
            <CardFooter className="pt-0">
              <Button 
                className="w-full bg-medishare-orange hover:bg-medishare-gold"
                onClick={() => handleReserveMedicine(medicine.id)}
                disabled={!!actionLoading}
              >
                {actionLoading === medicine.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reserving...
                  </>
                ) : "Reserve Medicine"}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MedicinesList;
