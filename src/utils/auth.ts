import { supabase } from "@/integrations/supabase/client";

export type UserType = 'donor' | 'ngo' | 'recipient' | 'admin';

export interface UserData {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  verified: boolean;
  createdAt?: string;
  organization?: string;
  address?: string;
  phoneNumber?: string;
  verificationId?: string;
  department?: string;
}

// Local storage key for user data
const USER_STORAGE_KEY = 'medishare_user_data';

/**
 * Save user data to local storage
 */
export const saveUser = (userData: UserData): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
};

/**
 * Get user data from local storage
 */
export const getUser = (): UserData | null => {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

/**
 * Check if user is authenticated by verifying if session exists
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<{success: boolean; message?: string}> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Clear local storage
    localStorage.removeItem(USER_STORAGE_KEY);
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during logout."
    };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string, 
  password: string, 
  userType: UserType
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  try {
    console.log(`Attempting to login user: ${email} as ${userType}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      // Handle "Email not confirmed" error
      if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
        console.log("Email not confirmed, attempting to confirm manually...");
        
        // Try to get user by email and confirm
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: null
          }
        });
        
        if (signUpError) {
          console.error("Error during sign up:", signUpError);
          throw error; // Throw original error if sign up fails
        }
        
        // Try signing in again after sign up attempt
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (retryError) {
          throw retryError;
        }
        
        data.user = retryData.user;
        data.session = retryData.session;
      } else {
        throw error;
      }
    }
    
    if (!data.user || !data.session) {
      return {
        success: false,
        message: "Login failed. Please try again."
      };
    }
    
    // Fetch user profile from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return {
        success: false,
        message: "Error fetching user profile."
      };
    }
    
    // Check if user type matches
    if (profileData.user_type !== userType) {
      // Sign out if wrong user type
      await supabase.auth.signOut();
      return {
        success: false,
        message: `This account is not registered as a ${userType}. Please use the correct login type.`
      };
    }
    
    // Check if the user is verified
    if (!profileData.verified && userType !== 'admin') {
      // Sign out if user is not verified
      await supabase.auth.signOut();
      return {
        success: false,
        message: "Your account is pending verification by an admin. Please try again later or contact support."
      };
    }
    
    // Create user data object
    const userData: UserData = {
      id: data.user.id,
      email: data.user.email || '',
      name: profileData.name || email.split('@')[0],
      userType: profileData.user_type as UserType,
      verified: profileData.verified || false,
      createdAt: profileData.created_at,
      organization: profileData.organization,
      address: profileData.address,
      phoneNumber: profileData.phone_number,
      verificationId: profileData.verification_id,
      department: profileData.department
    };
    
    // Save user data
    saveUser(userData);
    
    return {
      success: true,
      userData
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during login."
    };
  }
};

/**
 * Register a new user
 */
export const registerUser = async (
  userData: Partial<UserData>,
  password: string,
  verificationId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email || '',
      password,
      options: {
        data: {
          name: userData.name,
          user_type: userData.userType,
          organization: userData.organization,
          address: userData.address,
          phone_number: userData.phoneNumber,
          verification_id: verificationId,
          department: userData.department
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      message: "Registration successful! Please check your email to confirm your account."
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration."
    };
  }
};

/**
 * Resend confirmation email
 */
export const resendConfirmationEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;

    return {
      success: true,
      message: "Confirmation email sent! Please check your inbox."
    };
  } catch (error: any) {
    console.error("Email resend error:", error);
    return {
      success: false,
      message: error.message || "Could not resend confirmation email."
    };
  }
};
