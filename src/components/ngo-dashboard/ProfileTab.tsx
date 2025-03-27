
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserData } from "@/utils/auth";

interface ProfileTabProps {
  user: UserData;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Name</label>
                <p className="text-lg font-medium">{user.organization || "N/A"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-lg font-medium">{user.phoneNumber || "N/A"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-lg font-medium">{user.address || "N/A"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Verification ID</label>
                <p className="text-lg font-medium">{user.verificationId || "N/A"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Account Status</label>
                <p className="text-lg font-medium">
                  {user.verified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-amber-600">Pending Verification</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
