"use client"
import Navbar from "@/components/ui/Navbar"
import { useRouter } from 'next/navigation'
import { HiArrowRight, HiArrowLeft } from "react-icons/hi"

export default function DashboardDinasPertanian() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />

      {/* Main Content */}
      <main className="px-3 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 lg:py-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">
          <span>ISIKAN </span><span className="font-bold">DATA</span>
        </h1>

        <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] mx-auto space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 transition-all duration-300">
          {/* Data Kebutuhan & Ketersediaan */}
          <div
            onClick={() => router.push('/pilih-kebutuhan')}
            className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] cursor-pointer transition-colors rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-5 md:p-6 flex justify-between items-center hover:opacity-90"
          >
            <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Data Kebutuhan & Ketersediaan</span>
            <HiArrowRight size={20} color="white" className="flex-shrink-0 ml-2" />
          </div>

          {/* Data Komoditas */}
          <div
            onClick={() => router.push('/pilih-komoditas')}
            className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] cursor-pointer transition-colors rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-5 md:p-6 flex justify-between items-center hover:opacity-90"
          >
            <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Data Komoditas</span>
            <HiArrowRight size={20} color="white" className="flex-shrink-0 ml-2" />
          </div>

          {/* Data Harga dari Petani */}
          <div
            onClick={() => router.push('/pilih-harga')}
            className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] cursor-pointer transition-colors rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-5 md:p-6 flex justify-between items-center hover:opacity-90"
          >
            <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Data Harga dari Petani</span>
            <HiArrowRight size={20} color="white" className="flex-shrink-0 ml-2" />
          </div>

          {/* Data Harga dari Pasar */}
          <div
            onClick={() => router.push('/pilih-harga-pasar')}
            className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] cursor-pointer transition-colors rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-5 md:p-6 flex justify-between items-center hover:opacity-90"
          >
            <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Data Harga dari Pasar</span>
            <HiArrowRight size={20} color="white" className="flex-shrink-0 ml-2" />
          </div>
        </div>

        {/* Back Button - Desktop */}
        <div className="hidden md:flex mt-6 md:mt-8 pl-4 md:pl-12 lg:pl-20">
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-xl transition duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <HiArrowLeft size={20} color="white" />
            <span className="font-bold">Back</span>
          </button>
        </div>

        {/* Back Button - Mobile */}
        <div className="flex md:hidden mt-6 pl-3 sm:pl-6 pb-4">
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm"
          >
            <HiArrowLeft size={16} color="white" />
            <span className="font-bold">Back</span>
          </button>
        </div>
      </main>
    </div>
  )
}
