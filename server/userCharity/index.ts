import api from "@/lib/axios"
import { UserCharityResponse } from "./types"

export const handleGetUserCharity=async()=>{
const res=await api.get('/api/user-charity')
return res.data as UserCharityResponse
}
export const handleCreateUserCharity=async(data:{percentage:number,charityId:string})=>{
    const res=await api.post('/api/user-charity/create',data)
return res.data
}