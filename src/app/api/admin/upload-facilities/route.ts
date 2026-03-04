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

function csvRowToFacility(row: Record<string, string>) {
  const name = row['施設名']?.trim() || ''
  const facilityId = row['施設ID']?.trim() || ''
  const rawStatus = row['Status']?.trim() || row['status']?.trim() || ''

  // スラグは施設IDを優先、なければ施設名のASCII部分から生成
  const slug = facilityId ? toSlug(facilityId) : toSlug(name)

  return {
    facility_id: facilityId || null,
    name,
    slug: slug || `facility-${Date.now()}`,
    address: row['住所']?.trim() || null,
    web_address: row['WEB表示住所']?.trim() || null,
    tel: row['TEL ID']?.trim() || null,
    fax: row['FAX']?.trim() || null,
    email: row['E-mail']?.trim() || null,
    job_medley_url: row['ジョブメドレーURL']?.trim() || null,
    minnano_kaigo_url: row['みんなの介護URL']?.trim() || null,
    google_maps_url: row['GoogleMapsURL']?.trim() || null,
    recruit_url: row['自社採用']?.trim() || null,
    status: normalizeStatus(rawStatus),
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
