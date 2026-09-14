import React, { useState, useMemo } from 'react'
import { 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Phone, 
  ChevronDown,
  Building2,
  ExternalLink,
  RotateCw,
  RotateCcw,
  Table,
  LayoutGrid
} from 'lucide-react'
import { exportSitesToExcel } from '../../utils/excelExport'
import { StatusDropdown } from '../StatusDropdown'
import { ViewSwitcher } from '../ViewSwitcher'
import { StatusFilterDropdown } from '../StatusFilterDropdown'
import { SortDropdown } from '../SortDropdown'

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function TableView({
  sites = [],
  loading = false,
  currentView = 'table',
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
  const [sortBy, setSortBy] = useState('date-desc')
  const [updatingId, setUpdatingId] = useState(null)
  const [openDropdownId, setOpenDropdownId] = useState(null)

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== 'ALL' || sortBy !== 'date-desc')

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setSortBy('date-desc')
  }

  // Filter, search and sort data
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

  // Inline status change handler
  const handleInlineStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    await onUpdateStatus(id, newStatus)
    setUpdatingId(null)
  }

  // Excel export handler
  const handleExport = () => {
    exportSitesToExcel(filteredSites, 'Site_Data')
  }

  return (
    <div className="space-y-4">
      
      {/* Main Action Buttons & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white m-0 tracking-tight">Site List</h2>
          <p className="text-xs text-slate-400 m-0">Manage and monitor all site locations</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* View Switcher: Segmented on Desktop, Dropdown on Mobile (Positioned Left of Export to Excel) */}
          <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />

          {/* Export to Excel */}
          <button
            onClick={handleExport}
            disabled={filteredSites.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-btn-secondary text-slate-200 hover:text-white text-xs font-bold cursor-pointer disabled:opacity-50 active:scale-98"
            title="Download data as Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Export to Excel</span>
          </button>

          {/* Add Site Button */}
          <button
            onClick={onOpenAddModal}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold shadow-lg shadow-white/10 transition duration-200 cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Box */}
      <div className="glass-panel p-2.5 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, address, PIC, phone number..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-white focus:outline-none"
          />
        </div>

        {/* Filters, Sort & Refresh */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Filter */}
          <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />

          {/* Sort Dropdown */}
          <SortDropdown value={sortBy} onChange={setSortBy} />

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass-btn-secondary text-slate-300 hover:text-white text-xs font-bold cursor-pointer active:scale-95"
              title="Reset all filters & sort"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 text-slate-400 hover:text-white glass-btn-secondary rounded-xl cursor-pointer shrink-0 active:scale-95 ml-auto sm:ml-0"
              title="Refresh Data"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.04] backdrop-blur-md border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-20">Photo</th>
                <th className="py-3.5 px-4 min-w-[200px]">Company & Address</th>
                <th className="py-3.5 px-4 min-w-[170px]">PIC & Contact</th>
                <th className="py-3.5 px-4 min-w-[160px]">Status (Quick Change)</th>
                <th className="py-3.5 px-4 min-w-[200px]">Notes</th>
                <th className="py-3.5 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 text-sm">
              {loading && sites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="inline-block w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                    <div className="text-xs">Loading database...</div>
                  </td>
                </tr>
              ) : filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <div className="font-bold text-slate-200">No data found</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {searchTerm || statusFilter !== 'ALL'
                        ? 'Try adjusting your search query or status filter'
                        : 'Click "Add Site" to create the first record'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSites.map((site, index) => {
                  const isDropdownOpen = openDropdownId === site.id

                  return (
                    <tr 
                      key={site.id} 
                      className={`hover:bg-white/[0.06] transition duration-150 group relative ${
                        isDropdownOpen ? 'z-30' : 'z-10'
                      }`}
                    >
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-xs font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* Photo */}
                      <td className="py-3.5 px-4">
                        {site.image_url ? (
                          <div 
                            onClick={() => onPreviewImage(site.image_url, site.company_name)}
                            className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 cursor-pointer group-hover:border-white/30 transition shadow-2xs relative bg-slate-900/60 flex items-center justify-center"
                            title="Click to view full photo"
                          >
                            <img
                              src={site.image_url}
                              alt={site.company_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                              <ImageIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Company & Address */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-blue-300 transition">
                          {site.company_name}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {site.address}
                        </div>
                      </td>

                      {/* PIC & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>{site.pic_name}</span>
                        </div>
                        <div className="mt-1">
                          <a
                            href={`https://wa.me/${site.pic_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-emerald-400 font-bold hover:underline"
                            title="Chat via WhatsApp"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{site.pic_phone}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                          </a>
                        </div>
                      </td>

                      {/* Floating Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <StatusDropdown
                          currentStatus={site.status}
                          disabled={updatingId === site.id}
                          onChange={(newStatus) => handleInlineStatusChange(site.id, newStatus)}
                          onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? site.id : null)}
                          size="sm"
                        />
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {site.notes || '-'}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenEditModal(site)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSite(site.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition cursor-pointer"
                            title="Delete Data"
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

        {/* Table Footer Summary (Status text hidden on mobile, dots only) */}
        <div className="px-4 sm:px-5 py-3.5 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{filteredSites.length}</span> of{' '}
            <span className="font-bold text-white">{sites.length}</span> total sites
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

    </div>
  )
}
