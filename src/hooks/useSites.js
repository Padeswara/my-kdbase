import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const STORAGE_KEY = 'kdbase_sites_local'

const DEFAULT_DEMO_SITES = []

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
  const [isDbOnline, setIsDbOnline] = useState(false)

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
        setIsDbOnline(true)
      } catch (err) {
        console.error('Gagal mengambil data dari Supabase:', err)
        setError(err.message)
        setIsDbOnline(false)
      } finally {
        setLoading(false)
      }
    } else {
      setIsDbOnline(false)
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

    // Otomatis cek & sambung ulang saat HP kembali online atau tab dibuka kembali
    const handleOnline = () => {
      fetchSites()
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSites()
      }
    }

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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
    isDbOnline,
    fetchSites,
    addSite,
    updateSite,
    updateStatus,
    deleteSite
  }
}

