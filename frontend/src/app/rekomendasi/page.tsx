'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { HiArrowLeft } from 'react-icons/hi';

export const fetchCache = 'force-no-store';

export default function Rekomendasi() {
  const router = useRouter();

  const [marketName, setMarketName] = useState('Pasar Tidak Diketahui');
  const [komoditasName, setKomoditasName] = useState('Komoditas Tidak Diketahui');

  // Ambil data dari localStorage setelah komponen mount
  useEffect(() => {
    const savedMarket = localStorage.getItem('selectedMarket');
    const savedKomoditas = localStorage.getItem('selectedKomoditasRight');

    if (savedMarket) setMarketName(savedMarket);
    if (savedKomoditas) setKomoditasName(savedKomoditas);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[95%] xl:w-[95%] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-2 sm:py-4 transition-all duration-300">
        {/* Market Selection Pill */}
        <div className="flex justify-center sm:justify-end mb-2 sm:mb-4">
          <div className="bg-white rounded-full px-4 sm:px-6 py-1.5 sm:py-2 shadow-md text-sm sm:text-base">
            <span className="text-gray-600">{marketName}</span>
            <span className="mx-1.5 sm:mx-2">|</span>
            <span className="text-gray-400">{komoditasName}</span>
          </div>
        </div>

        {/* Content - stacks on mobile, side-by-side on lg+ */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left side - Text content */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-600 mb-3 sm:mb-4">
              REKOMENDASI<br />
              <span className="text-gray-700 font-bold">INTERVENSI</span>
            </h1>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 mb-1.5 sm:mb-2 md:mb-3">KABUPATEN GARUT</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Kabupaten Garut sedang mengalami surplus cabai rawit, lakukan
                  koordinasi dengan daerah tersebut.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 mb-1.5 sm:mb-2 md:mb-3">KABUPATEN BANDUNG BARAT</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Kabupaten Bandung Barat sedang mengalami surplus cabai rawit,
                  lakukan koordinasi dengan daerah tersebut.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 mb-1.5 sm:mb-2 md:mb-3">LAKUKAN INVESTIGASI LAPANGAN</h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  Lakukan investigasi rantai distribusi dan pengecekan penimbunan
                  stock komoditas.
                </p>
              </div>
            </div>

            {/* Back Button - Desktop only */}
            <div className="hidden md:flex mt-6">
              <button
                onClick={() => router.back()}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
              >
                <HiArrowLeft size={20} color="white" />
                <span>Back</span>
              </button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[470px] flex justify-center items-center">
            <img
              src="/assets/img/sayur.png"
              alt="Map Kabupaten Sukabumi"
              className="w-full h-full object-contain"
            />
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
