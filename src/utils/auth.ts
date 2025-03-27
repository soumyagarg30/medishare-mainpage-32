
/**
 * Authentication utilities for MediShare
 */
import { supabase } from '@/integrations/supabase/client';

// User type definitions
export type UserType = 'donor' | 'ngo' | 'recipient' | 'admin';

export interface UserData {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  verified: boolean;
  createdAt: string;
  // Additional fields based on user type
  organization?: string; 
  address?: string;
  phoneNumber?: string;
  verificationId?: string; // GST ID, UID, DigiLocker ID, or Admin code
  department?: string; // For admin users
}

// Local storage keys
const USER_KEY = 'medishare_user';
const AUTH_TOKEN_KEY = 'medishare_auth_token';

/**
 * Save user data to local storage
 */
export const saveUser = (userData: UserData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Get user data from local storage
 */
export const getUser = (): UserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove user data from local storage (logout)
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

/**
 * Logout the current user
 * @returns Object indicating success and optional message
 */
export const logoutUser = async (): Promise<{success: boolean; message?: string}> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    removeUser();
    return {
      success: true,
      message: "Successfully logged out"
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Error during logout"
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
      throw error;
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
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  try {
    console.log("Registering user:", userData);
    
    // Basic validation
    if (!userData.email || !userData.userType || !password || !verificationId) {
      return {
        success: false,
        message: "Missing required fields for registration."
      };
    }
    
    // Prepare user metadata
    const metadata = {
      name: userData.name,
      user_type: userData.userType,
      organization: userData.organization,
      address: userData.address,
      phone_number: userData.phoneNumber,
      verification_id: verificationId,
      department: userData.department
    };
    
    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (!data.user) {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }
    
    // Create user data object
    const newUser: UserData = {
      id: data.user.id,
      email: data.user.email || '',
      name: userData.name || userData.email?.split('@')[0] || '',
      userType: userData.userType,
      verified: false, // Will require verification
      createdAt: new Date().toISOString(),
      organization: userData.organization,
      address: userData.address,
      phoneNumber: userData.phoneNumber,
      verificationId: verificationId,
      department: userData.department,
    };
    
    // Save user data
    saveUser(newUser);
    
    return {
      success: true,
      userData: newUser,
      message: "Registration successful! Your account is pending verification."
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration."
    };
  }
};
