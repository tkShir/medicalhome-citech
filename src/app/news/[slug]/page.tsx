import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'

interface Props {
  params: { slug: string }
}

async function getPost(slug: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) return { title: 'お知らせ' }
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

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
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 font-sans text-xs text-midgray hover:text-green-dark transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                お知らせ一覧へ戻る
              </Link>
            </nav>

            <article className="bg-white p-8 md:p-12">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {publishedDate && (
                  <time className="font-sans text-xs text-midgray tracking-wider">
                    {publishedDate}
                  </time>
                )}
                <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-xl md:text-2xl text-green-deeper leading-relaxed mb-8 pb-6 border-b border-lightgray">
                {post.title}
              </h1>

              {/* Content */}
              {post.content ? (
                <div
                  className="news-post-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                post.excerpt && (
                  <p className="font-sans text-sm text-darkgray leading-loose">{post.excerpt}</p>
                )
              )}
            </article>

            {/* Back link */}
            <div className="mt-10 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                お知らせ一覧へ戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
