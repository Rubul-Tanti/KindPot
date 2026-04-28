"use client"
import { useUserContext } from "@/contextProvider"
import { MdStar } from "react-icons/md"
import Link from "next/link"
import { TbWheel } from "react-icons/tb"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { CgChevronDown, CgProfile } from "react-icons/cg"
import { usePathname } from "next/navigation"
import { HiMenu, HiX } from "react-icons/hi"

const navItems = [
  { label: "Dashboard", route: "/dashboard" },
  { label: "Charities", route: "/charities" },
]

export const Navbar = () => {
  const { setUser, user } = useUserContext()
  const pathname = usePathname()

  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setUser({ isAuthenticated: false, userName: "", email: "", role: null, profilePicture: "", subscription: null })
    window.location.href = "/signin"
  }

  return (
    <motion.nav
      className="z-50 transition-all duration-500 bg-white border-b border-gray-100"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/dashboard">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-[#1a5c42] rounded-lg flex items-center justify-center mr-1"
            >
              <MdStar size={14} className="text-white fill-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">Digital</span>
            <span className="text-xl font-bold text-[#1a5c42] ml-1">Heroes</span>
          </motion.div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.route
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`transition ${
                  isActive
                    ? "text-[#C9A84C] border-b-2 border-[#C9A84C] pb-1"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </motion.div>

        {/* ── Desktop Right ── */}
        <div className="hidden md:flex items-center gap-4">
          {/* Jackpot button */}
          {user?.role !== "ADMIN" && (
            <Link href="/draw">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 25px #ffd700, 0 0 60px #ff0000" }}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col cursor-pointer justify-center items-center
                           bg-gradient-to-br from-black via-[#1a0000] to-black
                           border-2 p-1 border-yellow-500 rounded-xl
                           shadow-[0_0_20px_rgba(255,215,0,0.6)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,215,0,0.2)_0%,_transparent_70%)] animate-pulse" />
                <TbWheel className="animate-spin text-yellow-400 drop-shadow-[0_0_10px_gold]" size={26} />
                <span className="text-yellow-400 font-bold tracking-widest text-[9px] animate-pulse">JACKPOT</span>
              </motion.button>
            </Link>
          )}

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setProfileOpen(!profileOpen)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2"
            >
              {user?.profilePicture ? (
                <Image className="rounded-full" alt="profile" src={user.profilePicture} width={36} height={36} />
              ) : (
                <CgProfile color="green" size={34} />
              )}
              <p className="text-zinc-700 font-semibold text-sm hidden lg:block">{user?.userName || "Profile"}</p>
              <CgChevronDown size={16} className="text-zinc-600" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border p-4 z-50"
                >
                  <ProfileContent user={user} onLogout={handleLogout} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile: Jackpot + Hamburger ── */}
        <div className="flex md:hidden items-center gap-3">
          {user?.role !== "ADMIN" && (
            <Link href="/draw">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col cursor-pointer justify-center items-center
                           bg-gradient-to-br from-black via-[#1a0000] to-black
                           border-2 p-1 border-yellow-500 rounded-xl
                           shadow-[0_0_15px_rgba(255,215,0,0.5)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,215,0,0.2)_0%,_transparent_70%)] animate-pulse" />
                <TbWheel className="animate-spin text-yellow-400" size={22} />
                <span className="text-yellow-400 font-bold tracking-widest text-[8px] animate-pulse">JACKPOT</span>
              </motion.button>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Nav links */}
              {navItems.map((item) => {
                const isActive = pathname === item.route
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="border-t border-gray-100 my-2" />

              {/* Profile section */}
              <div className="flex items-center gap-3 px-3 py-2">
                {user?.profilePicture ? (
                  <Image className="rounded-full" alt="profile" src={user.profilePicture} width={36} height={36} />
                ) : (
                  <CgProfile size={32} color="green" />
                )}
                <div>
                  <p className="text-sm font-semibold">{user?.userName || "Guest"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "Not signed in"}</p>
                </div>
              </div>

              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link href="/admin">
                      <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition">
                        Admin Dashboard
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/signin">
                  <button className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 transition">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Shared profile dropdown content ────────────────────────────────────────
function ProfileContent({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 border-b pb-3 mb-3">
        {user?.profilePicture ? (
          <Image className="rounded-full" alt="profile" src={user.profilePicture} width={36} height={36} />
        ) : (
          <CgProfile size={34} />
        )}
        <div>
          <p className="font-semibold text-sm">{user?.userName || "Guest"}</p>
          <p className="text-xs text-gray-500">{user?.email || "Not signed in"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {user ? (
          <>
            {user.role === "ADMIN" && (
              <Link href="/admin">
                <button className="w-full text-left text-sm hover:bg-gray-100 px-2 py-2 rounded-md transition">
                  Admin Dashboard
                </button>
              </Link>
            )}
            <button
              onClick={onLogout}
              className="text-left text-sm hover:bg-red-50 px-2 py-2 rounded-md text-red-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button className="text-left text-sm hover:bg-gray-100 px-2 py-2 rounded-md text-green-600 transition">
            Sign In
          </button>
        )}
      </div>
    </>
  )
}