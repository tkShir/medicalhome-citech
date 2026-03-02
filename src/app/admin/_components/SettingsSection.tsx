'use client'

import { useState, useEffect, useCallback } from 'react'

interface SettingsData {
  settings: Record<string, string>
  fromEmail: string
  resendConfigured: boolean
}

export default function SettingsSection() {
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 通知先メール一覧（カンマ区切り文字列 → 配列）
  const [emails, setEmails] = useState<string[]>([])
  const [addingEmail, setAddingEmail] = useState(false)
  const [newEmailValue, setNewEmailValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{ success?: string; error?: string } | null>(null)

  const parseEmails = (raw: string | undefined): string[] => {
    if (!raw) return []
    return raw.split(',').map(e => e.trim()).filter(Boolean)
  }

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to load settings')
      const json: SettingsData = await res.json()
      setData(json)
      setEmails(parseEmails(json.settings.notification_email))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  async function saveEmails(list: string[]) {
    setSaving(true)
    setSaveResult(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'notification_email', value: list.join(',') }),
      })
      if (!res.ok) throw new Error('保存に失敗しました')
      setSaveResult({ success: '保存しました' })
      await fetchSettings()
    } catch (err) {
      setSaveResult({ error: err instanceof Error ? err.message : '保存に失敗しました' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAddEmail() {
    const trimmed = newEmailValue.trim()
    if (!trimmed) return
    if (emails.includes(trimmed)) {
      setSaveResult({ error: 'すでに登録されているアドレスです' })
      return
    }
    const updated = [...emails, trimmed]
    setEmails(updated)
    setNewEmailValue('')
    setAddingEmail(false)
    await saveEmails(updated)
  }

  async function handleRemoveEmail(email: string) {
    const updated = emails.filter(e => e !== email)
    setEmails(updated)
    await saveEmails(updated)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="font-sans text-sm text-midgray">読み込み中...</p>
      </div>
    )
  }

  if (error) {
    const isTableMissing = error.includes('Failed to load') || error.includes('relation') || error.includes('does not exist')
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-5">
        <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-sans text-sm font-medium text-amber-800">設定テーブルが見つかりません</p>
            <p className="font-sans text-xs text-amber-700 mt-1 leading-relaxed">
              {isTableMissing
                ? 'Supabase に settings テーブルが作成されていません。以下の SQL を実行してください。'
                : error}
            </p>
          </div>
        </div>

        {isTableMissing && (
          <>
            <div className="bg-white border border-lightgray p-6">
              <p className="font-sans text-xs text-midgray tracking-widest uppercase mb-3">手順 1 — Supabase で SQL を実行</p>
              <p className="font-sans text-xs text-darkgray/70 mb-3 leading-relaxed">
                Supabase ダッシュボード → <strong>SQL Editor</strong> に以下を貼り付けて実行してください。
              </p>
              <pre className="bg-offwhite border border-lightgray p-4 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre leading-relaxed">{`CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 通知先メールの初期値（カンマ区切りで複数設定可）
INSERT INTO settings (key, value)
VALUES ('notification_email', 'your-email@example.com');`}</pre>
            </div>

            <div className="bg-white border border-lightgray p-6">
              <p className="font-sans text-xs text-midgray tracking-widest uppercase mb-3">
                代替手順 — 環境変数で設定（Supabase 不要）
              </p>
              <p className="font-sans text-xs text-darkgray/70 mb-3 leading-relaxed">
                settings テーブルを作らない場合は、Vercel の環境変数{' '}
                <code className="bg-offwhite border border-lightgray px-1 py-0.5">NOTIFICATION_EMAIL</code>{' '}
                に通知先アドレスを設定するだけで動作します。複数アドレスはカンマ区切りで指定できます。ただし管理画面からの変更はできなくなります。
              </p>
              <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray">{`NOTIFICATION_EMAIL=a@example.com,b@example.com`}</pre>
            </div>
          </>
        )}

        <button
          onClick={fetchSettings}
          className="font-sans text-xs text-green-dark hover:underline"
        >
          再読み込み
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

      {/* Resend 設定状況バナー */}
      {!data?.resendConfigured && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-sans text-sm font-medium text-amber-800">Resend が未設定です</p>
            <p className="font-sans text-xs text-amber-700 mt-1 leading-relaxed">
              メール通知を有効にするには、Vercel の環境変数に{' '}
              <code className="bg-amber-100 px-1 py-0.5 text-xs">RESEND_API_KEY</code> と{' '}
              <code className="bg-amber-100 px-1 py-0.5 text-xs">RESEND_FROM_EMAIL</code>{' '}
              を設定してください。
            </p>
          </div>
        </div>
      )}

      {/* メール通知設定 */}
      <div className="bg-white border border-lightgray p-6 md:p-8">
        <h2 className="font-serif text-base text-green-deeper mb-1">メール通知設定</h2>
        <div className="w-6 h-0.5 bg-green-main mb-6" />

        {/* 通知先メール一覧 */}
        <div className="mb-6">
          <label className="font-sans text-xs text-midgray tracking-widest uppercase block mb-2">
            通知先メールアドレス
          </label>
          <p className="font-sans text-xs text-darkgray/60 mb-4 leading-relaxed">
            お問い合わせ・採用応募フォームが送信されたとき、登録されたすべてのアドレスに通知メールが届きます。
          </p>

          {/* 登録済みアドレス一覧 */}
          <div className="space-y-2 mb-3">
            {emails.length === 0 ? (
              <div className="bg-offwhite border border-lightgray px-3 py-2.5">
                <span className="font-sans text-sm text-midgray italic">未設定</span>
              </div>
            ) : (
              emails.map((email) => (
                <div key={email} className="flex items-center gap-3 bg-offwhite border border-lightgray px-3 py-2.5">
                  <span className="font-sans text-sm text-darkgray flex-1">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    disabled={saving}
                    className="font-sans text-xs text-pink-main hover:text-pink-dark transition-colors disabled:opacity-50 flex-shrink-0"
                    aria-label={`${email} を削除`}
                  >
                    削除
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 追加フォーム */}
          {addingEmail ? (
            <div className="space-y-2">
              <input
                type="email"
                value={newEmailValue}
                onChange={(e) => setNewEmailValue(e.target.value)}
                placeholder="notification@example.com"
                className="w-full font-sans text-sm text-darkgray border border-lightgray px-3 py-2.5 focus:outline-none focus:border-green-main"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddEmail()
                  if (e.key === 'Escape') {
                    setAddingEmail(false)
                    setNewEmailValue('')
                    setSaveResult(null)
                  }
                }}
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddEmail}
                  disabled={saving || !newEmailValue.trim()}
                  className="font-sans text-sm font-medium bg-green-main text-white px-5 py-2 hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : '追加する'}
                </button>
                <button
                  onClick={() => {
                    setAddingEmail(false)
                    setNewEmailValue('')
                    setSaveResult(null)
                  }}
                  disabled={saving}
                  className="font-sans text-sm text-midgray hover:text-darkgray transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setAddingEmail(true)
                setSaveResult(null)
              }}
              className="font-sans text-sm text-green-dark hover:text-green-deeper transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              アドレスを追加
            </button>
          )}

          {saveResult?.error && (
            <p className="font-sans text-xs text-pink-main mt-2">{saveResult.error}</p>
          )}
          {saveResult?.success && (
            <div className="mt-3 flex items-center gap-2 text-green-dark">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-sans text-xs">{saveResult.success}</span>
            </div>
          )}
        </div>

        {/* 送信元メール（読み取り専用） */}
        <div className="pt-6 border-t border-lightgray">
          <label className="font-sans text-xs text-midgray tracking-widest uppercase block mb-2">
            送信元メールアドレス
          </label>
          <p className="font-sans text-xs text-darkgray/60 mb-3 leading-relaxed">
            通知メールの差出人アドレスです。変更するには Vercel の環境変数{' '}
            <code className="bg-offwhite border border-lightgray px-1 py-0.5 text-xs">RESEND_FROM_EMAIL</code>{' '}
            を更新してください。
          </p>
          <div className="bg-offwhite border border-lightgray px-3 py-2.5">
            {data?.fromEmail ? (
              <span className="font-sans text-sm text-darkgray/70">{data.fromEmail}</span>
            ) : (
              <span className="font-sans text-sm text-midgray italic">RESEND_FROM_EMAIL 未設定</span>
            )}
          </div>
        </div>
      </div>

      {/* 通知内容の説明 */}
      <div className="bg-white border border-lightgray p-6 md:p-8">
        <h2 className="font-serif text-base text-green-deeper mb-1">通知メールの種類</h2>
        <div className="w-6 h-0.5 bg-green-main mb-5" />
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-green-light flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-deeper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-darkgray">お問い合わせ通知</p>
              <p className="font-sans text-xs text-darkgray/60 mt-0.5">
                件名：【お問い合わせ】〇〇様よりお問い合わせが届きました
              </p>
              <p className="font-sans text-xs text-darkgray/50 mt-0.5">
                名前・メール・会社・役職・メッセージを含みます
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-green-light flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-deeper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-darkgray">採用応募通知</p>
              <p className="font-sans text-xs text-darkgray/60 mt-0.5">
                件名：【採用応募】〇〇様より応募が届きました
              </p>
              <p className="font-sans text-xs text-darkgray/50 mt-0.5">
                名前・メール・電話・職種・希望施設・応募求人・メッセージを含みます
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 更新ボタン */}
      <div className="flex justify-end">
        <button
          onClick={fetchSettings}
          className="font-sans text-xs text-midgray hover:text-darkgray transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          更新
        </button>
      </div>

    </div>
  )
}
