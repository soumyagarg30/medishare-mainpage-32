/**
 * Utility functions for verification of various IDs required by MediShare
 */

/**
 * Verify GST ID for donors
 * In a production environment, this would connect to the GST verification API
 * Currently using a mock implementation with more robust validation
 */
export const verifyGSTID = async (gstId: string): Promise<{
  valid: boolean;
  name?: string;
  address?: string;
  message?: string;
}> => {
  console.log("Verifying GST ID:", gstId);
  
  // Basic GST format validation (15 characters with specific pattern)
  // Real GST format: 2 digits state code + 10 digits PAN + 1 digit entity number + 1 digit check digit + Z
  if (!gstId || gstId.length !== 15) {
    return {
      valid: false,
      message: "Invalid GST ID format. Must be 15 characters."
    };
  }

  // Check if the GST follows the correct pattern
  // First 2 digits should be a valid state code (01-38)
  const stateCode = parseInt(gstId.substring(0, 2), 10);
  if (isNaN(stateCode) || stateCode < 1 || stateCode > 38) {
    return {
      valid: false,
      message: "Invalid state code in GST ID."
    };
  }

  // Last character should be Z for companies
  if (gstId[14] !== 'Z') {
    return {
      valid: false,
      message: "Invalid GST ID format. Last character should be 'Z' for companies."
    };
  }

  // Check if characters 3-12 form a valid PAN pattern (5 letters + 4 numbers + 1 letter)
  const panPart = gstId.substring(2, 12);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(panPart)) {
    return {
      valid: false,
      message: "Invalid PAN format within GST ID."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, we'll consider certain patterns as valid
  // In production, this would be replaced with a real API call
  const validGSTs = [
    "27AADCB2230M1Z3", // Maharashtra
    "07AADCB2230M1Z4", // Delhi
    "33AADCB2230M1Z5", // Tamil Nadu
    "29AADCB2230M1Z2", // Karnataka
    "24AADCB2230M1Z7"  // Gujarat
  ];
  
  if (validGSTs.includes(gstId)) {
    const stateNames = {
      "27": "Maharashtra",
      "07": "Delhi",
      "33": "Tamil Nadu",
      "29": "Karnataka",
      "24": "Gujarat"
    };
    
    const statePrefix = gstId.substring(0, 2);
    const stateName = stateNames[statePrefix as keyof typeof stateNames] || "India";
    
    return {
      valid: true,
      name: "MediShare Healthcare Ltd.",
      address: `123 Health Avenue, ${stateName}`
    };
  }
  
  // If the GST format is correct but not in our valid list
  return {
    valid: false,
    message: "GST ID verification failed. Please check the ID and try again."
  };
};

/**
 * Verify UID/Registration Number for NGOs
 * In a production environment, this would connect to the NGO verification API
 * Currently using a mock implementation with improved validation
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
  
  // Basic validation for UID
  if (!uid || uid.length < 5) {
    return {
      valid: false,
      message: "Invalid UID format. Must be at least 5 characters."
    };
  }

  // Check for specific NGO registration formats
  const ngoRegex = /^(NGO|REG|IN)[A-Z0-9]{5,15}$/;
  if (!ngoRegex.test(uid)) {
    return {
      valid: false,
      message: "Invalid NGO registration number format. Should start with NGO, REG, or IN followed by 5-15 alphanumeric characters."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, certain patterns are considered valid
  const validUIDs = ["NGO12345", "REG67890", "INABC123", "NGO98765", "REGXYZ789"];
  
  if (validUIDs.includes(uid)) {
    const registrationDates = {
      "NGO12345": "2021-03-15",
      "REG67890": "2022-05-20",
      "INABC123": "2020-11-10",
      "NGO98765": "2019-07-22",
      "REGXYZ789": "2023-01-05"
    };
    
    const authorities = {
      "NGO12345": "Ministry of Social Justice",
      "REG67890": "Department of Social Welfare",
      "INABC123": "Charity Commission",
      "NGO98765": "Ministry of Health",
      "REGXYZ789": "National Trust"
    };
    
    return {
      valid: true,
      name: "Health For All Foundation",
      registrationDetails: {
        date: registrationDates[uid as keyof typeof registrationDates],
        authority: authorities[uid as keyof typeof authorities]
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
