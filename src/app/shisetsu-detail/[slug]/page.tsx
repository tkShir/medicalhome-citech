import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

interface FacilityImage {
  id: string
  url: string
  sort_order: number
}

interface Feature {
  icon: string
  title: string
  desc: string
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
  disclosure_offices: { name: string; url?: string }[] | null
  disclosure_note: string | null
  description: string | null
  details: string | null
  open_date: string | null
  last_updated: string | null
  director_name: string | null
  director_title: string | null
  director_message: string | null
  access_nearest_station: string | null
  access_walk_time: string | null
  access_bus: string | null
  access_parking: string | null
  services: string[] | null
  features: Feature[] | null
  facility_images: FacilityImage[]
}

const getFacility = cache(async (slug: string): Promise<FacilityRow | null> => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('facilities')
    .select(`
      id, name, slug, web_address, status,
      google_maps_url, job_medley_url, minnano_kaigo_url, recruit_url,
      disclosure_offices, disclosure_note,
      description, details, open_date, last_updated,
      director_name, director_title, director_message,
      access_nearest_station, access_walk_time, access_bus, access_parking,
      services, features,
      facility_images(id, url, sort_order)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as FacilityRow
})

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const facility = await getFacility(params.slug)
  if (!facility || facility.status === 'not_published') return { title: '施設が見つかりません' }
  return {
    title: facility.name,
    description: facility.description ?? facility.name,
  }
}

export default async function FacilityDetailPage({ params }: { params: { slug: string } }) {
  const facility = await getFacility(params.slug)

  if (!facility || facility.status === 'not_published') notFound()

  const images = [...facility.facility_images].sort((a, b) => a.sort_order - b.sort_order)

  const hasAbout = facility.description || facility.details
  const hasAccess = facility.access_nearest_station
  const hasDirector = facility.director_name && facility.director_message
  const hasLinks = facility.google_maps_url || facility.job_medley_url || facility.minnano_kaigo_url || facility.recruit_url
  const hasDisclosure = facility.disclosure_offices?.length || facility.disclosure_note

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
            {facility.open_date && (
              <div className="mt-4">
                <span className="font-sans text-xs text-green-deeper bg-green-main px-3 py-1 tracking-wider">
                  {facility.open_date}
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
                {hasAbout && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設について</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    {facility.description && (
                      <p className="font-sans text-sm text-darkgray leading-[1.9] mb-4">{facility.description}</p>
                    )}
                    {facility.details && (
                      <p className="font-sans text-sm text-darkgray/70 leading-[1.9]">{facility.details}</p>
                    )}
                  </div>
                )}

                {/* Features */}
                {facility.features && facility.features.length > 0 && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">施設の特徴</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <div className="grid sm:grid-cols-2 gap-5">
                      {facility.features.map((feature, i) => (
                        <div key={i} className="flex gap-4">
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

                {/* Services */}
                {facility.services && facility.services.length > 0 && (
                  <div className="bg-white border border-lightgray p-6 md:p-8">
                    <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">提供サービス</h2>
                    <div className="w-8 h-0.5 bg-green-main mb-5" />
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {facility.services.map((service) => (
                        <div key={service} className="flex items-center gap-2 font-sans text-sm text-darkgray">
                          <span className="w-1.5 h-1.5 bg-green-main flex-shrink-0" />
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director message */}
                {hasDirector && (
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
                        <p className="font-sans text-xs text-midgray tracking-wide mb-0.5">
                          {facility.director_title ?? '施設長'}
                        </p>
                        <p className="font-serif text-base font-semibold text-green-deeper mb-4">
                          {facility.director_name}
                        </p>
                        <div className="space-y-3">
                          {facility.director_message!.split(/\n\n|\n/).filter(Boolean).map((para, i) => (
                            <p key={i} className="font-sans text-sm text-darkgray leading-[1.9]">{para}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Access info */}
                {hasAccess && (
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
                      {facility.access_nearest_station && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">最寄り駅</dt>
                          <dd className="font-sans text-sm text-darkgray leading-relaxed">{facility.access_nearest_station}</dd>
                        </div>
                      )}
                      {facility.access_walk_time && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">徒歩</dt>
                          <dd className="font-sans text-sm text-darkgray">{facility.access_walk_time}</dd>
                        </div>
                      )}
                      {facility.access_bus && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">バス</dt>
                          <dd className="font-sans text-sm text-darkgray">{facility.access_bus}</dd>
                        </div>
                      )}
                      {facility.access_parking && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">駐車場</dt>
                          <dd className="font-sans text-sm text-darkgray">{facility.access_parking}</dd>
                        </div>
                      )}
                      {facility.web_address && (
                        <div className="flex gap-3">
                          <dt className="font-sans text-xs text-midgray w-20 flex-shrink-0 pt-0.5 tracking-wide">住所</dt>
                          <dd className="font-sans text-sm text-darkgray">{facility.web_address}</dd>
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
                    {facility.last_updated && (
                      <p className="font-sans text-xs text-midgray mt-5 pt-4 border-t border-lightgray tracking-wide">
                        最終更新：{facility.last_updated}
                      </p>
                    )}
                  </div>
                )}

                {/* 情報公開 */}
                {hasDisclosure && (
                  <div className="bg-white border border-lightgray p-6">
                    <h3 className="font-serif text-base font-semibold text-green-deeper mb-4">情報公開</h3>
                    <p className="font-sans text-xs text-darkgray/70 leading-relaxed mb-4">
                      運営規定・重要事項説明書・経営情報を記載しています。
                    </p>
                    {facility.disclosure_offices && facility.disclosure_offices.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {facility.disclosure_offices.map((office, i) =>
                          office.url ? (
                            <a
                              key={i}
                              href={office.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 font-sans text-sm text-green-dark hover:text-green-deeper transition-colors tracking-wide"
                            >
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {office.name}
                            </a>
                          ) : (
                            <span
                              key={i}
                              className="flex items-center gap-2 font-sans text-sm text-darkgray/60 tracking-wide"
                            >
                              <svg className="w-4 h-4 flex-shrink-0 text-lightgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {office.name}
                            </span>
                          )
                        )}
                      </div>
                    )}
                    {facility.disclosure_note && (
                      <p className="font-sans text-xs text-darkgray/60 leading-relaxed pt-3 border-t border-lightgray">
                        {facility.disclosure_note}
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
