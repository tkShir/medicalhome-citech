import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const facilitiesData: Record<string, {
  name: string
  address: string
  status: 'open' | 'coming_soon'
  openDate?: string
  description: string
  details?: string
  googleMapsUrl?: string
  recruitUrl?: string
  minnanoKaigoUrl?: string
  jobMedleyUrl?: string
  lastUpdated?: string
}> = {
  'abee-hodogaya': {
    name: 'ナーシングホームAbee保土ヶ谷',
    address: '神奈川県横浜市保土ヶ谷区坂本町106-1',
    status: 'open',
    description: '在宅型有料老人ホーム。24時間体制の医療・介護サービスを提供するホスピス住宅です。訪問看護ステーション・訪問介護ステーションを併設し、その人らしい生活を包括的にサポートします。',
    details: '終末期の医療的ケアが必要な方や、在宅ケアを希望される方が安心して過ごせる環境を整えています。訪問診療医と連携した24時間体制の看護・介護で、ご本人・ご家族を支えます。',
    googleMapsUrl: 'https://maps.app.goo.gl/BbEVY43gAREhRTjM8',
    recruitUrl: '/recruit?shisetsu=hodogaya',
    jobMedleyUrl: 'https://job-medley.com/facility/544393/',
    lastUpdated: '2026年1月19日',
  },
  'ciz-fujisawahonmachi': {
    name: 'シーズメディカルホーム藤沢本町',
    address: '神奈川県藤沢市花の木',
    status: 'coming_soon',
    openDate: '2026年6月オープン予定',
    description: '藤沢市に新規開設予定のホスピス住宅です。地域の医療・介護ニーズに応え、その人らしい暮らしをサポートします。',
    details: '2026年6月のオープンに向け、準備を進めています。開設後は訪問看護ステーション・訪問介護ステーションを併設し、包括的なケアを提供予定です。',
  },
  'ciz-kawasakishiratori': {
    name: 'シーズメディカルホーム川崎白鳥',
    address: '神奈川県川崎市麻生区',
    status: 'coming_soon',
    openDate: '2026年秋頃オープン予定',
    description: '川崎市麻生区に開設予定のホスピス住宅です。地域に根ざした医療・介護サービスを提供します。',
    details: '2026年秋頃のオープンに向け、準備を進めています。詳細は随時お知らせいたします。',
  },
}

export function generateStaticParams() {
  return Object.keys(facilitiesData).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const facility = facilitiesData[params.slug]
  if (!facility) return { title: '施設が見つかりません' }
  return {
    title: facility.name,
    description: facility.description,
  }
}

const services = [
  '24時間看護体制',
  '訪問診療連携',
  '訪問看護ステーション',
  '訪問介護ステーション',
  '食事提供',
  'リハビリサービス',
  'グリーフケア',
  '看取りケア',
]

export default function FacilityDetailPage({ params }: { params: { slug: string } }) {
  const facility = facilitiesData[params.slug]
  if (!facility) notFound()

  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <Link
              href="/shisetsu-ichiran"
              className="inline-flex items-center gap-1 font-sans text-xs text-green-pale hover:text-white transition-colors mb-4 tracking-wider"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              施設一覧に戻る
            </Link>
            <span className="page-header-en">Facility Detail</span>
            <h1 className="page-header-title">{facility.name}</h1>
            <p className="font-sans text-sm text-green-pale mt-3 tracking-wide flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {facility.address}
            </p>
            {facility.openDate && (
              <div className="mt-4">
                <span className="font-sans text-xs text-green-deeper bg-green-main px-3 py-1 tracking-wider">
                  {facility.openDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <section className="py-12 md:py-20 bg-offwhite">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">

              {/* Main content */}
              <div className="md:col-span-2 space-y-6">

                {/* Image placeholder */}
                <div className="bg-green-light h-64 md:h-80 flex items-center justify-center relative overflow-hidden border border-lightgray">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-pale" />
                  <span className="relative font-serif text-base text-green-deeper/50 tracking-wider">
                    施設外観写真
                  </span>
                </div>

                {/* About */}
                <div className="bg-white border border-lightgray p-6 md:p-8">
                  <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設について</h2>
                  <div className="w-8 h-0.5 bg-green-main mb-5" />
                  <p className="font-sans text-sm text-darkgray leading-[1.9] mb-4">{facility.description}</p>
                  {facility.details && (
                    <p className="font-sans text-sm text-darkgray/70 leading-[1.9]">{facility.details}</p>
                  )}
                </div>

                {/* Services (open only) */}
                {facility.status === 'open' && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">提供サービス</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {services.map((service) => (
                        <div key={service} className="flex items-center gap-2 font-sans text-sm text-darkgray">
                          <span className="w-1.5 h-1.5 bg-green-main flex-shrink-0" />
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Sidebar */}
              <div className="space-y-4">

                {/* Contact card */}
                <div className="bg-white border border-lightgray p-6">
                  <h3 className="font-serif text-base font-semibold text-green-deeper mb-4">入居・見学のご相談</h3>
                  <a
                    href="tel:03-3797-4002"
                    className="font-sans text-lg font-semibold text-green-dark hover:text-green-deeper transition-colors block mb-1 tracking-wider"
                  >
                    ☎&ensp;03-3797-4002
                  </a>
                  <p className="font-sans text-xs text-midgray mb-5 tracking-wide">
                    受付時間：平日10:00 – 19:00
                  </p>
                  <Link href="/contact" className="btn-primary w-full text-center">
                    お問い合わせフォーム
                  </Link>
                </div>

                {/* Links card */}
                {(facility.googleMapsUrl || facility.jobMedleyUrl || facility.recruitUrl) && (
                  <div className="bg-white border border-lightgray p-6">
                    <h3 className="font-serif text-base font-semibold text-green-deeper mb-4">その他情報</h3>
                    <div className="space-y-3">
                      {facility.googleMapsUrl && (
                        <a
                          href={facility.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Google Maps で見る
                        </a>
                      )}
                      {facility.jobMedleyUrl && (
                        <a
                          href={facility.jobMedleyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          求人情報（ジョブメドレー）
                        </a>
                      )}
                      {facility.recruitUrl && (
                        <Link
                          href={facility.recruitUrl}
                          className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          採用情報はこちら
                        </Link>
                      )}
                    </div>
                    {facility.lastUpdated && (
                      <p className="font-sans text-xs text-midgray mt-5 pt-4 border-t border-lightgray tracking-wide">
                        最終更新：{facility.lastUpdated}
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
