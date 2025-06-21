import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Types
export interface Layout {
  _id: string;
  type: string;
  banner?: {
    image: {
      url: string;
      public_id: string;
    };
    title: string;
    subTitle: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  categories?: Array<{
    title: string;
  }>;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  thumbnail: {
    url: string;
    public_id: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: Array<{ title: string }>;
  prerequisites: Array<{ title: string }>;
  reviews: Array<{
    user: {
      name: string;
      avatar: {
        url: string;
      };
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  courseData: Array<{
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: {
      url: string;
    };
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: Array<{ title: string; url: string }>;
    suggestion: string;
  }>;
  ratings: number;
  purchased: number;
  createdAt: string;
}

// API functions
export const fetchLayoutByType = async (type: string): Promise<Layout> => {
  const response = await api.get(`/get-layout?type=${type}`);
  return response.data.layout;
};

export const fetchPublicCourses = async (): Promise<Course[]> => {
  const response = await api.get("/get-courses");
  return response.data.courses;
};

// Custom hooks
export const useLayout = (type: string) => {
  return useQuery({
    queryKey: ["layout", type],
    queryFn: () => fetchLayoutByType(type),
    enabled: !!type,
  });
};

export const usePublicCourses = () => {
  return useQuery({
    queryKey: ["courses", "public"],
    queryFn: fetchPublicCourses,
  });
};
