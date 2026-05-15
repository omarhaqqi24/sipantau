"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { FiSearch } from 'react-icons/fi'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

export default function CheckingStation() {
  const router = useRouter()

  const [marketName, setMarketName] = useState('Pasar Tidak Diketahui')
  const [selectedDate, setSelectedDate] = useState({ day: '', month: '', year: '' })
  const [selectedKomoditasLeft, setSelectedKomoditasLeft] = useState('')
  const [selectedKomoditasRight, setSelectedKomoditasRight] = useState('')
  const [showDropdownLeft, setShowDropdownLeft] = useState(false)
  const [showDropdownRight, setShowDropdownRight] = useState(false)
  const [harga, setHarga] = useState<number | null>(null)

  const komoditasList = ['Cabai Rawit', 'Cabai Keriting', 'Bawang Putih']

  // 🔥 Ambil marketName & komoditas dari LocalStorage saat pertama load
  useEffect(() => {
    const storedMarket = localStorage.getItem('selectedMarket')



    if (storedMarket) setMarketName(storedMarket)

  }, [])

  const handleCheckHarga = (komoditas = selectedKomoditasLeft) => {
    if (!komoditas) {
      setHarga(null) // reset harga jika komoditas kosong
      return
    }

    localStorage.setItem('selectedKomoditasLeft', komoditas) // 💾 simpan ke localStorage
    const fakeHarga = Math.floor(Math.random() * 50000) + 10000
    setHarga(fakeHarga)
  }

  const handleCheckHargaKanan = () => {
    if (!selectedKomoditasLeft || !selectedDate.day || !selectedDate.month || !selectedDate.year) {
      alert('Harap pilih komoditas di kiri dan isi tanggal terlebih dahulu!')
      return
    }
    const fakeHarga = Math.floor(Math.random() * 50000) + 10000
    setHarga(fakeHarga)
  }

  const handleCheckKomoditas = () => {
    if (!selectedKomoditasRight) {
      alert('Harap pilih komoditas di kanan terlebih dahulu!')
      return
    }

    localStorage.setItem('selectedKomoditasRight', selectedKomoditasRight) // 💾 simpan ke localStorage

    router.push('/price-chart')
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const [year, month, day] = value.split('-')
    setSelectedDate({ day, month, year })
  }

  const updateDateField = (field: 'day' | 'month' | 'year', value: string) => {
    const updatedDate = { ...selectedDate, [field]: value }
    setSelectedDate(updatedDate)

    const hiddenInput = document.querySelector<HTMLInputElement>('#hiddenDateInput')
    if (hiddenInput) {
      hiddenInput.value = `${updatedDate.year}-${updatedDate.month}-${updatedDate.day}`
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#ffff] to-[#dddcdc]">
      <Navbar />

      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[95%] xl:w-[90%] mx-auto px-4 sm:px-6 lg:px-20 py-6 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0 mt-5">
          {/* Left Side */}
          <div className="lg:w-1/2 border-r-3 border-black">
            <h1 className="text-5xl sm:text-6xl text-gray-900 mt-10 mb-4 leading-none">
              {marketName
                .toUpperCase()
                .split(' ')
                .map((line, idx) => (
                  <div key={idx} className={idx === 0 ? 'font-normal' : 'font-bold'}>
                    {line}
                  </div>
                ))}
            </h1>

            <div className="mb-31">
              <div className="relative w-[90%]">
                <input
                  type="text"
                  placeholder="Komoditas"
                  value={selectedKomoditasLeft}
                  onChange={(e) => setSelectedKomoditasLeft(e.target.value)}
                  onFocus={() => setShowDropdownLeft(true)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
                />
                <button
                  onClick={() => handleCheckHarga()}
                  className="absolute  right-0 top-[5%] bg-gradient-to-r from-[#456882] to-[#a5bfcc] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <FiSearch size={20} color="white" />
                </button>

                {showDropdownLeft && (
                  <div className="absolute top-full w-[80%] left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                    {komoditasList.map((komoditas, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedKomoditasLeft(komoditas)
                          setShowDropdownLeft(false)
                          handleCheckHarga(komoditas)
                        }}
                        className="w-full text-left px-4 py-1.5 hover:bg-green-100 first:bg-green-200 border-b border-gray-200 last:border-b-0 text-gray-900"
                      >
                        {komoditas}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl w-[15%] font-bold mb-1 border-b-3 border-black text-gray-900">HARGA</h2>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {harga ? (
                  <>Rp. <span>{harga?.toLocaleString()}</span></>
                ) : (
                  <>Rp. <span>________________</span></>
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:w-1/2">
            <div className="p-6 sm:p-8">
              <h2 className="text-4xl mb-4 sm:mb-6 text-gray-900">
                <span className="font-normal">CHECKING</span> <span className="font-bold">STATION</span>
              </h2>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-2xl mb-4 sm:mb-4 text-gray-900 underline underline-offset-8 decoration-2 decoration-black">
                  <span className="font-semibold">Input</span> <span className="font-bold">Tanggal</span>
                </h3>

                <input
                  id="hiddenDateInput"
                  type="date"
                  onChange={handleDateChange}
                  className="absolute opacity-0 pointer-events-none"
                />

                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() =>
                    (document.getElementById('hiddenDateInput') as HTMLInputElement).showPicker()
                  }
                >
                  {[0, 1].map((i) => (
                    <input
                      key={`day-${i}`}
                      type="text"
                      placeholder="D"
                      maxLength={1}
                      value={selectedDate.day[i] || ''}
                      onChange={(e) => {
                        const newDay = selectedDate.day.split('')
                        newDay[i] = e.target.value.replace(/\D/g, '')
                        updateDateField('day', newDay.join('').slice(0, 2))
                      }}
                      className="w-12 h-12 text-center border-2 bg-white border-gray-300 rounded-2xl text-gray-900 font-semibold focus:border-blue-500 outline-none"
                    />
                  ))}
                  <span className="px-2 text-lg font-bold text-gray-600">|</span>
                  {[0, 1].map((i) => (
                    <input
                      key={`month-${i}`}
                      type="text"
                      placeholder="M"
                      maxLength={1}
                      value={selectedDate.month[i] || ''}
                      onChange={(e) => {
                        const newMonth = selectedDate.month.split('')
                        newMonth[i] = e.target.value.replace(/\D/g, '')
                        updateDateField('month', newMonth.join('').slice(0, 2))
                      }}
                      className="w-12 h-12 text-center bg-white border-2 border-gray-300 rounded-2xl text-gray-900 font-semibold focus:border-blue-500 outline-none"
                    />
                  ))}
                  <span className="px-2 text-lg font-bold text-gray-600">|</span>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={`year-${i}`}
                      type="text"
                      placeholder="Y"
                      maxLength={1}
                      value={selectedDate.year[i] || ''}
                      onChange={(e) => {
                        const newYear = selectedDate.year.split('')
                        newYear[i] = e.target.value.replace(/\D/g, '')
                        updateDateField('year', newYear.join('').slice(0, 4))
                      }}
                      className="w-12 h-12 text-center bg-white border-2 border-gray-300 rounded-2xl text-gray-900 font-semibold focus:border-blue-500 outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handleCheckHargaKanan}
                  className="w-[40%] bg-yellow-500 text-black px-4 py-3 rounded-full font-semibold hover:bg-yellow-600 transition mt-5 flex items-center justify-center space-x-2"
                >
                  <span className="font-bold">Check Harga</span>
                  <span><HiArrowRight /></span>
                </button>
              </div>

              <div>
                <h3 className="text-2xl mb-4 sm:mb-4 text-gray-900 underline underline-offset-4 decoration-2 decoration-black">
                  <span className="font-semibold">Check</span> <span className="font-bold">Komoditas</span>
                </h3>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Komoditas"
                    value={selectedKomoditasRight}
                    onChange={(e) => setSelectedKomoditasRight(e.target.value)}
                    onFocus={() => setShowDropdownRight(true)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#456882] to-[#a5bfcc] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                    <FiSearch size={20} color="white" />
                  </button>

                  {showDropdownRight && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                      {komoditasList.map((komoditas, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedKomoditasRight(komoditas)
                            setShowDropdownRight(false)
                            localStorage.setItem('selectedKomoditasRight', komoditas) // 💾 simpan ke localStorage
                          }}
                          className="w-full text-left px-4 py-1.5 hover:bg-green-100 first:bg-green-200 border-b border-gray-200 last:border-b-0 text-gray-900"
                        >
                          {komoditas}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckKomoditas}
                  className="w-[40%] bg-yellow-500 text-black px-4 py-3 rounded-full font-semibold hover:bg-yellow-600 transition mt-5 flex items-center justify-center space-x-2"
                >
                  <span className="font-bold">Check!</span>
                  <span><HiArrowRight /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start px-12 md:px-20 -translate-y-10 xl:-translate-y-9">
        <div className="w-full flex justify-start">
          <button
            onClick={() => router.push('/dashboard-dinas-pertanian')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-12 py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2"
          >
            <HiArrowLeft size={20} color="white" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </main>
  )
}
