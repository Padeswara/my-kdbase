import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export function DeleteConfirmModal({ isOpen, siteName, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div 
        className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center justify-center text-rose-600 mx-auto mb-4 shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900 m-0 tracking-tight">
          Delete Site Data?
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          Are you sure you want to delete data for <span className="font-bold text-slate-800">"{siteName}"</span>? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 bg-white/80 hover:bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 shadow-2xs transition cursor-pointer disabled:opacity-50 active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-98"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
