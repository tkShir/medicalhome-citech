import { NextResponse } from 'next/server'
import { createServerSupabaseClient, hasValidSupabaseConfig } from '@/lib/supabase-server'
import { getNotificationEmail, sendContactNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!hasValidSupabaseConfig()) {
      console.log('Contact form submission (Supabase not configured):', body)
      return NextResponse.json({ success: true })
    }

    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from('contact_submissions').insert([{
      last_name: body.lastName,
      first_name: body.firstName,
      email: body.email,
      job_title: body.jobTitle || null,
      company: body.company || null,
      message: body.message,
      agreed_to_privacy_policy: body.agreedToPrivacyPolicy,
    }])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // メール通知（失敗しても送信自体は成功扱い）
    const toEmail = await getNotificationEmail(supabase)
    if (toEmail) {
      await sendContactNotification(
        {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          company: body.company,
          jobTitle: body.jobTitle,
          message: body.message,
        },
        toEmail
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
