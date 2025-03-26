
/**
 * MediShare user profile management utilities
 */
import { supabase } from "@/integrations/supabase/client";
import { UserData } from './types';
import { saveUser } from './storage';

/**
 * Fetch user profile from Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<{
  success: boolean;
  userData?: UserData;
  message?: string;
}> => {
  try {
    // Get user's email from Supabase auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData.user) {
      console.error("Error fetching auth user:", authError);
      return {
        success: false,
        message: "Could not fetch user information"
      };
    }
    
    const userEmail = authData.user.email || "";
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        message: "Could not fetch user profile"
      };
    }

    if (!data) {
      return {
        success: false,
        message: "User profile not found"
      };
    }

    // Transform from database format to our UserData format
    const userData: UserData = {
      id: data.id,
      email: userEmail, // Use email from auth.getUser() instead of profile
      name: data.name || "",
      userType: data.user_type as UserData['userType'],
      verified: data.verified || false,
      createdAt: data.created_at || new Date().toISOString(),
      organization: data.organization,
      address: data.address,
      phoneNumber: data.phone_number,
      verificationId: data.verification_id,
      department: data.department
    };

    // Save to local storage
    saveUser(userData);

    return {
      success: true,
      userData
    };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return {
      success: false,
      message: "An unexpected error occurred"
    };
  }
};
