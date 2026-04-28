import api from "@/lib/axios"

export const handleCreateParticipants=async(data:{drawId:string,score:String})=>{
  const res=await api.post('/api/participant/',data)
    return res.data
}