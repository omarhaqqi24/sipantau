"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HiMenu, HiX, HiLogout, HiChevronDown } from 'react-icons/hi'
import { MdHistory } from 'react-icons/md'
import { logout, isSessionValid, clearAllStorage } from '@/lib/auth'
import ActivityLogModal from '@/components/ActivityLogModal'

interface UserData {
  name: string
  email: string
  role: string
}

export default function LandingPage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activityLogOpen, setActivityLogOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cek session validity saat mount
  useEffect(() => {
    if (isSessionValid()) {
      setIsLoggedIn(true)
    } else {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (token) {
        clearAllStorage()
      }
      setIsLoggedIn(false)
    }
  }, [])

  // Fetch user dari /api/me (hanya jika sudah login)
  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(async data => {
        if (data && (data.name || data.email)) {
          // Fallback role check for admin without modifying backend
          try {
            const adminCheck = await fetch('/api/activities/summary')
            if (adminCheck.ok) {
              data.role = 'admin'
            }
          } catch (e) {}

          setUser(data)
          if (data.role) {
            localStorage.setItem('user_role', data.role)
          }
        }
      })
      .catch(() => {})
  }, [isLoggedIn])

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = user?.name || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#456882] to-[#a5bfcc] relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#456882]/10 to-[#a5bfcc]/30 z-10"></div>

      {/* Right side with Vegetable Image (Full Height) */}
      <div className="absolute top-0 right-0 w-full sm:w-[50%] md:w-[40%] h-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 sm:opacity-100"
          style={{
            backgroundImage: `url('/assets/img/landing.jpg')`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-4 sm:px-8 md:px-16 py-4 sm:py-6 mt-2 sm:mt-4 h-16 sm:h-20">
        {/* Logo di kiri */}
        <div className="flex items-center">
          <img
            src="/assets/img/logo.png"
            alt="Watugate Logo"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
          />
        </div>

        {/* Nav di tengah - Desktop only */}
        <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 lg:px-12 py-2 lg:py-3">
          <div className="flex space-x-6 lg:space-x-16 text-gray-600 text-sm lg:text-base">
            <button
              onClick={() => router.push('/')}
              className="hover:text-gray-900 transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => router.push('/tentang-kami')}
              className="hover:text-gray-900 transition-colors"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => router.push('/faq')}
              className="hover:text-gray-900 transition-colors"
            >
              FAQ
            </button>
          </div>
        </nav>

        {/* User Avatar + Dropdown (desktop) - tampil jika login */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 group cursor-pointer select-none"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-base font-bold shadow border border-white/30">
                  {initials}
                </div>
                <span className="font-medium text-white max-w-[120px] truncate drop-shadow-sm">{displayName}</span>
                <HiChevronDown
                  size={16}
                  className={`text-white/80 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(router); setIsLoggedIn(false); setUser(null); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <HiLogout size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full items-center justify-center">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full"></div>
          </div>
        )}

        {/* Hamburger Button - Mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors z-30"
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-0 right-0 w-[70%] max-w-xs h-full bg-white shadow-2xl p-6 pt-20 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info - hanya tampil jika login */}
            {isLoggedIn ? (
              <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-[#456882] text-white rounded-full flex items-center justify-center text-base font-bold shadow">
                  {initials}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[150px]">{user?.email || ''}</p>
                </div>
              </div>
            ) : (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500">Belum login</p>
              </div>
            )}

            {/* Nav Items */}
            <button
              onClick={() => { router.push('/'); setMenuOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => { router.push('/tentang-kami'); setMenuOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => { router.push('/faq'); setMenuOpen(false) }}
              className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors"
            >
              FAQ
            </button>

            {/* Logout di Mobile Menu - hanya tampil jika login */}
            {isLoggedIn && (
              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={() => { setMenuOpen(false); logout(router); setIsLoggedIn(false); setUser(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  <HiLogout size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex">
        {/* Left content */}
        <div className="flex-1 px-6 sm:px-10 md:px-16 py-10 sm:py-14 md:py-20">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-3 sm:mb-4 md:mb-6">SIPANTAU</h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 md:mb-4">
            Sistem Informasi Prediksi dan Pantauan Komoditas
          </p>
          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6">
            Kabupaten Sukabumi
          </p>
          <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg italic mb-6 sm:mb-8 md:mb-12">
            #PrediksiHargaHariEsok,IntervensiLebihCepat
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => router.push('/dashboard-tim-pengendalian')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 sm:px-10 md:px-14 py-2.5 sm:py-3 rounded-full text-sm sm:text-base md:text-lg transition transform hover:scale-105 shadow-2xl"
            >
              Mulai
            </button>

            {/* Log Aktivitas Button - tampil jika sudah login sebagai admin */}
            {isLoggedIn && (typeof window !== 'undefined' && localStorage.getItem('user_role') === 'admin' || user?.role === 'admin') && (
              <button
                onClick={() => setActivityLogOpen(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base transition transform hover:scale-105 shadow-xl border border-white/30"
              >
                <MdHistory size={18} />
                Log Aktivitas
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={activityLogOpen}
        onClose={() => setActivityLogOpen(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
      `}</style>
    </div>
  )
}
