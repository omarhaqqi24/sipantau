"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

export const fetchCache = "force-no-store";

export default function Breakdown() {
  const router = useRouter();

  const [marketName, setMarketName] = useState("Pasar Tidak Diketahui");
  const [komoditasName, setKomoditasName] = useState("Komoditas Tidak Diketahui");

  // Ambil data dari localStorage setelah komponen mount
  useEffect(() => {
    const savedMarket = localStorage.getItem("selectedMarket");
    const savedKomoditas = localStorage.getItem("selectedKomoditasRight");

    if (savedMarket) setMarketName(savedMarket);
    if (savedKomoditas) setKomoditasName(savedKomoditas);
  }, []);

  const handleRekomendasi = () => {
    router.push("/rekomendasi");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[95%] xl:w-[95%] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-2 sm:py-4 transition-all duration-300">
        {/* Market Selection Pill */}
        <div className="flex justify-center sm:justify-end mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-full px-4 sm:px-6 py-1.5 sm:py-2 shadow-md text-sm sm:text-base">
            <span className="text-gray-600">{marketName}</span>
            <span className="mx-1.5 sm:mx-2">|</span>
            <span className="text-gray-400">{komoditasName}</span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full xl:w-[87%]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-600 mb-4 sm:mb-6 md:mb-8">
            FAKTOR YANG MEMPENGARUHI<br />
            <span className="text-gray-700 font-bold">INTERNAL</span>
          </h1>

          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            <p>
              Kelompok tani kurang optimal dalam membeli pupuk dan pestisida sehingga
              hasil panen kurang optimal yang mempengaruhi harga pasar.
            </p>

            <p>
              Ketidakteraturan pola tanam antarkelompok tani mengakibatkan
              ketidakseimbangan pasokan. Pada periode tertentu terjadi surplus, namun
              pada periode lainnya mengalami kekosongan pasokan.
            </p>

            <p>
              Curah hujan yang tinggi dan suhu ekstrem menimbulkan penyakit pada
              tanaman dan peningkatan hama yang merugikan petani
            </p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-12 md:mt-16 gap-4 sm:gap-0">
          {/* Back Button - Desktop only */}
          <div className="hidden md:block">
            <button
              onClick={() => router.back()}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
            >
              <HiArrowLeft size={20} color="white" />
              <span>Back</span>
            </button>
          </div>

          {/* Rekomendasi Button */}
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <button
              onClick={handleRekomendasi}
              className="w-full sm:w-auto bg-yellow-500 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-yellow-600 transition flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span className="font-bold">Rekomendasi Intervensi</span>
              <HiArrowRight />
            </button>
          </div>
        </div>

        {/* Back Button - Mobile only (bottom) */}
        <div className="flex md:hidden mt-4 pb-4">
          <button
            onClick={() => router.back()}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm"
          >
            <HiArrowLeft size={16} color="white" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </main>
  );
}
