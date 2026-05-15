"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft } from 'react-icons/hi'

export default function PilihHarga() {
  const router = useRouter()

  const [selectedKomoditasDrop, setSelectedKomoditasDrop] = useState('')
  const [showDropdownLeft, setShowDropdownLeft] = useState(false)

  const [komoditasList, setKomoditasList] = useState<{id: number, nama_komoditas: string}[]>([])

  useEffect(() => {
    // Fetch komoditas dari API
    fetch('/api/komoditas')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setKomoditasList(data.data)
        }
      })
      .catch(err => console.error('Gagal fetch komoditas:', err))
  }, [])

  const handleCheckHarga = (komoditas = selectedKomoditasDrop) => {
    if (!komoditas) {
      alert('Pilih komoditas terlebih dahulu!')
      return
    }

    // Cari id dari komoditas yang dipilih
    const selectedItem = komoditasList.find(k => k.nama_komoditas === komoditas)
    if (selectedItem) {
      localStorage.setItem('selectedKomoditasId', selectedItem.id.toString())
    }

    localStorage.setItem('selectedKomoditasDrop', komoditas)
    router.push('/input-harga')
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#ffff] to-[#dddcdc] relative pb-20">
      <Navbar />

      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[95%] xl:w-[90%] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-4 sm:py-6 transition-all duration-300">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center mb-4 sm:mb-6 md:mb-8 text-gray-800 mt-2 leading-none">
          <span>PILIH </span><span className="font-semibold">KOMODITAS</span>
        </h1>

        <div className="flex justify-center">
          <div className="relative w-[95%] sm:w-[85%] md:w-[80%] lg:w-[70%]">
            <input
              type="text"
              placeholder="Komoditas"
              value={selectedKomoditasDrop}
              onChange={(e) => setSelectedKomoditasDrop(e.target.value)}
              onFocus={() => setShowDropdownLeft(true)}
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 md:py-5 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900 text-sm sm:text-base pr-16"
            />
            <button
              onClick={() => handleCheckHarga()}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#456882] to-[#a5bfcc] text-white w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              <FiSearch size={22} color="white" />
            </button>

            {showDropdownLeft && komoditasList.length > 0 && (
              <div className="absolute top-full w-[96%] left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                {komoditasList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedKomoditasDrop(item.nama_komoditas)
                      setShowDropdownLeft(false)
                      handleCheckHarga(item.nama_komoditas)
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-green-100 first:bg-green-200 border-b border-gray-200 last:border-b-0 text-gray-900 text-sm sm:text-base"
                  >
                    {item.nama_komoditas}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back Button - always at bottom */}
      <div className="absolute bottom-6 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-20">
        <button
          onClick={() => router.push('/dashboard-dinas-pertanian')}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 sm:px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
        >
          <HiArrowLeft size={18} color="white" />
          <span>Back</span>
        </button>
      </div>
    </main>
  )
}
