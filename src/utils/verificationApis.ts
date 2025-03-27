
/**
 * API mock for verification services
 * In a real application, these would call actual verification APIs
 */

// Regular expressions for validating format
const GST_ID_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const UID_REGEX = /^[A-Z]{2}\/[A-Z]{2}\/[0-9]{3}\/[0-9]{4}-[0-9]{2}$/;
const DIGILOCKER_REGEX = /^[A-Z0-9]{12}$/;
const ADMIN_CODE_REGEX = /^ADM-[A-Z0-9]{6}$/;

// Authorized admin email domains
const AUTHORIZED_ADMIN_DOMAINS = ['medishare.org', 'medishare.admin.in', 'health.gov.in'];

// Valid admin verification codes (in a real application, these would be stored securely)
const VALID_ADMIN_CODES = ['ADM-12AB34', 'ADM-567C89', 'ADM-XYZ123'];

/**
 * Verify a GST ID
 * @param gstId GST ID to verify
 * @returns Object with valid flag and message
 */
export const verifyGSTID = async (gstId: string): Promise<{ valid: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Format validation
  if (!GST_ID_REGEX.test(gstId)) {
    return {
      valid: false,
      message: "Invalid GST ID format. It should be in the format: 22AAAAA0000A1Z5"
    };
  }
  
  // In a real application, this would call the actual GST verification API
  // Here we're simulating validation based on the format
  return {
    valid: true,
    message: "GST ID verified successfully!"
  };
};

/**
 * Verify a UID (Unique Identification) for NGOs
 * @param uid UID to verify
 * @returns Object with valid flag and message
 */
export const verifyUID = async (uid: string): Promise<{ valid: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Format validation
  if (!UID_REGEX.test(uid)) {
    return {
      valid: false,
      message: "Invalid UID format. It should be in the format: MH/MU/123/2023-24"
    };
  }
  
  // In a real application, this would call the actual NGO verification API
  // Here we're simulating validation based on the format
  return {
    valid: true,
    message: "NGO UID verified successfully!"
  };
};

/**
 * Verify a DigiLocker ID
 * @param digiLocker DigiLocker ID to verify
 * @returns Object with valid flag and message
 */
export const verifyDigiLocker = async (digiLocker: string): Promise<{ valid: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Format validation
  if (!DIGILOCKER_REGEX.test(digiLocker)) {
    return {
      valid: false,
      message: "Invalid DigiLocker ID format. It should be a 12-character alphanumeric code."
    };
  }
  
  // In a real application, this would call the actual DigiLocker verification API
  // Here we're simulating validation based on the format
  return {
    valid: true,
    message: "DigiLocker ID verified successfully!"
  };
};

/**
 * Verify an admin verification code and email domain
 * @param adminCode Admin verification code to verify
 * @param email Admin email to verify
 * @returns Object with valid flag and message
 */
export const verifyAdminCode = async (adminCode: string, email?: string): Promise<{ valid: boolean; message?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Format validation
  if (!ADMIN_CODE_REGEX.test(adminCode)) {
    return {
      valid: false,
      message: "Invalid admin code format. It should be in the format: ADM-123ABC"
    };
  }
  
  // Validate admin code
  if (!VALID_ADMIN_CODES.includes(adminCode)) {
    return {
      valid: false,
      message: "Invalid admin verification code. Please contact the system administrator."
    };
  }
  
  // Validate email domain if provided
  if (email) {
    const domain = email.split('@')[1];
    if (!AUTHORIZED_ADMIN_DOMAINS.some(d => domain === d)) {
      return {
        valid: false,
        message: `Invalid email domain. Admin accounts must use an authorized domain (${AUTHORIZED_ADMIN_DOMAINS.join(', ')}).`
      };
    }
  }
  
  return {
    valid: true,
    message: "Admin verification successful!"
  };
};
