
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CheckCircle, UserPlus, Building, HeartHandshake, Shield } from "lucide-react";

// User type selection step
const UserTypeSelector = ({ selectedType, onSelectType }) => {
  const userTypes = [
    {
      id: "donor",
      title: "Donor",
      description: "Healthcare providers or suppliers with surplus medication",
      icon: <UserPlus className="h-10 w-10 text-medishare-orange mb-2" />,
      verification: "GST ID verification"
    },
    {
      id: "ngo",
      title: "NGO",
      description: "Organizations that distribute medicines to those in need",
      icon: <HeartHandshake className="h-10 w-10 text-medishare-teal mb-2" />,
      verification: "UID verification"
    },
    {
      id: "recipient",
      title: "Recipient",
      description: "Individuals who require medication assistance",
      icon: <Building className="h-10 w-10 text-medishare-blue mb-2" />,
      verification: "DigiLocker verification"
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-medishare-dark">Choose account type</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {userTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`
              p-6 rounded-xl cursor-pointer transition duration-300
              ${selectedType === type.id
                ? "border-2 border-medishare-orange bg-medishare-orange/5 shadow-md"
                : "border border-gray-200 hover:border-medishare-orange/70 hover:shadow"}
            `}
          >
            <div className="flex flex-col items-center text-center">
              {type.icon}
              <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{type.description}</p>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {type.verification}
              </div>
              {selectedType === type.id && (
                <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-medishare-orange" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Registration form schemas for different user types
const donorFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  gstId: z.string().min(15, {
    message: "GST ID must be 15 characters long.",
  }).max(15),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your address.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

const ngoFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  uid: z.string().min(5, {
    message: "Please enter a valid UID.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your address.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

const recipientFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  digilocker: z.string().min(5, {
    message: "Please enter a valid DigiLocker ID.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your address.",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Create forms with React Hook Form + Zod
  const donorForm = useForm({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      password: "",
      gstId: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const ngoForm = useForm({
    resolver: zodResolver(ngoFormSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      password: "",
      uid: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const recipientForm = useForm({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      digilocker: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const handleUserTypeSelection = (type) => {
    setUserType(type);
  };

  const nextStep = () => {
    if (step === 1 && userType) {
      setStep(2);
    }
  };

  const previousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const onSubmit = (data) => {
    console.log("Form data:", data);
    console.log("User type:", userType);
    
    // Here you would normally send the data to your backend
    // Simulating a successful registration
    toast({
      title: "Registration successful!",
      description: "Your account has been created. Verification is in process.",
    });
    
    setRegistrationComplete(true);
  };

  // Get appropriate form based on user type
  const getActiveForm = () => {
    switch (userType) {
      case "donor":
        return {
          form: donorForm,
          schema: donorFormSchema,
          onSubmit: donorForm.handleSubmit(onSubmit),
          render: () => (
            <DonorRegistrationForm form={donorForm} />
          ),
        };
      case "ngo":
        return {
          form: ngoForm,
          schema: ngoFormSchema,
          onSubmit: ngoForm.handleSubmit(onSubmit),
          render: () => (
            <NGORegistrationForm form={ngoForm} />
          ),
        };
      case "recipient":
        return {
          form: recipientForm,
          schema: recipientFormSchema,
          onSubmit: recipientForm.handleSubmit(onSubmit),
          render: () => (
            <RecipientRegistrationForm form={recipientForm} />
          ),
        };
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-medishare-dark mb-4">Join MediShare</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create an account to start donating medicines, distributing to those in need, 
              or receiving medication assistance.
            </p>
          </div>

          {registrationComplete ? (
            <RegistrationSuccess userType={userType} />
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                {step === 1 && (
                  <UserTypeSelector 
                    selectedType={userType} 
                    onSelectType={handleUserTypeSelection} 
                  />
                )}

                {step === 2 && userType && getActiveForm()?.render()}

                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                  {step === 2 && (
                    <Button
                      variant="outline"
                      onClick={previousStep}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step === 1 ? (
                    <Button
                      className="ml-auto"
                      onClick={nextStep}
                      disabled={!userType}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className="ml-auto"
                      type="submit"
                      onClick={getActiveForm()?.onSubmit}
                    >
                      Register
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <a href="#" className="text-medishare-orange font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Success message component
const RegistrationSuccess = ({ userType }) => {
  const messages = {
    donor: "We're verifying your GST ID. You'll receive an email when your account is verified.",
    ngo: "We're verifying your UID. You'll receive an email when your account is verified.",
    recipient: "We're verifying your DigiLocker information. You'll receive an email when your account is verified.",
  };

  return (
    <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registration Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for registering with MediShare. {messages[userType]}
      </p>
      <Button href="/" className="bg-medishare-orange hover:bg-medishare-gold">
        Return to Home
      </Button>
    </div>
  );
};

// Donor Registration Form
const DonorRegistrationForm = ({ form }) => {
  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold text-medishare-dark mb-6">Donor Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your organization name" {...field} />
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
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Create a password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gstId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your 15-digit GST ID" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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

// NGO Registration Form
const NGORegistrationForm = ({ form }) => {
  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold text-medishare-dark mb-6">NGO Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your NGO name" {...field} />
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
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Create a password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="uid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UID / Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your NGO UID or registration number" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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

// Recipient Registration Form
const RecipientRegistrationForm = ({ form }) => {
  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold text-medishare-dark mb-6">Recipient Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
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
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Create a password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="digilocker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DigiLocker ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your DigiLocker ID" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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

export default Register;
