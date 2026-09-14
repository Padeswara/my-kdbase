import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const STORAGE_KEY = 'kdbase_sites_local'

const DEFAULT_DEMO_SITES = [
  {
    id: 'demo-1',
    company_name: 'PT Teknologi Nusantara',
    address: 'Jl. Jendral Sudirman No. 45, Jakarta Selatan',
    pic_name: 'Budi Santoso',
    pic_phone: '081234567890',
    status: 'On Going',
    notes: 'Instalasi jaringan server tahap 1 dan penarikan fiber optik gedung utama.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'demo-2',
    company_name: 'CV Mitra Mandiri Perkasa',
    address: 'Jl. Pemuda No. 12, Surabaya, Jawa Timur',
    pic_name: 'Siti Rahma',
    pic_phone: '085712345678',
    status: 'Approve',
    notes: 'Dokumentasi kontrak & izin lingkungan sudah diverifikasi lengkap.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'demo-3',
    company_name: 'PT Samudra Logistics Indah',
    address: 'Kawasan Industri Cikarang Blok B4, Bekasi',
    pic_name: 'Hendra Wijaya',
    pic_phone: '081398765432',
    status: 'Pending',
    notes: 'Menunggu review biaya dan persetujuan dari direktur operasional.',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  },
  {
    id: 'demo-4',
    company_name: 'PT Buana Solusindo',
    address: 'Jl. Ahmad Yani KM 7, Bandung',
    pic_name: 'Rian Pratama',
    pic_phone: '087811223344',
    status: 'Decline',
    notes: 'Spesifikasi teknis belum memenuhi standar minimum proyek.',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString()
  }
]

// Helper konversi file gambar ke Base64 (untuk fallback mode lokal)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export function useSites() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSupabaseMode] = useState(isSupabaseConfigured)

  // 1. Fetch data dari Supabase atau LocalStorage
  const fetchSites = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: sbError } = await supabase
          .from('sites')
          .select('*')
          .order('created_at', { ascending: false })

        if (sbError) throw sbError
        setSites(data || [])
      } catch (err) {
        console.error('Gagal mengambil data dari Supabase:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      // Fallback Local Storage
      try {
        const localData = localStorage.getItem(STORAGE_KEY)
        if (localData) {
          setSites(JSON.parse(localData))
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_SITES))
          setSites(DEFAULT_DEMO_SITES)
        }
      } catch (err) {
        console.error('Gagal membaca data lokal:', err)
        setSites(DEFAULT_DEMO_SITES)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  // Helper upload image
  const uploadImage = async (file) => {
    if (!file) return null

    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `sites/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file)

      if (uploadError) {
        console.warn('Gagal upload ke Supabase Storage, fallback ke Base64:', uploadError)
        return await fileToBase64(file)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath)

      return publicUrl
    } else {
      // Fallback konversi ke Base64 lokal
      return await fileToBase64(file)
    }
  }

  // 2. Tambah Site Baru
  const addSite = async (newSiteData, imageFile) => {
    try {
      let imageUrl = newSiteData.image_url || null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const payload = {
        company_name: newSiteData.company_name.trim(),
        address: newSiteData.address.trim(),
        pic_name: newSiteData.pic_name.trim(),
        pic_phone: newSiteData.pic_phone.trim(),
        status: newSiteData.status || 'Pending',
        notes: newSiteData.notes ? newSiteData.notes.trim() : '',
        image_url: imageUrl,
        created_at: new Date().toISOString()
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error: insertError } = await supabase
          .from('sites')
          .insert([payload])
          .select()
          .single()

        if (insertError) throw insertError
        setSites((prev) => [data, ...prev])
        return { success: true, data }
      } else {
        // Mode Lokal
        const localItem = {
          ...payload,
          id: `site-${Date.now()}`
        }
        setSites((prev) => {
          const updated = [localItem, ...prev]
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        return { success: true, data: localItem }
      }
    } catch (err) {
      console.error('Error saat menambah site:', err)
      return { success: false, error: err.message }
    }
  }

  // 3. Update Status Cepat (dari Tabel / Preview)
  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic update di UI
      setSites((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )

      if (isSupabaseConfigured && supabase) {
        const { error: updateError } = await supabase
          .from('sites')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (updateError) {
          fetchSites() // rollback jika gagal
          throw updateError
        }
      } else {
        // Update Local Storage
        const localData = localStorage.getItem(STORAGE_KEY)
        if (localData) {
          const parsed = JSON.parse(localData)
          const updated = parsed.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
      }
      return { success: true }
    } catch (err) {
      console.error('Error update status:', err)
      return { success: false, error: err.message }
    }
  }

  // 4. Update Seluruh Data Site
  const updateSite = async (id, updatedFields, newImageFile) => {
    try {
      let imageUrl = updatedFields.image_url
      if (newImageFile) {
        imageUrl = await uploadImage(newImageFile)
      }

      const payload = {
        ...updatedFields,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error: updateError } = await supabase
          .from('sites')
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (updateError) throw updateError
        setSites((prev) => prev.map((item) => (item.id === id ? data : item)))
        return { success: true, data }
      } else {
        setSites((prev) => {
          const updated = prev.map((item) =>
            item.id === id ? { ...item, ...payload } : item
          )
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        return { success: true }
      }
    } catch (err) {
      console.error('Error update site:', err)
      return { success: false, error: err.message }
    }
  }

  // 5. Hapus Site
  const deleteSite = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data site ini?')) {
      return { success: false }
    }

    try {
      setSites((prev) => prev.filter((item) => item.id !== id))

      if (isSupabaseConfigured && supabase) {
        const { error: deleteError } = await supabase
          .from('sites')
          .delete()
          .eq('id', id)

        if (deleteError) {
          fetchSites() // rollback
          throw deleteError
        }
      } else {
        const localData = localStorage.getItem(STORAGE_KEY)
        if (localData) {
          const parsed = JSON.parse(localData)
          const updated = parsed.filter((item) => item.id !== id)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        }
      }
      return { success: true }
    } catch (err) {
      console.error('Error delete site:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    sites,
    loading,
    error,
    isSupabaseMode,
    fetchSites,
    addSite,
    updateSite,
    updateStatus,
    deleteSite
  }
}

