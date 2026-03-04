import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { cache } from 'react'

// ===== DBに存在しないリッチコンテンツ（slug別） =====
// CSVで管理できない情報はここで管理。DBに移行する際はこのオブジェクトを削除してください。
const FACILITY_CONTENT: Record<string, {
  description?: string
  details?: string
  openDate?: string
  lastUpdated?: string
  features?: { icon: string; title: string; desc: string }[]
  director?: { name: string; title: string; message: string }
  access?: {
    nearestStation: string
    walkTime?: string
    bus?: string
    parking?: string
    note?: string
  }
}> = {
  'abee-hodogaya': {
    description: '在宅型有料老人ホーム。24時間体制の医療・介護サービスを提供するホスピス住宅です。訪問看護ステーション・訪問介護ステーションを併設し、その人らしい生活を包括的にサポートします。',
    details: '終末期の医療的ケアが必要な方や、在宅ケアを希望される方が安心して過ごせる環境を整えています。訪問診療医と連携した24時間体制の看護・介護で、ご本人・ご家族を支えます。',
    lastUpdated: '2026年1月19日',
    features: [
      {
        icon: '🏥',
        title: '24時間看護体制',
        desc: '夜間を含む24時間、常駐の看護師が対応します。急変時も迅速にケアを提供できる体制を整えています。',
      },
      {
        icon: '👨‍⚕️',
        title: '訪問診療との連携',
        desc: '定期的に訪問診療医が来訪し、医師との綿密な連携のもと医療処置・投薬管理を行います。',
      },
      {
        icon: '🤝',
        title: '訪問看護・介護ステーション併設',
        desc: '同一建物内に訪問看護ステーションと訪問介護ステーションを併設。シームレスなケア提供が可能です。',
      },
      {
        icon: '💚',
        title: '看取り・ターミナルケア',
        desc: '人生の最終章を穏やかに迎えられるよう、本人・ご家族のご意思を尊重した看取りケアを提供します。',
      },
      {
        icon: '🍽️',
        title: '食事・生活支援',
        desc: 'その方の嗜好や食形態に合わせた食事提供のほか、入浴・排せつ介助など日常生活全般を支援します。',
      },
      {
        icon: '🏃',
        title: 'リハビリテーション',
        desc: 'PT/OTによるリハビリを提供し、日常生活動作の維持・向上をサポートします。',
      },
    ],
    director: {
      name: '※ 施設長名をご記入ください',
      title: '施設長',
      message: 'ナーシングホームAbee保土ヶ谷では、「その人らしく」最期まで暮らし続けることのできる環境をつくることを使命と考えています。\n\n医療と介護の専門職が連携し、入居者様お一人おひとりのペースを大切にしながら、日々のケアに臨んでいます。ご本人やご家族の想いに寄り添い、安心してお任せいただける施設であり続けるよう、スタッフ一同努めてまいります。\n\n見学・入居のご相談はいつでも歓迎しております。どうぞお気軽にお声がけください。',
    },
    access: {
      nearestStation: 'JR横須賀線・相鉄本線「保土ケ谷」駅',
      walkTime: '徒歩約15分',
      bus: '神奈川中央交通バス「坂本町」停留所 徒歩約3分',
      parking: 'お車でお越しの場合は事前にお問い合わせください',
      note: '〒240-0023 神奈川県横浜市保土ヶ谷区坂本町106-1',
    },
  },
  'ciz-fujisawahonmachi': {
    description: '藤沢市に新規開設予定のホスピス住宅です。地域の医療・介護ニーズに応え、その人らしい暮らしをサポートします。',
    details: '2026年6月のオープンに向け、準備を進めています。開設後は訪問看護ステーション・訪問介護ステーションを併設し、包括的なケアを提供予定です。',
    openDate: '2026年6月オープン予定',
    features: [
      {
        icon: '🏥',
        title: '24時間看護体制（予定）',
        desc: '開設後は夜間を含む24時間の看護体制を整備予定。安心して暮らせる環境を用意します。',
      },
      {
        icon: '👨‍⚕️',
        title: '訪問診療連携（予定）',
        desc: '地域の訪問診療医との連携体制を構築し、医療依存度の高い方でも安心して入居いただける環境を整えます。',
      },
      {
        icon: '🤝',
        title: '訪問看護・介護ステーション併設（予定）',
        desc: '開設時より訪問看護ステーション・訪問介護ステーションを併設し、一体的なケアを提供予定です。',
      },
      {
        icon: '💚',
        title: '看取りケア（予定）',
        desc: '人生の最終章を穏やかに過ごせるよう、本人・ご家族の意思を尊重した看取りケアを提供予定です。',
      },
    ],
    access: {
      nearestStation: '小田急江ノ島線「藤沢本町」駅',
      walkTime: '詳細は開設時にお知らせします',
      note: '神奈川県藤沢市花の木（詳細住所は開設時に公開予定）',
    },
  },
  'ciz-kawasakishiratori': {
    description: '川崎市麻生区に開設予定のホスピス住宅です。地域に根ざした医療・介護サービスを提供します。',
    details: '2026年秋頃のオープンに向け、準備を進めています。詳細は随時お知らせいたします。',
    openDate: '2026年秋頃オープン予定',
    features: [
      {
        icon: '🏥',
        title: '24時間看護体制（予定）',
        desc: '開設後は夜間を含む24時間の看護体制を整備予定。安心の医療・介護環境を構築します。',
      },
      {
        icon: '👨‍⚕️',
        title: '訪問診療連携（予定）',
        desc: '地域の医療機関・訪問診療医との連携のもと、医療ニーズの高い方の入居に対応する体制を整えます。',
      },
      {
        icon: '🤝',
        title: '訪問看護・介護ステーション併設（予定）',
        desc: '訪問看護・訪問介護ステーションを開設時より併設し、連携したケアを提供予定です。',
      },
      {
        icon: '💚',
        title: '看取りケア（予定）',
        desc: '川崎エリアで安心した看取り・ターミナルケアを提供できる環境を整備します。',
      },
    ],
    access: {
      nearestStation: '小田急多摩線「白鳥」駅付近（詳細は開設時にお知らせ）',
      note: '神奈川県川崎市麻生区（詳細住所は開設時に公開予定）',
    },
  },
}

// ==========================================

export const dynamic = 'force-dynamic'

interface FacilityImage {
  id: string
  url: string
  sort_order: number
}

interface FacilityRow {
  id: string
  name: string
  slug: string
  web_address: string | null
  status: 'not_published' | 'coming_soon' | 'open'
  google_maps_url: string | null
  job_medley_url: string | null
  minnano_kaigo_url: string | null
  recruit_url: string | null
  facility_images: FacilityImage[]
}

const getFacility = cache(async (slug: string): Promise<FacilityRow | null> => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('facilities')
    .select('id, name, slug, web_address, status, google_maps_url, job_medley_url, minnano_kaigo_url, recruit_url, facility_images(id, url, sort_order)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as FacilityRow
})

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const facility = await getFacility(params.slug)
  if (!facility || facility.status === 'not_published') return { title: '施設が見つかりません' }
  const content = FACILITY_CONTENT[params.slug]
  return {
    title: facility.name,
    description: content?.description ?? facility.name,
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

export default async function FacilityDetailPage({ params }: { params: { slug: string } }) {
  const facility = await getFacility(params.slug)

  if (!facility || facility.status === 'not_published') notFound()

  const content = FACILITY_CONTENT[facility.slug] ?? {}
  const images = [...facility.facility_images].sort((a, b) => a.sort_order - b.sort_order)

  const hasLinks = facility.google_maps_url || facility.job_medley_url || facility.minnano_kaigo_url || facility.recruit_url

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
            {facility.web_address && (
              <p className="font-sans text-sm text-green-pale mt-3 tracking-wide flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {facility.web_address}
              </p>
            )}
            {content.openDate && (
              <div className="mt-4">
                <span className="font-sans text-xs text-green-deeper bg-green-main px-3 py-1 tracking-wider">
                  {content.openDate}
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

                {/* Images */}
                {images.length > 0 ? (
                  images.length === 1 ? (
                    <div className="h-64 md:h-80 overflow-hidden border border-lightgray">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images[0].url}
                        alt={facility.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-64 md:h-80 overflow-hidden border border-lightgray">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0].url}
                          alt={facility.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {images.slice(1).map((img) => (
                          <div key={img.id} className="aspect-square overflow-hidden border border-lightgray">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt={facility.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-green-light h-64 md:h-80 flex items-center justify-center relative overflow-hidden border border-lightgray">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-pale" />
                    <span className="relative font-serif text-base text-green-deeper/50 tracking-wider">
                      施設外観写真
                    </span>
                  </div>
                )}

                {/* About */}
                {content.description && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設について</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <p className="font-sans text-sm text-darkgray leading-[1.9] mb-4">{content.description}</p>
                    {content.details && (
                      <p className="font-sans text-sm text-darkgray/70 leading-[1.9]">{content.details}</p>
                    )}
                  </div>
                )}

                {/* Features */}
                {content.features && content.features.length > 0 && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設の特徴</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <div className="grid sm:grid-cols-2 gap-5">
                      {content.features.map((feature) => (
                        <div key={feature.title} className="flex gap-4">
                          <div className="w-10 h-10 bg-green-light flex items-center justify-center flex-shrink-0 text-lg">
                            {feature.icon}
                          </div>
                          <div>
                            <p className="font-sans text-sm font-semibold text-green-deeper mb-1">
                              {feature.title}
                            </p>
                            <p className="font-sans text-xs text-darkgray/80 leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

                {/* Director message */}
                {content.director && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設長からのメッセージ</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <div className="flex gap-5 items-start">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-green-light flex items-center justify-center flex-shrink-0 border border-lightgray">
                        <svg className="w-8 h-8 text-green-deeper/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-sans text-xs text-midgray tracking-wide mb-0.5">{content.director.title}</p>
                        <p className="font-serif text-base font-semibold text-green-deeper mb-4">{content.director.name}</p>
                        <div className="space-y-3">
                          {content.director.message.split('\n\n').map((para, i) => (
                            <p key={i} className="font-sans text-sm text-darkgray leading-[1.9]">{para}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Access info */}
                {content.access && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">アクセス情報</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />

                    {/* Map area */}
                    <div className="bg-green-light/50 h-48 md:h-56 flex items-center justify-center mb-5 border border-lightgray relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-light/30 to-green-pale/20" />
                      {facility.google_maps_url ? (
                        <a
                          href={facility.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative font-sans text-sm text-green-dark hover:text-green-deeper transition-colors flex items-center gap-2 bg-white px-4 py-2 border border-lightgray hover:border-green-main"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Google マップで開く
                        </a>
                      ) : (
                        <span className="relative font-serif text-sm text-green-deeper/40 tracking-wider">地図</span>
                      )}
                    </div>

                    <dl className="space-y-3">
                      <div className="flex gap-3">
                        <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">最寄り駅</dt>
                        <dd className="font-sans text-sm text-darkgray leading-relaxed">{content.access.nearestStation}</dd>
                      </div>
                      {content.access.walkTime && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">徒歩</dt>
                          <dd className="font-sans text-sm text-darkgray">{content.access.walkTime}</dd>
                        </div>
                      )}
                      {content.access.bus && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">バス</dt>
                          <dd className="font-sans text-sm text-darkgray">{content.access.bus}</dd>
                        </div>
                      )}
                      {content.access.parking && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">駐車場</dt>
                          <dd className="font-sans text-sm text-darkgray">{content.access.parking}</dd>
                        </div>
                      )}
                      {content.access.note && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">住所</dt>
                          <dd className="font-sans text-sm text-darkgray">{content.access.note}</dd>
                        </div>
                      )}
                    </dl>
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
                {hasLinks && (
                  <div className="bg-white border border-lightgray p-6">
                    <h3 className="font-serif text-base font-semibold text-green-deeper mb-4">その他情報</h3>
                    <div className="space-y-3">
                      {facility.google_maps_url && (
                        <a
                          href={facility.google_maps_url}
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
                      {facility.job_medley_url && (
                        <a
                          href={facility.job_medley_url}
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
                      {facility.minnano_kaigo_url && (
                        <a
                          href={facility.minnano_kaigo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          みんなの介護
                        </a>
                      )}
                      {facility.recruit_url && (
                        <Link
                          href={facility.recruit_url}
                          className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          採用情報はこちら
                        </Link>
                      )}
                    </div>
                    {content.lastUpdated && (
                      <p className="font-sans text-xs text-midgray mt-5 pt-4 border-t border-lightgray tracking-wide">
                        最終更新：{content.lastUpdated}
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
