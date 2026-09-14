import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export function DeleteConfirmModal({ isOpen, siteName, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden animate-in zoom-in-95 duration-150 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup Silang */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Peringatan Estetik */}
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-4 shadow-inner">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 m-0">
          Hapus Data Site?
        </h3>

        <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus data <span className="font-bold text-slate-800">"{siteName}"</span>? Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

