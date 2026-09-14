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
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Layers
} from 'lucide-react'

export function App() {
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

  // 3. Default View: 'card'
  const [currentView, setCurrentView] = useState('card')

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

  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} idleNotice={idleNotice} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Responsive Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isDbOnline={isDbOnline}
      />

      {/* Ambient Glass Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-28 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 w-96 h-96 bg-emerald-100/25 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-20 w-88 h-88 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        
        {/* Statistics Summary: Total Sites (100% Width) & 4 Status Cards */}
        <div className="space-y-2 sm:space-y-3">
          
          {/* Total Sites Card (100% Width) */}
          <div className="w-full bg-white/75 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/80 shadow-xs shadow-slate-900/5 flex items-center justify-between transition-all duration-200 hover:bg-white/85">
          <div className="w-full glass-panel-hover p-4 sm:p-5 rounded-2xl flex items-center justify-between cursor-default">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-900/20">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Sites
                </div>
                <div className="text-xs text-slate-500 truncate hidden xs:block sm:block">
                  Total number of registered site locations
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 shrink-0 pr-1">
              {stats.total}
            </div>
          </div>

          {/* 4 Status Cards (2 Columns on Mobile, 4 Columns on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            
            <div className="bg-white/75 backdrop-blur-xl p-3.5 rounded-2xl border border-white/80 shadow-xs hover:bg-white/90 hover:border-slate-300/80 transition-all duration-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <div className="glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-default">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-200/50 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">On Going</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.onGoing}</div>
              </div>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-3.5 rounded-2xl border border-white/80 shadow-xs hover:bg-white/90 hover:border-slate-300/80 transition-all duration-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <div className="glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-default">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200/50 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Pending</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.pending}</div>
              </div>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-3.5 rounded-2xl border border-white/80 shadow-xs hover:bg-white/90 hover:border-slate-300/80 transition-all duration-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <div className="glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-default">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Approve</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.approve}</div>
              </div>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-3.5 rounded-2xl border border-white/80 shadow-xs hover:bg-white/90 hover:border-slate-300/80 transition-all duration-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <div className="glass-panel-hover p-3.5 rounded-2xl flex items-center gap-3 cursor-default">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-200/50 backdrop-blur-sm flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Decline</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.decline}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Active View: CardView or TableView */}
        {currentView === 'card' ? (
          <CardView
            sites={sites}
            loading={loading}
            currentView={currentView}
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
      <footer className="mt-auto w-full py-5 border-t border-white/80 text-center text-xs text-slate-400 bg-white/50 backdrop-blur-md">
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
