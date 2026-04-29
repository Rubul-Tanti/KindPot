import api from "@/lib/axios"
import { GetRecentUsersResponse, GetUsersResponse } from "./types";
export const handleGetUsers = async ({
  page,
  limit,
  userName,
}: {
  page: number;
  limit: number;
  userName?: string;
}) => {
  console.log(userName)
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
export const handleDeactivateUser=async(id:string)=>{
  const res=await api.delete(`/api/user/${id}`)
  return res.data
}
export const handleAsignRole=async({id,role}:{id:string,role:'ADMIN'|'SUBSCRIBER'|'VIEWER'})=>{
  const res=await api.put(`/api/user/asign-role/${id}`,{role})
  return res.data
}
