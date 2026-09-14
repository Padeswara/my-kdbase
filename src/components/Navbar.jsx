import React from 'react'
import { Database, LogOut } from 'lucide-react'

export function Navbar({ currentUser, onLogout, isDbOnline }) {
  return (
    <header className="bg-white/75 backdrop-blur-xl border-b border-white/80 sticky top-0 z-30 shadow-xs shadow-slate-900/5">
    <header className="glass-panel sticky top-0 z-30 border-b border-white/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand: MY KDBASE */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xs shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/20 shrink-0">
              <Database className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
              MY KDBASE
            </div>
          </div>

          {/* Right: Supabase Status, User Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Supabase Database Status (Online / Offline) */}
            {isDbOnline ? (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 backdrop-blur-md text-emerald-700 border border-emerald-200/80 shadow-2xs"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 backdrop-blur-md text-emerald-700 border border-emerald-300/60 shadow-2xs"
                title="Supabase database is connected and ready"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold">Online</span>
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 backdrop-blur-md text-rose-700 border border-rose-200/80 shadow-2xs"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 backdrop-blur-md text-rose-700 border border-rose-300/60 shadow-2xs"
                title="Supabase database is disconnected or offline"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-[11px] font-bold">Offline</span>
              </span>
            )}

            {/* Minimalist User Profile */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs text-xs">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser?.substring(0, 1) || 'K'}
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline">{currentUser}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition cursor-pointer active:scale-95"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-white/80 rounded-xl transition cursor-pointer active:scale-95"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  )
}
