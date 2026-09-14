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
      <div className="hidden sm:flex items-center bg-slate-200/50 backdrop-blur-md p-0.5 rounded-xl border border-white/80 shrink-0">
        <button
          type="button"
          onClick={() => onViewChange('card')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            currentView === 'card'
              ? 'bg-white/90 text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
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
              ? 'bg-white/90 text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
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
          className={`w-full inline-flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs active:scale-98 select-none ${
            isOpen
              ? 'border-slate-900 bg-white/95 ring-2 ring-slate-900/10 text-slate-900'
              : 'border-white/80 bg-white/75 backdrop-blur-xl hover:bg-white text-slate-700'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-slate-100/80 text-slate-900 shrink-0">
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
              isOpen ? 'rotate-180 text-slate-900' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full mt-1.5 w-52 bg-white/85 backdrop-blur-2xl rounded-2xl border border-white/90 shadow-xl shadow-slate-900/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg ${currentView === 'card' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <div className="leading-none">Cards View</div>
                  <div className={`text-[10px] mt-0.5 ${currentView === 'card' ? 'text-slate-300' : 'text-slate-400 font-normal'}`}>
                    Visual grid preview
                  </div>
                </div>
              </div>
              {currentView === 'card' && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg ${currentView === 'table' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Table className="w-3.5 h-3.5" />
                </span>
                <div className="text-left">
                  <div className="leading-none">Table View</div>
                  <div className={`text-[10px] mt-0.5 ${currentView === 'table' ? 'text-slate-300' : 'text-slate-400 font-normal'}`}>
                    Compact data rows
                  </div>
                </div>
              </div>
              {currentView === 'table' && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1.5" />}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

