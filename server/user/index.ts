import api from "@/lib/axios"
import { GetRecentUsersResponse, GetUsersResponse } from "./types";
export const handleGetUsers = async ({
  page,
  limit,
  userName,
  role,
}: {
  page: number;
  limit: number;
  userName?: string;
  role?: string;
}) => {
  const res = await api.get("/api/user/", {
    params: {
      page,
      limit,
      userName,
    },
  });

  return res.data as GetUsersResponse
};
export const handleGetRecentUsers=async()=>{
    const res=await api.get('/api/user/recent')
    return res.data as GetRecentUsersResponse
}