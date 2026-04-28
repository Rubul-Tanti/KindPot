import api from "@/lib/axios"
import { charityPayload, getAllCharitiesResponse } from "./types"

export const handleGetAllCharities=async(page:number,limit:number,search:string,active:boolean)=>{
    const queryParams=new URLSearchParams({name:search,isActive:active.toString(),page:page.toString(),limit:limit.toString()})
    const res=await api.get(`/api/charity/?${queryParams.toString()}`)
    return res.data as getAllCharitiesResponse
}
export const handleCreateCharity=async(data:FormData)=>{
const res=await api.post("/api/charity/create",data)
return res.data
}