import React, { useState, useEffect } from 'react'
import { X, Upload, Building2, MapPin, User, Phone } from 'lucide-react'

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
        setErrorMsg('Image file size must be less than 5MB!')
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
      setErrorMsg('Company Name is required!')
      return
    }
    if (!formData.address.trim()) {
      setErrorMsg('Address is required!')
      return
    }
    if (!formData.pic_name.trim()) {
      setErrorMsg('PIC Name is required!')
      return
    }
    if (!formData.pic_phone.trim()) {
      setErrorMsg('PIC WhatsApp Number is required!')
      return
    }

    setIsSubmitting(true)
    const result = await onSave(formData, imageFile)
    setIsSubmitting(false)

    if (result?.success) {
      onClose()
    } else {
      setErrorMsg(result?.error || 'An error occurred while saving data.')
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/80 my-auto animate-in zoom-in-95 duration-150"
        className="relative w-full max-w-lg glass-modal rounded-3xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 bg-white/60 backdrop-blur-md border-b border-slate-200/60">
        <div className="flex items-center justify-between px-6 py-5 bg-white/45 backdrop-blur-md border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 m-0 leading-tight tracking-tight">
                {editingSite ? 'Edit Site Data' : 'Add New Site'}
              </h2>
              <p className="text-xs text-slate-400 m-0 mt-0.5">
                {editingSite ? 'Update location details' : 'Fill in site information and upload photo documentation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-full transition cursor-pointer backdrop-blur-sm"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-in fade-in">
            <div className="p-3 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-in fade-in backdrop-blur-sm">
              {errorMsg}
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Photo Documentation
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl p-3 sm:p-4 transition text-center">
            <div className="border-2 border-dashed border-slate-300/80 hover:border-slate-400 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-2xl p-3 sm:p-4 transition text-center shadow-2xs">
              {imagePreview ? (
                <div className="relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-44 h-28 object-cover rounded-xl shadow-xs border border-slate-200 mx-auto"
                    className="w-44 h-28 object-cover rounded-xl shadow-xs border border-white/80 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 mb-1.5 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-white/90 border border-white flex items-center justify-center text-slate-700 mb-1.5 shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 hover:underline">
                    Choose Photo File
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG, or WEBP (Max 5MB)
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
            {/* Company Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Acme Technologies"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 123 Main Street, Suite 400"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* PIC & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  PIC Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.pic_name}
                    onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  PIC WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.pic_phone}
                    onChange={(e) => setFormData({ ...formData, pic_phone: e.target.value })}
                    placeholder="e.g. 08123456789"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900"
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Site Status
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
                          ? `${opt.color} shadow-xs ring-2 scale-[1.02] backdrop-blur-sm`
                          : 'border-white/80 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/90 hover:text-slate-900'
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

            {/* Additional Notes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Progress notes, obstacles, or specifications..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition text-slate-900 resize-none"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl glass-input text-slate-900 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 glass-btn-secondary rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-98"
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md shadow-slate-900/15 transition duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingSite ? 'Save Changes' : 'Add Site'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
