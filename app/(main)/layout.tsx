import { Navbar } from "@/components/navbar"

export default function Layout({children}:{children:React.ReactNode}){
  return<section className="max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-0 py-4 sm:py-6">
    <Navbar/>
          {children}
</section>
}