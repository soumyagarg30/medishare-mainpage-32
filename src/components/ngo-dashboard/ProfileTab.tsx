
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserData } from "@/utils/auth";
import { toast } from "@/hooks/use-toast";

interface ProfileTabProps {
  user: UserData;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState<Partial<UserData>>({
    name: user.name,
    organization: user.organization,
    address: user.address,
    phoneNumber: user.phoneNumber
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { 
        ...user, 
        ...editableUserData 
      };
      
      // Update local storage for demo purposes
      localStorage.setItem('medishare_user_data', JSON.stringify(updatedUser));
      
      // Send toast notification
      toast.success("Profile updated successfully!");
      
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditableUserData({
      name: user.name,
      organization: user.organization,
      address: user.address,
      phoneNumber: user.phoneNumber
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCancelEdit}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Name</label>
                {isEditing ? (
                  <Input
                    name="organization"
                    value={editableUserData.organization || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{user.organization || "N/A"}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                {isEditing ? (
                  <Input
                    name="phoneNumber"
                    value={editableUserData.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{user.phoneNumber || "N/A"}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={editableUserData.address || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{user.address || "N/A"}</p>
                )}
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
