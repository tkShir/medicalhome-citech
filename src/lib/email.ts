import { Resend } from 'resend'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── クライアント ──────────────────────────────────────────────
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'noreply@example.com'
}

// ── settings テーブルから通知先メールを取得 ────────────────────
// 優先順位: 1) settings テーブル  2) NOTIFICATION_EMAIL 環境変数
export async function getNotificationEmail(
  supabase: SupabaseClient
): Promise<string | null> {
  // まず settings テーブルを試みる
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'notification_email')
      .single()

    if (!error && data?.value) {
      return data.value as string
    }
  } catch {
    // settings テーブルが存在しない場合などはフォールバックへ
  }

  // 環境変数にフォールバック
  const envEmail = process.env.NOTIFICATION_EMAIL
  if (envEmail) return envEmail

  return null
}

// ── HTML メール本文ヘルパー ───────────────────────────────────
function buildEmailHtml(title: string, rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:8px 12px;background:#f5f9f5;font-weight:600;font-size:13px;color:#4a5568;width:140px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">
          ${label}
        </td>
        <td style="padding:8px 12px;font-size:13px;color:#2d3748;border-bottom:1px solid #e2e8f0;line-height:1.6;">
          ${value.replace(/\n/g, '<br>')}
        </td>
      </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2d5a2d;padding:20px 28px;">
            <p style="margin:0;font-size:11px;color:#93d449;letter-spacing:0.1em;text-transform:uppercase;">
              CIZ Medical Home
            </p>
            <h1 style="margin:4px 0 0;font-size:16px;font-weight:600;color:#ffffff;letter-spacing:0.05em;">
              ${title}
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-collapse:collapse;">
              ${rowsHtml}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 28px;background:#f5f9f5;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#718096;">
              このメールはシーズメディカルホームのウェブサイトから自動送信されています。<br>
              管理画面: <a href="https://www.citech.co.jp/admin" style="color:#2d7a2d;">管理画面を開く</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── お問い合わせ通知メール ────────────────────────────────────
export interface ContactNotificationData {
  firstName: string
  lastName: string
  email: string
  company?: string
  jobTitle?: string
  message: string
}

export async function sendContactNotification(
  data: ContactNotificationData,
  toEmail: string
): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set – skipping contact notification')
    return
  }

  const name = `${data.lastName}${data.firstName}`
  const rows: { label: string; value: string }[] = [
    { label: 'お名前', value: name },
    { label: 'メール', value: data.email },
  ]
  if (data.company) rows.push({ label: '会社名', value: data.company })
  if (data.jobTitle) rows.push({ label: '役職', value: data.jobTitle })
  rows.push({ label: 'メッセージ', value: data.message })

  try {
    await resend.emails.send({
      from: `シーズメディカルホーム <${getFromEmail()}>`,
      to: toEmail,
      subject: `【お問い合わせ】${name}様よりお問い合わせが届きました`,
      html: buildEmailHtml('お問い合わせ通知', rows),
    })
  } catch (err) {
    console.error('[email] Failed to send contact notification:', err)
    // メール失敗はフォーム送信の失敗にしない
  }
}

// ── 採用応募通知メール ─────────────────────────────────────────
export interface RecruitNotificationData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  jobType?: string
  facility?: string
  jobTitle?: string
  message?: string
}

export async function sendRecruitNotification(
  data: RecruitNotificationData,
  toEmail: string
): Promise<void> {
  const resend = getResendClient()
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set – skipping recruit notification')
    return
  }

  const name = `${data.lastName}${data.firstName}`
  const rows: { label: string; value: string }[] = [
    { label: 'お名前', value: name },
    { label: 'メール', value: data.email },
  ]
  if (data.phone) rows.push({ label: '電話番号', value: data.phone })
  if (data.jobType) rows.push({ label: '職種', value: data.jobType })
  if (data.facility) rows.push({ label: '希望施設', value: data.facility })
  if (data.jobTitle) rows.push({ label: '応募求人', value: data.jobTitle })
  if (data.message) rows.push({ label: 'メッセージ', value: data.message })

  try {
    await resend.emails.send({
      from: `シーズメディカルホーム <${getFromEmail()}>`,
      to: toEmail,
      subject: `【採用応募】${name}様より応募が届きました`,
      html: buildEmailHtml('採用応募通知', rows),
    })
  } catch (err) {
    console.error('[email] Failed to send recruit notification:', err)
  }
}
