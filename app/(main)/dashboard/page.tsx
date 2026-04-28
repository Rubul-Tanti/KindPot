"use client"
import CharityPannel from "@/components/charityPannel"
import Drawer from "@/components/drawer"
import { Navbar } from "@/components/navbar"
import UserScoresPanel from "@/components/scorePannel"
import UserStatsOverview from "@/components/stasOverview"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useUserContext } from "@/contextProvider"
import Image from "next/image"
const page=()=>{
  const {user}=useUserContext()
  return<section >

          <h1 className="text-2xl sm:text-3xl lg:text-4xl max-w-6xl w-full mx-auto font-bold text-[#1a5c42] py-4 sm:py-6">
            Welcome back, {user.userName}
          </h1>
          {/* // Stats Overview */}
            <UserStatsOverview/>
          <div className="flex flex-col lg:flex-row max-w-6xl w-full mx-auto justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 px-0">
            {/* //user score pannel */}
            <UserScoresPanel/>
            <CharityPannel/>
          </div>

  </section>
}
export default page