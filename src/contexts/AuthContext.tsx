
import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "donor" | "ngo" | "admin" | null;

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API functions (replace with actual API calls in production)
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, different users based on email
  if (email === "donor@example.com") {
    return {
      id: "1",
      name: "Demo Donor",
      email: "donor@example.com",
      role: "donor"
    };
  } else if (email === "ngo@example.com") {
    return {
      id: "2",
      name: "Demo NGO",
      email: "ngo@example.com",
      role: "ngo"
    };
  } else if (email === "admin@example.com") {
    return {
      id: "3",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    };
  }
  
  throw new Error("Invalid credentials");
};

const mockRegister = async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would create a user in the database
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    role
  };
};

// Auth provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("medishare_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem("medishare_user", JSON.stringify(user));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await mockRegister(name, email, password, role);
      setUser(user);
      localStorage.setItem("medishare_user", JSON.stringify(user));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("medishare_user");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
