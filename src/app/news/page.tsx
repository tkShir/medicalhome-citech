import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'お知らせ',
  description: 'シーズメディカルホームからのお知らせ・ニュースリリース。施設オープン情報・サービス更新・地域連携に関する最新情報を発信します。',
  openGraph: {
    type: 'website',
    url: 'https://medicalhome.citech.co.jp/news',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: 'お知らせ | シーズメディカルホーム',
    description: 'シーズメディカルホームからのお知らせ・ニュースリリース。施設オープン情報・サービス更新・地域連携に関する最新情報を発信します。',
  },
}

async function getPosts() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .select('id, title, slug, excerpt, category, published_at')
      .eq('is_published', true)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">News &amp; Updates</span>
            <h1 className="page-header-title">お知らせ</h1>
          </div>
        </div>

        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-3xl mx-auto px-6">

            <div className="border-t border-lightgray">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 py-6 border-b border-lightgray hover:bg-white transition-colors px-2 group"
                >
                  <time className="font-sans text-xs text-midgray tracking-wider flex-shrink-0 pt-0.5">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).replace(/\//g, '.')
                      : ''}
                  </time>
                  <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5 flex-shrink-0 self-start">
                    {post.category}
                  </span>
                  <div className="flex-1">
                    <h2 className="font-sans text-sm font-medium text-darkgray group-hover:text-green-dark transition-colors leading-relaxed mb-1">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="font-sans text-xs text-midgray leading-relaxed">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-16">
                <p className="font-sans text-sm text-midgray tracking-wide">お知らせはありません</p>
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
