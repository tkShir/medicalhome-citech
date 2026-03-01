import { NextResponse } from 'next/server'
import { createServerSupabaseClient, hasValidSupabaseConfig } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!hasValidSupabaseConfig()) {
      console.log('Recruit form submission (Supabase not configured):', body)
      return NextResponse.json({ success: true })
    }

    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from('recruit_submissions').insert([{
      last_name: body.lastName,
      first_name: body.firstName,
      email: body.email,
      phone: body.phone,
      job_type: body.jobType,
      facility: body.facility || null,
      job_listing_id: body.jobListingId || null,
      job_title: body.jobTitle || null,
      message: body.message || null,
      agreed_to_privacy_policy: body.agreedToPrivacyPolicy,
    }])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Recruit API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
