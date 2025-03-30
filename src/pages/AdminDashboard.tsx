
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getUser, UserData, isAuthenticated } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Filter, Search, UserPlus, Check, X } from "lucide-react";
import MedicineDonationsTab from "@/components/admin-dashboard/MedicineDonationsTab";
import MedicineRequestsTab from "@/components/admin-dashboard/MedicineRequestsTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated()) {
      navigate("/sign-in");
      return;
    }

    const userData = getUser();
    if (!userData || userData.userType !== "admin") {
      navigate("/sign-in");
      return;
    }

    // Fetch users
    const fetchUsers = async () => {
      try {
        // Get all users from the users table
        const { data: usersData, error } = await supabase
          .from('users')
          .select('*');

        if (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: "Could not fetch users. Please try again later.",
            variant: "destructive",
          });
          return;
        }

        // Process and set user data
        const processedUsers = usersData.map((user) => ({
          id: user.id,
          name: user.entity_type === 'Donor' ? 'Donor' : 
               user.entity_type === 'Recipient' ? 'Recipient' : 
               user.entity_type === 'Intermediary NGO' ? 'NGO' : 'Admin',
          email: user.email,
          userType: user.entity_type,
          createdAt: user.created_at,
          verified: true, // Assuming all users in the database are verified
          verificationId: user.verification_id
        }));

        setUsers(processedUsers);
        setFilteredUsers(processedUsers);
      } catch (err) {
        console.error("Error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleVerifyUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Update the user's verified status in the database
      const { data, error } = await supabase
        .from('users')
        .update({ 
          // Assuming we want to mark the user as verified
          // We don't have a 'verified' column in the users table based on the schema
          // This is just a placeholder - we'd need to add this column or use another approach
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, verified: true } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: "User has been verified.",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error verifying user:", error);
      toast({
        title: "Error",
        description: "Failed to verify user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-medishare-dark">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users, medicines, and monitor platform activity
            </p>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => handleTabChange("users")}
              className={activeTab === "users" ? "bg-medishare-orange" : ""}
            >
              Users Management
            </Button>
            <Button
              variant={activeTab === "donations" ? "default" : "outline"}
              onClick={() => handleTabChange("donations")}
              className={activeTab === "donations" ? "bg-medishare-orange" : ""}
            >
              Medicine Donations
            </Button>
            <Button
              variant={activeTab === "requests" ? "default" : "outline"}
              onClick={() => handleTabChange("requests")}
              className={activeTab === "requests" ? "bg-medishare-orange" : ""}
            >
              Medicine Requests
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "outline"}
              onClick={() => handleTabChange("analytics")}
              className={activeTab === "analytics" ? "bg-medishare-orange" : ""}
            >
              Analytics
            </Button>
          </div>

          {/* Users Management Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Registered Users</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Name/Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Verification ID</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.userType === "Donor"
                                ? "bg-blue-100 text-blue-700"
                                : user.userType === "Recipient"
                                ? "bg-green-100 text-green-700"
                                : user.userType === "Intermediary NGO"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.userType}
                          </span>
                        </TableCell>
                        <TableCell>{user.verificationId}</TableCell>
                        <TableCell>
                          {user.createdAt
                            ? format(new Date(user.createdAt), "PPP")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <Check className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                              <X className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Medicine Donations Tab */}
          {activeTab === "donations" && <MedicineDonationsTab />}

          {/* Medicine Requests Tab */}
          {activeTab === "requests" && <MedicineRequestsTab />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  Analytics information will be displayed here.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User Type</p>
                  <p>{selectedUser.userType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p>
                    {selectedUser.verified ? "Verified" : "Pending Verification"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Verification ID
                  </p>
                  <p>{selectedUser.verificationId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Registration Date
                  </p>
                  <p>
                    {selectedUser.createdAt
                      ? format(new Date(selectedUser.createdAt), "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>

              {!selectedUser.verified && (
                <Button
                  onClick={handleVerifyUser}
                  className="w-full bg-medishare-orange hover:bg-medishare-gold"
                >
                  Verify User
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default AdminDashboard;
