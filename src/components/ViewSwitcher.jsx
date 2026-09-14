import React, { useState, useRef, useEffect } from 'react'
import { LayoutGrid, Table, ChevronDown, Check } from 'lucide-react'

export function ViewSwitcher({ currentView = 'card', onViewChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
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

  // Close on Escape key
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

  if (!onViewChange) return null

  return (
    <>
      {/* Desktop View: Segmented Pill */}
      <div className="hidden sm:flex items-center bg-white/[0.06] backdrop-blur-xl p-0.5 rounded-xl border border-white/10 shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => onViewChange('card')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentView === 'card'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to Card View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Cards</span>
        </button>
        <button
          type="button"
          onClick={() => onViewChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentView === 'table'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to Table View"
        >
          <Table className="w-3.5 h-3.5" />
          <span>Table</span>
        </button>
      </div>

      {/* Mobile View: Custom Styled Dropdown */}
      <div className="relative sm:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer select-none active:scale-98 ${
            isOpen
              ? 'border-white/30 bg-white/15 ring-2 ring-white/10 text-white shadow-xs'
              : 'glass-btn-secondary text-slate-200 hover:text-white'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-white/10 text-white shrink-0">
              {currentView === 'card' ? (
                <LayoutGrid className="w-3 h-3" />
              ) : (
                <Table className="w-3 h-3" />
              )}
            </span>
            <span className="truncate">{currentView === 'card' ? 'Cards View' : 'Table View'}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full mt-1.5 w-52 glass-dropdown rounded-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            role="listbox"
          >
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Display Mode
            </div>

            <button
              type="button"
              role="option"
              aria-selected={currentView === 'card'}
              onClick={() => {
                onViewChange('card')
                setIsOpen(false)
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentView === 'card'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg ${currentView === 'card' ? 'bg-slate-950 text-white' : 'bg-white/10 text-slate-300'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <div className="leading-none">Cards View</div>
                  <div className={`text-[10px] mt-0.5 ${currentView === 'card' ? 'text-slate-700' : 'text-slate-400 font-normal'}`}>
                    Visual grid preview
                  </div>
                </div>
              </div>
              {currentView === 'card' && <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-1.5" />}
            </button>

            <button
              type="button"
              role="option"
              aria-selected={currentView === 'table'}
              onClick={() => {
                onViewChange('table')
                setIsOpen(false)
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer mt-1 ${
                currentView === 'table'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg ${currentView === 'table' ? 'bg-slate-950 text-white' : 'bg-white/10 text-slate-300'}`}>
                  <Table className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <div className="leading-none">Table View</div>
                  <div className={`text-[10px] mt-0.5 ${currentView === 'table' ? 'text-slate-700' : 'text-slate-400 font-normal'}`}>
                    Compact data rows
                  </div>
                </div>
              </div>
              {currentView === 'table' && <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 ml-1.5" />}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

