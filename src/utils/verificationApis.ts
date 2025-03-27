
/**
 * Utility functions for verification of various IDs required by MediShare
 */

/**
 * Verify GST ID for donors
 * Performs validation against known GST ID formats and patterns for India
 */
export const verifyGSTID = async (gstId: string): Promise<{
  valid: boolean;
  name?: string;
  address?: string;
  message?: string;
}> => {
  console.log("Verifying GST ID:", gstId);
  
  // GST ID format validation: 
  // - 2 digits state code
  // - 10 digits PAN
  // - 1 digit entity number
  // - 1 digit check code
  // - 1 digit 'Z' by default
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  
  if (!gstId || !gstRegex.test(gstId)) {
    return {
      valid: false,
      message: "Invalid GST ID format. Must follow the standard 15-character GST format."
    };
  }

  // Verify checksum (simplified implementation)
  // In production, this would connect to GST verification portal
  const isValidChecksum = validateGSTChecksum(gstId);
  if (!isValidChecksum) {
    return {
      valid: false,
      message: "GST ID checksum validation failed. Please enter a valid GST ID."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, we'll allow all properly formatted GST IDs to be considered valid
  // In a production environment, this would connect to the GST verification API
  return {
    valid: true,
    name: `Organization with GST ${gstId}`,
    address: "Address will be fetched from official GST database in production"
  };
};

/**
 * Validates the GST checksum (simplified implementation)
 * In production, this would be replaced with the actual GST validation algorithm
 */
const validateGSTChecksum = (gstId: string): boolean => {
  // This is a simplified check. A real implementation would follow the
  // actual GST checksum algorithm
  
  // Get the first 14 characters and the check character
  const gstWithoutCheckDigit = gstId.substring(0, 14);
  const providedCheckDigit = gstId.charAt(14);
  
  // For demo purposes, we're accepting all well-formatted GST IDs
  // Replace this with actual checksum logic in production
  return true;
};

/**
 * Verify UID/Registration Number for NGOs
 * Performs validation against known NGO registration formats
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
  
  // Basic validation for NGO registration numbers
  // Different states/authorities have different formats
  // This is a simplified validation that checks for common patterns
  
  if (!uid || uid.length < 5) {
    return {
      valid: false,
      message: "Invalid UID format. Registration numbers are typically at least 5 characters."
    };
  }

  // Check for common NGO registration patterns
  // In production, this would be more comprehensive
  const uidPatterns = [
    /^[A-Z0-9]{5,}$/,                  // Basic alphanumeric
    /^NGO-[A-Z0-9]{3,}$/,              // NGO prefix
    /^[A-Z]{2,3}\/[0-9]{2,4}\/[0-9]+$/, // State code format
    /^[0-9]{2,4}\/[A-Z]+\/[0-9]{2,4}$/, // Year-based format
    /^REG-[A-Z0-9-]{5,}$/              // Registration prefix
  ];

  let isValidFormat = false;
  for (const pattern of uidPatterns) {
    if (pattern.test(uid)) {
      isValidFormat = true;
      break;
    }
  }

  if (!isValidFormat) {
    return {
      valid: false,
      message: "Registration number format is not recognized. Please check your ID."
    };
  }

  // Mock API call - in production, this would be a real API call
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would connect to the appropriate NGO verification database
  // For demo purposes, we're accepting all well-formatted UIDs
  return {
    valid: true,
    name: `Organization with Registration ${uid}`,
    registrationDetails: {
      date: new Date().toISOString().split('T')[0], // Current date for demo
      authority: "Relevant Registering Authority"
    }
  };
};

/**
 * Verify DigiLocker ID for recipients
 * Validates ID format according to DigiLocker specifications
 */
export const verifyDigiLocker = async (id: string): Promise<{
  valid: boolean;
  name?: string;
  message?: string;
}> => {
  console.log("Verifying DigiLocker ID:", id);
  
  // DigiLocker ID validation
  // This is a simplified validation - actual validation would be more complex
  
  if (!id || id.length < 8) {
    return {
      valid: false,
      message: "Invalid DigiLocker ID format. IDs should be at least 8 characters."
    };
  }

  // Check for common DigiLocker patterns
  // In production, this would follow the actual DigiLocker ID format
  const digilockerPatterns = [
    /^DL-[A-Z0-9]{6,}$/,               // DL prefix
    /^AADHAAR-[0-9]{4}-[0-9]{4}$/,     // Aadhaar-linked format
    /^[A-Z0-9]{8,16}$/                 // Basic alphanumeric
  ];

  let isValidFormat = false;
  for (const pattern of digilockerPatterns) {
    if (pattern.test(id)) {
      isValidFormat = true;
      break;
    }
  }

  if (!isValidFormat) {
    return {
      valid: false,
      message: "DigiLocker ID format is not recognized. Please check your ID."
    };
  }

  // Mock API call - in production, this would connect to DigiLocker API
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept all well-formatted DigiLocker IDs
  return {
    valid: true,
    name: `User with DigiLocker ID ${id}`
  };
};

/**
 * Verify Admin code
 * Currently using a mock implementation with predefined codes and extended validation
 */
export const verifyAdminCode = async (code: string): Promise<{
  valid: boolean;
  department?: string;
  message?: string;
}> => {
  console.log("Verifying Admin code:", code);
  
  // Admin code validation
  if (!code || code.length < 6) {
    return {
      valid: false,
      message: "Invalid admin code format. Must be at least 6 characters."
    };
  }

  // Check for admin code pattern
  // Usually follows some organizational convention
  const adminCodePattern = /^[A-Z]{2,5}[0-9]{4,8}$/;
  if (!adminCodePattern.test(code)) {
    return {
      valid: false,
      message: "Admin code format is invalid. Must be 2-5 uppercase letters followed by 4-8 digits."
    };
  }

  // Simulating verification delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo/development, allow some predefined admin codes
  // In production, this would connect to an admin verification service
  const validCodes = {
    "ADMIN123456": "System Administration",
    "SUPER987654": "Super Admin",
    "TECH456789": "Technical Support",
    "MGMT123456": "Management",
    "OPS789012": "Operations",
    "SEC345678": "Security"
  };
  
  // Check if the code is in our predefined list
  if (code in validCodes) {
    return {
      valid: true,
      department: validCodes[code as keyof typeof validCodes]
    };
  }
  
  // For valid format codes not in our predefined list,
  // extract department from code prefix for demo purposes
  const prefix = code.match(/^[A-Z]{2,5}/)?.[0] || "";
  const departmentMap: Record<string, string> = {
    "ADMIN": "Administration",
    "SUPER": "Supervision",
    "TECH": "Technical",
    "MGMT": "Management",
    "OPS": "Operations",
    "SEC": "Security",
    "FIN": "Finance",
    "HR": "Human Resources",
    "IT": "Information Technology"
  };

  if (prefix in departmentMap) {
    return {
      valid: true,
      department: departmentMap[prefix]
    };
  }
  
  // If it matches our pattern but isn't recognized, consider it valid
  // In production, you would want stricter validation
  return {
    valid: true,
    department: "General Administration"
  };
};
