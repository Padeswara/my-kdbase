import React, { useState } from 'react'
import { LoginPage } from './components/LoginPage'
import { Navbar } from './components/Navbar'
import { TableView } from './components/views/TableView'
import { CardView } from './components/views/CardView'
import { SiteModal } from './components/SiteModal'
import { ImagePreviewModal } from './components/ImagePreviewModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { useSites } from './hooks/useSites'
import { useIdleTimer } from './hooks/useIdleTimer'
import { useTheme } from './hooks/useTheme'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Layers
} from 'lucide-react'

export function App() {
  // Theme Manager (Dark / Light Mode)
  const { theme, toggleTheme } = useTheme()

  // 1. Simple Authentication
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = localStorage.getItem('kdbase_auth_session')
      return session ? JSON.parse(session).username : null
    } catch {
      return null
    }
  })
  const [idleNotice, setIdleNotice] = useState('')

  const handleLoginSuccess = (username) => {
    setIdleNotice('')
    setCurrentUser(username)
  }

  const handleLogout = () => {
    setIdleNotice('')
    localStorage.removeItem('kdbase_auth_session')
    localStorage.removeItem('kdbase_last_activity')
    setCurrentUser(null)
  }

  // Auto-logout after 10 minutes of AFK / inactivity
  const handleIdleTimeout = () => {
    localStorage.removeItem('kdbase_auth_session')
    localStorage.removeItem('kdbase_last_activity')
    setCurrentUser(null)
    setIdleNotice('Your session has automatically expired due to 10 minutes of inactivity for account security.')
  }

  useIdleTimer({
    onIdle: handleIdleTimeout,
    enabled: Boolean(currentUser)
  })

  // 2. Data Hook
  const {
    sites,
    loading,
    error,
    isSupabaseMode,
    isDbOnline,
    fetchSites,
    addSite,
    updateSite,
    updateStatus,
    deleteSite
  } = useSites()

  // 3. Views & Status Filter State (Lifted to App for top card synchronization)
  const [currentView, setCurrentView] = useState('card')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // 4. Modal States
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [previewImage, setPreviewImage] = useState({ isOpen: false, url: '', title: '' })
  const [deleteTarget, setDeleteTarget] = useState({ isOpen: false, id: null, name: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenAddModal = () => {
    setEditingSite(null)
    setIsSiteModalOpen(true)
  }

  const handleOpenEditModal = (site) => {
    setEditingSite(site)
    setIsSiteModalOpen(true)
  }

  const handleSaveSite = async (formData, imageFile) => {
    if (editingSite) {
      return await updateSite(editingSite.id, formData, imageFile)
    } else {
      return await addSite(formData, imageFile)
    }
  }

  const handlePreviewImage = (url, title) => {
    setPreviewImage({ isOpen: true, url, title })
  }

  const handleRequestDelete = (siteId) => {
    const target = sites.find((s) => s.id === siteId)
    setDeleteTarget({
      isOpen: true,
      id: siteId,
      name: target?.company_name || 'This site'
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget.id) return
    setIsDeleting(true)
    await deleteSite(deleteTarget.id)
    setIsDeleting(false)
    setDeleteTarget({ isOpen: false, id: null, name: '' })
  }

  // Summary Statistics
  const stats = {
    total: sites.length,
    onGoing: sites.filter((s) => s.status === 'On Going').length,
    pending: sites.filter((s) => s.status === 'Pending').length,
    approve: sites.filter((s) => s.status === 'Approve').length,
    decline: sites.filter((s) => s.status === 'Decline').length
  }

  // Card filter toggler: Clicking active card resets to ALL, clicking inactive sets it
  const handleStatCardClick = (status) => {
    if (status === 'ALL') {
      setStatusFilter('ALL')
    } else {
      setStatusFilter((prev) => (prev === status ? 'ALL' : status))
    }
  }

  // If not logged in, render LoginPage
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        idleNotice={idleNotice} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100">
      
      {/* Responsive Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isDbOnline={isDbOnline}
        isDbLoading={loading}
        onRetryDb={fetchSites}
        dbError={error}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      {/* Ambient Glass Background Glows (GPU-Accelerated) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none transform-gpu will-change-transform">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-2xl" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-2xl" />
        <div className="absolute top-2/3 -left-20 w-88 h-88 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-2xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-600/20 rounded-full blur-2xl" />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        
        {/* Statistics Summary: Total Sites (100% Width) & 4 Status Cards */}
        <div className="space-y-2 sm:space-y-3">
          
          {/* Total Sites Card (100% Width) */}
          <div 
            onClick={() => handleStatCardClick('ALL')}
            className={`w-full glass-panel-hover p-4 sm:p-5 rounded-2xl flex items-center justify-between cursor-pointer sm:active:scale-98 transition-colors select-none ${
              statusFilter === 'ALL'
                ? 'ring-2 ring-slate-900/30 dark:ring-white/40 border-slate-900/40 dark:border-white/40 shadow-md'
                : 'sm:hover:border-slate-300 sm:dark:hover:border-white/25'
            }`}
            title="Click to view all site locations"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-slate-900/20 dark:shadow-white/20'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10'
              }`}>
                <Layers className="w-5 h-5 text-current opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Total Sites</span>
                  {statusFilter === 'ALL' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900/10 dark:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold lowercase">
                      showing all
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate hidden xs:block sm:block">
                  Total registered site locations
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white shrink-0 pr-1">
              {stats.total}
            </div>
          </div>

          {/* 4 Status Cards (2 Columns on Mobile, 4 Columns on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            
            {/* On Going Card */}
            <div 
              onClick={() => handleStatCardClick('On Going')}
              className={`glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer sm:active:scale-98 transition-colors select-none ${
                statusFilter === 'On Going'
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 shadow-md shadow-blue-500/20'
                  : 'sm:hover:border-blue-400/40'
              }`}
              title={statusFilter === 'On Going' ? 'Click to reset filter' : 'Click to filter On Going sites'}
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === 'On Going'
                  ? 'bg-blue-500 text-white border-blue-400 shadow-sm shadow-blue-500/50'
                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 backdrop-blur-sm'
              }`}>
                <Clock className="w-4 h-4 text-current opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  On Going
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {stats.onGoing}
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div 
              onClick={() => handleStatCardClick('Pending')}
              className={`glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer sm:active:scale-98 transition-colors select-none ${
                statusFilter === 'Pending'
                  ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 shadow-md shadow-amber-500/20'
                  : 'sm:hover:border-amber-400/40'
              }`}
              title={statusFilter === 'Pending' ? 'Click to reset filter' : 'Click to filter Pending sites'}
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === 'Pending'
                  ? 'bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/50'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 backdrop-blur-sm'
              }`}>
                <Clock className="w-4 h-4 text-current opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  Pending
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {stats.pending}
                </div>
              </div>
            </div>

            {/* Approve Card */}
            <div 
              onClick={() => handleStatCardClick('Approve')}
              className={`glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer sm:active:scale-98 transition-colors select-none ${
                statusFilter === 'Approve'
                  ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md shadow-emerald-500/20'
                  : 'sm:hover:border-emerald-400/40'
              }`}
              title={statusFilter === 'Approve' ? 'Click to reset filter' : 'Click to filter Approved sites'}
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === 'Approve'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/50'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-sm'
              }`}>
                <CheckCircle className="w-4 h-4 text-current opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  Approve
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {stats.approve}
                </div>
              </div>
            </div>

            {/* Decline Card */}
            <div 
              onClick={() => handleStatCardClick('Decline')}
              className={`glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer sm:active:scale-98 transition-colors select-none ${
                statusFilter === 'Decline'
                  ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-500/10 dark:bg-rose-500/20 shadow-md shadow-rose-500/20'
                  : 'sm:hover:border-rose-400/40'
              }`}
              title={statusFilter === 'Decline' ? 'Click to reset filter' : 'Click to filter Declined sites'}
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === 'Decline'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-500/50'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 backdrop-blur-sm'
              }`}>
                <XCircle className="w-4 h-4 text-current opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  Decline
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {stats.decline}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Active View: CardView or TableView with synchronized statusFilter */}
        {currentView === 'card' ? (
          <CardView
            sites={sites}
            loading={loading}
            currentView={currentView}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onViewChange={setCurrentView}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onUpdateStatus={updateStatus}
            onDeleteSite={handleRequestDelete}
            onPreviewImage={handlePreviewImage}
            onRefresh={fetchSites}
          />
        ) : (
          <TableView
            sites={sites}
            loading={loading}
            currentView={currentView}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onViewChange={setCurrentView}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onUpdateStatus={updateStatus}
            onDeleteSite={handleRequestDelete}
            onPreviewImage={handlePreviewImage}
            onRefresh={fetchSites}
          />
        )}

      </main>

      {/* Sticky Bottom Footer */}
      <footer className="mt-auto w-full py-5 border-t border-slate-200/80 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl">
        © 2026 Rittergeistworks by Padeswaraa. All rights reserved.
      </footer>

      {/* Add / Edit Site Modal */}
      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onSave={handleSaveSite}
        editingSite={editingSite}
      />

      {/* Full Size Image Preview Lightbox */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        imageUrl={previewImage.url}
        title={previewImage.title}
        onClose={() => setPreviewImage({ isOpen: false, url: '', title: '' })}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteTarget.isOpen}
        siteName={deleteTarget.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget({ isOpen: false, id: null, name: '' })}
      />

    </div>
  )
}

export default App
