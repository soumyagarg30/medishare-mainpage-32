
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const InventoryTab = () => {
  const inventory = [
    {
      id: 1,
      name: "Amoxicillin",
      category: "Antibiotics",
      quantity: 200,
      expiryDate: "2024-12-15",
      status: "In Stock"
    },
    {
      id: 2,
      name: "Paracetamol",
      category: "Painkillers",
      quantity: 350,
      expiryDate: "2024-08-10",
      status: "In Stock"
    },
    {
      id: 3,
      name: "Insulin",
      category: "Diabetes",
      quantity: 45,
      expiryDate: "2024-09-20",
      status: "Low Stock"
    },
    {
      id: 4,
      name: "Atorvastatin",
      category: "Cardiovascular",
      quantity: 0,
      expiryDate: "2024-11-05",
      status: "Out of Stock"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medicine Inventory</CardTitle>
          <Button>Add Medicine</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-gray-500">Category: {item.category}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Expiry: {item.expiryDate}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      item.status === "In Stock" 
                        ? "bg-green-100 text-green-800" 
                        : item.status === "Low Stock" 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-red-100 text-red-800"
                    }>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryTab;
