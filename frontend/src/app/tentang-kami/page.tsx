"use client"

import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { HiArrowLeft } from 'react-icons/hi'

export default function Tentang() {
  const router = useRouter()


  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[95%] xl:w-[95%] mx-auto px-4 sm:px-6 lg:px-20 py-1 transition-all duration-300">
        {/* Title Section */}
        <div className="my-6 flex justify-end mb-1">
          <div className="bg-white rounded-full px-6 py-2 shadow-md">
            <span className="text-gray-600">SIPANTAU</span>
            <span className="mx-2">|</span>
            <span className="text-gray-400">Tentang Kami</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Text content */}
          <div className="flex-1 pr-8">
            <h1 className="text-5xl text-gray-600 mb-3">
              TENTANG<br />
              <span className="text-gray-700  font-bold">SIPANTAU</span>
            </h1>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-1">Apa Itu SIPANTAU?</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  SIPANTAU (Sistem Informasi Prediksi dan Pantauan Komoditas) adalah platform inovatif untuk memantau harga dan distribusi komoditas di berbagai pasar secara real-time. Kami membantu pemerintah, petani, dan masyarakat untuk mengambil keputusan yang tepat berbasis data.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-1">Keunggulan SIPANTAU</h2>
                <ul className="list-disc ml-5 text-lg text-gray-600 leading-relaxed">
                  <li>Pemantauan harga komoditas secara real-time</li>
                  <li>Prediksi harga 3 hari ke depan dengan AI</li>
                  <li>Rekomendasi intervensi untuk daerah surplus/defisit</li>
                  <li>Dukungan visualisasi data yang interaktif</li>
                </ul>
              </div>
            </div>

<div className="w-full flex justify-start">
             <button
               onClick={() => router.back()}
               className="mt-12 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2"
             >
               <HiArrowLeft size={20} color="white" />
               <span>Back</span>
             </button>
           </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 h-[470px] flex justify-center items-center mt-8 lg:mt-0">
            <img
              src="/assets/img/petani.png" // Ganti ke logo/about image SIPANTAU kalau ada
              alt="Tentang SIPANTAU"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
