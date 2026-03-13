import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    absolute: '【公式】シーズメディカルホーム｜東京都・神奈川県を主に展開する医療特化型介護施設',
  },
  description: '終末期・難病・医療依存度の高い方の住まいをお探しなら。24時間看護体制・看取り対応・訪問診療連携。横浜市保土ヶ谷区・藤沢市・川崎市・日野市に展開する医療特化型介護施設。入居相談受付中。',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'シーズメディカルホーム',
  url: 'https://medicalhome.citech.co.jp',
  logo: 'https://cagtyscyplrhkhkzbeay.supabase.co/storage/v1/object/public/web_asset/cizmedihome_ogimage.png',
  description: '東京・神奈川を中心に関東エリアで展開する医療特化型介護施設。終末期・難病・医療依存度の高い方の24時間看護・看取り対応。横浜市保土ヶ谷区・藤沢市・川崎市・日野市に展開。',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+81-3-3797-4002',
    contactType: 'customer service',
    availableLanguage: 'Japanese',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '19:00',
    },
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: '東京・神奈川を中心とした関東エリア',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>

        {/* ── Hero ── */}
        <section className="relative bg-green-deeper text-white overflow-hidden">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(147,218,73,0.15),_transparent_60%)]" />

          <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
            <div className="max-w-2xl">
              <span className="font-sans text-xs tracking-widest text-green-pale uppercase mb-6 block">
                CIZ Medical Home
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-snug tracking-wide mb-8">
                人生を描く、<br />
                <span className="text-green-main">想いを形に。</span>
              </h1>
              <p className="font-sans text-base md:text-lg text-white/80 leading-loose mb-10 tracking-wide">
                地域と共に、その人らしく。<br />
                医療と介護の力を結集した、新しい医療特化型介護施設のかたち。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/residence-application" className="btn-white">
                  入居のご相談はこちら
                </Link>
                <Link href="/saiyo" className="btn-white-outline">
                  採用情報を見る
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative vertical line */}
          <div className="absolute right-12 top-1/4 hidden lg:block w-px h-64 bg-white/10" />
          <div className="absolute right-16 top-1/3 hidden lg:block w-px h-32 bg-green-main/30" />
        </section>

        {/* ── 3つのらしさ ── */}
        <section className="py-20 md:py-28 bg-offwhite">
          <div className="max-w-7xl mx-auto px-6">

            <div className="mb-14">
              <span className="section-heading-en">Our Mission</span>
              <h2 className="section-heading">シーズメディカルホームの思い</h2>
              <div className="divider-green" />
              <p className="font-sans text-sm text-darkgray/70 leading-relaxed max-w-xl">
                シーズは３つの「らしさ」を追求します。<br />
                関わるすべての人が、自分らしく生きられる場所をつくるために。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-0 border border-lightgray">
              {[
                {
                  num: '01',
                  title: 'ご入居者にとっての\n「らしさ」',
                  desc: '住み慣れた地域で、最期までお暮らしいただけるよう、ご入居者お一人お一人の尊厳を大切にしたその人らしい生活を支援します。',
                },
                {
                  num: '02',
                  title: 'スタッフにとっての\n「らしさ」',
                  desc: 'スタッフの思いと個別性を重視し、物心両面で真の豊かさを手にすることができる環境を目指します。',
                },
                {
                  num: '03',
                  title: '地域にとっての\n「らしさ」',
                  desc: '医療特化型介護施設としての役割を十分に発揮し、地域医療機能の維持・適正化に寄与すると共に、安心して暮らすことができる住まいとケアを提供します。',
                },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className={`bg-white p-8 md:p-10 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-lightgray' : ''}`}
                >
                  <span className="font-sans text-4xl font-light text-green-main/30 tracking-tighter block mb-4">
                    {item.num}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-green-deeper mb-4 leading-snug whitespace-pre-line">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-darkgray/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/contact" className="btn-primary">
                入居のお問い合わせはこちら
              </Link>
            </div>
          </div>
        </section>

        {/* ── 施設紹介 ── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="section-heading-en">Facilities</span>
                <h2 className="section-heading">施設一覧</h2>
                <div className="divider-green" />
              </div>
              <Link
                href="/shisetsu-ichiran"
                className="font-sans text-sm text-green-dark hover:text-green-deeper tracking-wider transition-colors flex items-center gap-1"
              >
                すべての施設を見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  slug: 'abee-hodogaya',
                  name: 'ナーシングホームAbee保土ヶ谷',
                  address: '神奈川県横浜市保土ヶ谷区',
                  status: 'open' as const,
                  openDate: null,
                },
                {
                  slug: 'ciz-fujisawahonmachi',
                  name: 'シーズメディカルホーム藤沢本町',
                  address: '神奈川県藤沢市',
                  status: 'coming_soon' as const,
                  openDate: '2026年6月オープン予定',
                },
                {
                  slug: 'ciz-kawasakishiratori',
                  name: 'シーズメディカルホーム川崎白鳥',
                  address: '神奈川県川崎市麻生区',
                  status: 'coming_soon' as const,
                  openDate: '2026年秋頃オープン予定',
                },
              ].map((f) => (
                <Link
                  key={f.slug}
                  href={`/shisetsu-detail/${f.slug}`}
                  className="card group hover:border-green-dark transition-colors duration-200"
                >
                  {/* Image placeholder */}
                  <div className="h-44 bg-green-light flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-light to-green-pale/60" />
                    <span className="relative font-serif text-sm text-green-deeper/60 tracking-wider">
                      {f.name}
                    </span>
                    {f.status === 'coming_soon' && (
                      <div className="absolute top-3 right-3 bg-white border border-lightgray px-2 py-0.5">
                        <span className="font-sans text-[10px] tracking-widest text-darkgray uppercase">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-base font-semibold text-green-deeper mb-1 group-hover:text-green-dark transition-colors leading-snug">
                      {f.name}
                    </h3>
                    <p className="font-sans text-xs text-midgray mb-3 tracking-wide">{f.address}</p>
                    {f.openDate && (
                      <p className="font-sans text-xs text-green-dark bg-green-light px-2 py-1 inline-block">
                        {f.openDate}
                      </p>
                    )}
                    {f.status === 'open' && (
                      <p className="font-sans text-xs text-green-dark bg-green-light px-2 py-1 inline-block">
                        営業中
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 採用バナー ── */}
        <section className="bg-pink-light py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="font-sans text-xs tracking-widest text-pink-main uppercase mb-3 block">
                  Recruitment
                </span>
                <p className="font-serif text-2xl md:text-3xl text-green-deeper leading-snug font-normal">
                  「あなたの看護が、<br />
                  地域の安心につながる。」
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/saiyo" className="btn-pink">
                  採用情報はこちら
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 代表挨拶 ── */}
        <section className="py-20 md:py-28 bg-offwhite">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-10">
              <span className="section-heading-en">Message</span>
              <h2 className="section-heading">代表挨拶</h2>
              <div className="divider-green" />
            </div>

            <div className="bg-white border border-lightgray p-8 md:p-12">
              <h3 className="font-serif text-xl md:text-2xl font-normal text-green-deeper mb-8 leading-snug">
                その人「らしさ」を支える場所へ。
              </h3>
              <div className="space-y-5 font-sans text-sm text-darkgray leading-[1.9] tracking-wide">
                <p>
                  シーズメディカルホームは、医療と介護の力を結集し、その人「らしさ」を実現するために生まれた住まいです。この信念のもと、ご入居者お一人おひとりの人生に寄り添い、心の通ったケアと安心できる暮らしを届けることを使命としています。
                </p>
                <p>
                  私はこれまで経営者としてさまざまな事業に携わる中で、社会とのつながりの大切さを改めて感じてきました。その経験を通じて、「より多くの人の暮らしを豊かにし、支えとなる事業に取り組みたい」という思いが強くなり、人の生き方に最も近い領域である医療・介護分野に挑戦する決意をしました。
                </p>
                <p>
                  私たちは「医療・介護 と テクノロジー」を融合させ、従来の枠を超えた新しい医療特化型介護施設のかたちを目指しています。経営の安定性、現場の専門性、そして未来を見据えた技術力。この三つを軸に、心から安心して暮らせる環境と、支える人々が誇りを持てる仕組みを築いてまいります。
                </p>
                <p>
                  シーズメディカルホームは、入居者様、ご家族様、地域、そしてスタッフをはじめとする関わるすべての人々が、自分「らしさ」を大切にしながら共に生きていける場所でありたい。その想いを胸に、これからも誠実に、一歩ずつ歩みを進めてまいります。
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-lightgray text-right">
                <p className="font-sans text-xs text-midgray tracking-wide">株式会社シーズ・テクノロジーズ</p>
                <p className="font-sans text-xs text-midgray mb-1 tracking-wide">代表取締役</p>
                <p className="font-serif text-lg font-semibold text-green-deeper">城野 親徳</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── お知らせ ── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="section-heading-en">News</span>
                <h2 className="section-heading">お知らせ</h2>
              </div>
              <Link
                href="/news"
                className="font-sans text-sm text-green-dark hover:text-green-deeper tracking-wider transition-colors flex items-center gap-1"
              >
                一覧を見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* News list */}
            <div className="border-t border-lightgray">
              <a
                href="/news"
                className="flex flex-col sm:flex-row sm:items-center gap-3 py-5 border-b border-lightgray hover:bg-offwhite transition-colors px-1 group"
              >
                <time className="font-sans text-xs text-midgray tracking-wider flex-shrink-0">2025.11.01</time>
                <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5 flex-shrink-0">
                  お知らせ
                </span>
                <span className="font-sans text-sm text-darkgray group-hover:text-green-dark transition-colors leading-relaxed">
                  シーズメディカルホーム　ウェブサイト開設のお知らせ
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── お問い合わせCTA ── */}
        <section className="py-16 bg-green-deeper text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-widest text-green-pale uppercase mb-4">Contact</p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide mb-3">
              入居・見学のご相談はお気軽に
            </h2>
            <p className="font-sans text-sm text-white/70 mb-8 tracking-wide">
              入居ご相談窓口　受付時間 / 平日 10:00 – 19:00
            </p>
            <a
              href="tel:03-3797-4002"
              className="font-sans text-2xl md:text-3xl font-semibold tracking-wider hover:text-green-pale transition-colors block mb-8"
            >
              ☎&ensp;03-3797-4002
            </a>
            <Link href="/contact" className="btn-white">
              お問い合わせフォームはこちら
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </main>
      <Footer />
    </>
  )
}
