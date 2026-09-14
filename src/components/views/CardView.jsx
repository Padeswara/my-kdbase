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
  MapPin, 
  User,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { exportSitesToExcel } from '../../utils/excelExport'

const STATUS_CONFIG = {
  'On Going': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    border: 'border-l-blue-500'
  },
  'Pending': {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    border: 'border-l-amber-500'
  },
  'Approve': {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    border: 'border-l-emerald-500'
  },
  'Decline': {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    border: 'border-l-rose-500'
  }
}

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function CardView({
  sites = [],
  loading = false,
  onOpenAddModal,
  onOpenEditModal,
  onUpdateStatus,
  onDeleteSite,
  onPreviewImage
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

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

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari perusahaan, alamat, PIC..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/50 hover:bg-white transition"
            />
          </div>

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
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportSitesToExcel(filteredSites)}
            disabled={filteredSites.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
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

      {/* Grid of Cards */}
      {filteredSites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <div className="text-base font-semibold text-slate-700">Tidak ada data site</div>
          <div className="text-xs text-slate-400 mt-1">
            Data tidak ditemukan atau belum ada site yang ditambahkan.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSites.map((site) => {
            const config = STATUS_CONFIG[site.status] || STATUS_CONFIG['Pending']

            return (
              <div
                key={site.id}
                className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col border-l-4 ${config.border}`}
              >
                {/* Image Header */}
                <div 
                  className="h-40 w-full bg-slate-100 relative cursor-pointer group overflow-hidden"
                  onClick={() => site.image_url && onPreviewImage(site.image_url, site.company_name)}
                >
                  {site.image_url ? (
                    <img
                      src={site.image_url}
                      alt={site.company_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  
                  {/* Status Dropdown on top of card */}
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={site.status}
                      onChange={(e) => onUpdateStatus(site.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-xs appearance-none pr-6 cursor-pointer ${config.badge}`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-white text-slate-800">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {site.company_name}
                    </h3>

                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{site.address}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Nama PIC</div>
                        <div className="font-semibold text-slate-800 truncate">{site.pic_name}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-semibold">Kontak PIC</div>
                        <a
                          href={`https://wa.me/${site.pic_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{site.pic_phone}</span>
                        </a>
                      </div>
                    </div>

                    {site.notes && (
                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed">
                        {site.notes}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {site.created_at ? new Date(site.created_at).toLocaleDateString('id-ID') : '-'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditModal(site)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSite(site.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

