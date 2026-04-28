"use client";
import { Badge, Btn, CharityStatus, SectionCard, statusVariant } from "@/app/(main)/admin/page";
interface Charity {
  id: string;
  emoji: string;
  name: string;
  category: string;
  subscribers: number;
  ytdReceived: number;
  status: CharityStatus;
}

const CHARITIES: Charity[] = [
  { id: "1", emoji: "♥", name: "Cancer Research UK", category: "Health",   subscribers: 312, ytdReceived: 4210, status: "Active"       },
  { id: "2", emoji: "⚓", name: "RNLI",               category: "Rescue",   subscribers: 198, ytdReceived: 2680, status: "Active"       },
  { id: "3", emoji: "🌿", name: "Macmillan",          category: "Health",   subscribers: 241, ytdReceived: 3290, status: "Active"       },
  { id: "4", emoji: "☺", name: "NSPCC",              category: "Children", subscribers: 180, ytdReceived: 2450, status: "Active"       },
  { id: "5", emoji: "⛰", name: "Age UK",             category: "Elderly",  subscribers: 94,  ytdReceived: 1280, status: "Under Review" },
];

import { useState } from "react";
import CharityForm from "./charityForm";
import { Button } from "@/components/ui/button";
import CharityList from "./charityList";



function CharitiesSection() {
    const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [active,setisActive] = useState(true)
  const [limit, setLimit] = useState(10)

  const [openForm,setOpenForm]=useState(false)

  return (
 <>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setOpenForm(!openForm)}>
          {openForm ? " - Cancel" : "+ Add charity"}
        </Button>
      </div>

      {openForm && (
        <CharityForm
           search={search}
        page={page}
        limit={limit}
        active={active}
        />
      )}

      <CharityList
      variant="dynamic"
        search={search}
        page={page}
        limit={limit}
        active={active}
        setPage={setPage}
        setSearch={setSearch}
        setisActive={setisActive}
        setLimit={setLimit}
      />
    </>
  );
}
export default CharitiesSection