import React from 'react'
import { Database, LogOut } from 'lucide-react'

export function Navbar({ currentUser, onLogout, isDbOnline }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand: MY KDBASE */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 shrink-0">
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              MY KDBASE
            </div>
          </div>

          {/* Kanan: Status Database Online / Offline, User, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Status Supabase Database (Online / Offline) */}
            {isDbOnline ? (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
                title="Database Supabase terhubung dan siap digunakan"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"
                title="Database Supabase sedang tidak terhubung atau offline"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Offline</span>
              </span>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser?.substring(0, 1) || 'K'}
              </div>
              <span className="font-semibold text-slate-700 hidden sm:inline">{currentUser}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
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
