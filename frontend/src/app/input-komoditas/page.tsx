"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from "@/components/ui/Navbar"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { HiArrowLeft } from 'react-icons/hi'

export default function InputKomoditas() {
  const router = useRouter()
  const [komoditasData, setKomoditasData] = useState(
    Array.from({ length: 30 }, () => ({
      tonase: '',
      tanggal: null as Date | null,
    }))
  )
  const [komoditasId, setKomoditasId] = useState<string | null>(null)
  const [komoditasName, setKomoditasName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem('selectedKomoditasId')
    const storedName = localStorage.getItem('selectedKomoditasDrop')
    setKomoditasId(storedId)
    if (storedName) setKomoditasName(storedName)
  }, [])

  const handleInputChange = (index: number, field: string, value: any) => {
    const newData = [...komoditasData]
    newData[index] = { ...newData[index], [field]: value }
    setKomoditasData(newData)
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

    // Filter hanya row yang diisi tonase dan tanggal
    const validItems = komoditasData
      .filter(item => item.tonase !== '' && item.tanggal !== null)
      .map(item => ({
        perkiraan_tonase: item.tonase,
        tanggal_prakiraan_panen: formatDate(item.tanggal as Date),
      }))

    if (validItems.length === 0) {
      setPopup({ type: 'error', message: 'Harap isi minimal 1 data tonase dan tanggal prakiraan panen.' })
      return
    }

    setIsLoading(true)
    setPopup(null)

    try {
      const response = await fetch('/api/panen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          komoditas_id: komoditasId,
          items: validItems,
        }),
      })

      const data = await response.json()

      if (response.ok && (data.success || response.status === 200 || response.status === 201)) {
        setPopup({ type: 'success', message: 'Data komoditas berhasil disimpan!' })
        setKomoditasData(Array.from({ length: 30 }, () => ({ tonase: '', tanggal: null })))

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative pb-20">
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
      <main className="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-2 sm:mb-3 text-gray-800">
          <span>DATA </span>
          <span className='font-bold'>KOMODITAS</span>
        </h1>
        {komoditasName && (
          <p className="text-center text-sm sm:text-base md:text-lg text-gray-500 mb-4 sm:mb-6 md:mb-8">
            Komoditas: <span className="font-semibold text-gray-700">{komoditasName}</span>
          </p>
        )}

        {/* Form Card */}
        <div className="w-full sm:w-[95%] md:w-[90%] lg:w-[65%] xl:w-[60%] mx-auto transition-all duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#456882] via-[#a5bfcc] to-[#456882] text-white rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8">
                <h2 className="text-sm sm:text-lg md:text-xl text-center font-semibold">Prakiraan Panen</h2>
                <h2 className="text-sm sm:text-lg md:text-xl text-center font-semibold">Perkiraan Tonase</h2>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 max-h-[280px] sm:max-h-[320px] overflow-y-auto custom-scrollbar">
              {komoditasData.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-8 relative">
                  {/* Prakiraan Panen (tanggal) */}
                  <div className="w-full">
                    <DatePicker
                      selected={item.tanggal}
                      onChange={(date) => handleInputChange(index, 'tanggal', date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd/mm/yyyy"
                      className="w-full border-b-2 border-gray-300 bg-transparent text-gray-800 text-center placeholder-gray-400 focus:border-blue-500 outline-none p-1.5 sm:p-2 md:p-3 text-sm sm:text-base"
                      wrapperClassName="w-full"
                    />
                  </div>
                  {/* Perkiraan Tonase */}
                  <input
                    type="number"
                    placeholder="Ton"
                    value={item.tonase}
                    onChange={(e) => handleInputChange(index, 'tonase', e.target.value)}
                    className="border-b-2 text-center border-gray-300 bg-transparent text-gray-800 placeholder-gray-400 focus:border-blue-500 outline-none p-1.5 sm:p-2 md:p-3 text-sm sm:text-base"
                  />
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
