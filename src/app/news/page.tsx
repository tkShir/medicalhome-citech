import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'お知らせ',
  description: 'シーズメディカルホームからのお知らせ・ニュースリリース。',
}

const posts = [
  {
    slug: 'website-launch',
    title: 'シーズメディカルホーム　ウェブサイト開設のお知らせ',
    excerpt: '2025年11月1日付けでシーズメディカルホームのウェブサイトを開設したことをお知らせします。',
    publishedAt: '2025.11.01',
    category: 'お知らせ',
  },
]

export default function NewsPage() {
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
                <article
                  key={post.slug}
                  className="flex flex-col sm:flex-row sm:items-start gap-4 py-6 border-b border-lightgray hover:bg-white transition-colors px-2 group"
                >
                  <time className="font-sans text-xs text-midgray tracking-wider flex-shrink-0 pt-0.5">
                    {post.publishedAt}
                  </time>
                  <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5 flex-shrink-0 self-start">
                    {post.category}
                  </span>
                  <div className="flex-1">
                    <h2 className="font-sans text-sm font-medium text-darkgray group-hover:text-green-dark transition-colors leading-relaxed mb-1">
                      {post.title}
                    </h2>
                    <p className="font-sans text-xs text-midgray leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
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
