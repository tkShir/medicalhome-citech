'use client'

import { useState, useEffect, useCallback } from 'react'

interface ContactSubmission {
  id: string
  last_name: string
  first_name: string
  email: string
  job_title: string | null
  company: string | null
  message: string
  agreed_to_privacy_policy: boolean
  // テーブルによって列名が異なる場合があるため両方定義
  created_at?: string
  submitted_at?: string
}

function getTimestamp(s: ContactSubmission): string {
  return s.created_at ?? s.submitted_at ?? ''
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2.5 border-b border-lightgray/50">
      <span className="font-sans text-xs text-midgray w-24 flex-shrink-0">{label}</span>
      <span className="font-sans text-xs text-darkgray break-all">{value}</span>
    </div>
  )
}

export default function ContactSection() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetch('/api/admin/submissions/contact')
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.detail || data.error || 'データの取得に失敗しました')
        setSubmissions([])
        return
      }
      setSubmissions(data.submissions || [])
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Escape key to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(null); setConfirmDelete(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/submissions/contact/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== id))
        setSelected(null)
        setConfirmDelete(false)
      }
    } catch {
      console.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-base text-green-deeper mb-1">お問い合わせ一覧</h2>
          <div className="w-6 h-0.5 bg-green-main" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-midgray">{submissions.length}件</span>
          <button onClick={load} className="font-sans text-xs text-green-dark hover:underline">
            更新
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center bg-white border border-lightgray">
          <p className="font-sans text-sm text-midgray">読み込み中...</p>
        </div>
      ) : apiError ? (
        <div className="bg-white border border-lightgray p-6">
          <div className="flex items-start gap-3 text-pink-main">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.99L13.75 4a2 2 0 00-3.5 0L3.25 16A2 2 0 005.07 19z" />
            </svg>
            <div>
              <p className="font-sans text-sm font-medium text-darkgray">データの取得に失敗しました</p>
              <p className="font-sans text-xs text-midgray mt-1 font-mono break-all">{apiError}</p>
              <button onClick={load} className="font-sans text-xs text-green-dark hover:underline mt-3">
                再試行する
              </button>
            </div>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-lightgray bg-white">
          <p className="font-sans text-sm text-midgray">お問い合わせはまだありません</p>
        </div>
      ) : (
        <div className="bg-white border border-lightgray overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-lightgray bg-offwhite">
                <th className="text-left py-3 px-4 text-midgray font-medium whitespace-nowrap">受信日時</th>
                <th className="text-left py-3 px-4 text-midgray font-medium">名前</th>
                <th className="text-left py-3 px-4 text-midgray font-medium">メールアドレス</th>
                <th className="text-left py-3 px-4 text-midgray font-medium hidden md:table-cell">会社・役職</th>
                <th className="text-left py-3 px-4 text-midgray font-medium hidden lg:table-cell">メッセージ</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => { setSelected(s); setConfirmDelete(false) }}
                  className="border-b border-lightgray/50 hover:bg-green-light/20 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-darkgray whitespace-nowrap">{formatDate(getTimestamp(s))}</td>
                  <td className="py-3 px-4 text-darkgray whitespace-nowrap">{s.last_name} {s.first_name}</td>
                  <td className="py-3 px-4 text-darkgray">{s.email}</td>
                  <td className="py-3 px-4 text-darkgray/70 hidden md:table-cell">
                    {[s.company, s.job_title].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="py-3 px-4 text-darkgray/60 max-w-xs truncate hidden lg:table-cell">
                    {s.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => { setSelected(null); setConfirmDelete(false) }}
        >
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-lightgray flex-shrink-0">
              <div>
                <h3 className="font-serif text-base text-green-deeper">お問い合わせ詳細</h3>
                <p className="font-sans text-xs text-midgray mt-0.5">{formatDate(getTimestamp(selected))}</p>
              </div>
              <button
                onClick={() => { setSelected(null); setConfirmDelete(false) }}
                className="text-midgray hover:text-darkgray transition-colors p-1"
                aria-label="閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <DetailRow label="氏名" value={`${selected.last_name} ${selected.first_name}`} />
              <DetailRow label="会社名" value={selected.company} />
              <DetailRow label="役職" value={selected.job_title} />
              <div className="flex gap-4 py-2.5 border-b border-lightgray/50">
                <span className="font-sans text-xs text-midgray w-24 flex-shrink-0">メール</span>
                <a
                  href={`mailto:${selected.email}`}
                  className="font-sans text-xs text-green-dark hover:underline break-all"
                >
                  {selected.email}
                </a>
              </div>
              <div className="py-3">
                <p className="font-sans text-xs text-midgray mb-2">メッセージ</p>
                <p className="font-sans text-sm text-darkgray leading-relaxed whitespace-pre-wrap bg-offwhite p-4 border border-lightgray/50">
                  {selected.message}
                </p>
              </div>
            </div>

            {/* Modal footer – delete */}
            <div className="px-6 pb-6 flex-shrink-0 border-t border-lightgray pt-4">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="font-sans text-xs text-pink-main border border-pink-main/50 px-4 py-2 hover:bg-pink-light transition-colors"
                >
                  このデータを削除する
                </button>
              ) : (
                <div className="bg-pink-light border border-pink-main/30 p-4">
                  <p className="font-sans text-xs text-darkgray mb-3">
                    本当に削除しますか？この操作は元に戻せません。
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDelete(selected.id)}
                      disabled={deleting}
                      className="font-sans text-xs bg-pink-main text-white px-4 py-2 hover:bg-pink-dark transition-colors disabled:opacity-50"
                    >
                      {deleting ? '削除中...' : '削除する'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="font-sans text-xs text-midgray hover:text-darkgray transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
