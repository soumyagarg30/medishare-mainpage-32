
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Check, Clock, AlertTriangle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

// Define the schema for medicine request form
const formSchema = z.object({
  medicine_name: z.string().min(3, { message: "Medicine name must be at least 3 characters" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  need_by_date: z.date()
});

type FormValues = z.infer<typeof formSchema>;

interface MedicineRequest {
  id: string;
  medicine_name: string | null;
  quantity: number | null;
  need_by_date: string | null;
  status: string | null;
  recipient_entity_id: string;
  ngo_entity_id: string | null;
  ngo_name?: string | null;
}

interface NgoDetails {
  name: string | null;
  address: string | null;
  phone: string | null;
}

const MedicineRequestsTab = ({ recipientEntityId }: { recipientEntityId: string | null }) => {
  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicine_name: "",
      quantity: 1,
      need_by_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
    }
  });

  const fetchMedicineRequests = async () => {
    if (!recipientEntityId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('requested_meds')
        .select('*')
        .eq('recipient_entity_id', recipientEntityId);

      if (error) {
        throw error;
      }

      let requestsWithNgoInfo: MedicineRequest[] = data || [];

      // For each request with an ngo_entity_id, fetch NGO details
      for (let i = 0; i < requestsWithNgoInfo.length; i++) {
        if (requestsWithNgoInfo[i].ngo_entity_id) {
          const { data: ngoData, error: ngoError } = await supabase
            .from('intermediary_ngo')
            .select('name')
            .eq('entity_id', requestsWithNgoInfo[i].ngo_entity_id)
            .single();

          if (!ngoError && ngoData) {
            requestsWithNgoInfo[i].ngo_name = ngoData.name;
          }
        }
      }

      setRequests(requestsWithNgoInfo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicine requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your medicine requests",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!recipientEntityId) {
      toast({
        title: "Error",
        description: "Your account information is incomplete",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('requested_meds')
        .insert({
          medicine_name: values.medicine_name,
          quantity: values.quantity,
          need_by_date: values.need_by_date.toISOString().split('T')[0],
          recipient_entity_id: recipientEntityId,
          status: 'uploaded'
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Medicine request submitted successfully"
      });

      // Add the new request to the state
      if (data && data.length > 0) {
        setRequests(prev => [...prev, data[0]]);
      }

      // Reset form and hide it
      form.reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting medicine request:', error);
      toast({
        title: "Error",
        description: "Failed to submit medicine request",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription for medicine requests
  useEffect(() => {
    fetchMedicineRequests();

    // Only subscribe if we have a recipient entity ID
    if (recipientEntityId) {
      // Subscribe to changes on the requested_meds table
      const channel = supabase
        .channel('recipient-medicine-requests')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'requested_meds',
            filter: `recipient_entity_id=eq.${recipientEntityId}`
          }, 
          async (payload) => {
            console.log('Medicine request updated:', payload);
            
            // Handle ngo_entity_id updates
            if (payload.new.ngo_entity_id && (!payload.old.ngo_entity_id || payload.old.ngo_entity_id !== payload.new.ngo_entity_id)) {
              try {
                // Fetch NGO details
                const { data: ngoData, error: ngoError } = await supabase
                  .from('intermediary_ngo')
                  .select('name')
                  .eq('entity_id', payload.new.ngo_entity_id)
                  .single();

                if (ngoError) throw ngoError;

                // Create a properly typed updated request object
                const updatedRequest: MedicineRequest = {
                  ...payload.new as MedicineRequest,
                  ngo_name: ngoData?.name || null
                };

                // Update the request in the local state
                setRequests(prev => prev.map(req => 
                  req.id === payload.new.id ? updatedRequest : req
                ));

                toast({
                  title: "Request Update",
                  description: `Your medicine request has been assigned to ${ngoData?.name || 'an NGO'}`
                });
              } catch (error) {
                console.error('Error handling request update:', error);
              }
            } else {
              // Update with other changes
              setRequests(prev => prev.map(req => 
                req.id === payload.new.id ? { ...req, ...payload.new } : req
              ));
            }
          }
        )
        .subscribe();

      // Clean up subscription when component unmounts
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [recipientEntityId]);

  // Render status cell with appropriate controls based on status
  const renderStatusCell = (request: MedicineRequest) => {
    // If status is rejected, just show status without controls
    if (request.status === 'rejected') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium 
        ${request.status === 'approved' 
          ? 'bg-green-100 text-green-800' 
          : request.status === 'uploaded' 
          ? 'bg-amber-100 text-amber-800'
          : 'bg-blue-100 text-blue-800'}`}
      >
        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>My Medicine Requests</CardTitle>
            <CardDescription>Track and manage your medicine requests</CardDescription>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-medishare-blue hover:bg-medishare-blue/90"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Card className="mb-6 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">New Medicine Request</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicine_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Paracetamol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Needed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            placeholder="Enter quantity" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="need_by_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Needed By</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal"
                                }
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-6">Loading your requests...</div>
          ) : requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Needed By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned NGO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.medicine_name}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.need_by_date ? new Date(request.need_by_date).toLocaleDateString() : 'Not specified'}</TableCell>
                    <TableCell>
                      {renderStatusCell(request)}
                    </TableCell>
                    <TableCell>
                      {request.ngo_entity_id ? (
                        <span className="flex items-center text-green-600 gap-1">
                          <Check size={16} />
                          {request.ngo_name || 'NGO Assigned'}
                        </span>
                      ) : request.status === 'rejected' ? (
                        <span className="flex items-center text-red-600 gap-1">
                          <X size={16} />
                          Request Rejected
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600 gap-1">
                          <Clock size={16} />
                          No NGO Assigned
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 flex flex-col items-center text-gray-500">
              <AlertTriangle className="h-12 w-12 text-amber-400 mb-2" />
              <p className="text-lg font-medium">No Medicine Requests</p>
              <p className="mt-1">You haven't requested any medicines yet. Click the "New Request" button to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineRequestsTab;
