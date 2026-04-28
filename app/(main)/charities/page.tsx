"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useCharity from "@/hooks/use-charity";
import { motion } from "framer-motion";
import { MdOutlineBusiness, MdOpenInNew, MdLocationOn } from "react-icons/md";
import { useUserContext } from "@/contextProvider";
import { useRouter } from "next/navigation";
import { useUserCharity } from "@/hooks/useUserCharity";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const CharitySkeleton = () => {
  return (
    <div className="rounded-2xl overflow-hidden border animate-pulse bg-white">
      <div className="h-40 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="h-9 w-full bg-gray-200 rounded-lg mt-2" />
      </div>
    </div>
  );
};

export default function CharitiesPage() {
  const [selectedCharity, setSelectedCharity] = useState<any>(null);
  const [percentage, setPercentage] = useState(10);
  const [open, setOpen] = useState(false);

  const [search] = useState("");
  const [page] = useState(1);
  const [active] = useState(true);
  const [limit] = useState(10);
  const {user}=useUserContext()
  console.log(user)
  const router=useRouter()
  const userSubscriptionPlan=user.subscription
  const { getCharities } = useCharity();
  const {createUserCharity}=useUserCharity(true)
  const { data, isLoading: loading } = getCharities(
    page,
    limit,
    search,
    active
  );

  const handleChange = (value: number) => {
    if (value < 10) return;
    setPercentage(value);
  };

  const handleDonate = async () => {
    if (!selectedCharity) return;

    createUserCharity.mutate({
        charityId: selectedCharity.id,
        percentage,
      },{onSuccess:()=>{
        toast.success(`Donated ${percentage} % of subscription to ${selectedCharity.name}`)
        setOpen(false);
      },onError:(e:any)=>{
        toast.error(e.response.data)
        setOpen(false);
      }})
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-purple-600 text-white rounded-lg shadow">
            <MdOutlineBusiness size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All Charities
          </h1>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CharitySkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && data?.data.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No charities found
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((charity, i) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <Card className="rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition-all group">

                  {/* Banner */}
                  {charity.images?.[0]?.url && (
                    <div className="h-40 w-full relative overflow-hidden">
                      <Image
                        src={charity.images[0].url}
                        alt={charity.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}

                  <CardContent className="p-5 flex flex-col gap-4">

                    {/* Top */}
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border bg-gray-100 flex items-center justify-center">
                        <Image
                          src={charity.logoUrl}
                          alt={charity.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>

                      <h2 className="text-lg font-semibold text-gray-900">
                        {charity.name}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {charity.description}
                    </p>

                    {/* Meta */}
                    <div className="flex justify-between items-center text-xs">

                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                        <MdLocationOn size={14} />
                        {charity.country}
                      </span>

                      <a
                        href={charity.websiteUrl}
                        target="_blank"
                        className="flex items-center gap-1 text-purple-600 hover:underline"
                      >
                        Visit <MdOpenInNew size={12} />
                      </a>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if(
                          userSubscriptionPlan
                        ){
                          setSelectedCharity(charity);
                          setPercentage(10); // reset
                          setOpen(true)
                        }else{
                          router.replace("/subscriptions  ")
                        }
                      }}
                      className="mt-3 w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                    >

                      Select Charity
                    </motion.button>

                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white">

          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Donate to {selectedCharity?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 mt-4">

            {/* Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border">
                {selectedCharity?.logoUrl && (
                  <Image
                    src={selectedCharity.logoUrl}
                    alt="logo"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                )}
              </div>

              <p className="text-sm text-gray-600">
                Choose how much of your subscription you want to donate.
              </p>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Donation Percentage
              </label>

              <input
                type="range"
                min={10}
                max={100}
                value={percentage}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span className="font-semibold text-purple-600">
                  {percentage}%
                </span>
                <span>100%</span>
              </div>

              {/* 🔥 Donation Preview */}
              <p className="text-xs text-gray-500">
                Estimated donation: ${((percentage / 100) * (Number(userSubscriptionPlan?.amount)/100)).toFixed(2)}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={handleDonate}
              disabled={!selectedCharity}
              className="w-full py-2 rounded-lg  flex justify-center bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 transition"
            >
               {createUserCharity.isPending?<Loader className="animate-spin"/>:
                    "   Donate to this charity"
                  }

            </button>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}