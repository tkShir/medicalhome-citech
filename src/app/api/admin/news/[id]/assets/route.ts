import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const STORAGE_BUCKET = 'news-assets'
const IMAGE_MAX_BYTES = 10 * 1024 * 1024 // 10MB

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_assets')
      .select('*')
      .eq('news_post_id', params.id)
      .order('sort_order')

    if (error) throw error
    return NextResponse.json({ assets: data || [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '画像ファイルのみアップロードできます' }, { status: 400 })
    }

    if (file.size > IMAGE_MAX_BYTES) {
      return NextResponse.json({ error: 'ファイルサイズは10MB以下にしてください' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const storagePath = `${params.id}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)

    // Get next sort_order
    const { data: existing } = await supabase
      .from('news_assets')
      .select('sort_order')
      .eq('news_post_id', params.id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextSortOrder =
      existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

    const { data: assetRecord, error: dbError } = await supabase
      .from('news_assets')
      .insert({
        news_post_id: params.id,
        asset_type: 'image',
        url: publicUrl,
        storage_path: storagePath,
        file_name: file.name,
        sort_order: nextSortOrder,
      })
      .select()
      .single()

    if (dbError) {
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
      throw dbError
    }

    return NextResponse.json({ asset: assetRecord })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { assetId } = await request.json()
    if (!assetId) {
      return NextResponse.json({ error: 'assetId が必要です' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data: asset } = await supabase
      .from('news_assets')
      .select('storage_path')
      .eq('id', assetId)
      .eq('news_post_id', params.id)
      .single()

    const { error } = await supabase
      .from('news_assets')
      .delete()
      .eq('id', assetId)
      .eq('news_post_id', params.id)

    if (error) throw error

    if (asset?.storage_path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([asset.storage_path])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
