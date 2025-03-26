
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, Loader2, MapPin, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addMedicineDonation } from "@/utils/medicineUtils";
import { toast } from "@/hooks/use-toast";

// Form schema
const medicineFormSchema = z.object({
  name: z.string().min(3, { message: "Medicine name must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
  expiry_date: z.date({
    required_error: "Please select an expiry date.",
  }).refine((date) => date > new Date(), {
    message: "Expiry date must be in the future.",
  }),
  description: z.string().optional(),
  location: z.string().min(3, { message: "Please enter a location." }),
});

const AddMedicineForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const form = useForm<z.infer<typeof medicineFormSchema>>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 1,
      description: "",
      location: "",
    },
  });

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setUseCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast({
            title: "Location detected",
            description: "Your current location has been detected.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setUseCurrentLocation(false);
          toast({
            title: "Location error",
            description: "Could not detect your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter location manually.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof medicineFormSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await addMedicineDonation({
        ...data,
        expiry_date: format(data.expiry_date, "yyyy-MM-dd"),
        latitude: latitude,
        longitude: longitude,
      });

      if (result.success) {
        toast({
          title: "Donation added",
          description: result.message || "Medicine donation successfully added.",
        });
        form.reset();
        setLatitude(null);
        setLongitude(null);
        setUseCurrentLocation(false);
      } else {
        setErrorMessage(result.message || "Failed to add medicine donation.");
        toast({
          title: "Error",
          description: result.message || "Failed to add medicine donation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Donate Medicine</CardTitle>
        <CardDescription>
          Fill in the details about the medicine you wish to donate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter medicine name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="painkillers">Painkillers</SelectItem>
                        <SelectItem value="vitamins">Vitamins</SelectItem>
                        <SelectItem value="antidiabetic">Anti-diabetic</SelectItem>
                        <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="respiratory">Respiratory</SelectItem>
                        <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        min={1}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional details about the medicine"
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder="Enter pickup location"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={getCurrentLocation}
                        disabled={isSubmitting}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                    {useCurrentLocation && latitude && longitude && (
                      <p className="text-xs text-green-600 mt-1">
                        Location coordinates detected
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-medishare-orange hover:bg-medishare-gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Donate Medicine"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddMedicineForm;
