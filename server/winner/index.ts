import api from "@/lib/axios"

export const handleCreateWinner=async(data:File)=>{
    const formData=new FormData()
    formData.append("image",data)
    const res=await api.post("/api/winner/",formData)
    return res.data
}