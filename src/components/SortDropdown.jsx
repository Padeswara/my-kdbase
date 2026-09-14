import React, { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, ArrowDownAZ, ArrowUpZA, Calendar, Check } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A - Z)', icon: ArrowDownAZ, description: 'Alphabetical ascending' },
  { value: 'name-desc', label: 'Name (Z - A)', icon: ArrowUpZA, description: 'Alphabetical descending' },
  { value: 'date-desc', label: 'Date: Newest', icon: Calendar, description: 'Recently added first' },
  { value: 'date-asc', label: 'Date: Oldest', icon: Calendar, description: 'Oldest added first' },
]

export function SortDropdown({ value = 'date-desc', onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const activeOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0]
  const ActiveIcon = activeOption.icon

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer select-none active:scale-98 sm:min-w-[150px] ${
          isOpen
            ? 'border-slate-900/30 dark:border-white/30 bg-slate-900/10 dark:bg-white/15 ring-2 ring-slate-900/10 dark:ring-white/10 text-slate-900 dark:text-white shadow-xs'
            : value !== 'date-desc'
            ? 'border-slate-300 dark:border-white/20 bg-slate-100/80 dark:bg-white/10 text-slate-900 dark:text-white shadow-2xs'
            : 'glass-btn-secondary text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Sort data"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ActiveIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{activeOption.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900 dark:text-white' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-52 glass-dropdown rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none shadow-xl"
          role="listbox"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sort Sites By
          </div>

          <div className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.value === value
              const Icon = opt.icon
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`p-1 rounded-lg ${isSelected ? 'bg-slate-800 text-white dark:bg-slate-950 dark:text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-left">
                      <div className="leading-none">{opt.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300 dark:text-slate-700' : 'text-slate-400 font-normal'}`}>
                        {opt.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white dark:text-slate-950 shrink-0 ml-1.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

