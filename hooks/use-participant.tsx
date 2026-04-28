import { handleCreateParticipants } from "@/server/participants"
import { useMutation } from "@tanstack/react-query"

export const useParticipant=()=>{
    const createParticipant=useMutation({mutationFn:handleCreateParticipants})
return {createParticipant}
}
