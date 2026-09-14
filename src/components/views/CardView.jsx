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
  Calendar,
  RotateCw,
  Table,
  LayoutGrid
} from 'lucide-react'
import { exportSitesToExcel } from '../../utils/excelExport'
import { StatusDropdown } from '../StatusDropdown'
import { ViewSwitcher } from '../ViewSwitcher'

const STATUS_CONFIG = {
  'On Going': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-l-blue-500'
  },
  'Pending': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-l-amber-500'
  },
  'Approve': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-l-emerald-500'
  },
  'Decline': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-l-rose-500'
  }
}

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function CardView({
  sites = [],
  loading = false,
  currentView = 'card',
  onViewChange,
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
  const [openDropdownId, setOpenDropdownId] = useState(null)

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

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    await onUpdateStatus(id, newStatus)
    setUpdatingId(null)
  }

  return (
    <div className="space-y-4">
      
      {/* Main Action Buttons & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 m-0 tracking-tight">Site List</h2>
          <p className="text-xs text-slate-400 m-0">Manage and monitor all site locations</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* View Switcher: Segmented on Desktop, Dropdown on Mobile (Positioned Left of Export to Excel) */}
          <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

          {/* Export to Excel */}
          <button
            onClick={() => exportSitesToExcel(filteredSites, 'Site_Data')}
            disabled={filteredSites.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50 shadow-2xs active:scale-98"
            title="Download Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Export to Excel</span>
          </button>

          {/* Add Site Button */}
          <button
            onClick={onOpenAddModal}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition duration-200 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Box */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, address, PIC, phone number..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900"
          />
        </div>

        {/* Status Filter & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-44">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
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
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition cursor-pointer shrink-0"
              title="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Compact Cards */}
      {filteredSites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 shadow-xs">
          <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-bold text-slate-700">No site data found</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Try adjusting your search filters or click "Add Site".
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredSites.map((site) => {
            const config = STATUS_CONFIG[site.status] || STATUS_CONFIG['Pending']
            const isDropdownOpen = openDropdownId === site.id

            return (
              <div
                key={site.id}
                className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex flex-col border-l-4 ${config.border} relative ${
                  isDropdownOpen ? 'z-40' : 'z-10'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-28 bg-slate-100 rounded-tr-xl overflow-hidden">
                  {site.image_url ? (
                    <img
                      src={site.image_url}
                      alt={site.company_name}
                      onClick={() => onPreviewImage(site.image_url, site.company_name)}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Floating Status Dropdown (Outside photo overflow) */}
                <div className="absolute top-2.5 right-2.5 z-30">
                  <StatusDropdown
                    currentStatus={site.status}
                    disabled={updatingId === site.id}
                    onChange={(newStatus) => handleStatusChange(site.id, newStatus)}
                    onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? site.id : null)}
                    size="sm"
                  />
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1.5">
                    
                    {/* Company Name */}
                    <div className="font-black text-slate-900 text-sm leading-tight line-clamp-1">
                      {site.company_name}
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-1 text-[11px] text-slate-500 leading-snug">
                      <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{site.address}</span>
                    </div>

                    {/* PIC & WhatsApp Contact */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">PIC</span>
                        <span className="font-bold text-slate-800 truncate block text-xs">
                          {site.pic_name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Contact</span>
                        <a
                          href={`https://wa.me/${site.pic_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-800 hover:text-black font-bold hover:underline"
                        >
                          <Phone className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{site.pic_phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {site.notes && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                        {site.notes}
                      </p>
                    )}

                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {site.created_at ? new Date(site.created_at).toLocaleDateString('en-US') : '-'}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onOpenEditModal(site)}
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Edit Data"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSite(site.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete Data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Card View Summary Footer (No text labels on mobile, only dots) */}
      <div className="bg-white p-3 sm:px-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredSites.length}</span> of{' '}
          <span className="font-bold text-slate-800">{sites.length}</span> sites
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium" title="On Going">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="hidden sm:inline">On Going</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium" title="Pending">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="hidden sm:inline">Pending</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium" title="Approve">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="hidden sm:inline">Approve</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium" title="Decline">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="hidden sm:inline">Decline</span>
          </span>
        </div>
      </div>

    </div>
  )
}
