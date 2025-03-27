
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Loader2 } from "lucide-react";
import { UserType, resendConfirmationEmail } from "@/utils/auth";
import { toast } from "@/hooks/use-toast";

interface RegistrationSuccessProps {
  userType: UserType | null;
  email?: string;
  requiresEmailConfirmation?: boolean;
}

const RegistrationSuccess = ({ userType, email, requiresEmailConfirmation }: RegistrationSuccessProps) => {
  const [isResending, setIsResending] = useState(false);
  
  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    const result = await resendConfirmationEmail(email);
    setIsResending(false);
    
    if (result.success) {
      toast({
        title: "Email Sent",
        description: result.message
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      });
    }
  };
  
  // Different messages based on user type and confirmation requirements
  const verificationMessages = {
    donor: "We're verifying your GST ID. You'll receive an email when your account is verified.",
    ngo: "We're verifying your UID. You'll receive an email when your account is verified.",
    recipient: "We're verifying your DigiLocker information. You'll receive an email when your account is verified.",
    admin: "We're verifying your admin credentials. You'll receive an email when your account is verified.",
  };

  return (
    <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registration Successful!</h2>
      
      {requiresEmailConfirmation ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Thank you for registering with MediShare. Please check your email to confirm your account.
          </p>
          {email && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Didn't receive the email?</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Resend Confirmation Email
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600 mb-6">
          Thank you for registering with MediShare. {userType && verificationMessages[userType]}
        </p>
      )}
      
      <Link to="/sign-in" className="mt-6 inline-block">
        <Button className="bg-medishare-orange hover:bg-medishare-gold mt-4">
          Proceed to Sign In
        </Button>
      </Link>
    </div>
  );
};

export default RegistrationSuccess;
