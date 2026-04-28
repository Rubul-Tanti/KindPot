import { Card, CardContent } from "./ui/card"

const Drawer = () => {
  return (
<section className="mx-auto max-w-6xl mt-6 sm:mt-8 mb-6 sm:mb-8 px-3 sm:px-4 lg:px-0">
    <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
  <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
      <h2 className="text-lg sm:text-xl font-bold text-[#1a5c42">
        April Draw Results
      </h2>

      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-[#1a5c42] font-bold w-fit">
        🎲 2 Matches!
      </span>
    </div>

    {/* Numbers */}
    <div className="flex gap-2 sm:gap-3 flex-wrap">
      {[22, 35, 31, 14, 27].map((num, i) => {
        const isMatch = [22, 14, 27].includes(num);

        return (
          <div
            key={i}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-transform hover:scale-110
              ${isMatch
                ? "bg-[#1a5c42] text-white"
                : "bg-green-100 text-[#1a5c42]"
              }`}
          >
            {num}
          </div>
        );
      })}
    </div>

    {/* Divider */}
    <div className="border-t" />

    {/* Info rows */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <p className="text-sm text-gray-700">Your scores matched</p>
      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-[#1a5c42] font-bold w-fit">
        3-Match
      </span>
    </div>

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <p className="text-sm text-gray-700">Your prize</p>
      <p className="font-bold text-[#1a5c42] text-sm">£12.50</p>
    </div>

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
      <p className="text-sm text-gray-700">Status</p>
      <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-bold w-fit">
        Pending verification
      </span>
    </div>


    {/* Title */}
    <h2 className="text-lg sm:text-xl font-bold text-[#1a5c42] mb-3 sm:mb-4 mt-4 sm:mt-6">
      Draw History
    </h2>

    {/* Table */}
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-[600px] sm:min-w-full">

        {/* Header */}
        <thead>
          <tr className="text-xs uppercase text-[#1a5c42] border-b border-[#1a5c42] font-bold bg-green-50">
            <th className="py-3 px-2 sm:px-3">Month</th>
            <th className="py-3 px-2 sm:px-3">Draw Numbers</th>
            <th className="py-3 px-2 sm:px-3">Match</th>
            <th className="py-3 px-2 sm:px-3">Prize</th>
            <th className="py-3 px-2 sm:px-3">Status</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y">

          {/* Row */}
          <tr className="hover:bg-gray-50 transition">
            <td className="py-3 px-2 sm:px-3 font-medium">Apr 2026</td>
            <td className="py-3 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">22 · 35 · 31 · 14 · 27</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-bold whitespace-nowrap inline-block">
                3-Match
              </span>
            </td>

            <td className="py-3 px-2 sm:px-3 font-bold text-sm">£12.50</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-bold whitespace-nowrap inline-block">
                Pending
              </span>
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="py-3 px-2 sm:px-3 font-medium">Mar 2026</td>
            <td className="py-3 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">29 · 38 · 12 · 31 · 19</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-bold whitespace-nowrap inline-block">
                4-Match
              </span>
            </td>

            <td className="py-3 px-2 sm:px-3 font-bold text-sm">£28.00</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-bold whitespace-nowrap inline-block">
                Paid
              </span>
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="py-3 px-2 sm:px-3 font-medium">Feb 2026</td>
            <td className="py-3 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">7 · 22 · 41 · 15 · 33</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-bold whitespace-nowrap inline-block">
                No Match
              </span>
            </td>

            <td className="py-3 px-2 sm:px-3 text-gray-400">—</td>
            <td className="py-3 px-2 sm:px-3 text-gray-400">—</td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="py-3 px-2 sm:px-3 font-medium">Jan 2026</td>
            <td className="py-3 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">31 · 9 · 23 · 17 · 35</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-bold whitespace-nowrap inline-block">
                3-Match
              </span>
            </td>

            <td className="py-3 px-2 sm:px-3 font-bold text-sm">£7.00</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-teal-100 text-[#1a5c42] font-bold whitespace-nowrap inline-block">
                Paid
              </span>
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="py-3 px-2 sm:px-3 font-medium">Dec 2025</td>
            <td className="py-3 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm">18 · 26 · 34 · 40 · 11</td>

            <td className="py-3 px-2 sm:px-3">
              <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-bold whitespace-nowrap inline-block">
                No Match
              </span>
            </td>

            <td className="py-3 px-2 sm:px-3 text-gray-400">—</td>
            <td className="py-3 px-2 sm:px-3 text-gray-400">—</td>
          </tr>

        </tbody>
      </table>
    </div>

  </CardContent>
</Card>
</section>

)}
  export default    Drawer