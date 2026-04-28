import { handleAddGolfScore, handleGetGolfScore, handlegetLastGolfScore } from "@/server/golf_score"
import { useMutation, useQuery } from "@tanstack/react-query"
import { use } from "react"

const useGolfScore=()=>{
    const getLastFiveScores=()=>useQuery({queryKey:["golfScore"],queryFn:handlegetLastGolfScore})
    const addGolfScore=useMutation({mutationFn:handleAddGolfScore})
    const getGolfScores=({page,limit}:{page:number,limit:number})=>useQuery({queryKey:['golfScoresHistory',page,limit],queryFn:()=>handleGetGolfScore({page,limit})})
    return {getLastFiveScores,addGolfScore,getGolfScores}
}
export default useGolfScore