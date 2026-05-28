"use client"

import { useState, useEffect, useRef } from 'react'
import Navbar from "@/components/ui/Navbar"
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft } from 'react-icons/hi'

export default function DashboardTPID() {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedKomoditas, setSelectedKomoditas] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [komoditasList, setKomoditasList] = useState<{ id: number; nama_komoditas: string }[]>([])
  const [loadingKomoditas, setLoadingKomoditas] = useState(true)

  // Get selected market from localStorage
  useEffect(() => {
    const market = localStorage.getItem('selectedMarket') || 'Pasar Cisaat'
    setSelectedMarket(market)
  }, [])

  // Fetch komoditas dari API
  useEffect(() => {
    fetch('/api/komoditas')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setKomoditasList(data.data)
        }
      })
      .catch(err => console.error('[dashboard-tpid] Gagal fetch komoditas:', err))
      .finally(() => setLoadingKomoditas(false))
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredKomoditas = komoditasList.filter(k =>
    k.nama_komoditas.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleKomoditasSelect = (komoditas: string) => {
    setSelectedKomoditas(komoditas)
    setSearchTerm(komoditas)
    setShowDropdown(false)
    // Store selected komoditas and navigate to price chart
    localStorage.setItem('selectedKomoditasRight', komoditas)
    router.push('/price-chart')
  }


  return (
    <div className="min-h-screen bg-[#eef2f5]">
      <Navbar />

      {/* Main Content */}
      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[88%] xl:w-[85%] mx-auto px-2 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10">
        
        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-gray-900 text-sm sm:text-base md:text-lg font-bold tracking-wide uppercase">
            Prediksi Harga
          </h2>
          <h1 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
            {selectedMarket.toUpperCase()}
          </h1>
        </div>

        {/* Content Area - 50/50 layout */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-12">
          
          {/* Left - TPID Logo */}
          <div className="w-full md:flex-1 flex items-center justify-center">
            <img
              src="/assets/img/tpid.png"
              alt="TPID Kabupaten Sukabumi"
              className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[420px] h-auto object-contain"
            />
          </div>

          {/* Right - Komoditas Search */}
          <div className="w-full md:flex-1 pt-2 sm:pt-4 md:pt-6" ref={dropdownRef}>
            <div className="relative w-full max-w-lg mx-auto md:mx-0">
              {/* Search Input */}
              <div className="flex items-center bg-white border-2 border-gray-300 rounded-full shadow-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Komoditas"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 text-gray-700 text-sm sm:text-base outline-none bg-transparent"
                />
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-[#6b8fa3] hover:bg-[#5a7e92] text-white p-3 sm:p-3.5 rounded-full mr-1 transition-colors"
                >
                  <FiSearch size={18} />
                </button>
              </div>

              {/* Dropdown List */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="max-h-[250px] overflow-y-auto">
                    {loadingKomoditas ? (
                      <div className="px-5 py-3 text-sm text-gray-400 text-center">Memuat komoditas...</div>
                    ) : filteredKomoditas.length > 0 ? (
                      filteredKomoditas.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() => handleKomoditasSelect(item.nama_komoditas)}
                          className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors
                            ${idx === 0 && !searchTerm
                              ? 'bg-[#d4e6b5] text-gray-800 font-bold'
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                            ${selectedKomoditas === item.nama_komoditas ? 'bg-[#d4e6b5] text-gray-800 font-bold' : ''}
                          `}
                        >
                          {item.nama_komoditas}
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-gray-400 text-center">
                        Komoditas tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button - Desktop */}
        <div className="hidden md:block mt-12 lg:mt-20 pb-4">
          <button
            onClick={() => router.push('/dashboard-tim-pengendalian')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <HiArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        {/* Back Button - Mobile */}
        <div className="flex md:hidden mt-6 pb-4">
          <button
            onClick={() => router.push('/dashboard-tim-pengendalian')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm"
          >
            <HiArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
