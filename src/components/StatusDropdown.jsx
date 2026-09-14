import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const STATUS_MAP = {
  'On Going': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80 shadow-xs shadow-blue-500/5',
    dot: 'bg-blue-500 shadow-xs shadow-blue-500/50',
    hover: 'hover:bg-blue-50/80 hover:text-blue-800'
  },
  'Pending': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80 shadow-xs shadow-amber-500/5',
    dot: 'bg-amber-500 shadow-xs shadow-amber-500/50',
    hover: 'hover:bg-amber-50/80 hover:text-amber-800'
  },
  'Approve': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80 shadow-xs shadow-emerald-500/5',
    dot: 'bg-emerald-500 shadow-xs shadow-emerald-500/50',
    hover: 'hover:bg-emerald-50/80 hover:text-emerald-800'
  },
  'Decline': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80 shadow-xs shadow-rose-500/5',
    dot: 'bg-rose-500 shadow-xs shadow-rose-500/50',
    hover: 'hover:bg-rose-50/80 hover:text-rose-800'
  }
}

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function StatusDropdown({ currentStatus = 'Pending', onChange, disabled = false, size = 'sm' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const config = STATUS_MAP[currentStatus] || STATUS_MAP['Pending']

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (status) => {
    if (status !== currentStatus && onChange) {
      onChange(status)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button Estetik */}
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-95 ${config.badge} ${
          size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        title="Klik untuk mengubah status"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`}></span>
        <span>{currentStatus}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu Estetik dengan Animasi */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-1.5 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Ubah Status
          </div>
          <div className="space-y-0.5 mt-0.5">
            {ALL_STATUSES.map((status) => {
              const itemConfig = STATUS_MAP[status]
              const isSelected = status === currentStatus

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelect(status)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900'
                      : `text-slate-700 ${itemConfig.hover}`
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${itemConfig.dot}`}></span>
                    <span>{status}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

