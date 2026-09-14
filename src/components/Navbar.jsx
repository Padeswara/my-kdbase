import React from 'react'
import { Database, LogOut, Sun, Moon } from 'lucide-react'

export function Navbar({ currentUser, onLogout, isDbOnline, theme = 'dark', onToggleTheme }) {
  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-slate-200/80 dark:border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo & Brand: MY KDBASE */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-md shadow-slate-900/10 dark:shadow-white/10 shrink-0">
              <Database className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
              MY KDBASE
            </div>
          </div>

          {/* Right: Theme Switcher, Supabase Status, User Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Dark / Light Mode Toggle Button */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 sm:p-2 glass-btn-secondary rounded-xl transition cursor-pointer active:scale-95 flex items-center justify-center"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
                )}
              </button>
            )}

            {/* Supabase Database Status (Online / Offline) */}
            {isDbOnline ? (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs"
                title="Supabase database is connected and ready"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold">Online</span>
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-2xs"
                title="Supabase database is disconnected or offline"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400"></span>
                <span className="text-[11px] font-bold">Offline</span>
              </span>
            )}

            {/* Minimalist User Profile */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-white/10 backdrop-blur-md border border-slate-200/80 dark:border-white/15 shadow-2xs text-xs text-slate-800 dark:text-white">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold text-[10px]">
                {currentUser?.substring(0, 1) || 'K'}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">{currentUser}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100/80 dark:hover:bg-white/10 rounded-xl transition cursor-pointer active:scale-95"
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
