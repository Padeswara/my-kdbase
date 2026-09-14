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
  // 1. Autentikasi Sederhana
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

  // Auto-logout jika idle / AFK selama 10 menit
  // Auto-logout after 10 minutes of AFK / inactivity
  const handleIdleTimeout = () => {
    localStorage.removeItem('kdbase_auth_session')
    localStorage.removeItem('kdbase_last_activity')
    setCurrentUser(null)
    setIdleNotice('Sesi Anda telah berakhir otomatis karena tidak ada aktivitas selama 10 menit demi keamanan akun.')
    setIdleNotice('Your session has automatically expired due to 10 minutes of inactivity for account security.')
  }

  useIdleTimer({
    onIdle: handleIdleTimeout,
    enabled: Boolean(currentUser)
  })

  // 2. Data Hook Terpusat
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

  // 3. Tampilan Default: 'card' (tampilan kartu ringkas sesuai permintaan)
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
      name: target?.company_name || 'Site ini'
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

  // Ringkasan Statistik
  // Summary Statistics
  const stats = {
    total: sites.length,
    onGoing: sites.filter((s) => s.status === 'On Going').length,
    pending: sites.filter((s) => s.status === 'Pending').length,
    approve: sites.filter((s) => s.status === 'Approve').length,
    decline: sites.filter((s) => s.status === 'Decline').length
  }

  // Jika belum login, tampilkan halaman Login
  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} idleNotice={idleNotice} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar Atas Responsif */}
      {/* Responsive Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isDbOnline={isDbOnline}
      />

      {/* Konten Utama */}
      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        
        {/* Ringkasan Statistik: Total Site 100% Width & 4 Status di Bawahnya */}
        {/* Statistics Summary: Total Sites (100% Width) & 4 Status Cards */}
        <div className="space-y-2 sm:space-y-3">
          
          {/* Total Site Card (Width 100% Minimalist Style) */}
          {/* Total Sites Card (100% Width) */}
          <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Site
                  Total Sites
                </div>
                <div className="text-xs text-slate-500 truncate hidden xs:block sm:block">
                  Jumlah seluruh lokasi site yang terdaftar
                  Total number of registered site locations
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 shrink-0 pr-1">
              {stats.total}
            </div>
          </div>

          {/* 4 Status Cards (Grid 2 Kolom di Mobile, 4 Kolom di Desktop) */}
          {/* 4 Status Cards (2 Columns on Mobile, 4 Columns on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">On Going</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.onGoing}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Pending</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.pending}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Approve</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.approve}</div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Decline</div>
                <div className="text-base sm:text-lg font-black text-slate-900">{stats.decline}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Tampilan Aktif: CardView atau TableView */}
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

      {/* Footer Paling Bawah (Sama Persis dengan Login Page) */}
      {/* Sticky Bottom Footer */}
      <footer className="mt-auto w-full py-5 border-t border-slate-200/60 text-center text-xs text-slate-400 bg-white/40">
        © 2026 Rittergeistworks by Padeswaraa. All rights reserved.
      </footer>

      {/* Modal Tambahkan / Edit Site */}
      {/* Add / Edit Site Modal */}
      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onSave={handleSaveSite}
        editingSite={editingSite}
      />

      {/* Modal Preview Gambar Ukuran Penuh */}
      {/* Full Size Image Preview Lightbox */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        imageUrl={previewImage.url}
        title={previewImage.title}
        onClose={() => setPreviewImage({ isOpen: false, url: '', title: '' })}
      />

      {/* Modal Konfirmasi Hapus Data Estetik */}
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
