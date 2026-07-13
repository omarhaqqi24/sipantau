"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi'
import { isSessionValid, getUserRole, getDashboardByRole } from '@/lib/auth'

export default function LoginSelection() {
  const router = useRouter()
  const [marketName, setMarketName] = useState('')
  const [checking, setChecking] = useState(true)
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('selectedMarket')
    if (saved) setMarketName(saved)

    if (isSessionValid()) {
      const role = getUserRole()
      if (role && role !== 'admin') {
        // Bukan admin: langsung arahkan ke dashboard masing-masing
        router.replace(getDashboardByRole(role))
        return
      }
      setUserRole(role)
      setAlreadyLoggedIn(true)
      setChecking(false)
      return
    }
    setChecking(false)
  }, [router])

  // Tampilkan loading saat mengecek session
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#456882]">
        <div className="text-white text-lg">Memuat...</div>
      </div>
    )
  }

  // Jika admin sudah login: tampilkan pilihan langsung tanpa form
  if (alreadyLoggedIn) {
    return (
      <main
        className="relative min-h-screen flex flex-col items-center justify-start px-4"
        style={{
          backgroundImage: `
             linear-gradient(to left, rgba(69, 104, 130, 0.99), rgba(69, 104, 130, 0.6)),
            url('/assets/img/sawah.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Header Logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-b-[40px] sm:rounded-b-[55px] md:rounded-b-[65px] px-4 sm:px-6 flex items-center justify-center shadow-md w-[50%] sm:w-[30%] md:w-[22%] lg:w-[20%] h-16 sm:h-20 md:h-24">
          <img src="/assets/img/logo.png" alt="Watugate Logo" className="h-[150%] sm:h-[160%] md:h-[170%] object-contain" />
        </div>

        {/* Back Button Desktop */}
        <div className="hidden md:flex w-full justify-start mt-20 pl-16 lg:pl-24">
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
          >
            <HiArrowLeft size={18} color="white" />
            <span>Back</span>
          </button>
        </div>


        {/* Title */}
        {marketName && (
          <p className="text-gray-300 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold italic drop-shadow-lg mt-20 sm:mt-24 md:mt-8 mb-1 sm:mb-2 uppercase tracking-wide">
            {marketName}
          </p>
        )}
        <h1 className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg ${marketName ? 'mt-0' : 'mt-20 sm:mt-24 md:mt-8'} mb-20 sm:mb-24 md:mb-32 lg:mb-40`}>
          PILIH DASHBOARD
        </h1>

        {/* Dashboard Options */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20 max-w-6xl w-full px-4 sm:px-8">
          {/* Dinas Pertanian */}
          <button
            onClick={() => router.push('/dashboard-dinas-pertanian')}
            className="relative bg-red-700 rounded-3xl sm:rounded-4xl shadow-[8px_8px_20px_rgba(0,0,0,0.5)] pt-16 sm:pt-24 md:pt-28 lg:pt-29 pb-6 sm:pb-4 md:pb-2 px-6 sm:px-6 md:px-8 flex flex-col items-center space-y-3 sm:space-y-6 md:space-y-8 w-[85%] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] mx-auto sm:mx-0 hover:brightness-110 transition"
          >
            <img
              src="/assets/img/logofix.png"
              alt="Logo Dinas Pertanian"
              className="absolute -top-12 sm:-top-24 md:-top-32 lg:-top-45 h-28 w-28 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-86 lg:w-86 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
            />
            <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-center leading-snug">
              Dinas Pertanian, Dinas Perdagangan dan Perindustrian, &amp; Dinas Ketahanan Pangan
            </span>

          </button>

          {/* Tim Pengendalian */}
          <button
            onClick={() => router.push('/dashboard-tpid')}
            className="relative bg-yellow-500 rounded-3xl sm:rounded-4xl shadow-[8px_8px_20px_rgba(0,0,0,0.5)] pt-16 sm:pt-24 md:pt-28 lg:pt-30 pb-8 sm:pb-10 md:pb-14 lg:pb-16 px-8 sm:px-12 md:px-20 lg:px-29 flex flex-col items-center space-y-3 sm:space-y-6 md:space-y-8 w-[85%] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] mx-auto sm:mx-0 hover:brightness-110 transition"
          >
            <img
              src="/assets/img/tpid.png"
              alt="Logo Tim Pengendalian"
              className="absolute -top-12 sm:-top-24 md:-top-32 lg:-top-40 h-28 w-28 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-86 lg:w-86 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
            />
            <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-center leading-snug">
              Tim Pengendalian Inflasi Daerah
            </span>

          </button>
        </div>

        {/* Back Button Mobile */}
        <div className="flex md:hidden w-full justify-start mt-8 mb-6 pl-4 sm:pl-8">
          <button
            onClick={() => router.push('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 sm:px-8 py-2 sm:py-2.5 rounded-full shadow-md transition duration-300 flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm"
          >
            <HiArrowLeft size={16} color="white" />
            <span>Back</span>
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-start px-4"
      style={{
        backgroundImage: `
           linear-gradient(to left, rgba(69, 104, 130, 0.99), rgba(69, 104, 130, 0.6)),
          url('/assets/img/sawah.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header Logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-b-[40px] sm:rounded-b-[55px] md:rounded-b-[65px] px-4 sm:px-6 flex items-center justify-center shadow-md w-[50%] sm:w-[30%] md:w-[22%] lg:w-[20%] h-16 sm:h-20 md:h-24">
        <img
          src="/assets/img/logo.png"
          alt="Watugate Logo"
          className="h-[150%] sm:h-[160%] md:h-[170%] object-contain"
        />
      </div>

      {/* Back Button - Desktop only (top) */}
      <div className="hidden md:flex w-full justify-start mt-20 pl-16 lg:pl-24">
        <button
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
        >
          <HiArrowLeft size={18} color="white" />
          <span>Back</span>
        </button>
      </div>

      {/* Title */}
      {marketName && (
        <p className="text-gray-300 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold italic drop-shadow-lg mt-20 sm:mt-24 md:mt-8 lg:mt-10 mb-1 sm:mb-2 uppercase tracking-wide">
          {marketName}
        </p>
      )}
      <h1 className={`text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg ${marketName ? 'mt-0' : 'mt-20 sm:mt-24 md:mt-8 lg:mt-10'} mb-24 sm:mb-28 md:mb-36 lg:mb-44`}>
        LOGIN SEBAGAI
      </h1>

      {/* Login Options */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20 max-w-6xl w-full px-4 sm:px-8">
        {/* Dinas Pertanian */}
        <button
          onClick={() => router.push('/login-dinas-pertanian')}
          className="relative bg-red-700 rounded-3xl sm:rounded-4xl shadow-[8px_8px_20px_rgba(0,0,0,0.5)] pt-16 sm:pt-24 md:pt-28 lg:pt-29 pb-6 sm:pb-4 md:pb-2 px-6 sm:px-6 md:px-8 flex flex-col items-center space-y-3 sm:space-y-6 md:space-y-8 w-[85%] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] mx-auto sm:mx-0 hover:brightness-110 transition"
        >
          <img
            src="/assets/img/logofix.png"
            alt="Logo Dinas Pertanian"
            className="absolute -top-12 sm:-top-24 md:-top-32 lg:-top-45 h-28 w-28 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-86 lg:w-86 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
          />
          <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-center leading-snug">
            Dinas Pertanian, Dinas Perdagangan dan Perindustrian, & Dinas Ketahanan Pangan
          </span>
        </button>

        {/* Tim Pengendalian */}
        <button
          onClick={() => router.push('/login-tim-pengendalian')}
          className="relative bg-yellow-500 rounded-3xl sm:rounded-4xl shadow-[8px_8px_20px_rgba(0,0,0,0.5)] pt-16 sm:pt-24 md:pt-28 lg:pt-30 pb-8 sm:pb-10 md:pb-14 lg:pb-16 px-8 sm:px-12 md:px-20 lg:px-29 flex flex-col items-center space-y-3 sm:space-y-6 md:space-y-8 w-[85%] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] mx-auto sm:mx-0 hover:brightness-110 transition"
        >
          <img
            src="/assets/img/tpid.png"
            alt="Logo Tim Pengendalian"
            className="absolute -top-12 sm:-top-24 md:-top-32 lg:-top-40 h-28 w-28 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-86 lg:w-86 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)]"
          />
          <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-center leading-snug">
            Tim Pengendalian Inflasi Daerah
          </span>
        </button>
      </div>

      {/* Back Button - Mobile only (bottom) */}
      <div className="flex md:hidden w-full justify-start mt-8 mb-6 pl-4 sm:pl-8">
        <button
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 sm:px-8 md:px-12 py-2 sm:py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
        >
          <HiArrowLeft size={16} color="white" />
          <span>Back</span>
        </button>
      </div>
    </main>
  )
}
