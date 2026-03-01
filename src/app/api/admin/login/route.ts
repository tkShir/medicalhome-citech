import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const secret = process.env.ADMIN_SECRET

    if (!secret) {
      return NextResponse.json({ error: 'ADMIN_SECRET が設定されていません' }, { status: 500 })
    }

    if (password !== secret) {
      return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}
