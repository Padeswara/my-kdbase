import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

const STATUS_MAP = {
  'On Going': {
    badge: 'bg-blue-500/15 backdrop-blur-md text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/25 shadow-xs shadow-blue-500/10',
    dot: 'bg-blue-500 dark:bg-blue-400 shadow-xs shadow-blue-500/50 ring-2 ring-blue-400/30',
    hover: 'hover:bg-blue-50/80 dark:hover:bg-white/10 hover:text-blue-800 dark:hover:text-white'
  },
  'Pending': {
    badge: 'bg-amber-500/15 backdrop-blur-md text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25 shadow-xs shadow-amber-500/10',
    dot: 'bg-amber-500 dark:bg-amber-400 shadow-xs shadow-amber-500/50 ring-2 ring-amber-400/30',
    hover: 'hover:bg-amber-50/80 dark:hover:bg-white/10 hover:text-amber-800 dark:hover:text-white'
  },
  'Approve': {
    badge: 'bg-emerald-500/15 backdrop-blur-md text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 shadow-xs shadow-emerald-500/10',
    dot: 'bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-500/50 ring-2 ring-emerald-400/30',
    hover: 'hover:bg-emerald-50/80 dark:hover:bg-white/10 hover:text-emerald-800 dark:hover:text-white'
  },
  'Decline': {
    badge: 'bg-rose-500/15 backdrop-blur-md text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/25 shadow-xs shadow-rose-500/10',
    dot: 'bg-rose-500 dark:bg-rose-400 shadow-xs shadow-rose-500/50 ring-2 ring-rose-400/30',
    hover: 'hover:bg-rose-50/80 dark:hover:bg-white/10 hover:text-rose-800 dark:hover:text-white'
  }
}

const ALL_STATUSES = ['On Going', 'Pending', 'Approve', 'Decline']

export function StatusDropdown({ 
  currentStatus = 'Pending', 
  onChange, 
  disabled = false, 
  size = 'sm',
  align = 'auto',
  onOpenChange,
  bgWhite = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState({})
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  const config = STATUS_MAP[currentStatus] || STATUS_MAP['Pending']

  // Calculate fixed position to escape table overflow wrapper
  const updatePosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuWidth = 144 // 9rem = 144px
    const menuHeight = 165 // estimated height
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const openUp = spaceBelow < menuHeight && spaceAbove > spaceBelow

    // Horizontal alignment: smart auto or explicit align
    let left = rect.left
    if (align === 'right' || (align === 'auto' && rect.left > window.innerWidth / 2)) {
      left = rect.right - menuWidth
    }
    if (left < 10) left = 10
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10
    }

    const top = openUp ? Math.max(10, rect.top - menuHeight - 6) : rect.bottom + 6

    setMenuStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${menuWidth}px`,
      zIndex: 9999
    })
  }

  // Toggle dropdown
  const handleToggle = (e) => {
    e.stopPropagation()
    const nextState = !isOpen
    if (nextState) {
      updatePosition()
    }
    setIsOpen(nextState)
    onOpenChange?.(nextState)
  }

  // Update position on scroll or resize
  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    const handleScrollOrResize = () => {
      updatePosition()
    }

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target) &&
        menuRef.current && !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        onOpenChange?.(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onOpenChange])

  const handleSelect = (status) => {
    if (status !== currentStatus && onChange) {
      onChange(status)
    }
    setIsOpen(false)
    onOpenChange?.(false)
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 font-bold rounded-full border transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-xs ${
          bgWhite
            ? 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 shadow-sm'
            : config.badge
        } ${
          size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        title="Click to change status"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`}></span>
        <span>{currentStatus}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${bgWhite ? 'text-slate-700 dark:text-slate-800' : 'text-current opacity-80'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu via React Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={menuRef}
          style={menuStyle}
          className={`${
            bgWhite
              ? 'bg-white border border-slate-200 shadow-2xl'
              : 'glass-dropdown'
          } rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 select-none`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Change Status
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
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : bgWhite
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${itemConfig.dot}`}></span>
                    <span>{status}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
