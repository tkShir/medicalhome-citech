'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Job {
  id: string
  facility: string
  job_type: string
  employment_type: string
  title: string
  is_active: boolean
  total_salary_min: number | null
  total_salary_max: number | null
  updated_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success?: string; error?: string } | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function loadJobs() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/jobs')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch {
      console.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload-jobs', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setUploadResult({ success: data.message })
        await loadJobs()
      } else {
        setUploadResult({ error: data.error || 'アップロードに失敗しました' })
      }
    } catch {
      setUploadResult({ error: 'エラーが発生しました' })
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function toggleActive(job: Job) {
    setTogglingId(job.id)
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !job.is_active }),
      })
      if (res.ok) {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, is_active: !j.is_active } : j))
      }
    } catch {
      console.error('Toggle failed')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const activeCount = jobs.filter(j => j.is_active).length
  const inactiveCount = jobs.filter(j => !j.is_active).length

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Header */}
      <header className="bg-white border-b border-lightgray px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-lg text-green-deeper">管理画面</h1>
          <span className="font-sans text-xs text-midgray">求人管理</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/recruit"
            target="_blank"
            className="font-sans text-xs text-green-dark hover:underline"
          >
            求人ページを確認 →
          </a>
          <button
            onClick={handleLogout}
            className="font-sans text-xs text-midgray hover:text-darkgray transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* CSV Upload section */}
        <div className="bg-white border border-lightgray p-6 md:p-8">
          <h2 className="font-serif text-base text-green-deeper mb-1">CSVアップロード</h2>
          <div className="w-6 h-0.5 bg-green-main mb-4" />
          <p className="font-sans text-xs text-darkgray/70 mb-5 leading-relaxed">
            Google SheetsからエクスポートしたCSVファイルをアップロードすると、求人情報が自動で更新されます。<br />
            CSVに含まれない求人は自動的に非公開になります。
          </p>

          <div className="flex items-center gap-4">
            <label className={`inline-flex items-center gap-2 px-5 py-2.5 font-sans text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-lightgray text-midgray cursor-not-allowed' : 'bg-green-main text-white hover:bg-green-dark'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploading ? 'アップロード中...' : 'CSVファイルを選択'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleUpload}
                disabled={uploading}
                className="sr-only"
              />
            </label>

            {uploadResult?.success && (
              <div className="flex items-center gap-2 text-green-dark">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-sans text-xs">{uploadResult.success}</span>
              </div>
            )}
            {uploadResult?.error && (
              <div className="flex items-center gap-2 text-pink-main">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-sans text-xs">{uploadResult.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Job listings table */}
        <div className="bg-white border border-lightgray p-6 md:p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif text-base text-green-deeper">求人一覧</h2>
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-green-dark bg-green-light px-2 py-0.5">公開 {activeCount}</span>
              <span className="font-sans text-xs text-midgray bg-offwhite border border-lightgray px-2 py-0.5">非公開 {inactiveCount}</span>
            </div>
          </div>
          <div className="w-6 h-0.5 bg-green-main mb-6" />

          {loading ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-midgray">読み込み中...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-lightgray">
              <p className="font-sans text-sm text-midgray mb-2">求人データがありません</p>
              <p className="font-sans text-xs text-midgray/70">CSVをアップロードして求人を登録してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="border-b border-lightgray">
                    <th className="text-left py-2 pr-4 text-midgray font-medium">施設</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium">職種</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium">雇用形態</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium hidden md:table-cell">タイトル</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium hidden md:table-cell">給与総額</th>
                    <th className="text-left py-2 pr-4 text-midgray font-medium">状態</th>
                    <th className="text-left py-2 text-midgray font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className={`border-b border-lightgray/50 hover:bg-offwhite/50 ${!job.is_active ? 'opacity-50' : ''}`}>
                      <td className="py-3 pr-4 text-darkgray">{job.facility}</td>
                      <td className="py-3 pr-4 text-darkgray">{job.job_type}</td>
                      <td className="py-3 pr-4 text-darkgray">{job.employment_type}</td>
                      <td className="py-3 pr-4 text-darkgray/80 hidden md:table-cell max-w-xs truncate">{job.title}</td>
                      <td className="py-3 pr-4 text-darkgray hidden md:table-cell">
                        {job.total_salary_min && job.total_salary_max
                          ? `¥${job.total_salary_min.toLocaleString()} – ¥${job.total_salary_max.toLocaleString()}`
                          : job.total_salary_min
                          ? `¥${job.total_salary_min.toLocaleString()}〜`
                          : '—'}
                      </td>
                      <td className="py-3 pr-4">
                        {job.is_active ? (
                          <span className="text-green-dark bg-green-light px-2 py-0.5">公開</span>
                        ) : (
                          <span className="text-midgray bg-offwhite border border-lightgray px-2 py-0.5">非公開</span>
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => toggleActive(job)}
                          disabled={togglingId === job.id}
                          className="text-green-dark hover:text-green-deeper underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {togglingId === job.id ? '...' : job.is_active ? '非公開にする' : '公開する'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
