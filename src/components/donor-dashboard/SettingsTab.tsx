
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="mb-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <p className="text-sm text-gray-500 mb-4">Manage how you receive notifications</p>
            
            <div className="space-y-2">
              <p>Notification settings will be available soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your account security</p>
            
            <div className="space-y-2">
              <p>Security settings will be available soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <h3 className="text-lg font-medium">Privacy Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Control your privacy preferences</p>
            
            <div className="space-y-2">
              <p>Privacy settings will be available soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
