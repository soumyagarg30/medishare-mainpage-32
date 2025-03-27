
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AdminRegistrationFormProps {
  form: UseFormReturn<any>;
  isVerifying: boolean;
  isRegistering: boolean;
}

const AdminRegistrationForm = ({ form, isVerifying, isRegistering }: AdminRegistrationFormProps) => {
  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold text-medishare-dark mb-6">Admin Registration</h2>
      
      <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
        <InfoIcon className="h-4 w-4 mr-2" />
        <AlertDescription>
          Admin registration is restricted to authorized personnel only. You must use an approved email domain 
          and a valid admin verification code.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your authorized email" type="email" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">Must be an authorized admin email domain</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Create a password" type="password" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="adminCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter admin verification code" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">Contact the system administrator for a valid code</p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Enter your department" {...field} disabled={isVerifying || isRegistering} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-gray-200">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isVerifying || isRegistering}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the <a href="#" className="text-medishare-orange hover:underline">terms and conditions</a> and <a href="#" className="text-medishare-orange hover:underline">privacy policy</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default AdminRegistrationForm;
