import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .select('id, title, slug, category, is_published, published_at, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ posts: data || [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, is_published, published_at } = body

    if (!title || !slug) {
      return NextResponse.json({ error: 'タイトルとスラッグは必須です' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        category: category || 'お知らせ',
        is_published: is_published || false,
        published_at: is_published ? (published_at || new Date().toISOString()) : null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ post: data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    if (message.includes('duplicate key') || message.includes('unique')) {
      return NextResponse.json({ error: 'このスラッグはすでに使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
