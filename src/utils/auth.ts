
/**
 * Authentication utilities for MediShare
 */

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
export const isAuthenticated = (): boolean => {
  return !!getUser();
};

/**
 * Mock login function
 * In a production environment, this would connect to your backend API
 */
export const loginUser = async (
  email: string, 
  password: string, 
  userType: UserType
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  console.log(`Attempting to login user: ${email} as ${userType}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, allow any email/password with simple validation
  if (!email || !email.includes('@') || !password || password.length < 6) {
    return {
      success: false,
      message: "Invalid email or password."
    };
  }
  
  // Create mock user data
  const userData: UserData = {
    id: `user_${Date.now()}`,
    email,
    name: email.split('@')[0],
    userType,
    verified: true, // In production, this would depend on verification status
    createdAt: new Date().toISOString(),
    organization: userType === 'donor' || userType === 'ngo' ? 'Organization Name' : undefined,
    address: '123 Main Street, City',
    phoneNumber: '1234567890',
  };
  
  // Save user data
  saveUser(userData);
  
  return {
    success: true,
    userData
  };
};

/**
 * Mock registration function
 * In a production environment, this would connect to your backend API
 */
export const registerUser = async (
  userData: Partial<UserData>,
  password: string,
  verificationId: string
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  console.log("Registering user:", userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Basic validation
  if (!userData.email || !userData.userType || !password || !verificationId) {
    return {
      success: false,
      message: "Missing required fields for registration."
    };
  }
  
  // Create user data
  const newUser: UserData = {
    id: `user_${Date.now()}`,
    email: userData.email,
    name: userData.name || userData.email.split('@')[0],
    userType: userData.userType,
    verified: false, // Will require verification
    createdAt: new Date().toISOString(),
    organization: userData.organization,
    address: userData.address,
    phoneNumber: userData.phoneNumber,
    verificationId: verificationId,
  };
  
  // Save user data
  saveUser(newUser);
  
  return {
    success: true,
    userData: newUser,
    message: "Registration successful! Your account is pending verification."
  };
};
