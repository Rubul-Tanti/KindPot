import {useMutation,useQuery} from "@tanstack/react-query"
import { handleCreateCharity, handleGetAllCharities } from "@/server/charity"
const useCharity=()=>{
    const createCharity=useMutation({mutationFn:handleCreateCharity})
    const getCharities=(page:number,limit:number,search:string,active:boolean)=>useQuery({queryKey:["charities",page,limit,search,active],queryFn:()=>handleGetAllCharities(page,limit,search,active,)})
return {createCharity,getCharities}
}
export default useCharity
