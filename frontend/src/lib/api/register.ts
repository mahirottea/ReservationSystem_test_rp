import axios from '@/lib/axiosConfig';

export const registerUser = async (
    email: string,
    password: string,
    role: string,
    name: string,
    tenantId: string
  ) => {
  return await axios.post("/auth/register", {
    email,
    password,
    role,
    name,
    tenantId,
  });
};

