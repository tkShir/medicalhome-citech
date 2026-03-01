import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const facilities = [
  {
    slug: 'abee-hodogaya',
    name: 'ナーシングホームAbee保土ヶ谷',
    address: '神奈川県横浜市保土ヶ谷区坂本町106-1',
    status: 'open' as const,
    description: '在宅型有料老人ホーム。24時間体制の医療・介護サービスを提供するホスピス住宅です。',
  },
  {
    slug: 'ciz-fujisawahonmachi',
    name: 'シーズメディカルホーム藤沢本町',
    address: '神奈川県藤沢市花の木',
    status: 'coming_soon' as const,
    openDate: '2026年6月オープン予定',
    description: '藤沢市に新規開設予定のホスピス住宅。地域の医療・介護ニーズに応えます。',
  },
  {
    slug: 'ciz-kawasakishiratori',
    name: 'シーズメディカルホーム川崎白鳥',
    address: '神奈川県川崎市麻生区',
    status: 'coming_soon' as const,
    openDate: '2026年秋頃オープン予定',
    description: '川崎市麻生区に開設予定のホスピス住宅。安心・安全な暮らしをサポートします。',
  },
]

export const metadata = {
  title: '施設一覧',
  description: 'シーズメディカルホームの施設一覧。神奈川県内に複数のホスピス住宅を展開しています。',
}

export default function FacilitiesPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Facilities</span>
            <h1 className="page-header-title">施設一覧</h1>
          </div>
        </div>

        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-7xl mx-auto px-6">

            <div className="grid md:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <Link
                  key={facility.slug}
                  href={`/shisetsu-detail/${facility.slug}`}
                  className="card group hover:border-green-dark transition-colors duration-200 flex flex-col"
                >
                  {/* Image area */}
                  <div className="h-52 bg-green-light relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-pale" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <span className="font-serif text-sm text-green-deeper/70 tracking-wider text-center leading-snug">
                        {facility.name}
                      </span>
                    </div>
                    {facility.status === 'coming_soon' && (
                      <div className="absolute top-3 right-3 bg-white border border-lightgray px-2 py-0.5">
                        <span className="font-sans text-[10px] tracking-widest text-darkgray uppercase">Coming Soon</span>
                      </div>
                    )}
                    {facility.status === 'open' && (
                      <div className="absolute top-3 right-3 bg-green-dark px-2 py-0.5">
                        <span className="font-sans text-[10px] tracking-widest text-white uppercase">Open</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-serif text-base font-semibold text-green-deeper mb-2 leading-snug group-hover:text-green-dark transition-colors">
                      {facility.name}
                    </h2>
                    <p className="font-sans text-xs text-midgray mb-3 tracking-wide flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {facility.address}
                    </p>
                    {'openDate' in facility && facility.openDate && (
                      <p className="font-sans text-xs text-green-dark bg-green-light px-2 py-1 inline-block mb-3 self-start">
                        {facility.openDate}
                      </p>
                    )}
                    <p className="font-sans text-xs text-darkgray/70 leading-relaxed flex-1">
                      {facility.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-lightgray flex items-center justify-between">
                      <span className="font-sans text-xs text-green-dark tracking-wider">詳細を見る</span>
                      <svg className="w-4 h-4 text-green-dark group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-white border border-lightgray p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="font-sans text-xs tracking-widest text-green-dark uppercase mb-2">Contact</p>
                  <h3 className="font-serif text-xl md:text-2xl text-green-deeper font-normal leading-snug">
                    入居・見学のご相談はお気軽に
                  </h3>
                  <p className="font-sans text-sm text-darkgray/70 mt-2 tracking-wide">
                    受付時間 / 平日 10:00 – 19:00
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  <a
                    href="tel:03-3797-4002"
                    className="btn-primary-outline"
                  >
                    ☎&ensp;03-3797-4002
                  </a>
                  <Link href="/contact" className="btn-primary">
                    お問い合わせフォーム
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
