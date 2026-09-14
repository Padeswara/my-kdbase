import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  FileSpreadsheet, 
  Search, 
  X,
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Phone, 
  MapPin, 
  Calendar,
  Building2,
  RotateCw,
  RotateCcw
} from 'lucide-react'
import { exportSitesToExcel } from '../../utils/excelExport'
import { StatusDropdown } from '../StatusDropdown'
import { ViewSwitcher } from '../ViewSwitcher'
import { StatusFilterDropdown } from '../StatusFilterDropdown'
import { SortDropdown } from '../SortDropdown'


const STATUS_DOT = {
  'On Going': 'bg-blue-500 ring-4 ring-blue-500/20',
  'Pending': 'bg-amber-500 ring-4 ring-amber-500/20',
  'Approve': 'bg-emerald-500 ring-4 ring-emerald-500/20',
  'Decline': 'bg-rose-500 ring-4 ring-rose-500/20'
}

export function CardView({
  sites = [],
  loading = false,
  currentView = 'card',
  statusFilter = 'ALL',
  onStatusFilterChange,
  onViewChange,
  onOpenAddModal,
  onOpenEditModal,
  onUpdateStatus,
  onDeleteSite,
  onPreviewImage,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [updatingId, setUpdatingId] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== 'ALL' || sortBy !== 'date-desc')

  const handleResetFilters = () => {
    setSearchTerm('')
    onStatusFilterChange?.('ALL')
    setSortBy('date-desc')
  }

  const filteredSites = useMemo(() => {
    const list = sites.filter((item) => {
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

    return list.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return (a.company_name || '').localeCompare(b.company_name || '', undefined, { sensitivity: 'base' })
      }
      if (sortBy === 'name-desc') {
        return (b.company_name || '').localeCompare(a.company_name || '', undefined, { sensitivity: 'base' })
      }
      if (sortBy === 'date-desc') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      }
      if (sortBy === 'date-asc') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0)
      }
      return 0
    })
  }, [sites, searchTerm, statusFilter, sortBy])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    await onUpdateStatus(id, newStatus)
    setUpdatingId(null)
  }

  return (
    <div className="space-y-4">
      
      {/* Main Action Buttons & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-20">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white m-0 tracking-tight">Site List</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Manage and monitor all site locations</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* View Switcher: Segmented on Desktop, Dropdown on Mobile */}
          <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

          {/* Export to Excel */}
          <button
            onClick={() => exportSitesToExcel(filteredSites, 'Site_Data')}
            disabled={filteredSites.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-btn-secondary text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs font-bold cursor-pointer disabled:opacity-50 active:scale-98"
            title="Download Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-current opacity-100 shrink-0" />
            <span>Export to Excel</span>
          </button>

          {/* Add Site Button */}
          <button
            onClick={onOpenAddModal}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-bold shadow-md shadow-slate-900/15 dark:shadow-white/10 transition duration-200 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-current opacity-100" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Box */}
      <div className="glass-panel p-2.5 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 relative z-20">
        {/* Row 1 on Mobile / Left Column on Desktop: Search Bar + Mobile Refresh */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-700 dark:text-slate-300 opacity-100 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, address, PIC, phone number..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl glass-input focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 p-0.5 rounded-full text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white opacity-100 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4 text-current opacity-100" />
              </button>
            )}
          </div>

          {/* Mobile-only Refresh button (stays cleanly beside search input) */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="sm:hidden p-2.5 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white glass-btn-secondary rounded-xl cursor-pointer shrink-0 active:scale-95"
              title="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 text-current opacity-100 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Row 2 on Mobile / Right Column on Desktop: Filters, Sort, Reset & Desktop Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {/* Status Filter (50% on mobile, auto on desktop) */}
          <div className="flex-1 sm:flex-initial min-w-0">
            <StatusFilterDropdown 
              value={statusFilter} 
              onChange={(val) => onStatusFilterChange?.(val)} 
            />
          </div>

          {/* Sort Dropdown (50% on mobile, auto on desktop) */}
          <div className="flex-1 sm:flex-initial min-w-0">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl glass-btn-secondary text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs font-bold cursor-pointer active:scale-95 shrink-0"
              title="Reset all filters & sort"
            >
              <RotateCcw className="w-3.5 h-3.5 text-current opacity-100" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Desktop-only Refresh button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="hidden sm:flex p-2.5 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white glass-btn-secondary rounded-xl cursor-pointer shrink-0 active:scale-95"
              title="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 text-current opacity-100 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Compact Cards */}
      {filteredSites.length === 0 ? (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
          <Building2 className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
          <div className="text-sm font-bold text-slate-800 dark:text-white">No site data found</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Try adjusting your search filters or click "Add Site".
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredSites.map((site) => {
            const isDropdownOpen = openDropdownId === site.id

            return (
              <div
                key={site.id}
                className={`glass-panel-hover rounded-2xl overflow-hidden flex flex-col relative group ${
                  isDropdownOpen ? 'z-40' : 'z-10'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-28 bg-slate-100 dark:bg-slate-900/80 rounded-t-2xl overflow-hidden">
                  {site.image_url ? (
                    <img
                      src={site.image_url}
                      alt={site.company_name}
                      loading="lazy"
                      decoding="async"
                      onClick={() => onPreviewImage(site.image_url, site.company_name)}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  {/* Floating Status Pill (Top-Right of Image) */}
                  <div className="absolute top-2.5 right-2.5 z-30">
                    <StatusDropdown
                      currentStatus={site.status}
                      disabled={updatingId === site.id}
                      onChange={(newStatus) => handleStatusChange(site.id, newStatus)}
                      onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? site.id : null)}
                      size="sm"
                      align="right"
                      bgWhite={true}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1.5">
                    
                    {/* Company Name & Round Status Dot */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-black text-slate-900 dark:text-white text-sm leading-tight line-clamp-1 truncate">
                        {site.company_name}
                      </div>
                      <span 
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[site.status] || 'bg-amber-500 ring-4 ring-amber-500/20'}`}
                        title={`Status: ${site.status}`}
                      />
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      <MapPin className="w-3 h-3 text-current opacity-100 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{site.address}</span>
                    </div>

                    {/* PIC & WhatsApp Contact */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs gap-2">
                      <div className="truncate">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold tracking-wider">PIC</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block text-xs">
                          {site.pic_name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold tracking-wider">Contact</span>
                        <a
                          href={`https://wa.me/${site.pic_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white font-bold hover:underline"
                        >
                          <Phone className="w-2.5 h-2.5 text-current opacity-100" />
                          <span>{site.pic_phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {site.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-100/60 dark:bg-white/5 backdrop-blur-xs p-2 rounded-xl border border-slate-200/80 dark:border-white/10 leading-relaxed">
                        {site.notes}
                      </p>
                    )}

                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-current opacity-100" />
                      {site.created_at ? new Date(site.created_at).toLocaleDateString('en-US') : '-'}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onOpenEditModal(site)}
                        className="p-1.5 text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition cursor-pointer"
                        title="Edit Data"
                      >
                        <Edit className="w-3.5 h-3.5 text-current opacity-100" />
                      </button>
                      <button
                        onClick={() => onDeleteSite(site.id)}
                        className="p-1.5 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-white/10 rounded-lg transition cursor-pointer"
                        title="Delete Data"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-current opacity-100" />
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
      <div className="glass-panel p-3 sm:px-4 rounded-2xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredSites.length}</span> of{' '}
          <span className="font-bold text-slate-900 dark:text-white">{sites.length}</span> sites
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300" title="On Going">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="hidden sm:inline">On Going</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300" title="Pending">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="hidden sm:inline">Pending</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300" title="Approve">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="hidden sm:inline">Approve</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300" title="Decline">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="hidden sm:inline">Decline</span>
          </span>
        </div>
      </div>

    </div>
  )
}
