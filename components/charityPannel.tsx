"use client";

import { Card, CardContent } from "@/components/ui/card";
import CharityList from "./admin/charity/charityList";
import { useState } from "react";
import { useUserContext } from "@/contextProvider";
import { useUserCharity } from "@/hooks/useUserCharity";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

// ─── Start Charity CTA ────────────────────────────────────────────────────────
function StartCharity() {
  return (
    <Card className="border border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm">
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Start Supporting a Charity
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose a charity and begin contributing today.
          </p>
        </div>
        <Link href="/charities">
          <button className="w-full sm:w-auto px-5 py-2 cursor-pointer rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition">
            Get Started
          </button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── My Charity Card ──────────────────────────────────────────────────────────
function MyCharity() {
  const { user } = useUserContext();
  const { getUserCharity } = useUserCharity(user.role === "SUBSCRIBER");
  const { data, isLoading, error } = getUserCharity;
  const charity = data?.data;
  const percentage = data?.data?.percentage || 10;

  if (isLoading) {
    return (
      <Card className="border border-gray-200 rounded-2xl shadow-sm animate-pulse">
        <div className="w-full h-40 bg-gray-200" />
        <CardContent className="p-5 flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-sm">
        Failed to load charity
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-center text-sm text-gray-500">
          You have not selected a charity yet.
        </p>
        <StartCharity />
      </div>
    );
  }

  return (
    <Card className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Banner */}
      {charity.charity.images?.[0]?.url && (
        <div className="w-full h-36 sm:h-48 relative">
          <Image
            src={charity.charity.images[0].url}
            alt="charity banner"
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Logo + Info */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border bg-gray-100 flex items-center justify-center">
            <Image
              src={charity.charity.logoUrl}
              alt={charity.charity.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {charity.charity.name}
            </h2>
            <p className="text-sm text-gray-500 line-clamp-2">
              {charity.charity.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                <MapPin size={11} /> {charity.charity.country}
              </span>
              <a
                href={charity.charity.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline py-1"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>

        {/* Contribution bar */}
        <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Your Contribution</p>
            <h3 className="text-2xl font-bold text-purple-600">{percentage}%</h3>
          </div>
          <div className="w-full sm:max-w-xs">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CharityPannel() {
  const { user } = useUserContext();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [active, setIsActive] = useState(true);
  const [limit, setLimit] = useState(10);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Charity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover and support causes that matter to you
          </p>
        </div>

        {/* My Charity / CTA */}
        {user.role !== "SUBSCRIBER" ? <StartCharity /> : <MyCharity />}

        {/* Charity List */}
        <CharityList
          variant="static"
          search={search}
          page={page}
          limit={limit}
          active={active}
          setPage={setPage}
          setSearch={setSearch}
          setisActive={setIsActive}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}