import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

// Session berlaku 2 jam (dalam detik)
export const SESSION_MAX_AGE = 7200 // 2 jam

// Roles yang diarahkan ke dashboard dinas pertanian
export const DINAS_ROLES = ['admin', 'dinas_pertanian', 'dinas_perdagangan', 'dinas_ketahanan_pangan']

// Roles yang diarahkan ke dashboard TPID
export const TPID_ROLES = ['admin', 'tpid']

/**
 * Mendapatkan dashboard URL berdasarkan role user
 */
export function getDashboardByRole(role: string): string {
  if (TPID_ROLES.includes(role) && !DINAS_ROLES.includes(role)) {
    // Hanya tpid (bukan admin) -> dashboard tpid
    return '/dashboard-tpid'
  }
  if (DINAS_ROLES.includes(role)) {
    // admin, dinas_pertanian, dinas_perdagangan, dinas_ketahanan_pangan -> dashboard dinas
    return '/dashboard-dinas-pertanian'
  }
  // Default fallback
  return '/dashboard-tim-pengendalian'
}

/**
 * Cek apakah session masih valid (belum expired)
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false

  const token = localStorage.getItem('auth_token')
  const loginTime = localStorage.getItem('login_time')

  if (!token || !loginTime) return false

  const elapsed = (Date.now() - parseInt(loginTime, 10)) / 1000
  if (elapsed > SESSION_MAX_AGE) {
    // Session sudah expired, hapus semua data
    clearAllStorage()
    return false
  }

  return true
}

/**
 * Mendapatkan role user dari localStorage
 */
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user_role')
}

/**
 * Menyimpan data session login
 */
export function saveSession(token: string, role: string) {
  // Simpan ke localStorage
  localStorage.setItem('auth_token', token)
  localStorage.setItem('user_role', role)
  localStorage.setItem('login_time', Date.now().toString())

  // Simpan ke cookie agar middleware bisa membaca (server-side protection)
  document.cookie = `auth_token=${token}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`
  document.cookie = `user_role=${role}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`

  console.log('[Auth] Session tersimpan (token + role + timestamp)')
}

/**
 * Menghapus semua data autentikasi dari localStorage, sessionStorage, dan cookie
 * (selectedMarket dipertahankan karena dipilih sebelum login)
 */
export function clearAllStorage() {
  // Hapus hanya auth-related items dari localStorage (bukan selectedMarket)
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_role')
  localStorage.removeItem('login_time')

  // Hapus semua sessionStorage
  sessionStorage.clear()

  // Hapus semua cookie auth
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
  document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax'

  console.log('[Auth] Data autentikasi dihapus')
}

/**
 * Menghapus semua data autentikasi dan redirect ke halaman awal
 */
export async function logout(router: AppRouterInstance) {
  const token = localStorage.getItem('auth_token')
  if (token) {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
    } catch (error) {
      console.error('[Auth] Error calling logout API:', error)
    }
  }

  clearAllStorage()
  console.log('[Auth] Logout berhasil')
  router.push('/')
}
