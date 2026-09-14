import React, { useState } from 'react'
import { Lock, User, Database, AlertCircle, ArrowRight, Clock } from 'lucide-react'

export function LoginPage({ onLoginSuccess, idleNotice = '' }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
        setError('Username atau Password yang Anda masukkan salah. Silakan coba lagi.')
      }
      setIsLoading(false)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center px-4 font-sans text-slate-900">
      
      {/* Spacer Atas */}
      <div className="h-6"></div>

      {/* Card Login Minimalis */}
      <div className="w-full max-w-sm my-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          
          {/* Header Brand Minimalis */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 m-0">
              MY KDBASE
            </h1>
            <p className="text-xs text-slate-400 m-0 mt-1">
              Masuk untuk mengelola database site
            </p>
          </div>

          {/* Notifikasi Sesi AFK / Idle 10 Menit */}
          {idleNotice && !error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-xl animate-in fade-in">
              <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="leading-snug">{idleNotice}</div>
            </div>
          )}

          {/* Pesan Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-slate-50/50 hover:bg-white transition"
                />
              </div>
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
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

      {/* Footer Paling Bawah */}
      <footer className="w-full py-5 border-t border-slate-200/60 text-center text-xs text-slate-400">
        © 2026 Rittergeistworks by Padeswaraa. All rights reserved.
      </footer>

    </div>
  )
}
