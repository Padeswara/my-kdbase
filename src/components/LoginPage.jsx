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
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between items-center px-4 font-sans text-slate-900">
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-200/35 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl" />
      </div>

      {/* Top Spacer */}
      <div className="h-6"></div>

      {/* Minimalist Glass Login Card */}
      <div className="w-full max-w-sm my-auto">
        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
          
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 m-0">
              MY KDBASE
            </h1>
            <p className="text-xs text-slate-400 m-0 mt-1">
              Sign in to manage the site database
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-[14px] py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200/80 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white/60 hover:bg-white focus:bg-white backdrop-blur-sm transition text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-[14px] py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200/80 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white/60 hover:bg-white focus:bg-white backdrop-blur-sm transition text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
      <footer className="w-full py-5 border-t border-white/80 text-center text-xs text-slate-400 bg-white/40 backdrop-blur-md">
        © 2026 Rittergeistworks by Padeswaraa. All rights reserved.
      </footer>

      {/* Session Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/80 text-center relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowTimeoutModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Timeout Clock Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-xs">
              <Clock className="w-7 h-7" />
            </div>

            {/* Title & Message */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              Session Expired
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              {idleNotice || 'You have been inactive for 10 minutes. For your account security, please sign in again.'}
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => setShowTimeoutModal(false)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition duration-200 cursor-pointer active:scale-98"
            >
              Sign In Again
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
