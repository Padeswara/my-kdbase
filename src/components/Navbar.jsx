import React from 'react'
import { Database, LogOut, LayoutGrid, Table, Shield, CheckCircle2, AlertTriangle } from 'lucide-react'

export function Navbar({ currentUser, onLogout, isSupabaseMode, currentView, onViewChange }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-2">
                Site Management
              </div>
              <div className="text-xs text-slate-500 hidden sm:block">
                Database Perusahaan & Site Tracking
              </div>
            </div>
          </div>

          {/* Tengah: Switcher View (Tabel vs Card) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onViewChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'table'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Tabel (File: TableView.jsx)"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tampilan Tabel</span>
            </button>
            <button
              onClick={() => onViewChange('card')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentView === 'card'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilan Card Grid (File: CardView.jsx)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tampilan Kartu</span>
            </button>
          </div>

          {/* Kanan: Status DB, User Info, Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Supabase Status Indicator */}
            {isSupabaseMode ? (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Supabase Connected
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                title="Supabase credentials belum diisi di .env. Data disimpan di Local Storage browser."
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Mode Demo</span> (Lokal)
              </span>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.substring(0, 1) || 'K'}
              </div>
              <span className="font-semibold text-slate-700">{currentUser}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  )
}

