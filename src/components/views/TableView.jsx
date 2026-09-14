import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Phone, 
  ChevronDown,
  Building2,
  ExternalLink,
  RotateCw
} from 'lucide-react'
import { exportSitesToExcel } from '../../utils/excelExport'

const STATUS_CONFIG = {
  'On Going': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    dot: 'bg-blue-500'
  },
  'Pending': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    dot: 'bg-amber-500'
  },
  'Approve': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dot: 'bg-emerald-500'
  },
  'Decline': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    dot: 'bg-rose-500'
  }
}

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function TableView({
  sites = [],
  loading = false,
  onOpenAddModal,
  onOpenEditModal,
  onUpdateStatus,
  onDeleteSite,
  onPreviewImage,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updatingId, setUpdatingId] = useState(null)

  // Filter dan pencarian data
  const filteredSites = useMemo(() => {
    return sites.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        item.company_name?.toLowerCase().includes(searchLower) ||
        item.address?.toLowerCase().includes(searchLower) ||
        item.pic_name?.toLowerCase().includes(searchLower) ||
        item.pic_phone?.includes(searchTerm) ||
        item.notes?.toLowerCase().includes(searchLower)

      return matchesStatus && matchesSearch
    })
  }, [sites, searchTerm, statusFilter])

  // Handler ubah status langsung dari baris tabel
  const handleInlineStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    await onUpdateStatus(id, newStatus)
    setUpdatingId(null)
  }

  // Handler Export Excel
  const handleExport = () => {
    exportSitesToExcel(filteredSites, 'Data_Site_Perusahaan')
  }

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Kiri: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari perusahaan, alamat, PIC, nomor..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/50 hover:bg-white transition"
            />
          </div>

          {/* Filter Status */}
          <div className="relative min-w-[150px]">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 hover:bg-white transition font-medium text-slate-700 appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition cursor-pointer"
              title="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Kanan: Tombol Export Excel & Tambahkan Site */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={filteredSites.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
            title="Download data sebagai file Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export ke Excel</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambahkan Site</span>
          </button>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-20">Foto</th>
                <th className="py-3.5 px-4 min-w-[200px]">Perusahaan & Alamat</th>
                <th className="py-3.5 px-4 min-w-[170px]">PIC & Kontak</th>
                <th className="py-3.5 px-4 min-w-[160px]">Status (Ubah Cepat)</th>
                <th className="py-3.5 px-4 min-w-[200px]">Keterangan</th>
                <th className="py-3.5 px-4 w-24 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && sites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="inline-block w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <div>Memuat data database...</div>
                  </td>
                </tr>
              ) : filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-600">Tidak ada data ditemukan</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {searchTerm || statusFilter !== 'ALL'
                        ? 'Coba ubah kata kunci pencarian atau filter status Anda'
                        : 'Klik tombol "Tambahkan Site" untuk membuat data pertama'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSites.map((site, index) => {
                  const statusStyle = STATUS_CONFIG[site.status] || STATUS_CONFIG['Pending']

                  return (
                    <tr 
                      key={site.id} 
                      className="hover:bg-slate-50/70 transition duration-150 group"
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                        {index + 1}
                      </td>

                      {/* Foto */}
                      <td className="py-3.5 px-4">
                        {site.image_url ? (
                          <div 
                            onClick={() => onPreviewImage(site.image_url, site.company_name)}
                            className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group-hover:border-blue-400 transition shadow-2xs relative bg-slate-100 flex items-center justify-center"
                            title="Klik untuk melihat foto penuh"
                          >
                            <img
                              src={site.image_url}
                              alt={site.company_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                              <ImageIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Perusahaan & Alamat */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {site.company_name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {site.address}
                        </div>
                      </td>

                      {/* PIC & Kontak */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <span>{site.pic_name}</span>
                        </div>
                        <div className="mt-1">
                          <a
                            href={`https://wa.me/${site.pic_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            title="Chat via WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{site.pic_phone}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        </div>
                      </td>

                      {/* Status (Dropdown Ubah Cepat Langsung di Baris Tabel) */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={site.status}
                            disabled={updatingId === site.id}
                            onChange={(e) => handleInlineStatusChange(site.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border appearance-none pr-7 cursor-pointer outline-none transition ${statusStyle.bg} ${
                              updatingId === site.id ? 'opacity-50' : ''
                            }`}
                            title="Klik untuk langsung mengubah status"
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st} className="bg-white text-slate-800 font-medium">
                                {st}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-2 top-2.5 text-current opacity-70">
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </div>
                      </td>

                      {/* Keterangan */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {site.notes || '-'}
                        </p>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenEditModal(site)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSite(site.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-700">{filteredSites.length}</span> dari{' '}
            <span className="font-semibold text-slate-700">{sites.length}</span> total site
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> On Going
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Approve
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Decline
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}

