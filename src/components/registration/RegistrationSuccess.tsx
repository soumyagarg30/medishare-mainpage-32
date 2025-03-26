
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { UserType } from "@/utils/auth";

interface RegistrationSuccessProps {
  userType: UserType | null;
}

const RegistrationSuccess = ({ userType }: RegistrationSuccessProps) => {
  const messages = {
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
      <p className="text-gray-600 mb-6">
        Thank you for registering with MediShare. {userType && messages[userType]}
      </p>
      <Link to="/">
        <Button className="bg-medishare-orange hover:bg-medishare-gold">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default RegistrationSuccess;
