import api from "@/lib/axios"
import { GetGolfScoresResponse,getLastFiveScoresResponse } from "./type"

export const handlegetLastGolfScore=async()=>{
     const res=await api.get('/api/golf-score/last-five')
    return res.data as getLastFiveScoresResponse
  }
 export  const handleAddGolfScore=async(data:{score:number,playedOn:string})=>{
    const res=await api.post('/api/golf-score/add',data)
    return res.data
  }
export const handleGetGolfScore=async({page,limit}:{page:number,limit:number})=>{
    const queryParams=new URLSearchParams({page:page.toString(),limit:limit.toString()})
    const res=await api.get(`/api/golf-score?${queryParams.toString()}`)
    return res.data as GetGolfScoresResponse
}