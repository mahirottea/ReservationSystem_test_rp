"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Role, SubRole } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | null;
  subRole: SubRole | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  subRole: null,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [role, setRole] = useState<Role | null>(null);
  const [subRole, setSubRole] = useState<SubRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ role: Role; subRole?: SubRole }>(token);
        setRole(decoded.role);
        setSubRole(decoded.subRole || null);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, subRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
