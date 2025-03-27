
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
