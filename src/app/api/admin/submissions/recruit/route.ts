import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // ORDER BY は使わず全件取得（テーブルによってタイムスタンプ列名が異なる場合があるため）
    const { data, error } = await supabase
      .from('recruit_submissions')
      .select('*')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error', detail: error.message }, { status: 500 })
    }

    // 利用可能なタイムスタンプ列で降順ソート（created_at / submitted_at どちらでも対応）
    const sorted = (data || []).sort((a, b) => {
      const tA = new Date(a.created_at ?? a.submitted_at ?? 0).getTime()
      const tB = new Date(b.created_at ?? b.submitted_at ?? 0).getTime()
      return tB - tA
    })

    return NextResponse.json({ submissions: sorted })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
