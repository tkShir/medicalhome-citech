import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// GET /api/admin/settings
// Returns all settings as { settings: { key: value } }
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')

    if (error) {
      console.error('Settings GET error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Convert array of {key, value} to flat object
    const settings: Record<string, string> = {}
    for (const row of data || []) {
      settings[row.key] = row.value
    }

    // Also include from email (read-only, from env var)
    const fromEmail = process.env.RESEND_FROM_EMAIL || ''
    const resendConfigured = !!process.env.RESEND_API_KEY

    return NextResponse.json({ settings, fromEmail, resendConfigured })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT /api/admin/settings
// Body: { key: string, value: string }
// Upserts a single setting
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'key is required' }, { status: 400 })
    }
    if (typeof value !== 'string') {
      return NextResponse.json({ error: 'value must be a string' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (error) {
      console.error('Settings PUT error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
