import axios from '@/lib/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from '@/types/auth';
import Cookies from "js-cookie";

export async function login(email: string, password: string): Promise<{ token: string; role: string }> {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  const token = res.data.accessToken;
  const rememberToken = res.data.rememberToken;

  const decoded = jwtDecode<JwtPayload>(token);
  localStorage.setItem('token', token);
  localStorage.setItem('role', decoded.role);
  localStorage.setItem('tenantId', decoded.tenantId);

  // ✅ remember_token を Cookie に保存（7日間）
  if (rememberToken) {
    Cookies.set("remember_token", rememberToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  }

  return { token, role: decoded.role };
}

