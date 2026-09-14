import { useEffect, useRef, useCallback } from 'react'

// 10 menit dalam milidetik
const IDLE_TIMEOUT_MS = 10 * 60 * 1000 
const ACTIVITY_STORAGE_KEY = 'kdbase_last_activity'

/**
 * Hook untuk mendeteksi kondisi AFK / idle pengguna selama 10 menit
 * @param {Function} onIdle - Callback yang dipanggil saat idle 10 menit
 * @param {boolean} enabled - Apakah timer aktif (hanya aktif jika sudah login)
 */
export function useIdleTimer({ onIdle, enabled = true }) {
  const timerRef = useRef(null)

  const resetTimer = useCallback(() => {
    if (!enabled) return

    // Simpan waktu aktivitas terakhir di localStorage
    localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString())

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Pasang timer 10 menit
    timerRef.current = setTimeout(() => {
      onIdle()
    }, IDLE_TIMEOUT_MS)
  }, [enabled, onIdle])

  useEffect(() => {
    if (!enabled) return

    // 1. Cek saat tab dibuka kembali: apakah sudah idle > 10 menit
    const lastActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY)
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10)
      if (elapsed >= IDLE_TIMEOUT_MS) {
        onIdle()
        return
      }
    }

    // 2. Mulai timer
    resetTimer()

    // 3. Deteksi aktivitas: mouse, ketik, sentuhan HP, scroll
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click'
    ]

    let throttleTimer = null
    const handleActivity = () => {
      if (!throttleTimer) {
        resetTimer()
        throttleTimer = setTimeout(() => {
          throttleTimer = null
        }, 1000) // Batasi deteksi per 1 detik agar performa tetap ringan
      }
    }

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true })
    })

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (throttleTimer) clearTimeout(throttleTimer)
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleActivity)
      })
    }
  }, [enabled, onIdle, resetTimer])
}

