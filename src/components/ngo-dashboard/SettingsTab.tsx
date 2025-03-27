
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      toast({
        title: "Passwords don't match",
        description: "The new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to change the password
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully."
    });
    
    setPassword({
      current: "",
      new: "",
      confirm: ""
    });
  };
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                name="current" 
                type="password" 
                value={password.current}
                onChange={handlePasswordChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                name="new" 
                type="password" 
                value={password.new}
                onChange={handlePasswordChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                name="confirm" 
                type="password" 
                value={password.confirm}
                onChange={handlePasswordChange}
              />
            </div>
            
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive updates about donations and requests</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive text messages for urgent notifications</p>
              </div>
              <Switch 
                id="sms-notifications" 
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>Customize your application experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-500">Use dark theme for the application</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="share-location">Share Location</Label>
                <p className="text-sm text-gray-500">Allow the app to access your location</p>
              </div>
              <Switch 
                id="share-location" 
                checked={shareLocation}
                onCheckedChange={setShareLocation}
              />
            </div>
            
            <Button onClick={handleSavePreferences}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
