
import { supabase } from "@/integrations/supabase/client";
import { getUser } from "@/utils/auth";

export interface Medicine {
  id: string;
  donor_id: string;
  name: string;
  category: string;
  quantity: number;
  expiry_date: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: 'available' | 'reserved' | 'donated';
  created_at: string;
  updated_at: string;
}

export interface MedicineInput {
  name: string;
  category: string;
  quantity: number;
  expiry_date: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Add a new medicine donation
 */
export const addMedicineDonation = async (medicine: MedicineInput): Promise<{
  success: boolean;
  data?: Medicine;
  message?: string;
}> => {
  try {
    const user = getUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to donate medicines."
      };
    }
    
    if (user.userType !== 'donor') {
      return {
        success: false,
        message: "Only donors can donate medicines."
      };
    }
    
    const { data, error } = await supabase
      .from('medicines')
      .insert({
        donor_id: user.id,
        name: medicine.name,
        category: medicine.category,
        quantity: medicine.quantity,
        expiry_date: medicine.expiry_date,
        description: medicine.description,
        location: medicine.location,
        latitude: medicine.latitude,
        longitude: medicine.longitude,
        status: 'available'
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding medicine donation:", error);
      return {
        success: false,
        message: error.message || "Failed to add medicine donation."
      };
    }
    
    return {
      success: true,
      data: data as Medicine,
      message: "Medicine donation added successfully."
    };
  } catch (error) {
    console.error("Error adding medicine donation:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};

/**
 * Get all available medicines
 */
export const getAvailableMedicines = async (): Promise<{
  success: boolean;
  data?: Medicine[];
  message?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching available medicines:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch available medicines."
      };
    }
    
    return {
      success: true,
      data: data as Medicine[]
    };
  } catch (error) {
    console.error("Error fetching available medicines:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};

/**
 * Get medicines by donor
 */
export const getDonorMedicines = async (donorId?: string): Promise<{
  success: boolean;
  data?: Medicine[];
  message?: string;
}> => {
  try {
    const user = getUser();
    const id = donorId || user?.id;
    
    if (!id) {
      return {
        success: false,
        message: "Donor ID is required."
      };
    }
    
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('donor_id', id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching donor medicines:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch donor medicines."
      };
    }
    
    return {
      success: true,
      data: data as Medicine[]
    };
  } catch (error) {
    console.error("Error fetching donor medicines:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};

/**
 * Update medicine status
 */
export const updateMedicineStatus = async (
  medicineId: string,
  status: 'available' | 'reserved' | 'donated'
): Promise<{
  success: boolean;
  data?: Medicine;
  message?: string;
}> => {
  try {
    const user = getUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to update medicine status."
      };
    }
    
    const { data, error } = await supabase
      .from('medicines')
      .update({ status })
      .eq('id', medicineId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating medicine status:", error);
      return {
        success: false,
        message: error.message || "Failed to update medicine status."
      };
    }
    
    return {
      success: true,
      data: data as Medicine,
      message: `Medicine status updated to ${status}.`
    };
  } catch (error) {
    console.error("Error updating medicine status:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};

/**
 * Delete medicine
 */
export const deleteMedicine = async (medicineId: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const user = getUser();
    
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to delete medicines."
      };
    }
    
    if (user.userType !== 'donor' && user.userType !== 'admin') {
      return {
        success: false,
        message: "Only donors and admins can delete medicines."
      };
    }
    
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', medicineId);
    
    if (error) {
      console.error("Error deleting medicine:", error);
      return {
        success: false,
        message: error.message || "Failed to delete medicine."
      };
    }
    
    return {
      success: true,
      message: "Medicine deleted successfully."
    };
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};

/**
 * Get medicine locations for map
 */
export const getMedicineLocations = async (): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    location: string;
    latitude: number;
    longitude: number;
  }>;
  message?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('id, name, category, quantity, location, latitude, longitude')
      .eq('status', 'available')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    if (error) {
      console.error("Error fetching medicine locations:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch medicine locations."
      };
    }
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error("Error fetching medicine locations:", error);
    return {
      success: false,
      message: "An unexpected error occurred."
    };
  }
};
