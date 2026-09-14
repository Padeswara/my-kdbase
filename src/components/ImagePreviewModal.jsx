import React from 'react'
import { X, ExternalLink } from 'lucide-react'

export function ImagePreviewModal({ isOpen, imageUrl, title, onClose }) {
  if (!isOpen || !imageUrl) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 animate-in zoom-in-95 duration-150"
        className="relative max-w-2xl w-full glass-modal-dark rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 text-white">
          <div className="font-bold text-xs sm:text-sm truncate pr-4 text-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/10 backdrop-blur-xl border-b border-white/10 text-white">
          <div className="font-bold text-xs sm:text-sm truncate pr-4 text-slate-100">
            {title || 'Site Documentation'}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/15 rounded-xl transition backdrop-blur-sm"
              title="Open image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/15 rounded-xl transition cursor-pointer backdrop-blur-sm"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="bg-slate-950 flex items-center justify-center max-h-[75vh] p-3 sm:p-4">
        <div className="bg-black/40 backdrop-blur-md flex items-center justify-center max-h-[75vh] p-3 sm:p-4">
          <img
            src={imageUrl}
            alt={title || 'Site Photo'}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-xl"
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      </div>
    </div>
  )
}
