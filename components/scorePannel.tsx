"use client"

import { useState } from "react"
import useGolfScore from "@/hooks/use-golfScore"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "react-toastify"
import { MdTrendingUp, MdOutlineDateRange, MdAdd, MdEmojiEvents } from "react-icons/md"
import { useUserContext } from "@/contextProvider"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleDeleteScore } from "@/server/golf_score"

export default function UserScoresPanel() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {user}=useUserContext()
  const router=useRouter()
  const [score, setScore] = useState("")
  const [playedOn, setPlayedOn] = useState("")
  const page=1
  const limit=6

const queryClient = useQueryClient();
  const { getLastFiveScores, addGolfScore, getGolfScores } = useGolfScore()
  const { data: recentScores, isLoading: recentLoading } = getLastFiveScores()
  const { data: allScores, isLoading: historyLoading } = getGolfScores({ page, limit})
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteScore=useMutation({mutationFn:handleDeleteScore})
  const count = recentScores?.count || 0
const handleDelete = async () => {
  if(!deleteId)return
  deleteScore.mutate(deleteId,{onSuccess:()=>{toast.success("Score deleted")
    queryClient.invalidateQueries({queryKey:["golfScore"]})
    queryClient.invalidateQueries({queryKey:["golfScoresHistory"]})
  },onError:()=>{toast.error("Failed to delete")},onSettled:()=>{setDeleteId(null)}})

};
  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if(user.role==='VIEWER'){
      return router.push('/subscriptions')
    }

    if (!score || !playedOn) {
      toast.error("Please fill in all fields")
      return
    }
    const selectedDate = new Date(playedOn)
const today = new Date()
if (selectedDate > today&&selectedDate !== today) {
  toast.error("Date cannot be in the future")
  return
}

    await addGolfScore.mutate(
      { score: parseInt(score), playedOn },
      {
        onSuccess: () => {
          setScore("")
          setPlayedOn("")
          setIsDialogOpen(false)
          toast.success("Score added successfully")
          queryClient.invalidateQueries({ queryKey: ["golfScore"] });
          queryClient.invalidateQueries({ queryKey: ['golfScoresHistory'] });
        },
        onError: () => {
          toast.error("Error adding score")
        },
      }
    )
  }

  const renderScoreBoxes = () => {
    if (recentLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-20 w-20 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0"
        />
      ))
    }

    if (count === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
            <MdAdd className="w-8 h-8 text-[#1a5c42]" />
          </div>
          <p className="text-sm text-gray-500 font-medium">No scores recorded yet</p>
        </div>
      )
    }

    const emptySlots = Array.from({ length: 5 - count }).map((_, i) => (
      <div
        key={`empty-${i}`}
        className="h-20 w-20 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 flex-shrink-0 flex items-center justify-center"
      >
        <span className="text-emerald-300 text-2xl font-light">+</span>
      </div>
    ))

    const scoreBoxes = recentScores?.data.map((score) => (
      <div key={score.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#1a5c42] to-[#2d7a5f] shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <span className="text-3xl font-bold text-white">{score.score}</span>
        </div>
        <p className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
          {new Date(score.playedOn).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    ))

    return [...emptySlots, ...scoreBoxes||'']
  }

  const renderHistoryTable = () => {
    if (historyLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      )
    }

    if (!allScores?.data?.length) {
      return (
        <div className="text-center py-8 text-gray-400 text-sm">
          No history available
        </div>
      )
    }

return (
  <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="bg-gradient-to-r from-[#1a5c42] to-[#2d7a5f] text-white">
          <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider rounded-tl-2xl">
            Played On
          </th>
          <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider">
            Score
          </th>
          <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider">
            Updated
          </th>
          <th className="py-4 px-6 font-semibold text-xs uppercase tracking-wider rounded-tr-2xl text-right">
            Action
          </th>
        </tr>
      </thead>

      <tbody className="text-gray-700 divide-y divide-gray-100">
        {allScores.data.map((row, i) => (
          <tr
            key={row.id || i}
            className="hover:bg-emerald-50/40 transition-colors duration-200"
          >
            {/* Played On */}
            <td className="py-4 px-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <MdOutlineDateRange className="w-3.5 h-3.5 text-[#1a5c42]" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {new Date(row.playedOn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </td>

            {/* Score */}
            <td className="py-4 px-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-[#1a5c42] font-bold text-lg border border-emerald-100">
                {row.score}
              </span>
            </td>

            {/* Updated */}
            <td className="py-4 px-6 text-gray-500">
              {new Date(row.updatedAt).toLocaleDateString()}
            </td>

            {/* Delete Button */}
            <td className="py-4 px-6 text-right">
              <button
                onClick={() =>{setDeleteId(row.id)}}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {deleteId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">

      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Delete Score?
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        This action cannot be undone. Are you sure you want to delete this score?
      </p>

      <div className="flex justify-end gap-3">
        {/* Cancel */}
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>

        {/* Confirm Delete */}
        <button
          onClick={()=>{handleDelete()}}
          disabled={deleteScore.isPending}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleteScore.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
  </div>
);
  }

  return (
    <Card className="flex-1 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-[#1a5c42] to-[#2d7a5f] text-white px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <MdEmojiEvents className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Scores</h1>
            <p className="text-emerald-100 text-sm mt-0.5">Track your golf performance</p>
          </div>
        </div>
        <button className="text-sm font-medium text-emerald-100 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/20">
          View all
          <MdTrendingUp className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      {/* Recent Score Boxes */}
      <CardContent className="px-8 py-8 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#1a5c42] rounded-full" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Recent Rounds
          </h3>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {renderScoreBoxes()}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col gap-0 px-0 pt-0 pb-0">
        <div className="px-8 py-6 w-full">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="group w-full bg-gradient-to-r from-[#1a5c42] to-[#2d7a5f] hover:from-[#145236] hover:to-[#236b52] text-white p-5 rounded-2xl transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <MdAdd className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              Add New Score
            </button>

            <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl">
              <DialogHeader className="pb-4 border-b border-gray-100">
                <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <MdEmojiEvents className="w-4 h-4 text-[#1a5c42]" />
                  </div>
                  Add New Score
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Enter your score and the date you played
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddScore} className="space-y-5 py-4">
                <div className="space-y-2.5">
                  <Label htmlFor="score" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MdTrendingUp className="w-4 h-4 text-[#1a5c42]" />
                    Score
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="e.g., 38"
                    value={score}
                    max={45}
                    onChange={(e) => setScore(e.target.value)}
                    disabled={addGolfScore.isPending}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#1a5c42] focus:ring-[#1a5c42]/20 text-lg font-semibold text-center"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="playedOn" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MdOutlineDateRange className="w-4 h-4 text-[#1a5c42]" />
                    Played On
                  </Label>
                  <Input
                    id="playedOn"
                    type="date"
                    value={playedOn}
                    onChange={(e) => setPlayedOn(e.target.value)}
                    disabled={addGolfScore.isPending}
                    className="h-12 rounded-xl border-gray-200 focus:border-[#1a5c42] focus:ring-[#1a5c42]/20"
                  />
                </div>

                <DialogFooter className="gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={addGolfScore.isPending}
                    className="flex-1 px-4 py-3 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addGolfScore.isPending}
                    className="flex-1 px-4 py-3 text-sm font-semibold bg-gradient-to-r from-[#1a5c42] to-[#2d7a5f] text-white rounded-xl hover:from-[#145236] hover:to-[#236b52] disabled:opacity-50 transition-all shadow-lg"
                  >
                    {addGolfScore.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      "Add Score"
                    )}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Score History Section */}
        <div className="w-full bg-gray-50/50 px-8 py-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#1a5c42] rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Score History</h2>
            <span className="ml-auto text-xs font-medium text-gray-400 bg-white px-2.5 py-1 rounded-full border border-gray-200">
              {allScores?.data?.length || 0} rounds
            </span>
          </div>

          {renderHistoryTable()}
        </div>
      </CardFooter>
    </Card>
  )
}