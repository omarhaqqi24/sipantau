"use client"

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function PasarDetail() {
  const router = useRouter()
  const params = useParams()
  const [selectedMarket, setSelectedMarket] = useState('Pasar Cisaat')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const komoditasList = [
    'Cabai Rawit',
    'Cabai Keriting', 
    'Bawang Putih'
  ]

  const handleCheck = () => {
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleCheckHarga = () => {
    router.push('/checking-station')
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">TW</span>
            </div>
            <span className="text-yellow-500 font-semibold text-lg">TIM WATUGATE</span>
          </div>

          <div className="bg-gray-100 rounded-full px-8 py-2 flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-800">Beranda</button>
            <button className="text-gray-600 hover:text-gray-800">Tentang Kami</button>
            <button className="text-gray-600 hover:text-gray-800">FAQ</button>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <span>User</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between px-6 py-8">
        {/* Left side - Search and Info */}
        <div className="flex-1 pr-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span className="text-lg font-semibold">Lokasi 8 Pasar Induk di Kabupaten Sukabumi</span>
          </div>

          <div className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white px-6 py-3 rounded-r-full hover:bg-blue-600 transition">
                🔍
              </button>
            </div>
          </div>

          <button
            onClick={handleCheck}
            className="bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition flex items-center space-x-2 mb-6"
          >
            <span>Check!</span>
            <span>→</span>
          </button>

          {showAlert && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>ALERT!</strong>
              <p>Harga dan pasokan di Pasar Cisaat diprediksi terjadi kenaikan harga komoditas.</p>
            </div>
          )}
        </div>

        {/* Right side - Map */}
        <div className="flex-1">
          <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center relative">
            {/* Simplified map representation */}
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg relative overflow-hidden">
              {/* Map regions */}
              <div className="absolute top-8 left-8 w-24 h-16 bg-gray-800 rounded"></div>
              <div className="absolute top-12 right-12 w-20 h-20 bg-gray-700 rounded"></div>
              <div className="absolute bottom-16 left-16 w-28 h-24 bg-gray-800 rounded"></div>
              <div className="absolute bottom-8 right-8 w-32 h-20 bg-white rounded"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-900 rounded"></div>
              
              {/* Red dots for market locations */}
              <div className="absolute top-16 left-20 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-20 right-16 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-24 left-24 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-16 right-16 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-32 left-1/3 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/dashboard-tim-penanggulangan')}
        className="ml-6 mb-8 bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-600 transition flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>
    </main>
  )
}
