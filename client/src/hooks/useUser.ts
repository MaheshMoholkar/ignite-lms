import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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
    const response = await axios.get<{ user: User }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/me`,
      {
        withCredentials: true,
      }
    );
    return response.data.user;
  } catch (error) {
    // Don't redirect on 401, just return null for public pages
    if (error instanceof AxiosError) {
      return null;
    }
    // For other errors, still return null but don't redirect
    return null;
  }
};

export const useUser = () => {
  return useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: true,
  });
};
