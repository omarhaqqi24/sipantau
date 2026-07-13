"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { HiX, HiRefresh, HiFilter, HiClock, HiUser, HiChevronLeft, HiChevronRight, HiDownload, HiSwitchVertical } from 'react-icons/hi'
import { MdHistory, MdArrowUpward, MdArrowDownward } from 'react-icons/md'
import DatePicker, { registerLocale } from 'react-datepicker'
import { id } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('id', id)

interface ActivityUser {
  id: number
  nama: string
  role: string
}

interface Activity {
  id: number
  user: ActivityUser
  activity: string
  time: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ActivitySummary {
  total: {
    activity: number
    user_login: number
  }
  today: {
    activity: number
    user_login: {
      total: number
      users: Array<{ id: number; name: string; login_count: number }>
    }
  }
}

interface ActivityLogModalProps {
  isOpen: boolean
  onClose: () => void
}

const ACTIVITY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  login: { label: 'Login', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  logout: { label: 'Logout', color: 'text-rose-700', bg: 'bg-rose-100' },
  create_ketersediaan_harian: { label: 'Input Ketersediaan', color: 'text-blue-700', bg: 'bg-blue-100' },
  create_panen: { label: 'Input Panen', color: 'text-amber-700', bg: 'bg-amber-100' },
  create_harga_pasar: { label: 'Input Harga Pasar', color: 'text-violet-700', bg: 'bg-violet-100' },
  create_harga_petani: { label: 'Input Harga Petani', color: 'text-cyan-700', bg: 'bg-cyan-100' },
}

function getActivityBadge(activity: string) {
  const found = ACTIVITY_LABELS[activity]
  if (found) return found
  return { label: activity, color: 'text-gray-700', bg: 'bg-gray-100' }
}

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
  } catch {
    return dateStr
  }
}

type FilterMode = 'all' | 'period'
type SortKey = 'user' | 'activity' | 'time'
type SortDir = 'asc' | 'desc'

export default function ActivityLogModal({ isOpen, onClose }: ActivityLogModalProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [activities, setActivities] = useState<Activity[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [summary, setSummary] = useState<ActivitySummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Active tab
  const [activeTab, setActiveTab] = useState<'log' | 'summary'>('log')

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('time')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toYMD = (d: Date) => d.toISOString().slice(0, 10)

  const fetchActivities = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      let url = ''
      if (filterMode === 'period' && startDate && endDate) {
        url = `/api/activities/period?start_date=${toYMD(startDate)}&end_date=${toYMD(endDate)}&page=${page}`
      } else {
        url = `/api/activities?page=${page}`
      }
      const res = await fetch(url)
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Gagal mengambil data')
      }
      const json = await res.json()
      // Support both paginated and non-paginated response
      const items = json.data?.data || json.data || []
      setActivities(Array.isArray(items) ? items : [])
      if (json.data?.meta || json.data?.current_page) {
        const rawMeta = json.data?.meta || {
          current_page: json.data.current_page,
          last_page: json.data.last_page,
          per_page: json.data.per_page,
          total: json.data.total,
        }
        setMeta(rawMeta)
      } else {
        setMeta(null)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }, [filterMode, startDate, endDate])

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/activities/summary')
      if (!res.ok) return
      const json = await res.json()
      setSummary(json.data || null)
    } catch {
      // silent fail for summary
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchActivities(1)
      fetchSummary()
      setCurrentPage(1)
    }
  }, [isOpen, fetchActivities, fetchSummary])

  const handleApplyFilter = () => {
    setCurrentPage(1)
    fetchActivities(1)
  }

  const handleResetFilter = () => {
    setFilterMode('all')
    setStartDate(null)
    setEndDate(null)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchActivities(page)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      let valA = ''
      let valB = ''
      if (sortKey === 'user') {
        valA = a.user?.nama?.toLowerCase() ?? ''
        valB = b.user?.nama?.toLowerCase() ?? ''
      } else if (sortKey === 'activity') {
        valA = a.activity?.toLowerCase() ?? ''
        valB = b.activity?.toLowerCase() ?? ''
      } else {
        valA = a.time ?? ''
        valB = b.time ?? ''
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [activities, sortKey, sortDir])

  if (!isOpen) return null

  const totalPages = meta?.last_page || 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#456882] to-[#6b9ab5] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <MdHistory size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Log Aktivitas</h2>
              <p className="text-white/70 text-xs">Riwayat seluruh aktivitas pengguna sistem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
          >
            <HiX size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'log'
                ? 'text-[#456882] border-b-2 border-[#456882] bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <HiClock size={15} />
              Daftar Log
            </span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-[#456882] border-b-2 border-[#456882] bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <HiUser size={15} />
              Ringkasan
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'log' ? (
            <div className="p-5 flex flex-col gap-4">
              {/* Filter Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <HiFilter size={16} className="text-[#456882]" />
                  <span className="text-sm font-semibold text-gray-700">Filter</span>
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                  {/* Mode selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 font-medium">Mode:</label>
                    <select
                      value={filterMode}
                      onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#456882]/40 focus:border-[#456882]"
                    >
                      <option value="all">Semua</option>
                      <option value="period">Periode</option>
                    </select>
                  </div>

                  {/* Date range - hanya tampil jika mode period */}
                  {filterMode === 'period' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Dari Tanggal</label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          maxDate={endDate ?? new Date()}
                          dateFormat="dd/MM/yyyy"
                          locale="id"
                          placeholderText="Pilih tanggal"
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#456882]/40 focus:border-[#456882] w-36 cursor-pointer"
                          popperClassName="z-[200]"
                          popperPlacement="bottom-start"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Sampai Tanggal</label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate ?? undefined}
                          maxDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                          locale="id"
                          placeholderText="Pilih tanggal"
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#456882]/40 focus:border-[#456882] w-36 cursor-pointer"
                          popperClassName="z-[200]"
                          popperPlacement="bottom-start"
                        />
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-end gap-2 ml-auto">
                    <button
                      onClick={handleResetFilter}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <HiRefresh size={14} />
                      Reset
                    </button>
                    <button
                      onClick={handleApplyFilter}
                      disabled={filterMode === 'period' && (!startDate || !endDate)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-white bg-[#456882] hover:bg-[#3a5970] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiFilter size={14} />
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Meta info */}
              {meta && (
                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                  <span>
                    Total <strong className="text-gray-700">{meta.total}</strong> aktivitas
                    {filterMode === 'period' && startDate && endDate && (
                      <span className="ml-1">
                        ({startDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} — {endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })})
                      </span>
                    )}
                  </span>
                  <span>Halaman {meta.current_page} / {meta.last_page}</span>
                </div>
              )}

              {/* Table */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-3 border-[#456882] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Memuat data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <HiX size={22} className="text-red-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">{error}</p>
                  <button
                    onClick={() => fetchActivities(currentPage)}
                    className="text-sm text-[#456882] underline"
                  >
                    Coba lagi
                  </button>
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                    <MdHistory size={22} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">Tidak ada data aktivitas</p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <button
                            onClick={() => handleSort('user')}
                            className="flex items-center gap-1 hover:text-[#456882] transition-colors group"
                          >
                            Pengguna
                            <span className="text-gray-300 group-hover:text-[#456882]">
                              {sortKey === 'user'
                                ? (sortDir === 'asc' ? <MdArrowUpward size={13} className="text-[#456882]" /> : <MdArrowDownward size={13} className="text-[#456882]" />)
                                : <HiSwitchVertical size={13} />}
                            </span>
                          </button>
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <button
                            onClick={() => handleSort('activity')}
                            className="flex items-center gap-1 hover:text-[#456882] transition-colors group"
                          >
                            Aktivitas
                            <span className="text-gray-300 group-hover:text-[#456882]">
                              {sortKey === 'activity'
                                ? (sortDir === 'asc' ? <MdArrowUpward size={13} className="text-[#456882]" /> : <MdArrowDownward size={13} className="text-[#456882]" />)
                                : <HiSwitchVertical size={13} />}
                            </span>
                          </button>
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <button
                            onClick={() => handleSort('time')}
                            className="flex items-center gap-1 hover:text-[#456882] transition-colors group"
                          >
                            Waktu
                            <span className="text-gray-300 group-hover:text-[#456882]">
                              {sortKey === 'time'
                                ? (sortDir === 'asc' ? <MdArrowUpward size={13} className="text-[#456882]" /> : <MdArrowDownward size={13} className="text-[#456882]" />)
                                : <HiSwitchVertical size={13} />}
                            </span>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sortedActivities.map((act, idx) => {
                        const badge = getActivityBadge(act.activity)
                        const rowNum = meta
                          ? (currentPage - 1) * (meta.per_page || 20) + idx + 1
                          : idx + 1
                        return (
                          <tr key={act.id} className="hover:bg-blue-50/40 transition-colors">
                            <td className="px-4 py-3 text-xs text-gray-400">{rowNum}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#456882]/10 rounded-full flex items-center justify-center text-[#456882] font-bold text-xs">
                                  {act.user?.nama?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-medium text-gray-800">{act.user?.nama || '-'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-500 capitalize">{act.user?.role || '-'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                              {formatDateTime(act.time)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <HiChevronLeft size={16} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page: number
                    if (totalPages <= 7) {
                      page = i + 1
                    } else if (currentPage <= 4) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i
                    } else {
                      page = currentPage - 3 + i
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-[#456882] text-white font-semibold'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <HiChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Summary Tab */
            <div className="p-5 flex flex-col gap-4">
              {summary ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-[#456882] to-[#6b9ab5] rounded-xl p-4 text-white">
                      <p className="text-xs text-white/70 mb-1">Total Aktivitas</p>
                      <p className="text-3xl font-bold">{summary.total.activity}</p>
                      <p className="text-xs text-white/60 mt-1">Sepanjang waktu</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                      <p className="text-xs text-white/70 mb-1">Total User Login</p>
                      <p className="text-3xl font-bold">{summary.total.user_login}</p>
                      <p className="text-xs text-white/60 mt-1">Pengguna unik</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                      <p className="text-xs text-white/70 mb-1">Aktivitas Hari Ini</p>
                      <p className="text-3xl font-bold">{summary.today.activity}</p>
                      <p className="text-xs text-white/60 mt-1">Sejak midnight</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-white">
                      <p className="text-xs text-white/70 mb-1">Login Hari Ini</p>
                      <p className="text-3xl font-bold">{summary.today.user_login.total}</p>
                      <p className="text-xs text-white/60 mt-1">Pengguna aktif</p>
                    </div>
                  </div>

                  {/* Today's Login Users */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <HiUser size={15} className="text-[#456882]" />
                      Pengguna Login Hari Ini
                    </h3>
                    {summary.today.user_login.users.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">Belum ada login hari ini</p>
                    ) : (
                      <div className="space-y-2">
                        {summary.today.user_login.users.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-100 hover:border-[#456882]/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#456882]/10 rounded-full flex items-center justify-center text-[#456882] font-bold text-sm">
                                {u.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{u.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500">{u.login_count}x login</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-3 border-[#456882] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Memuat ringkasan...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <HiDownload size={12} />
            Data hanya dapat diakses oleh Admin
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn { animation: modalIn 0.2s ease-out; }
        .border-3 { border-width: 3px; }
      `}</style>
    </div>
  )
}
