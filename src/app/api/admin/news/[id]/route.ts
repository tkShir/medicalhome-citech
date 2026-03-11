import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .select('*, news_assets(*)')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 })
      }
      throw error
    }
    return NextResponse.json({ post: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, is_published, published_at } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (category !== undefined) updateData.category = category
    if (is_published !== undefined) {
      updateData.is_published = is_published
      if (is_published && published_at !== undefined) {
        updateData.published_at = published_at
      } else if (is_published && !published_at) {
        // Set published_at to now if publishing for the first time
        updateData.published_at = new Date().toISOString()
      }
      // Don't clear published_at when unpublishing (preserves the date for re-publishing)
    }
    if (published_at !== undefined && is_published === undefined) {
      updateData.published_at = published_at
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ post: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    if (message.includes('duplicate key') || message.includes('unique')) {
      return NextResponse.json({ error: 'このスラッグはすでに使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch assets to delete from storage
    const { data: assets } = await supabase
      .from('news_assets')
      .select('storage_path')
      .eq('news_post_id', params.id)
      .not('storage_path', 'is', null)

    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    // Clean up storage files (best effort)
    if (assets && assets.length > 0) {
      const paths = assets
        .map((a) => a.storage_path)
        .filter((p): p is string => Boolean(p))
      if (paths.length > 0) {
        await supabase.storage.from('news-assets').remove(paths)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
