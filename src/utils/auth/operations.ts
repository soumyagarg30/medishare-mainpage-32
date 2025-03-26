
/**
 * MediShare authentication operations utilities
 */
import { supabase } from "@/integrations/supabase/client";
import { UserData, UserType } from './types';
import { saveUser, removeUser } from './storage';
import { fetchUserProfile } from './profile';

/**
 * Initialize auth - check if user is already signed in via Supabase
 */
export const initializeAuth = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error);
      return false;
    }
    
    if (session?.user) {
      // User is signed in, fetch their profile
      const result = await fetchUserProfile(session.user.id);
      return result.success;
    }
    
    return false;
  } catch (error) {
    console.error("Auth initialization error:", error);
    return false;
  }
};

/**
 * Logout the current user
 * @returns Object indicating success and optional message
 */
export const logoutUser = async (): Promise<{success: boolean; message?: string}> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Supabase logout error:", error);
      return {
        success: false,
        message: error.message || "Error during logout"
      };
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
 * Login user with Supabase
 */
export const loginUser = async (
  email: string, 
  password: string, 
  userType: UserType
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Invalid email or password."
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        message: "Login failed. Please try again."
      };
    }
    
    // Fetch user profile
    const profileResult = await fetchUserProfile(data.user.id);
    
    if (!profileResult.success) {
      return profileResult;
    }
    
    // Check if user type matches
    if (profileResult.userData?.userType !== userType) {
      // Sign out since wrong user type
      await supabase.auth.signOut();
      removeUser();
      
      return {
        success: false,
        message: `This account is not registered as a ${userType}. Please sign in with the correct account type.`
      };
    }
    
    return {
      success: true,
      userData: profileResult.userData
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during login."
    };
  }
};

/**
 * Register a new user with Supabase
 */
export const registerUser = async (
  userData: Partial<UserData>,
  password: string,
  verificationId: string
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  try {
    if (!userData.email || !userData.userType || !password || !verificationId) {
      return {
        success: false,
        message: "Missing required fields for registration."
      };
    }
    
    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
      options: {
        data: {
          userType: userData.userType,
          name: userData.name || userData.email.split('@')[0],
          organization: userData.organization,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          verificationId: verificationId
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed. Please try again."
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        message: "Registration failed. Please try again."
      };
    }
    
    // Manually insert the user profile directly in case the trigger fails
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        user_type: userData.userType,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        verified: false,
        organization: userData.organization,
        address: userData.address,
        phone_number: userData.phoneNumber,
        verification_id: verificationId,
        department: userData.department
      });
      
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // We don't return error here as the auth user was created successfully
      // The profile might be created by the database trigger
    }
    
    // Create user data
    const newUser: UserData = {
      id: data.user.id,
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      userType: userData.userType,
      verified: false, // Will require verification
      createdAt: new Date().toISOString(),
      organization: userData.organization,
      address: userData.address,
      phoneNumber: userData.phoneNumber,
      verificationId: verificationId,
      department: userData.department
    };
    
    // Save user data
    saveUser(newUser);
    
    return {
      success: true,
      userData: newUser,
      message: "Registration successful! Your account is pending verification."
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during registration."
    };
  }
};

/**
 * Setup auth listener to keep session in sync
 */
export const setupAuthListener = (callback: (user: UserData | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Need to use setTimeout to avoid Supabase deadlock
      setTimeout(async () => {
        const result = await fetchUserProfile(session.user.id);
        if (result.success && result.userData) {
          callback(result.userData);
        }
      }, 0);
    } else if (event === 'SIGNED_OUT') {
      removeUser();
      callback(null);
    }
  });
};
