import api from "@/lib/axios"
import { PaymentStatus, VerificationStatus } from "../draw/types"

export const handleCreateWinner=async(data:File)=>{
    const formData=new FormData()
    formData.append("image",data)
    const res=await api.post("/api/winner/",formData)
    return res.data
}
export const handleUpdateVerificationPayment=async({status,id}:{status:VerificationStatus,id:string})=>{
    const res=await api.patch(`/api/winner/verification-status/${id}`,{status})
    return res.data
}
export const handleUpdatePaymentVerification=async({status,id}:{status:PaymentStatus,id:string})=>{
    const res=await api.patch(`/api/winner/verification-status/${id}`,{status})
    return res.data
}