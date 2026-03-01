import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

// Public endpoint: active job listings only
// Used by frontend and future Google Apps Script integration
export async function GET() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('facility', { ascending: true })
      .order('job_type', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ jobs: data })
  } catch (err) {
    console.error('Jobs API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
