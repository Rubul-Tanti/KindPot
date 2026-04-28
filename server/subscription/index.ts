import api from "@/lib/axios"
import { GetSubscriptionModelsResponse,CreateSubscriptionOrderResponse } from "./types"

export const handlegetSubscriptionPlans=async()=>{
    const res=await api.get('/api/subscription-model/')
    return res.data as GetSubscriptionModelsResponse
}
export const handleCreateSubscriptionOrder=async(planId:string)=>{
    const res=await api.post('/api/payment/create-subscriptionOrder',{subscriptionModelId:planId})
    return res.data as CreateSubscriptionOrderResponse
}
export const handleConfirmPayment=async(id:string)=>{
    const res=await api.post('/api/payment/confirm-payment',{paymentIntentId:id})
    return res.data as CreateSubscriptionOrderResponse
}