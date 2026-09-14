import React, { useState } from 'react'
import { LoginPage } from './components/LoginPage'
import { Navbar } from './components/Navbar'
import { TableView } from './components/views/TableView'
import { CardView } from './components/views/CardView'
import { SiteModal } from './components/SiteModal'
import { ImagePreviewModal } from './components/ImagePreviewModal'
import { useSites } from './hooks/useSites'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Info 
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

  const handleLoginSuccess = (username) => {
    setCurrentUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem('kdbase_auth_session')
    setCurrentUser(null)
  }

  // 2. Data Hook (Logika Terpisah dari Tampilan)
  const {
    sites,
    loading,
    error,
    isSupabaseMode,
    fetchSites,
    addSite,
    updateSite,
    updateStatus,
    deleteSite
  } = useSites()

  // 3. Pengaturan Tampilan UI (Bisa Diganti Menggunakan File Berbeda)
  // 'table' menggunakan src/components/views/TableView.jsx
  // 'card' menggunakan src/components/views/CardView.jsx
  const [currentView, setCurrentView] = useState('table')

  // 4. Modal States
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [previewImage, setPreviewImage] = useState({ isOpen: false, url: '', title: '' })

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

  // Ringkasan Statistik Data
  const stats = {
    total: sites.length,
    onGoing: sites.filter((s) => s.status === 'On Going').length,
    pending: sites.filter((s) => s.status === 'Pending').length,
    approve: sites.filter((s) => s.status === 'Approve').length,
    decline: sites.filter((s) => s.status === 'Decline').length
  }

  // Jika belum login, tampilkan halaman Login
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar Atas */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isSupabaseMode={isSupabaseMode}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Banner Info Kustomisasi UI */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-2xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950">Arsitektur Modular:</span> Tampilan UI dipisahkan di file terpisah.
              Saat ini aktif: <code className="bg-white/80 px-2 py-0.5 rounded border border-blue-200 font-semibold text-blue-700">{currentView === 'table' ? 'src/components/views/TableView.jsx' : 'src/components/views/CardView.jsx'}</code>.
              Anda bisa mendesain tampilan baru di file lain kapan saja tanpa mengubah logika database!
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setCurrentView(currentView === 'table' ? 'card' : 'table')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer text-[11px] whitespace-nowrap"
            >
              Ganti ke Tampilan {currentView === 'table' ? 'Kartu' : 'Tabel'}
            </button>
          </div>
        </div>

        {/* Baris Ringkasan Kartu Statistik */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Site</div>
              <div className="text-xl font-bold text-slate-900">{stats.total}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">On Going</div>
              <div className="text-xl font-bold text-blue-600">{stats.onGoing}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending</div>
              <div className="text-xl font-bold text-amber-600">{stats.pending}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Approve</div>
              <div className="text-xl font-bold text-emerald-600">{stats.approve}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Decline</div>
              <div className="text-xl font-bold text-rose-600">{stats.decline}</div>
            </div>
          </div>

        </div>

        {/* Tampilan Aktif: Tabel atau Kartu */}
        {currentView === 'table' ? (
          <TableView
            sites={sites}
            loading={loading}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onUpdateStatus={updateStatus}
            onDeleteSite={deleteSite}
            onPreviewImage={handlePreviewImage}
            onRefresh={fetchSites}
          />
        ) : (
          <CardView
            sites={sites}
            loading={loading}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onUpdateStatus={updateStatus}
            onDeleteSite={deleteSite}
            onPreviewImage={handlePreviewImage}
          />
        )}

      </main>

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

    </div>
  )
}

export default App
