
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserPlus, Building, HeartHandshake, Shield, LockIcon, MailIcon, AlertCircle } from "lucide-react";
import { UserType, isAuthenticated, loginUser, initializeAuth, setupAuthListener } from "@/utils/auth";

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("donor");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initializingAuth, setInitializingAuth] = useState(true);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setInitializingAuth(true);
      const isAuthed = await initializeAuth();
      
      if (isAuthed) {
        redirectToDashboard();
      }
      
      setInitializingAuth(false);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = setupAuthListener((user) => {
      if (user) {
        redirectToDashboard();
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const redirectToDashboard = () => {
    // Redirect to appropriate dashboard based on user type
    const user = JSON.parse(localStorage.getItem('medishare_user') || '{}');
    
    if (user.userType) {
      switch(user.userType) {
        case "donor":
          navigate("/donor-dashboard");
          break;
        case "ngo":
          navigate("/ngo-dashboard");
          break;
        case "recipient":
          navigate("/recipient-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };
  
  // Create form with React Hook Form + Zod
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await loginUser(data.email, data.password, userType);
      
      if (result.success) {
        toast({
          title: "Login successful!",
          description: `Welcome back to MediShare as a ${userType}.`,
        });
        
        // Redirect will happen via the auth listener
      } else {
        setErrorMessage(result.message || "An error occurred during login.");
        toast({
          title: "Login failed",
          description: result.message || "An error occurred during login.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (initializingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medishare-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-medishare-dark mb-4">Welcome Back</h1>
            <p className="text-gray-600">
              Sign in to your MediShare account to continue your mission.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Choose your account type and enter your credentials
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
              
              <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="donor" className="flex flex-col items-center gap-2 py-3">
                    <UserPlus className="h-5 w-5" />
                    <span>Donor</span>
                  </TabsTrigger>
                  <TabsTrigger value="ngo" className="flex flex-col items-center gap-2 py-3">
                    <HeartHandshake className="h-5 w-5" />
                    <span>NGO</span>
                  </TabsTrigger>
                  <TabsTrigger value="recipient" className="flex flex-col items-center gap-2 py-3">
                    <Building className="h-5 w-5" />
                    <span>Recipient</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex flex-col items-center gap-2 py-3">
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                              <Input 
                                placeholder="Enter your email" 
                                type="email" 
                                className="pl-10" 
                                {...field} 
                                disabled={isLoading}
                              />
                            </div>
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
                            <div className="relative">
                              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                              <Input 
                                placeholder="Enter your password" 
                                type="password" 
                                className="pl-10" 
                                {...field} 
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Link to="#" className="text-sm font-medium text-medishare-orange hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-medishare-orange hover:bg-medishare-gold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⭘</span>
                          Signing in...
                        </>
                      ) : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-600 mt-4">
                Don't have an account yet?{" "}
                <Link to="/register" className="text-medishare-orange font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
