import { createClient } from '@supabase/supabase-js'

/**
 * Supabase URL を環境変数から取得（複数の命名規則に対応）
 * - 標準: NEXT_PUBLIC_SUPABASE_URL
 * - Vercel Supabase integration: SUPABASE_URL
 */
function getSupabaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL

  if (!url || url === 'your_supabase_url') {
    throw new Error(
      'Supabase URL が未設定です。NEXT_PUBLIC_SUPABASE_URL または SUPABASE_URL を環境変数に設定してください。'
    )
  }
  return url
}

/**
 * Supabase Service Role Key を環境変数から取得（複数の命名規則に対応）
 * - 標準: SUPABASE_SERVICE_ROLE_KEY
 * - Vercel Supabase integration (新命名): SUPABASE_SECRET_KEY
 */
function getServiceRoleKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY

  if (!key) {
    throw new Error(
      'Supabase Service Role Key が未設定です。SUPABASE_SERVICE_ROLE_KEY または SUPABASE_SECRET_KEY を環境変数に設定してください。'
    )
  }
  return key
}

/**
 * サーバーサイド用 Supabase クライアント（Service Role Key 使用）
 * API Routes と Server Components で使用
 */
export function createServerSupabaseClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: 'no-store' }),
    },
  })
}

/**
 * 設定が有効かチェック（ビルド時のフォールバック用）
 */
export function hasValidSupabaseConfig(): boolean {
  try {
    getSupabaseUrl()
    getServiceRoleKey()
    return true
  } catch {
    return false
  }
}
