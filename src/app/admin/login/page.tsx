'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(from)
      } else {
        const data = await res.json()
        setError(data.error || 'ログインに失敗しました')
      }
    } catch {
      setError('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <p className="font-sans text-xs tracking-widest text-green-dark uppercase mb-2">Admin</p>
          <h1 className="font-serif text-2xl text-green-deeper">管理画面</h1>
          <div className="w-8 h-0.5 bg-green-main mx-auto mt-3" />
        </div>

        {/* Login card */}
        <div className="bg-white border border-lightgray p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="管理者パスワードを入力"
                autoFocus
              />
            </div>

            {error && (
              <p className="font-sans text-xs text-pink-main bg-pink-light px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="font-sans text-xs text-midgray hover:text-green-dark transition-colors">
            ← サイトトップへ戻る
          </a>
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-offwhite flex items-center justify-center"><p className="font-sans text-sm text-midgray">読み込み中...</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
