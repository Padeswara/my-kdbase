import React, { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown, Check, Layers } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses', dot: 'bg-slate-400' },
  { value: 'On Going', label: 'On Going', dot: 'bg-blue-500' },
  { value: 'Pending', label: 'Pending', dot: 'bg-amber-500' },
  { value: 'Approve', label: 'Approve', dot: 'bg-emerald-500' },
  { value: 'Decline', label: 'Decline', dot: 'bg-rose-500' }
]

export function StatusFilterDropdown({ value = 'ALL', onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const activeOption = STATUS_OPTIONS.find((opt) => opt.value === value) || STATUS_OPTIONS[0]

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
        className={`inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs select-none active:scale-98 min-w-[140px] sm:min-w-[155px] ${
        className={`inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer select-none active:scale-98 min-w-[140px] sm:min-w-[155px] ${
          isOpen
            ? 'border-slate-900 bg-white/95 ring-2 ring-slate-900/10 text-slate-900'
            ? 'border-slate-900 bg-white/95 ring-2 ring-slate-900/10 text-slate-900 shadow-xs'
            : value !== 'ALL'
            ? 'border-slate-300 bg-white text-slate-900'
            : 'border-white/80 bg-white/75 backdrop-blur-xl hover:bg-white text-slate-700'
            ? 'border-slate-300 bg-white/90 text-slate-900 shadow-2xs'
            : 'glass-btn-secondary text-slate-700 hover:text-slate-900'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Filter by status"
      >
        <div className="flex items-center gap-2 min-w-0">
          {value === 'ALL' ? (
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeOption.dot}`} />
          )}
          <span className="truncate">{activeOption.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-900' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 sm:left-0 top-full mt-1.5 w-48 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-xl shadow-slate-900/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
          className="absolute right-0 sm:left-0 top-full mt-1.5 w-48 glass-dropdown rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
          role="listbox"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Filter Status
          </div>

          <div className="space-y-0.5">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = opt.value === value
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
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/80'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.value === 'ALL' ? (
                      <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`} />
                    )}
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

