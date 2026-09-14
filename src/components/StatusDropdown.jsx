import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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

export function StatusDropdown({ 
  currentStatus = 'Pending', 
  onChange, 
  disabled = false, 
  size = 'sm',
  onOpenChange 
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

    // Horizontal alignment: right-aligned with trigger button
    let left = rect.right - menuWidth
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
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-95 ${config.badge} ${
          size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        title="Click to change status"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`}></span>
        <span>{currentStatus}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu via React Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={menuRef}
          style={menuStyle}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-200/80 p-1.5 animate-in fade-in zoom-in-95 duration-150 select-none"
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
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : `text-slate-700 ${itemConfig.hover}`
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${itemConfig.dot}`}></span>
                    <span>{status}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
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
