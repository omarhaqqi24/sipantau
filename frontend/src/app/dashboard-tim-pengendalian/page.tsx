"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import Navbar from "@/components/ui/Navbar"
import { useRouter } from 'next/navigation'
import { FiSearch, FiChevronDown } from 'react-icons/fi'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import dynamic from 'next/dynamic' // 1. Import dynamic untuk load peta
import { isSessionValid, getUserRole, getDashboardByRole } from '@/lib/auth'

// Data Komoditas
const komoditasList = [
  'Beras Medium',
  'Cabai Rawit Merah',
  'Cabai Merah Besar',
  'Bawang Merah',
]

// 2. Data Pasar dengan Koordinat & Harga per Komoditas (Dummy)
const pasarData = [
  { name: 'Pasar Cisaat', lat: -6.9133, lng: 106.9036, image: '/assets/img/fotocisaat.jpg', prices: {
    'Beras Medium': '14.000/Kg', 'Cabai Rawit Merah': '55.000/Kg',
    'Cabai Merah Besar': '45.000/Kg', 'Bawang Merah': '35.000/Kg',
  }},
  { name: 'Pasar Parungkuda', lat: -6.8407, lng: 106.7571, image: '/assets/img/fotoparung.jfif', prices: {
    'Beras Medium': '20.000/Kg', 'Cabai Rawit Merah': '58.000/Kg',
    'Cabai Merah Besar': '48.000/Kg', 'Bawang Merah': '38.000/Kg',
  }},
  { name: 'Pasar Cicurug', lat: -6.7865, lng: 106.7802, image: '/assets/img/fotocicurug.jpg', prices: {
    'Beras Medium': '18.000/Kg', 'Cabai Rawit Merah': '56.000/Kg',
    'Cabai Merah Besar': '46.000/Kg', 'Bawang Merah': '36.000/Kg',
  }},
  { name: 'Pasar Cibadak', lat: -6.8925, lng: 106.7800, image: '/assets/img/fotocibadak.jfif', prices: {
    'Beras Medium': '14.000/Kg', 'Cabai Rawit Merah': '54.000/Kg',
    'Cabai Merah Besar': '44.000/Kg', 'Bawang Merah': '34.000/Kg',
  }},
  { name: 'Pasar Sukaraja', lat: -6.9369, lng: 106.9450, image: '/assets/img/fotosukaraja.jpg', prices: {
    'Beras Medium': '17.000/Kg', 'Cabai Rawit Merah': '57.000/Kg',
    'Cabai Merah Besar': '47.000/Kg', 'Bawang Merah': '37.000/Kg',
  }},
  { name: 'Pasar Surade', lat: -7.3486, lng: 106.5742, image: '/assets/img/fotosurade.jpg', prices: {
    'Beras Medium': '18.000/Kg', 'Cabai Rawit Merah': '60.000/Kg',
    'Cabai Merah Besar': '50.000/Kg', 'Bawang Merah': '40.000/Kg',
  }},
  { name: 'Pasar Warungkiara', lat: -6.97839, lng: 106.71711, image: '/assets/img/fotokiara.jpg', prices: {

    'Beras Medium': '13.000/Kg', 'Cabai Rawit Merah': '52.000/Kg',
    'Cabai Merah Besar': '43.000/Kg', 'Bawang Merah': '33.000/Kg',
  }},
  { name: 'Pasar Palabuhanratu', lat: -6.9877, lng: 106.5513, image: '/assets/img/fotopelabuhanratu.jpg', prices: {
    'Beras Medium': '16.000/Kg', 'Cabai Rawit Merah': '59.000/Kg',
    'Cabai Merah Besar': '49.000/Kg', 'Bawang Merah': '39.000/Kg',
  }},
];

// 3. Load Map Component secara Dynamic (agar tidak error window is not defined)
const MapComponent = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl flex flex-col items-center justify-center text-gray-400">
      <p>Memuat Peta...</p>
    </div>
  )
})

export default function DashboardTimPenanggulangan() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showPageAlert, setShowPageAlert] = useState(true)

  // Komoditas state
  const [selectedKomoditas, setSelectedKomoditas] = useState('Beras Medium')
  const [showKomoditasDropdown, setShowKomoditasDropdown] = useState(false)
  const [komoditasSearch, setKomoditasSearch] = useState('')
  const komoditasRef = useRef<HTMLDivElement>(null)

  // Compute locations with price based on selected komoditas
  const pasarLocations = useMemo(() => 
    pasarData.map(p => ({
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      image: p.image,
      price: p.prices[selectedKomoditas as keyof typeof p.prices] || '-',
    })),
    [selectedKomoditas]
  )

  const pasarList = pasarLocations.map(p => p.name)

  useEffect(() => {
    setSelectedMarket('')
    setSearchTerm('')
  }, [])

  // Close komoditas dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (komoditasRef.current && !komoditasRef.current.contains(e.target as Node)) {
        setShowKomoditasDropdown(false)
        setKomoditasSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredPasar = pasarList.filter(pasar =>
    pasar.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePasarSelect = (pasar: string) => {
    setSearchTerm(pasar)
    setSelectedMarket(pasar)
    localStorage.setItem('selectedMarket', pasar)
    setShowDropdown(false)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleCheckHarga = () => {
    // Jika sudah login, langsung ke dashboard sesuai role
    if (isSessionValid()) {
      const role = getUserRole()
      if (role) {
        router.push(getDashboardByRole(role))
        return
      }
    }
    // Jika belum login, ke halaman login
    router.push('/login-sebagai')
  }

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[88%] xl:w-[85%] mx-auto transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start justify-between px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 gap-4 lg:gap-8">
          
          {/* Left side - Search and Info */}
          {/* Tambahkan z-10 agar dropdown muncul di atas peta */}
          <div className="w-full lg:w-[45%] xl:w-[40%] relative z-10">
            {/* Title */}
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full flex-shrink-0"></div>
              <span className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                Lokasi Pasar Rakyat di Kabupaten Sukabumi
              </span>
            </div>

            {/* Searchbar */}
            <div className="relative mb-4 sm:mb-6">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Cari Lokasi Pasar Induk"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900 shadow-sm text-sm sm:text-base"
                />
                <button
                  className="absolute right-0 top-[5%] bg-gradient-to-r from-[#456882] to-[#a5bfcc] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition shadow-md"
                >
                  <FiSearch size={18} color="white" />
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && filteredPasar.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">
                  {filteredPasar.map((pasar, index) => (
                    <button
                      key={index}
                      onClick={() => handlePasarSelect(pasar)}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 first:hover:bg-green-100 border-b border-gray-100 last:border-b-0 text-gray-700 transition-colors"
                    >
                      {pasar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Check Button & Alert */}
            <div className="relative">
              {/* Fixed height so searchbar doesn't shift */}
              {selectedMarket && (
                <div className="animate-fade-in-up">
                  <button
                    onClick={handleCheckHarga}
                    className="w-full sm:w-auto bg-yellow-500 text-black px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-yellow-600 transition flex items-center justify-center space-x-2 mb-2 shadow-md transform active:scale-95 text-sm sm:text-base"
                  >
                    <span>Check!</span>
                    <span><HiArrowRight /></span>
                  </button>
                </div>
              )}
              {(showAlert && selectedMarket) || showPageAlert ? (
                <div className="mt-2 w-full px-3 sm:px-4 py-3 sm:py-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-md animate-fade-in flex items-start justify-between gap-2">
                  <div>
                    <strong className='text-lg sm:text-2xl text-red-700 block mb-1'>ALERT!</strong>
                    <p className='text-gray-800 text-sm sm:text-lg leading-snug'>
                      Harga dan pasokan di <b>{showPageAlert && !selectedMarket ? 'Pasar Cisaat' : selectedMarket}</b> diprediksi terjadi kenaikan harga komoditas.
                    </p>
                  </div>
                  {showPageAlert && !selectedMarket && (
                    <button
                      onClick={() => setShowPageAlert(false)}
                      className="text-red-400 hover:text-red-600 transition text-xl leading-none flex-shrink-0 mt-0.5"
                      aria-label="Tutup alert"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>

{/* Right side - Map Area */}
<div className="w-full lg:w-[55%] xl:w-[60%] relative z-0">

  {/* Komoditas Dropdown - positioned top right above the map */}
  <div className="flex justify-end mb-3 relative z-[700]" ref={komoditasRef}>
    <div className="relative">
      {/* Pill-shaped dropdown trigger */}
      <div className="flex items-center bg-white border-2 border-[#6b8fa3] rounded-full shadow-md overflow-hidden">
        <button
          onClick={() => {
            setShowKomoditasDropdown(!showKomoditasDropdown)
            setKomoditasSearch('')
          }}
          className="flex items-center gap-2 px-5 py-2.5 text-[#3a5a6e] font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <span>{selectedKomoditas}</span>
          <span className="border-l border-[#6b8fa3] h-5 mx-1"></span>
          <FiChevronDown
            size={18}
            className={`transition-transform duration-200 ${showKomoditasDropdown ? 'rotate-180' : ''}`}
          />
        </button>
        <button
          onClick={() => {
            setShowKomoditasDropdown(!showKomoditasDropdown)
            setKomoditasSearch('')
          }}
          className="bg-gradient-to-r from-[#456882] to-[#a5bfcc] text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition shadow-md -ml-1"
        >
          <FiSearch size={16} />
        </button>
      </div>

      {/* Komoditas Dropdown List */}
      {showKomoditasDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[800] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search input inside dropdown */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Cari komoditas..."
              value={komoditasSearch}
              onChange={(e) => setKomoditasSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#456882] focus:ring-1 focus:ring-[#456882] text-gray-700 placeholder-gray-400"
              autoFocus
            />
          </div>
          {/* List items */}
          <div className="max-h-52 overflow-y-auto">
            {komoditasList
              .filter(k => k.toLowerCase().includes(komoditasSearch.toLowerCase()))
              .map((komoditas, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedKomoditas(komoditas)
                    setShowKomoditasDropdown(false)
                    setKomoditasSearch('')
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-b-0
                    ${selectedKomoditas === komoditas
                      ? 'bg-[#e8f4e8] text-[#2d5a3d] font-semibold'
                      : 'text-gray-700 hover:bg-[#f0f7fa]'
                    }`}
                >
                  {komoditas}
                </button>
              ))}
            {komoditasList.filter(k => k.toLowerCase().includes(komoditasSearch.toLowerCase())).length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                Komoditas tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Map */}
  <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px]">
    <MapComponent 
       locations={pasarLocations} 
       selectedMarket={selectedMarket} 
    />
  </div>
</div>

        </div>

        {/* Back Button */}
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 -mt-20">
          <div className="w-full flex justify-start">
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 sm:px-12 py-2.5 sm:py-3 rounded-full shadow-lg transition duration-300 flex items-center space-x-2 transform hover:-translate-y-1 text-sm sm:text-base"
            >
              <HiArrowLeft size={20} color="white" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}