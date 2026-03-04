import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { createServerSupabaseClient } from '@/lib/supabase-server'

type FacilityStatus = 'not_published' | 'coming_soon' | 'open'

function normalizeStatus(raw: string): FacilityStatus {
  const s = raw.toLowerCase().trim()
  if (s === 'open') return 'open'
  if (s === 'coming soon' || s === 'coming_soon') return 'coming_soon'
  return 'not_published'
}

// 施設IDやASCII文字からURL-safeなスラグを生成
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// 「施設の特徴」列のJSON文字列をパース
function parseFeatures(raw: string): { icon: string; title: string; desc: string }[] | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  try {
    const parsed = JSON.parse(trimmed)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// 「情報公開事業所」列のパース: `住宅:https://...|訪問介護|訪問看護:https://...`
// 名称部分は日本語のみ（コロンなし）なので、最初のコロンでname/urlを分割できる
function parseDisclosureOffices(raw: string): { name: string; url?: string }[] | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  const items = trimmed.split('|').map(s => {
    const idx = s.indexOf(':')
    if (idx > 0) {
      const name = s.substring(0, idx).trim()
      const url = s.substring(idx + 1).trim()
      return url ? { name, url } : { name }
    }
    return { name: s.trim() }
  }).filter(item => item.name)
  return items.length > 0 ? items : null
}

// 「サービス」列のパイプ区切り文字列をパース
function parseServices(raw: string): string[] | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  const items = trimmed.split('|').map(s => s.trim()).filter(Boolean)
  return items.length > 0 ? items : null
}

// 空文字→null
function str(v: string | undefined): string | null {
  return v?.trim() || null
}

function csvRowToFacility(row: Record<string, string>) {
  const name = row['施設名']?.trim() || ''
  const facilityId = row['施設ID']?.trim() || ''
  const rawStatus = row['Status']?.trim() || row['status']?.trim() || ''
  const slug = facilityId ? toSlug(facilityId) : toSlug(name)

  return {
    facility_id: facilityId || null,
    name,
    slug: slug || `facility-${Date.now()}`,
    address: str(row['住所']),
    web_address: str(row['WEB表示住所']),
    tel: str(row['TEL ID']),
    fax: str(row['FAX']),
    email: str(row['E-mail']),
    job_medley_url: str(row['ジョブメドレーURL']),
    minnano_kaigo_url: str(row['みんなの介護URL']),
    google_maps_url: str(row['GoogleMapsURL']),
    recruit_url: str(row['自社採用']),
    status: normalizeStatus(rawStatus),
    // リッチコンテンツ
    description: str(row['説明']),
    details: str(row['詳細説明']),
    open_date: str(row['オープン日']),
    last_updated: str(row['最終更新日']),
    director_name: str(row['施設長名']),
    director_title: str(row['施設長役職']),
    director_message: str(row['施設長メッセージ']),
    access_nearest_station: str(row['最寄り駅']),
    access_walk_time: str(row['徒歩時間']),
    access_bus: str(row['バスアクセス']),
    access_parking: str(row['駐車場']),
    disclosure_offices: parseDisclosureOffices(row['情報公開事業所'] || ''),
    disclosure_note: str(row['情報公開備考']),
    services: parseServices(row['サービス'] || ''),
    features: parseFeatures(row['施設の特徴'] || ''),
    updated_at: new Date().toISOString(),
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 })
    }

    const text = await file.text()

    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      console.error('CSV parse errors:', result.errors)
    }

    const rows = result.data
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSVにデータが見つかりません' }, { status: 400 })
    }

    const records = rows.map(csvRowToFacility)
    const validRecords = records.filter(r => r.name)

    if (validRecords.length === 0) {
      return NextResponse.json({ error: '有効な施設データがありません（施設名が必須です）' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 施設名をユニークキーとしてUPSERT
    const { error: upsertError } = await supabase
      .from('facilities')
      .upsert(validRecords, {
        onConflict: 'name',
        ignoreDuplicates: false,
      })

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json(
        { error: 'アップロードに失敗しました: ' + upsertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      uploaded: validRecords.length,
      message: `${validRecords.length}件の施設情報をアップロードしました`,
    })
  } catch (err) {
    console.error('Upload error:', err)
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
