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
  const handleIdleTimeout = () => {
    localStorage.removeItem('kdbase_auth_session')
    localStorage.removeItem('kdbase_last_activity')
    setCurrentUser(null)
    setIdleNotice('Sesi Anda telah berakhir otomatis karena tidak ada aktivitas selama 10 menit.')
  }

  useIdleTimer({
    onIdle: handleIdleTimeout,
    enabled: Boolean(currentUser)
  })

  // 2. Data Hook Terpusat
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
  const stats = {
    total: sites.length,
    onGoing: sites.filter((s) => s.status === 'On Going').length,
    pending: sites.filter((s) => s.status === 'Pending').length,
    approve: sites.filter((s) => s.status === 'Approve').length,
    decline: sites.filter((s) => s.status === 'Decline').length
  }

  // Jika belum login, tampilkan halaman Login
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} idleNotice={idleNotice} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar Atas Responsif */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isDbOnline={isDbOnline}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        
        {/* Ringkasan Statistik: Total Site 100% Width & 4 Status di Bawahnya */}
        <div className="space-y-2 sm:space-y-3">
          
          {/* Total Site Card (Width 100%) */}
          <div className="w-full bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Site</div>
                <div className="text-xs text-slate-500 truncate hidden xs:block sm:block">
                  Jumlah seluruh lokasi site yang terdaftar
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 shrink-0 pr-1">
              {stats.total}
            </div>
          </div>

          {/* 4 Status Cards (Grid 2 Kolom di Mobile, 4 Kolom di Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">On Going</div>
                <div className="text-base sm:text-lg font-bold text-blue-600">{stats.onGoing}</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Pending</div>
                <div className="text-base sm:text-lg font-bold text-amber-600">{stats.pending}</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Approve</div>
                <div className="text-base sm:text-lg font-bold text-emerald-600">{stats.approve}</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">Decline</div>
                <div className="text-base sm:text-lg font-bold text-rose-600">{stats.decline}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Tampilan Aktif: Default CardView yang lebih compact */}
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

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white/70 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="m-0">© 2026 Rittergeistworks by Padeswaraa. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Tambahkan / Edit Site */}
      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onSave={handleSaveSite}
        editingSite={editingSite}
      />

      {/* Modal Preview Gambar Ukuran Penuh */}
      <ImagePreviewModal
        isOpen={previewImage.isOpen}
        imageUrl={previewImage.url}
        title={previewImage.title}
        onClose={() => setPreviewImage({ isOpen: false, url: '', title: '' })}
      />

      {/* Modal Konfirmasi Hapus Data Estetik */}
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
