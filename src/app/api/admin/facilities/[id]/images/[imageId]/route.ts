import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const STORAGE_BUCKET = 'facility-images'

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: image, error: fetchError } = await supabase
      .from('facility_images')
      .select('storage_path')
      .eq('id', params.imageId)
      .eq('facility_id', params.id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json({ error: '画像が見つかりません' }, { status: 404 })
    }

    if (image.storage_path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([image.storage_path])
    }

    const { error: deleteError } = await supabase
      .from('facility_images')
      .delete()
      .eq('id', params.imageId)

    if (deleteError) throw deleteError
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
