import React, { useState, useEffect } from 'react'
import { Database, AlertCircle, ArrowRight, Clock, X } from 'lucide-react'

export function LoginPage({ onLoginSuccess, idleNotice = '' }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(Boolean(idleNotice))

  useEffect(() => {
    if (idleNotice) {
      setShowTimeoutModal(true)
    }
  }, [idleNotice])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      if (username === 'Keils00' && password === 'Keils00') {
        localStorage.setItem('kdbase_auth_session', JSON.stringify({
          username: 'Keils00',
          loggedInAt: new Date().toISOString()
        }))
        localStorage.setItem('kdbase_last_activity', Date.now().toString())
        onLoginSuccess('Keils00')
      } else {
        setError('Invalid username or password. Please try again.')
      }
      setIsLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between items-center px-4 font-sans text-slate-100 bg-[#0b0f19]">
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-88 h-88 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-88 h-88 bg-emerald-600/20 rounded-full blur-3xl" />
      </div>

      {/* Top Spacer */}
      <div className="h-6"></div>

      {/* Minimalist Glass Login Card */}
      <div className="w-full max-w-sm my-auto">
        <div className="glass-modal rounded-3xl p-6 sm:p-8 relative">
          
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md shadow-white/10">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white m-0">
              MY KDBASE
            </h1>
            <p className="text-xs text-slate-400 m-0 mt-1">
              Sign in to manage the site database
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl animate-in fade-in backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-[14px] py-2.5 text-xs sm:text-sm rounded-xl glass-input text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-[14px] py-2.5 text-xs sm:text-sm rounded-xl glass-input text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-white/10 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-5 border-t border-white/10 text-center text-xs text-slate-400 bg-slate-950/40 backdrop-blur-xl">
        © 2026 Rittergeistworks by Padeswaraa. All rights reserved.
      </footer>

      {/* Session Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-modal rounded-3xl p-6 sm:p-7 text-center relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowTimeoutModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer backdrop-blur-sm"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Timeout Clock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-sm shadow-amber-500/20">
              <Clock className="w-7 h-7" />
            </div>

            {/* Title & Message */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              Session Expired
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {idleNotice || 'You have been inactive for 10 minutes. For your account security, please sign in again.'}
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setShowTimeoutModal(false)}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-white/10 transition duration-200 cursor-pointer active:scale-98"
            >
              Sign In Again
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
