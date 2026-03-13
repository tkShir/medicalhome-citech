import { MetadataRoute } from 'next'
import { createServerSupabaseClient, hasValidSupabaseConfig } from '@/lib/supabase-server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://medicalhome.citech.co.jp'

// 静的ページ
const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL,                                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE_URL}/shisetsu-ichiran`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE_URL}/saiyo`,                         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE_URL}/recruit`,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE_URL}/renkei`,                        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/residence-application`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/news`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE_URL}/contact`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  { url: `${BASE_URL}/pamphlet`,                      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!hasValidSupabaseConfig()) {
    return staticRoutes
  }

  const supabase = createServerSupabaseClient()

  // 施設詳細ページ（公開中・公開予定のみ）
  const { data: facilities } = await supabase
    .from('facilities')
    .select('slug, last_updated')
    .in('status', ['open', 'coming_soon'])

  const facilityRoutes: MetadataRoute.Sitemap = (facilities ?? []).map((f) => ({
    url: `${BASE_URL}/shisetsu-detail/${f.slug}`,
    lastModified: f.last_updated ? new Date(f.last_updated) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  // ニュース記事ページ
  const { data: newsPosts } = await supabase
    .from('news_posts')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  const newsRoutes: MetadataRoute.Sitemap = (newsPosts ?? []).map((p) => ({
    url: `${BASE_URL}/news/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  // 求人詳細ページ
  const { data: jobs } = await supabase
    .from('job_listings')
    .select('id, updated_at')
    .eq('is_active', true)

  const jobRoutes: MetadataRoute.Sitemap = (jobs ?? []).map((j) => ({
    url: `${BASE_URL}/recruit/${j.id}`,
    lastModified: j.updated_at ? new Date(j.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...facilityRoutes, ...newsRoutes, ...jobRoutes]
}
