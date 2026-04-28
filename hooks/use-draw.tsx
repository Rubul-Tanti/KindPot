import { handlecreateDraw, handleGetActiveDraw, handleGetAllDraws, handlePublishDrawResult, handleUpdateDraw } from "@/server/draw"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useDraw=()=>{
    const create=useMutation({mutationFn:handlecreateDraw})
    const update=useMutation({mutationFn:handleUpdateDraw})
    const getActiveDraw=()=>useQuery({queryKey:['get-active-draw'],queryFn:handleGetActiveDraw})
    const getAllDraw=(page:number,limit:number,year:string,month:string,status:string)=>useQuery({queryKey:['get-all-draws',page,limit,year,month,status],queryFn:handleGetAllDraws})
    const publishResult=useMutation({mutationFn:handlePublishDrawResult})
    return {create,getActiveDraw,update,getAllDraw,publishResult}
}