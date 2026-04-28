import { handleCreateWinner } from "@/server/winner"
import { useMutation } from "@tanstack/react-query"

export const useWinner=()=>{
    const createWinner=useMutation({mutationFn:handleCreateWinner})
    return {createWinner}
}
