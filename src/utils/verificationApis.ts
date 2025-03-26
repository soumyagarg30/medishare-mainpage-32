
/**
 * Utility functions for verification of various IDs required by MediShare
 */

/**
 * Verify GST ID for donors
 * In a production environment, this would connect to the GST verification API
 * Currently using a mock implementation
 */
export const verifyGSTID = async (gstId: string): Promise<{
  valid: boolean;
  name?: string;
  address?: string;
  message?: string;
}> => {
  console.log("Verifying GST ID:", gstId);
  
  // Simple validation - GST IDs are 15 characters
  if (!gstId || gstId.length !== 15) {
    return {
      valid: false,
      message: "Invalid GST ID format. Must be 15 characters."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, we'll consider certain patterns as valid
  // In production, this would be replaced with a real API call
  if (gstId.startsWith("27") || gstId.startsWith("07") || gstId.startsWith("33")) {
    return {
      valid: true,
      name: "MediShare Healthcare Ltd.",
      address: "123 Health Avenue, Mumbai, Maharashtra"
    };
  }
  
  return {
    valid: false,
    message: "GST ID verification failed. Please check the ID and try again."
  };
};

/**
 * Verify UID/Registration Number for NGOs
 * In a production environment, this would connect to the NGO verification API
 * Currently using a mock implementation
 */
export const verifyUID = async (uid: string): Promise<{
  valid: boolean;
  name?: string;
  registrationDetails?: {
    date: string;
    authority: string;
  };
  message?: string;
}> => {
  console.log("Verifying UID:", uid);
  
  if (!uid || uid.length < 5) {
    return {
      valid: false,
      message: "Invalid UID format. Must be at least 5 characters."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, certain patterns are considered valid
  if (uid.includes("NGO") || uid.includes("REG") || uid.startsWith("IN")) {
    return {
      valid: true,
      name: "Health For All Foundation",
      registrationDetails: {
        date: "2022-05-15",
        authority: "Ministry of Social Justice"
      }
    };
  }
  
  return {
    valid: false,
    message: "UID verification failed. Please check the ID and try again."
  };
};

/**
 * Verify DigiLocker ID for recipients
 * Currently using a mock implementation
 */
export const verifyDigiLocker = async (id: string): Promise<{
  valid: boolean;
  name?: string;
  message?: string;
}> => {
  console.log("Verifying DigiLocker ID:", id);
  
  if (!id || id.length < 5) {
    return {
      valid: false,
      message: "Invalid DigiLocker ID format."
    };
  }

  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo validation
  if (id.startsWith("DL") || id.includes("AADHAAR")) {
    return {
      valid: true,
      name: "Patient Name"
    };
  }
  
  return {
    valid: false,
    message: "DigiLocker verification failed. Please check the ID and try again."
  };
};

/**
 * Verify Admin code
 * Currently using a mock implementation with predefined codes
 */
export const verifyAdminCode = async (code: string): Promise<{
  valid: boolean;
  department?: string;
  message?: string;
}> => {
  console.log("Verifying Admin code:", code);
  
  if (!code || code.length < 6) {
    return {
      valid: false,
      message: "Invalid admin code format. Must be at least 6 characters."
    };
  }

  // Simulating verification delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Predefined admin codes for demo
  const validCodes = {
    "ADMIN123456": "System Administration",
    "SUPER987654": "Super Admin",
    "TECH456789": "Technical Support"
  };
  
  if (code in validCodes) {
    return {
      valid: true,
      department: validCodes[code as keyof typeof validCodes]
    };
  }
  
  return {
    valid: false,
    message: "Admin code verification failed. Please check the code and try again."
  };
};
