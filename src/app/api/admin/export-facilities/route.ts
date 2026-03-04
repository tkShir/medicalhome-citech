import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const HEADERS = [
  '施設名', '住所', 'WEB表示住所', 'TEL ID', 'FAX', 'E-mail',
  'ジョブメドレーURL', 'みんなの介護URL', 'GoogleMapsURL', '自社採用',
  '施設ID', 'Status',
  '説明', '詳細説明', 'オープン日', '最終更新日',
  '施設長名', '施設長役職', '施設長メッセージ',
  '最寄り駅', '徒歩時間', 'バスアクセス', '駐車場',
  'サービス', '施設の特徴',
]

function normalizeStatusForExport(status: string): string {
  if (status === 'open') return 'Open'
  if (status === 'coming_soon') return 'Coming Soon'
  return 'Not Published'
}

// CSV セルをエスケープ（カンマ・改行・ダブルクォートを含む場合はクォート）
function cell(value: string | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (s.includes(',') || s.includes('\n') || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('facilities')
      .select(`
        facility_id, name, address, web_address, tel, fax, email,
        job_medley_url, minnano_kaigo_url, google_maps_url, recruit_url, status,
        description, details, open_date, last_updated,
        director_name, director_title, director_message,
        access_nearest_station, access_walk_time, access_bus, access_parking,
        services, features
      `)
      .order('created_at')

    if (error) throw error

    const rows = (data ?? []).map(f => [
      cell(f.name),
      cell(f.address),
      cell(f.web_address),
      cell(f.tel),
      cell(f.fax),
      cell(f.email),
      cell(f.job_medley_url),
      cell(f.minnano_kaigo_url),
      cell(f.google_maps_url),
      cell(f.recruit_url),
      cell(f.facility_id),
      cell(normalizeStatusForExport(f.status)),
      cell(f.description),
      cell(f.details),
      cell(f.open_date),
      cell(f.last_updated),
      cell(f.director_name),
      cell(f.director_title),
      cell(f.director_message),
      cell(f.access_nearest_station),
      cell(f.access_walk_time),
      cell(f.access_bus),
      cell(f.access_parking),
      // サービス: パイプ区切り（インポートと同じ形式）
      cell(Array.isArray(f.services) ? f.services.join('|') : null),
      // 施設の特徴: JSON（インポートと同じ形式）
      cell(f.features ? JSON.stringify(f.features) : null),
    ])

    const csvLines = [
      HEADERS.join(','),
      ...rows.map(r => r.join(',')),
    ]
    const csv = '\uFEFF' + csvLines.join('\n') // BOM付きUTF-8でExcel/Sheetsで文字化けしない

    const now = new Date()
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="facilities_${dateStr}.csv"`,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
