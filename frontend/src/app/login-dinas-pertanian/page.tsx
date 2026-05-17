"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiArrowLeft } from 'react-icons/hi'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { saveSession, getDashboardByRole } from '@/lib/auth'

export default function LoginDinasPertanian() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [popup, setPopup] = useState<{ type: 'success' | 'error'; message: string; errorType?: 'credentials' | 'network' | 'timeout' | 'server' } | null>(null)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid.'
    }
    if (!password.trim()) {
      newErrors.password = 'Password wajib diisi.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return

    setIsLoading(true)
    setPopup(null)

    try {
      const url = `/api/login`
      console.log('[Login] Mengirim request ke:', url)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      const data = await response.json()
      console.log('[Login] Response status:', response.status)
      console.log('[Login] Response data:', data)

      if (response.ok && data.success) {
        const token = data?.data?.token || data?.token
        if (token) {
          // Fetch user info untuk mendapatkan role
          let role = 'dinas_pertanian' // default role untuk halaman ini
          try {
            const meRes = await fetch('/api/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            const meData = await meRes.json()
            if (meData?.role) role = meData.role
          } catch {
            console.warn('[Login] Gagal fetch role, menggunakan default')
          }

          // Simpan session dengan token, role, dan timestamp
          saveSession(token, role)
          console.log('[Login] Session tersimpan dengan role:', role)

          setPopup({ type: 'success', message: 'Login berhasil! Anda akan diarahkan ke dashboard.' })
          setTimeout(() => {
            router.push(getDashboardByRole(role))
          }, 800)
        }
      } else {
        // Cek apakah error dari server (koneksi/timeout) atau credentials salah
        const errorType = data.errorType as string | undefined
        if (errorType === 'network' || errorType === 'timeout' || response.status === 503 || response.status === 504) {
          const msg = data.message || 'Gagal terhubung ke server. Periksa koneksi Anda.'
          console.warn('[Login] Koneksi gagal:', msg)
          setPopup({ type: 'error', message: msg, errorType: errorType === 'timeout' ? 'timeout' : 'network' })
        } else {
          // 401 atau response error lain = credentials salah
          const msg = data.message || data.error || 'Email atau password salah. Periksa kembali dan coba lagi.'
          console.warn('[Login] Credentials salah:', msg)
          setPopup({ type: 'error', message: msg, errorType: 'credentials' })
        }
      }
    } catch (err: unknown) {
      console.error('[Login] Error:', err)
      const error = err as Error
      if (error?.name === 'AbortError') {
        setPopup({ type: 'error', message: 'Koneksi timeout. Server tidak merespons dalam 15 detik. Coba lagi.', errorType: 'timeout' })
      } else {
        setPopup({ type: 'error', message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.', errorType: 'network' })
      }

    } finally {
      setIsLoading(false)
    }
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
      {/* Popup Notifikasi */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className={`bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm text-center flex flex-col items-center gap-4 animate-fadeIn`}>
            {popup.type === 'success' ? (
              <HiCheckCircle className="text-green-500" size={56} />
            ) : popup.errorType === 'credentials' ? (
              // Icon kunci untuk error credentials
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-orange-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            ) : (
              // Icon sinyal untuk error jaringan
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-red-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
                  <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                  <line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
              </div>
            )}
            <p className={`text-base sm:text-lg font-semibold ${
              popup.type === 'success' 
                ? 'text-green-700' 
                : popup.errorType === 'credentials' 
                  ? 'text-orange-600' 
                  : 'text-red-700'
            }`}>
              {popup.type === 'success' 
                ? 'Login Berhasil!' 
                : popup.errorType === 'credentials' 
                  ? 'Email / Password Salah'
                  : popup.errorType === 'timeout'
                    ? 'Koneksi Timeout'
                    : 'Gagal Terhubung'}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">{popup.message}</p>
            {popup.type === 'error' && (
              <button
                onClick={() => setPopup(null)}
                className={`mt-2 text-white font-semibold px-6 py-2 rounded-full transition text-sm ${
                  popup.errorType === 'credentials'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-b-[40px] sm:rounded-b-[55px] md:rounded-b-[65px] px-4 sm:px-6 flex items-center justify-center shadow-md w-[50%] sm:w-[30%] md:w-[20%] lg:w-[15%] xl:w-[12%] h-16 sm:h-20 md:h-24 transition-all duration-300">
        <img
          src="/assets/img/logo.png"
          alt="Watugate Logo"
          className="h-[150%] sm:h-[160%] md:h-[170%] object-contain"
        />
      </div>

      {/* Back Button - Desktop only (top) */}
      <div className="hidden md:flex w-full justify-start mt-20 pl-16 lg:pl-24">
        <button
          onClick={() => router.push('/login-sebagai')}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 md:px-12 py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
        >
          <HiArrowLeft size={18} color="white" />
          <span>Back</span>
        </button>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 lg:p-10 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[55%] mx-auto mt-20 sm:mt-24 md:mt-12 lg:mt-16 relative z-10 transition-all duration-300">
        <h2 className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8 text-gray-800">
          Silahkan Masukkan Email dan Password Anda
        </h2>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-md focus:ring-2 outline-none text-gray-700 transition text-sm sm:text-base ${
                errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-md focus:ring-2 outline-none text-gray-700 transition text-sm sm:text-base ${
                errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full sm:w-[50%] md:w-[30%] bg-yellow-500 text-white py-2.5 sm:py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors shadow-md text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Memproses...
                </>
              ) : 'Masuk'}
            </button>
          </div>
        </div>
      </div>

      {/* Red background bawah */}
      <div className="bg-red-700 h-8 sm:h-10 md:h-12 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[55%] mx-auto rounded-b-2xl sm:rounded-b-3xl relative -mt-4 z-0 transition-all duration-300"></div>

      {/* Back Button - Mobile only (bottom) */}
      <div className="flex md:hidden w-full justify-start mt-6 mb-6 pl-4 sm:pl-8">
        <button
          onClick={() => router.push('/login-sebagai')}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 sm:px-8 md:px-12 py-2 sm:py-2.5 md:py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm md:text-base"
        >
          <HiArrowLeft size={16} color="white" />
          <span>Back</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </main>
  )
}
