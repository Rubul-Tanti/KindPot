import { handleConfirmPayment, handleCreateSubscriptionOrder, handlegetSubscriptionPlans } from "@/server/subscription"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useSubscription=()=>{
    const getPlans=()=>useQuery({queryKey:['subscription-plan'],queryFn:handlegetSubscriptionPlans})
    const createOrder=useMutation({mutationFn:handleCreateSubscriptionOrder})
    const confirmPayment=useMutation({mutationFn:handleConfirmPayment})
    return {confirmPayment,getPlans,createOrder}
}
