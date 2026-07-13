"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HiMenu, HiX, HiLogout, HiChevronDown, HiSwitchHorizontal } from 'react-icons/hi'
import { logout, isSessionValid, clearAllStorage, getUserRole } from '@/lib/auth'

interface UserData {
  name: string
  email: string
  role: string
}

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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
    <header className="relative z-20 flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8 h-20 sm:h-24 mx-auto">
      {/* Logo Kiri */}
      <div className="flex items-center ml-2 sm:ml-4 md:ml-8 translate-y-2">
        <img
          src="/assets/img/logo.png"
          alt="Watugate Logo"
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
        />
      </div>

      {/* Desktop Nav - Rounded Gradient Background */}
      <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#456882] to-[#a5bfcc] rounded-b-[65px] shadow-md w-[40%] lg:w-[30%] h-[110%] items-center justify-center z-0">
        <nav className="bg-white/90 backdrop-blur-sm rounded-full w-[80%] h-[50%] shadow flex justify-evenly items-center text-gray-400 font-light text-sm lg:text-base">
          <button onClick={() => router.push('/')} className="hover:text-gray-900 transition-colors">Beranda</button>
          <button onClick={() => router.push('/tentang-kami')} className="hover:text-gray-900 transition-colors">Tentang Kami</button>
          <button onClick={() => router.push('/faq')} className="hover:text-gray-900 transition-colors">FAQ</button>
        </nav>
      </div>

      {/* User Avatar + Dropdown (desktop) - hanya tampil jika login */}
      {isLoggedIn ? (
        <div className="hidden md:flex items-center mr-4 md:mr-8 translate-y-2" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 group cursor-pointer select-none"
            >
              <div className="w-10 h-10 bg-[#456882] text-white rounded-full flex items-center justify-center text-base font-bold shadow">
                {initials}
              </div>
              <span className="font-medium text-gray-700 max-w-[120px] truncate">{displayName}</span>
              <HiChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                </div>
                {/* Ganti Dashboard - hanya tampil untuk role admin */}
                {isLoggedIn && (getUserRole() === 'admin' || user?.role === 'admin') && (
                  <button
                    onClick={() => { setDropdownOpen(false); router.push('/login-sebagai') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#456882] hover:bg-[#eef4f7] transition-colors"
                  >
                    <HiSwitchHorizontal size={16} />
                    Ganti Dashboard
                  </button>
                )}
                <button
                  onClick={() => { setDropdownOpen(false); logout(router) }}
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
        <div className="hidden md:flex items-center mr-4 md:mr-8 translate-y-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Hamburger Button (mobile) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden z-30 p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700"
        aria-label="Toggle menu"
      >
        {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-0 right-0 w-[70%] max-w-xs h-full bg-white shadow-2xl p-6 pt-20 flex flex-col gap-2 animate-in slide-in-from-right"
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
            <button onClick={() => { router.push('/'); setMenuOpen(false) }} className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors">Beranda</button>
            <button onClick={() => { router.push('/tentang-kami'); setMenuOpen(false) }} className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors">Tentang Kami</button>
            <button onClick={() => { router.push('/faq'); setMenuOpen(false) }} className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-[#eef4f7] transition-colors">FAQ</button>

            {/* Logout di Mobile Menu - hanya tampil jika login */}
            {isLoggedIn && (
              <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-1">
                {/* Ganti Dashboard - hanya tampil untuk role admin */}
                {isLoggedIn && (getUserRole() === 'admin' || user?.role === 'admin') && (
                  <button
                    onClick={() => { setMenuOpen(false); router.push('/login-sebagai') }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#456882] font-medium hover:bg-[#eef4f7] transition-colors"
                  >
                    <HiSwitchHorizontal size={18} />
                    Ganti Dashboard
                  </button>
                )}
                <button
                  onClick={() => { setMenuOpen(false); logout(router) }}
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
      `}</style>
    </header>
  )
}
