"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from "@/components/ui/Navbar"
import DatePicker from "react-datepicker"
import { HiArrowLeft } from 'react-icons/hi'
import "react-datepicker/dist/react-datepicker.css"

export default function InputKebutuhan() {
  const router = useRouter()
  const [hargaData, setHargaData] = useState(
    Array.from({ length: 30 }, () => ({
      kebutuhan: '',
      ketersediaan: '',
      neraca: '',
      tanggal: null as Date | null
    }))
  )
  const [komoditasId, setKomoditasId] = useState<string | null>(null)
  const [komoditasName, setKomoditasName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Ambil komoditas_id dan nama dari localStorage saat load
  useEffect(() => {
    const storedId = localStorage.getItem('selectedKomoditasId')
    const storedName = localStorage.getItem('selectedKomoditasDrop')
    setKomoditasId(storedId)
    if (storedName) setKomoditasName(storedName)
  }, [])

  const handleInputChange = (index: number, field: string, value: any) => {
    const newData = [...hargaData]
    newData[index] = { ...newData[index], [field]: value }

    // Auto-hitung neraca = ketersediaan - kebutuhan
    if (field === 'kebutuhan' || field === 'ketersediaan') {
      const ketersediaan = field === 'ketersediaan' ? parseFloat(value) : parseFloat(newData[index].ketersediaan)
      const kebutuhan = field === 'kebutuhan' ? parseFloat(value) : parseFloat(newData[index].kebutuhan)
      if (!isNaN(ketersediaan) && !isNaN(kebutuhan)) {
        newData[index].neraca = (ketersediaan - kebutuhan).toString()
      } else {
        newData[index].neraca = ''
      }
    }

    setHargaData(newData)
  }

  // Format tanggal ke YYYY-MM-DD
  const formatDate = (date: Date) => {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const handleSubmit = async () => {
    if (!komoditasId) {
      setPopup({ type: 'error', message: 'Komoditas belum dipilih. Silakan kembali ke halaman sebelumnya.' })
      return
    }

    // Filter hanya row yang diisi kebutuhan, ketersediaan, dan tanggal
    const validItems = hargaData
      .filter(item => item.kebutuhan !== '' && item.ketersediaan !== '' && item.tanggal !== null)
      .map(item => ({
        ketersediaan_harian: item.ketersediaan,
        kebutuhan_harian: item.kebutuhan,
        neraca_harian: item.neraca,
        tanggal: formatDate(item.tanggal as Date)
      }))

    if (validItems.length === 0) {
      setPopup({ type: 'error', message: 'Harap isi minimal 1 data kebutuhan, ketersediaan, dan tanggal.' })
      return
    }

    setIsLoading(true)
    setPopup(null)

    try {
      const response = await fetch('/api/ketersediaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          komoditas_id: komoditasId,
          items: validItems
        }),
      })

      const data = await response.json()

      if (response.ok && (data.success || response.status === 200 || response.status === 201)) {
        setPopup({ type: 'success', message: 'Data kebutuhan & ketersediaan berhasil disimpan!' })
        // Clear form
        setHargaData(Array.from({ length: 30 }, () => ({
          kebutuhan: '',
          ketersediaan: '',
          neraca: '',
          tanggal: null
        })))
        
        setTimeout(() => {
          router.push('/dashboard-dinas-pertanian')
        }, 2000)
      } else {
        setPopup({ type: 'error', message: data.message || 'Gagal menyimpan data.' })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setPopup({ type: 'error', message: 'Terjadi kesalahan jaringan.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br overflow-hidden from-gray-100 to-gray-200 relative pb-20">
      <Navbar />

      {/* Popup Notification */}
      {popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            {popup.type === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <h3 className={`text-xl font-bold mb-2 ${popup.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {popup.type === 'success' ? 'Berhasil!' : 'Gagal'}
            </h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <button
              onClick={() => setPopup(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-2 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mb-2 sm:mb-3 text-gray-800">
          <span>DATA </span>
          <span className='font-bold'>KEBUTUHAN & KETERSEDIAAN </span>
        </h1>
        {komoditasName && (
          <p className="text-center text-sm sm:text-base md:text-lg text-gray-500 mb-4 sm:mb-6 md:mb-8">
            Komoditas: <span className="font-semibold text-gray-700">{komoditasName}</span>
          </p>
        )}

        {/* Form Card */}
        <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[75%] xl:w-[70%] mx-auto transition-all duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] text-white rounded-t-2xl sm:rounded-t-3xl p-2 sm:p-3 md:p-4">
              <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 lg:gap-8">
                <h2 className="text-xs sm:text-sm md:text-base lg:text-xl text-center font-semibold">Kebutuhan Harian</h2>
                <h2 className="text-xs sm:text-sm md:text-base lg:text-xl text-center font-semibold">Ketersediaan Harian</h2>
                <h2 className="text-xs sm:text-sm md:text-base lg:text-xl text-center font-semibold">Neraca Harian</h2>
                <h2 className="text-xs sm:text-sm md:text-base lg:text-xl text-center font-semibold">Prakiraan Harian</h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto custom-scrollbar">
              {hargaData.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 lg:gap-10 relative">
                  {/* Kebutuhan Harian */}
                  <input
                    type="number"
                    placeholder="Ton"
                    value={item.kebutuhan}
                    onChange={(e) => handleInputChange(index, 'kebutuhan', e.target.value)}
                    className="text-center border-b-2 border-gray-300 bg-transparent text-gray-800 placeholder-gray-400 focus:border-blue-500 outline-none p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                  />
                  {/* Ketersediaan Harian */}
                  <input
                    type="number"
                    placeholder="Ton"
                    value={item.ketersediaan}
                    onChange={(e) => handleInputChange(index, 'ketersediaan', e.target.value)}
                    className="border-b-2 text-center border-gray-300 bg-transparent text-gray-800 placeholder-gray-400 focus:border-blue-500 outline-none p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                  />
                  {/* Neraca Harian (auto-calculated, read-only) */}
                  <input
                    type="text"
                    placeholder="Auto"
                    value={item.neraca}
                    readOnly
                    className={`border-b-2 text-center border-gray-300 bg-gray-50 placeholder-gray-400 outline-none p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base cursor-not-allowed ${
                      item.neraca !== '' && parseFloat(item.neraca) < 0 ? 'text-red-600 font-semibold' : 'text-gray-800'
                    }`}
                  />
                  {/* Prakiraan Harian = Tanggal (Date Picker) */}
                  <div className="w-full">
                    <DatePicker
                      selected={item.tanggal}
                      onChange={(date) => handleInputChange(index, 'tanggal', date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd/mm/yyyy"
                      className="w-full border-b-2 border-gray-300 bg-transparent text-gray-800 text-center placeholder-gray-400 focus:border-blue-500 outline-none p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="relative -mt-4 flex justify-center z-50">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`font-semibold px-8 sm:px-10 md:px-12 py-1.5 rounded-full text-base sm:text-lg transition-colors shadow-lg outline outline-1 outline-black flex items-center gap-2
                ${isLoading ? 'bg-gray-400 text-white cursor-not-allowed border-transparent' : 'bg-yellow-400 hover:bg-yellow-500 text-black'}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Input'
              )}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute bottom-6 left-3 sm:left-4 md:left-6 lg:left-8 xl:left-20">
          <button
            onClick={() => router.push('/dashboard-dinas-pertanian')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 sm:px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <HiArrowLeft size={18} color="white" />
            <span>Back</span>
          </button>
        </div>
      </main>
    </div>
  )
}
