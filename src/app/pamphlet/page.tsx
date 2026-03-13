import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'パンフレット',
  description: 'シーズメディカルホームのパンフレット・資料をご確認いただけます。施設概要・サービス内容・費用について詳しくご説明しています。',
  openGraph: {
    type: 'website',
    url: 'https://medicalhome.citech.co.jp/pamphlet',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: 'パンフレット | シーズメディカルホーム',
    description: 'シーズメディカルホームのパンフレット・資料をご確認いただけます。施設概要・サービス内容・費用について詳しくご説明しています。',
  },
}

export default function PamphletPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Pamphlet</span>
            <h1 className="page-header-title">パンフレット</h1>
          </div>
        </div>

        <section className="py-24 bg-offwhite min-h-[40vh] flex items-center">
          <div className="max-w-2xl mx-auto px-6 text-center w-full">
            <div className="bg-white border border-lightgray p-10 md:p-16">
              {/* Icon */}
              <div className="w-16 h-16 bg-green-light mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-sans text-xs tracking-widest text-green-dark uppercase mb-4">Coming Soon</p>
              <h2 className="font-serif text-xl md:text-2xl text-green-deeper font-normal mb-4">
                パンフレットは準備中です
              </h2>
              <p className="font-sans text-sm text-darkgray/70 mb-8 leading-relaxed">
                現在パンフレットを作成中です。<br />
                お問い合わせフォームよりご請求いただくことも可能です。
              </p>
              <Link href="/contact" className="btn-primary">
                お問い合わせはこちら
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
