import React, { useState, useEffect } from 'react'
import { X, Upload, Building2, MapPin, User, Phone, Image as ImageIcon, Sparkles } from 'lucide-react'

const STATUS_CONFIGS = [
  { value: 'On Going', label: 'On Going', color: 'border-blue-300 bg-blue-50/80 text-blue-700 ring-blue-500/20' },
  { value: 'Pending', label: 'Pending', color: 'border-amber-300 bg-amber-50/80 text-amber-700 ring-amber-500/20' },
  { value: 'Approve', label: 'Approve', color: 'border-emerald-300 bg-emerald-50/80 text-emerald-700 ring-emerald-500/20' },
  { value: 'Decline', label: 'Decline', color: 'border-rose-300 bg-rose-50/80 text-rose-700 ring-rose-500/20' }
]

export function SiteModal({ isOpen, onClose, onSave, editingSite = null }) {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    pic_name: '',
    pic_phone: '',
    status: 'Pending',
    notes: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (editingSite) {
      setFormData({
        company_name: editingSite.company_name || '',
        address: editingSite.address || '',
        pic_name: editingSite.pic_name || '',
        pic_phone: editingSite.pic_phone || '',
        status: editingSite.status || 'Pending',
        notes: editingSite.notes || '',
        image_url: editingSite.image_url || ''
      })
      setImagePreview(editingSite.image_url || '')
    } else {
      setFormData({
        company_name: '',
        address: '',
        pic_name: '',
        pic_phone: '',
        status: 'Pending',
        notes: '',
        image_url: ''
      })
      setImagePreview('')
    }
    setImageFile(null)
    setErrorMsg('')
  }, [editingSite, isOpen])

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file gambar maksimal 5MB!')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setErrorMsg('')
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData((prev) => ({ ...prev, image_url: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.company_name.trim()) {
      setErrorMsg('Nama Perusahaan wajib diisi!')
      return
    }
    if (!formData.address.trim()) {
      setErrorMsg('Alamat wajib diisi!')
      return
    }
    if (!formData.pic_name.trim()) {
      setErrorMsg('Nama PIC wajib diisi!')
      return
    }
    if (!formData.pic_phone.trim()) {
      setErrorMsg('Nomor PIC wajib diisi!')
      return
    }

    setIsSubmitting(true)
    const result = await onSave(formData, imageFile)
    setIsSubmitting(false)

    if (result?.success) {
      onClose()
    } else {
      setErrorMsg(result?.error || 'Terjadi kesalahan saat menyimpan data.')
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal Estetik dengan Gradien Halus */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-blue-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white m-0 leading-tight">
                {editingSite ? 'Edit Data Site' : 'Tambahkan Site Baru'}
              </h2>
              <p className="text-[11px] text-slate-300 m-0 mt-0.5">
                {editingSite ? 'Perbarui informasi detail lokasi' : 'Lengkapi data site dan upload dokumentasi foto'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Upload Foto Estetik */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Dokumentasi Foto
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-3 sm:p-4 transition text-center">
              {imagePreview ? (
                <div className="relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-44 h-28 object-cover rounded-xl shadow-md border border-slate-200 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition cursor-pointer"
                    title="Hapus foto"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-1.5 shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 hover:underline">
                    Pilih File Foto
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG, atau WEBP (Maksimal 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Nama Perusahaan */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Perusahaan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Contoh: PT Teknologi Nusantara"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50 hover:bg-white transition"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Contoh: Jl. Jendral Sudirman No. 45, Jakarta"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50 hover:bg-white transition"
                />
              </div>
            </div>

            {/* PIC & Nomor WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nama PIC <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50 hover:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Nomor WA PIC <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.pic_phone}
                    onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                    placeholder="Contoh: 08123456789"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50 hover:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Status Estetik (Visual Pill Selector) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Status Site
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_CONFIGS.map((opt) => {
                  const isSelected = formData.status === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: opt.value })}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? `${opt.color} shadow-xs ring-2 scale-[1.02]`
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        opt.value === 'On Going' ? 'bg-blue-500' :
                        opt.value === 'Pending' ? 'bg-amber-500' :
                        opt.value === 'Approve' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}></span>
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Keterangan Tambahan
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan progres, kendala, atau spesifikasi khusus..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50/50 hover:bg-white transition resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{editingSite ? 'Simpan Perubahan' : 'Tambahkan Site'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
