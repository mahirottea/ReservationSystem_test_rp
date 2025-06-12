"use client";

import { useAuth } from "../app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[]; // ✅ 型で制限
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && role && !allowedRoles.includes(role)) {
      router.replace("/");
    } else if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, role]);

  // ロード前に return null しないようにする
  if (role === null) {
    return null; // ロード待ち
  }

  return <>{children}</>;
};

export default RoleGuard;
