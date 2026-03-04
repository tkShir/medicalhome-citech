import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('facilities')
      .select('id, facility_id, name, slug, web_address, status, facility_images(id, url, storage_path, sort_order)')
      .order('name')

    if (error) throw error
    return NextResponse.json({ facilities: data || [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
