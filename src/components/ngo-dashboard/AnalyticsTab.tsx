
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DonationChart from "@/components/charts/DonationChart";
import DistributionChart from "@/components/charts/DistributionChart";
import MedicineCategoryChart from "@/components/charts/MedicineCategoryChart";

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donation Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <DonationChart title="Monthly Donations" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Medicine Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <MedicineCategoryChart title="Medicine Categories" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DistributionChart title="Monthly Distribution" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-gray-500 text-sm">Total Medicines Received</h3>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-green-600 text-sm">↑ 12% from last month</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-gray-500 text-sm">Total Medicines Distributed</h3>
              <p className="text-2xl font-bold">987</p>
              <p className="text-blue-600 text-sm">↑ 8% from last month</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-gray-500 text-sm">Active Donors</h3>
              <p className="text-2xl font-bold">32</p>
              <p className="text-purple-600 text-sm">↑ 5% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
