'use client'
import { Subscription, SubscriptionModel } from "@/server/subscription/types";
import { createContext, SetStateAction, useContext, useState
 } from "react";
 type UserType= {
    isAuthenticated:boolean
    role:'ADMIN'|'VIEWER'|'SUBSCRIBER'|null,
         userName:string|null,
        email:string|null,
        profilePicture:string|null,
        subscription:Subscription|null
 }
 type userContextType={
    user:UserType,
    setUser:React.Dispatch<SetStateAction<UserType>>
 }
 const UserContext=createContext<userContextType>({
    user:{
        isAuthenticated:false,
        role:null,
        userName:null,
        email:null,
        profilePicture:null,
        subscription:null
        },
    setUser:()=>{}
 })

export  const ContextProvider=({children}:{children:React.ReactNode})=>{
    const [user,setUser]=useState<UserType>({isAuthenticated:false,role:null,userName:null,
        email:null,
        profilePicture:null,
    subscription:null})


    return <UserContext value={{user,setUser}}>{children}</UserContext>

}

export const useUserContext=()=>{
   return useContext(UserContext)}
