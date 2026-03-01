import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'your_supabase_url') {
      // Supabase not configured yet - return success for development
      console.log('Contact form submission (Supabase not configured):', body)
      return NextResponse.json({ success: true })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { error } = await supabase.from('contact_submissions').insert([{
      last_name: body.lastName,
      first_name: body.firstName,
      email: body.email,
      job_title: body.jobTitle || null,
      company: body.company || null,
      message: body.message || null,
      agreed_to_privacy_policy: body.agreedToPrivacyPolicy,
      submitted_at: new Date().toISOString(),
    }])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
