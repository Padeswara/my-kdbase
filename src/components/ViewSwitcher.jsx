import React from 'react'
import { LayoutGrid, Table } from 'lucide-react'

export function ViewSwitcher({ currentView = 'card', onViewChange }) {
  if (!onViewChange) return null

  return (
    <div className="flex items-center justify-center bg-slate-200/60 dark:bg-white/[0.06] backdrop-blur-xl p-0.5 rounded-xl border border-slate-200/80 dark:border-white/10 shrink-0 shadow-2xs transition-colors">
      <button
        type="button"
        onClick={() => onViewChange('card')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
          currentView === 'card'
            ? 'bg-white text-slate-900 shadow-xs dark:bg-white dark:text-slate-950'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'
        }`}
        title="Switch to Cards View"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Cards</span>
      </button>
      <button
        type="button"
        onClick={() => onViewChange('table')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
          currentView === 'table'
            ? 'bg-white text-slate-900 shadow-xs dark:bg-white dark:text-slate-950'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'
        }`}
        title="Switch to Table View"
      >
        <Table className="w-3.5 h-3.5" />
        <span>Table</span>
      </button>
    </div>
  )
}
