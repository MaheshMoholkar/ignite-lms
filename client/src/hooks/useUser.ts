import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: {
    public_id: string;
    url: string;
  };
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ user: User }>("/me");
    return response.data.user;
  } catch {
    return null;
  }
};

export const useUser = () => {
  return useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
  });
};
