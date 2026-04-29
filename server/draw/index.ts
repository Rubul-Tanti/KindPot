import api from "@/lib/axios"
import { getActiveDrawResponse, getAllDrawResponse } from "./types";
type DrawFormState = {
  prizePool: Number;
  currency: string;
  entryStartDate: string;
  lastEntryDate: string;
  resultDate: string;
  fiveMatchPct: string;
  fourMatchPct: string;
  threeMatchPct: string;
};
export const handlecreateDraw=async(data:DrawFormState)=>{
    const res=await api.post('/api/draw/',data)
return res.data
}
export const handleUpdateDraw=async({data,id}:{data:DrawFormState,id:string})=>{
      const payload = {
    prizePool: Number(data.prizePool),
    currency: data.currency,
    entryStartDate: data.entryStartDate,
    lastEntryDate: data.lastEntryDate,
    resultDate: data.resultDate,
    fiveMatchPct: Number(data.fiveMatchPct),
    fourMatchPct:Number( data.fourMatchPct),
    threeMatchPct: Number(data.threeMatchPct),
  };
    console.log(data,id)
    const res=await api.patch(`/api/draw/${id}`,payload)
return res.data
}
export const handleGetActiveDraw=async()=>{
    const res=await api.get('/api/draw/active')
    return res.data as getActiveDrawResponse
}
export const handleGetAllDraws=async()=>{
  const res=await api.get("/api/draw/")
  return res.data as getAllDrawResponse
}
export const handlePublishDrawResult=async({drawId,result}:{drawId:string,result:string})=>{
  const res=await api.patch(`/api/draw/publish-result/${drawId}`,{result})
  return res.data
}
export const handleConcludeDraw=async({drawId,status}:{drawId:string,status:'active'|'cancelled'|'completed'})=>{
  const res=await api.patch(`/api/draw/${drawId}/status`,{status})
  return res.data
}