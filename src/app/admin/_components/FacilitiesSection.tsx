'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type FacilityStatus = 'not_published' | 'coming_soon' | 'open'

interface FacilityImage {
  id: string
  url: string
  storage_path: string | null
  sort_order: number
}

interface Facility {
  id: string
  name: string
  slug: string
  web_address: string | null
  status: FacilityStatus
  facility_images: FacilityImage[]
}

const STATUS_LABELS: Record<FacilityStatus, string> = {
  not_published: '非公開',
  coming_soon: 'Coming Soon',
  open: 'Open',
}

const STATUS_STYLES: Record<FacilityStatus, string> = {
  not_published: 'text-midgray bg-offwhite border border-lightgray',
  coming_soon: 'text-amber-700 bg-amber-50 border border-amber-200',
  open: 'text-green-dark bg-green-light',
}

const SETUP_SQL = `-- 施設テーブル（新規作成の場合）
CREATE TABLE IF NOT EXISTS facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id TEXT UNIQUE,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  web_address TEXT,
  tel TEXT,
  fax TEXT,
  email TEXT,
  job_medley_url TEXT,
  minnano_kaigo_url TEXT,
  google_maps_url TEXT,
  recruit_url TEXT,
  status TEXT NOT NULL DEFAULT 'not_published'
    CHECK (status IN ('not_published', 'coming_soon', 'open')),
  description TEXT,
  details TEXT,
  open_date TEXT,
  last_updated TEXT,
  director_name TEXT,
  director_title TEXT,
  director_message TEXT,
  access_nearest_station TEXT,
  access_walk_time TEXT,
  access_bus TEXT,
  access_parking TEXT,
  document_url TEXT,
  services JSONB,
  features JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 施設画像テーブル
CREATE TABLE IF NOT EXISTS facility_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`

const ALTER_SQL = `-- 既存テーブルにリッチコンテンツ列を追加（初回のみ実行）
ALTER TABLE facilities
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS details TEXT,
  ADD COLUMN IF NOT EXISTS open_date TEXT,
  ADD COLUMN IF NOT EXISTS last_updated TEXT,
  ADD COLUMN IF NOT EXISTS director_name TEXT,
  ADD COLUMN IF NOT EXISTS director_title TEXT,
  ADD COLUMN IF NOT EXISTS director_message TEXT,
  ADD COLUMN IF NOT EXISTS access_nearest_station TEXT,
  ADD COLUMN IF NOT EXISTS access_walk_time TEXT,
  ADD COLUMN IF NOT EXISTS access_bus TEXT,
  ADD COLUMN IF NOT EXISTS access_parking TEXT,
  ADD COLUMN IF NOT EXISTS document_url TEXT,
  ADD COLUMN IF NOT EXISTS services JSONB,
  ADD COLUMN IF NOT EXISTS features JSONB;`

const CSV_HEADERS = `施設名,住所,WEB表示住所,TEL ID,FAX,E-mail,ジョブメドレーURL,みんなの介護URL,GoogleMapsURL,自社採用,施設ID,Status,説明,詳細説明,オープン日,最終更新日,施設長名,施設長役職,施設長メッセージ,最寄り駅,徒歩時間,バスアクセス,駐車場,重要事項説明書URL,サービス,施設の特徴`

const FEATURES_EXAMPLE = `[{"icon":"🏥","title":"24時間看護体制","desc":"夜間を含む24時間、常駐の看護師が対応します。"},{"icon":"👨‍⚕️","title":"訪問診療との連携","desc":"定期的に訪問診療医が来訪します。"}]`

const SERVICES_EXAMPLE = `24時間看護体制|訪問診療連携|訪問看護ステーション|訪問介護ステーション|食事提供|リハビリサービス|看取りケア|グリーフケア`

export default function FacilitiesSection() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success?: string; error?: string } | null>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)

  const [changingStatusId, setChangingStatusId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [uploadingImageForId, setUploadingImageForId] = useState<string | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [imageResult, setImageResult] = useState<{ facilityId: string; success?: string; error?: string } | null>(null)
  const [deletingFacilityId, setDeletingFacilityId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const loadFacilities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/facilities')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load facilities')
      setFacilities(data.facilities || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFacilities()
  }, [loadFacilities])

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadResult(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload-facilities', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setUploadResult({ success: data.message })
        await loadFacilities()
      } else {
        setUploadResult({ error: data.error || 'アップロードに失敗しました' })
      }
    } catch {
      setUploadResult({ error: 'エラーが発生しました' })
    } finally {
      setUploading(false)
      if (csvInputRef.current) csvInputRef.current.value = ''
    }
  }

  async function handleExportCsv() {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/export-facilities')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      a.download = match ? match[1] : 'facilities.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      console.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  async function handleDeleteFacility(facilityId: string) {
    setDeletingFacilityId(facilityId)
    try {
      const res = await fetch(`/api/admin/facilities/${facilityId}`, { method: 'DELETE' })
      if (res.ok) {
        setFacilities(prev => prev.filter(f => f.id !== facilityId))
        setConfirmDeleteId(null)
      }
    } catch {
      console.error('Delete failed')
    } finally {
      setDeletingFacilityId(null)
    }
  }

  async function handleStatusChange(facility: Facility, newStatus: FacilityStatus) {
    setChangingStatusId(facility.id)
    try {
      const res = await fetch(`/api/admin/facilities/${facility.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setFacilities(prev =>
          prev.map(f => f.id === facility.id ? { ...f, status: newStatus } : f)
        )
      }
    } catch {
      console.error('Status change failed')
    } finally {
      setChangingStatusId(null)
    }
  }

  async function handleImageUpload(facilityId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImageForId(facilityId)
    setImageResult(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`/api/admin/facilities/${facilityId}/images`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setFacilities(prev =>
          prev.map(f =>
            f.id === facilityId
              ? { ...f, facility_images: [...f.facility_images, data.image] }
              : f
          )
        )
        setImageResult({ facilityId, success: '画像をアップロードしました' })
      } else {
        setImageResult({ facilityId, error: data.error || '画像のアップロードに失敗しました' })
      }
    } catch {
      setImageResult({ facilityId, error: 'エラーが発生しました' })
    } finally {
      setUploadingImageForId(null)
      e.target.value = ''
    }
  }

  async function handleImageDelete(facilityId: string, imageId: string) {
    if (!confirm('この画像を削除しますか？')) return
    setDeletingImageId(imageId)
    try {
      const res = await fetch(`/api/admin/facilities/${facilityId}/images/${imageId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setFacilities(prev =>
          prev.map(f =>
            f.id === facilityId
              ? { ...f, facility_images: f.facility_images.filter(img => img.id !== imageId) }
              : f
          )
        )
      }
    } catch {
      console.error('Image delete failed')
    } finally {
      setDeletingImageId(null)
    }
  }

  const isTableMissing = error && (
    error.includes('relation') ||
    error.includes('does not exist') ||
    error.includes('Failed to load')
  )

  if (!loading && isTableMissing) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-5">
        <div className="bg-amber-50 border border-amber-200 p-5 flex gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-sans text-sm font-medium text-amber-800">施設テーブルが見つかりません</p>
            <p className="font-sans text-xs text-amber-700 mt-1 leading-relaxed">
              Supabase にテーブルを作成し、Storage バケットを設定してください。
            </p>
          </div>
        </div>

        <div className="bg-white border border-lightgray p-6">
          <p className="font-sans text-xs text-midgray tracking-widest uppercase mb-3">手順 1 — Supabase SQL Editor で実行</p>
          <pre className="bg-offwhite border border-lightgray p-4 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre leading-relaxed">{SETUP_SQL}</pre>
        </div>

        <div className="bg-white border border-lightgray p-6">
          <p className="font-sans text-xs text-midgray tracking-widest uppercase mb-3">手順 2 — Storage バケットを作成</p>
          <p className="font-sans text-xs text-darkgray/70 mb-3 leading-relaxed">
            Supabase ダッシュボード → Storage → New bucket で以下を作成してください。
          </p>
          <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray">{`バケット名: facility-images\nPublic: ✓ (公開設定)`}</pre>
        </div>

        <button onClick={loadFacilities} className="font-sans text-xs text-green-dark hover:underline">
          再読み込み
        </button>
      </div>
    )
  }

  const publishedCount = facilities.filter(f => f.status === 'open').length
  const comingSoonCount = facilities.filter(f => f.status === 'coming_soon').length
  const unpublishedCount = facilities.filter(f => f.status === 'not_published').length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* CSV Upload */}
      <div className="bg-white border border-lightgray p-6 md:p-8">
        <h2 className="font-serif text-base text-green-deeper mb-1">CSVアップロード</h2>
        <div className="w-6 h-0.5 bg-green-main mb-4" />
        <p className="font-sans text-xs text-darkgray/70 mb-5 leading-relaxed">
          施設情報のCSVファイルをアップロードすると、施設情報が自動で更新されます。<br />
          画像はCSVに含まれないため、管理画面から個別にアップロードしてください。
        </p>
        <div className="mb-4">
          <p className="font-sans text-xs text-midgray mb-2">CSVに含める列（ヘッダー名）:</p>
          <p className="font-sans text-xs text-darkgray/60 font-mono bg-offwhite border border-lightgray px-3 py-2 leading-relaxed">
            施設名, 住所, WEB表示住所, TEL ID, FAX, E-mail, ジョブメドレーURL, みんなの介護URL, GoogleMapsURL, 自社採用, 施設ID, Status
          </p>
          <p className="font-sans text-xs text-darkgray/50 mt-1.5">
            ※ Status の値: <code className="bg-offwhite px-1">Open</code> / <code className="bg-offwhite px-1">Coming Soon</code> / <code className="bg-offwhite px-1">Not Published</code>
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <label className={`inline-flex items-center gap-2 px-5 py-2.5 font-sans text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-lightgray text-midgray cursor-not-allowed' : 'bg-green-main text-white hover:bg-green-dark'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploading ? 'アップロード中...' : 'CSVファイルを選択'}
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className={`inline-flex items-center gap-2 px-5 py-2.5 font-sans text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${exporting ? 'border-lightgray text-midgray' : 'border-green-main text-green-dark hover:bg-green-light'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exporting ? 'エクスポート中...' : 'CSVエクスポート'}
          </button>
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

      {/* Facility list */}
      <div className="bg-white border border-lightgray p-6 md:p-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-base text-green-deeper">施設一覧</h2>
          {facilities.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-xs text-green-dark bg-green-light px-2 py-0.5">Open {publishedCount}</span>
              <span className="font-sans text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5">Coming Soon {comingSoonCount}</span>
              <span className="font-sans text-xs text-midgray bg-offwhite border border-lightgray px-2 py-0.5">非公開 {unpublishedCount}</span>
            </div>
          )}
        </div>
        <div className="w-6 h-0.5 bg-green-main mb-6" />

        {loading ? (
          <div className="py-12 text-center">
            <p className="font-sans text-sm text-midgray">読み込み中...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-lightgray">
            <p className="font-sans text-sm text-midgray mb-2">施設データがありません</p>
            <p className="font-sans text-xs text-midgray/70">CSVをアップロードして施設を登録してください</p>
          </div>
        ) : (
          <div>
            {facilities.map((facility) => (
              <div key={facility.id} className="border-b border-lightgray/50 last:border-b-0">
                {/* Facility row */}
                <div className="py-4 flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-darkgray font-medium">{facility.name}</p>
                    {facility.web_address && (
                      <p className="font-sans text-xs text-midgray/70 mt-0.5">{facility.web_address}</p>
                    )}
                  </div>

                  {/* Status badge + select */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-sans text-xs px-2 py-0.5 whitespace-nowrap ${STATUS_STYLES[facility.status]}`}>
                      {STATUS_LABELS[facility.status]}
                    </span>
                    <select
                      value={facility.status}
                      onChange={(e) => handleStatusChange(facility, e.target.value as FacilityStatus)}
                      disabled={changingStatusId === facility.id}
                      className="font-sans text-xs border border-lightgray px-2 py-1 text-darkgray focus:outline-none focus:border-green-main disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    >
                      <option value="not_published">非公開に変更</option>
                      <option value="coming_soon">Coming Soonに変更</option>
                      <option value="open">Openに変更</option>
                    </select>
                    {changingStatusId === facility.id && (
                      <span className="font-sans text-xs text-midgray">保存中...</span>
                    )}
                  </div>

                  {/* Image expand toggle */}
                  <button
                    onClick={() => {
                      setExpandedId(expandedId === facility.id ? null : facility.id)
                      setImageResult(null)
                    }}
                    className="font-sans text-xs text-green-dark hover:text-green-deeper transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    画像 {facility.facility_images.length}枚
                    <svg className={`w-3 h-3 transition-transform ${expandedId === facility.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Delete */}
                  {confirmDeleteId === facility.id ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-sans text-xs text-pink-main">本当に削除しますか？</span>
                      <button
                        onClick={() => handleDeleteFacility(facility.id)}
                        disabled={deletingFacilityId === facility.id}
                        className="font-sans text-xs text-white bg-pink-main hover:bg-pink-dark px-2 py-0.5 disabled:opacity-50"
                      >
                        {deletingFacilityId === facility.id ? '削除中...' : '削除する'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="font-sans text-xs text-midgray hover:text-darkgray"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(facility.id)}
                      className="font-sans text-xs text-midgray hover:text-pink-main transition-colors shrink-0 flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      削除
                    </button>
                  )}
                </div>

                {/* Image management panel */}
                {expandedId === facility.id && (
                  <div className="pb-5">
                    <div className="bg-offwhite border border-lightgray p-4">
                      <p className="font-sans text-xs text-midgray mb-3">
                        画像管理 — {facility.name}
                        <span className="ml-2 text-darkgray/50">（施設一覧・施設詳細ページに表示されます）</span>
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                        {[...facility.facility_images]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((image) => (
                            <div key={image.id} className="relative group aspect-square">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image.url}
                                alt=""
                                className="w-full h-full object-cover border border-lightgray"
                              />
                              <button
                                onClick={() => handleImageDelete(facility.id, image.id)}
                                disabled={deletingImageId === image.id}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-pink-main text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                aria-label="画像を削除"
                              >
                                {deletingImageId === image.id ? (
                                  <span className="text-xs leading-none">…</span>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          ))}

                        {/* Upload button */}
                        <label
                          className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            uploadingImageForId === facility.id
                              ? 'border-lightgray opacity-50 cursor-not-allowed'
                              : 'border-lightgray hover:border-green-main hover:bg-green-light/30'
                          }`}
                        >
                          {uploadingImageForId === facility.id ? (
                            <span className="font-sans text-xs text-midgray">...</span>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-midgray mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="font-sans text-xs text-midgray">追加</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(facility.id, e)}
                            disabled={uploadingImageForId === facility.id}
                            className="sr-only"
                          />
                        </label>
                      </div>

                      <p className="font-sans text-xs text-darkgray/40 mt-2">
                        対応形式: JPG / PNG / WebP　最大5MB
                      </p>

                      {imageResult?.facilityId === facility.id && (
                        <div className={`mt-2 flex items-center gap-2 ${imageResult.success ? 'text-green-dark' : 'text-pink-main'}`}>
                          {imageResult.success ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className="font-sans text-xs">{imageResult.success || imageResult.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Setup guide (collapsible) */}
      <div className="bg-white border border-lightgray p-6 md:p-8">
        <h2 className="font-serif text-base text-green-deeper mb-1">セットアップ / CSV フォーマット</h2>
        <div className="w-6 h-0.5 bg-green-main mb-4" />

        {/* ALTER TABLE — for existing DB */}
        <details className="group mb-4">
          <summary className="font-sans text-xs text-green-dark hover:text-green-deeper cursor-pointer list-none flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            既存テーブルへのカラム追加 SQL（リッチコンテンツ対応・初回のみ実行）
          </summary>
          <div className="mt-3">
            <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre">{ALTER_SQL}</pre>
          </div>
        </details>

        {/* CSV format */}
        <details className="group mb-4">
          <summary className="font-sans text-xs text-green-dark hover:text-green-deeper cursor-pointer list-none flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            CSV ヘッダー一覧（コピーしてスプレッドシートの1行目に貼り付け）
          </summary>
          <div className="mt-3 space-y-3">
            <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre">{CSV_HEADERS}</pre>
            <div>
              <p className="font-sans text-xs text-midgray mb-1">「サービス」列の形式例（パイプ区切り）:</p>
              <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre">{SERVICES_EXAMPLE}</pre>
            </div>
            <div>
              <p className="font-sans text-xs text-midgray mb-1">「施設の特徴」列のJSON形式例:</p>
              <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre">{FEATURES_EXAMPLE}</pre>
              <p className="font-sans text-xs text-darkgray/50 mt-1.5 leading-relaxed">
                icon: 絵文字、title: 特徴タイトル、desc: 説明文。配列形式で複数追加可。<br />
                「施設長メッセージ」はセル内改行（Sheets: Alt+Enter）で段落分けできます。
              </p>
            </div>
          </div>
        </details>

        {/* Initial setup SQL */}
        <details className="group">
          <summary className="font-sans text-xs text-green-dark hover:text-green-deeper cursor-pointer list-none flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            初回セットアップSQL（テーブル未作成の場合）
          </summary>
          <div className="mt-3 space-y-3">
            <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray overflow-x-auto whitespace-pre">{SETUP_SQL}</pre>
            <div>
              <p className="font-sans text-xs text-midgray mb-1">Storage バケット作成:</p>
              <pre className="bg-offwhite border border-lightgray p-3 text-xs font-mono text-darkgray">{`バケット名: facility-images\nPublic: ✓ (公開設定)`}</pre>
            </div>
          </div>
        </details>
      </div>

    </div>
  )
}
