
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    // In a real application, this would send the updated profile data to the backend
    if (user) {
      const updatedUser = { 
        ...user, 
        ...editableUserData 
      };
      
      // Update local storage for demo purposes
      // In a real app, you would make an API call here
      localStorage.setItem('medishare_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
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
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">NGO Partner Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            {isEditing ? (
              <Input
                name="name"
                value={editableUserData.name || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <p className="text-base">{user.name || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Organization</p>
            {isEditing ? (
              <Input
                name="organization"
                value={editableUserData.organization || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <p className="text-base">{user.organization || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            {isEditing ? (
              <Input
                name="address"
                value={editableUserData.address || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <p className="text-base">{user.address || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            {isEditing ? (
              <Input
                name="phoneNumber"
                value={editableUserData.phoneNumber || ""}
                onChange={handleInputChange}
                className="mt-1"
              />
            ) : (
              <p className="text-base">{user.phoneNumber || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">UID Number</p>
            <p className="text-base">{user.verificationId || "Not provided"}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Account Created</p>
            <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Verification Status</p>
            <p className={`text-base ${user.verified ? "text-green-600" : "text-amber-600"}`}>
              {user.verified ? "Verified" : "Pending Verification"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
