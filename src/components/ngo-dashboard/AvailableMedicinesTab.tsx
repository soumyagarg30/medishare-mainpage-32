
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample data representing the donated_meds table
// In a real application, this would come from an API call
const donatedMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    category: "Analgesic",
    quantity: 2000,
    dosage: "500mg",
    expiry: "2024-10-15",
    donor: "Apollo Pharmacy",
    donationDate: "2023-03-10",
  },
  {
    id: 2,
    name: "Amoxicillin",
    category: "Antibiotic",
    quantity: 500,
    dosage: "250mg",
    expiry: "2024-05-20",
    donor: "City Medical Center",
    donationDate: "2023-04-05",
  },
  {
    id: 3,
    name: "Metformin",
    category: "Antidiabetic",
    quantity: 1000,
    dosage: "500mg",
    expiry: "2025-01-10",
    donor: "National Healthcare",
    donationDate: "2023-04-15",
  },
  {
    id: 4,
    name: "Aspirin",
    category: "Analgesic",
    quantity: 1500,
    dosage: "75mg",
    expiry: "2024-12-25",
    donor: "MedPlus",
    donationDate: "2023-03-22",
  },
  {
    id: 5,
    name: "Omeprazole",
    category: "Proton Pump Inhibitor",
    quantity: 300,
    dosage: "20mg",
    expiry: "2024-08-30",
    donor: "LifeCare Hospital",
    donationDate: "2023-05-01",
  },
];

const AvailableMedicinesTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(donatedMedicines);

  useEffect(() => {
    // Filter medicines based on search term
    if (searchTerm.trim() === "") {
      setFilteredMedicines(donatedMedicines);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = donatedMedicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(term) ||
          medicine.category.toLowerCase().includes(term) ||
          medicine.donor.toLowerCase().includes(term)
      );
      setFilteredMedicines(filtered);
    }
  }, [searchTerm]);

  // Function to check if a medicine is expiring soon (within 3 months)
  const isExpiringSoon = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    
    return expiry > now && expiry <= threeMonthsFromNow;
  };

  // Function to check if a medicine has expired
  const hasExpired = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    return expiry <= now;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Available Medicines</CardTitle>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search medicines..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.dosage}</TableCell>
                    <TableCell>
                      {medicine.expiry}
                      {hasExpired(medicine.expiry) ? (
                        <Badge className="ml-2 bg-red-500">Expired</Badge>
                      ) : isExpiringSoon(medicine.expiry) ? (
                        <Badge className="ml-2 bg-yellow-500">Expiring Soon</Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>{medicine.donor}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No medicines found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableMedicinesTab;
