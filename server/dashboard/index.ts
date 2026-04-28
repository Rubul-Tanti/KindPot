import api from "@/lib/axios"
import { AdminDashboardStatsResponse } from "./types"

export const handleDashboardOverview=async()=>{
    const res=await api.get('/api/dashboard')
    return res.data

}
export const handleAdminDashboardStas=async()=>{
    const res=await api.get("/api/dashboard/admin/")
 return res.data as AdminDashboardStatsResponse
}