import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'ご入居希望の方へ',
  description: 'シーズメディカルホームへの入居をご検討の方へ。入居対象、ご入居までの流れをご説明します。',
}

const diseases = [
  '末期の悪性腫瘍', '多発性硬化症', '重症筋無力症', 'スモン',
  '筋萎縮性側索硬化症', '脊髄小脳変性症', 'ハンチントン病', '進行性筋ジストロフィー症',
  'パーキンソン病関連疾患', '多系統萎縮症', 'プリオン病', '亜急性硬化性全脳炎',
  'ライソゾーム病', '副腎白質ジストロフィー', '脊髄性筋萎縮症', '球脊髄性筋萎縮症',
  '慢性炎症性脱髄性多発神経炎', '後天性免疫不全症候群', '頸髄損傷', '人工呼吸器を使用している状態',
]

const steps = [
  { num: 1, title: 'お問い合わせ・ご相談', desc: 'まずはお電話またはお問い合わせフォームよりご相談ください。入居に関する疑問・不安にお答えします。' },
  { num: 2, title: '見学・面談', desc: '実際に施設をご覧いただき、スタッフと詳しくお話しします。ご家族様のご参加も歓迎しております。' },
  { num: 3, title: '日程調整', desc: 'ご入居日程や必要な手続きについてご相談しながら調整いたします。' },
  { num: 4, title: 'ご契約・ご入居', desc: '契約書類へのご署名後、いよいよご入居となります。入居後も安心してお過ごしいただけるよう全力でサポートします。' },
]

export default function ResidenceApplicationPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">For Prospective Residents</span>
            <h1 className="page-header-title">ご入居希望の方へ</h1>
          </div>
        </div>

        <div className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-4xl mx-auto px-6">

            {/* Eligibility */}
            <section className="mb-16">
              <span className="section-heading-en">Eligibility</span>
              <h2 className="section-heading">ご入居の対象となる方</h2>
              <div className="divider-green" />

              <div className="bg-white border border-lightgray p-6 md:p-8 mb-6 space-y-4">
                {[
                  '終末期の方、「別表7の疾患（厚生労働大臣の定める疾病等）」、「別表8の状態」厚生労働大臣が認める疾患（※別表7）の方',
                  '気管カニューレを挿入している方や、褥瘡処置などで自宅より手厚い医療や看護介護の支援を必要としている方もご入居可能です。',
                  '食事や外出、面会などの希望から施設ケアではなく在宅ケアを希望している方もご入居可能です。',
                ].map((text, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 bg-green-main mt-2 flex-shrink-0" />
                    <p className="font-sans text-sm text-darkgray leading-[1.9]">{text}</p>
                  </div>
                ))}
              </div>

              {/* Disease table */}
              <div className="bg-white border border-lightgray p-6 md:p-8">
                <h3 className="font-serif text-base font-semibold text-green-deeper mb-1 text-center">
                  厚生労働大臣が認める疾患（※別表7）
                </h3>
                <div className="w-8 h-0.5 bg-green-main mx-auto mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {diseases.map((disease) => (
                    <div
                      key={disease}
                      className="bg-green-light border border-green-pale font-sans text-xs text-green-deeper text-center px-3 py-2.5 tracking-wide"
                    >
                      {disease}
                    </div>
                  ))}
                </div>
                <p className="font-sans text-xs text-midgray mt-5 text-center tracking-wide">
                  ※上記の状況以外の方でも受入が可能な場合がございます。お気軽にご相談ください。
                </p>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="mb-16 bg-green-darker text-white p-8 md:p-10 bg-green-deeper">
              <div className="text-center">
                <p className="font-sans text-xs tracking-widest text-green-pale uppercase mb-3">Contact</p>
                <h3 className="font-serif text-xl md:text-2xl font-normal mb-2">見学予約・入居相談はこちら</h3>
                <p className="font-sans text-sm text-white/70 mb-6 tracking-wide">入居ご相談窓口</p>
                <a
                  href="tel:03-3797-4002"
                  className="font-sans text-2xl md:text-3xl font-semibold tracking-wider hover:text-green-pale transition-colors block mb-1"
                >
                  ☎&ensp;03-3797-4002
                </a>
                <p className="font-sans text-xs text-white/60 mb-8 tracking-wide">平日10:00 – 19:00（土日・祝日を除く）</p>
                <Link href="/contact" className="btn-white">
                  お問い合わせフォームはこちら
                </Link>
              </div>
            </section>

            {/* Process */}
            <section>
              <span className="section-heading-en">Process</span>
              <h2 className="section-heading">ご入居までの流れ</h2>
              <div className="divider-green" />
              <p className="font-sans text-sm text-darkgray/80 mb-10 leading-[1.9]">
                シーズメディカルホームはご入居をご検討される方の多くが、早急な入居を必要としていることを理解しております。
                つきましては、お客様のご都合や入居状況にもよりますが、最短で下記ステップを３日以内で完了できるような体制作りを意識しております。
              </p>

              <div className="space-y-0">
                {steps.map((step, index) => (
                  <div key={step.num} className="flex gap-6 md:gap-8">
                    {/* Step number column */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-dark flex items-center justify-center text-white font-sans font-semibold text-sm flex-shrink-0">
                        {String(step.num).padStart(2, '0')}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-px flex-1 bg-lightgray mt-0 my-0" style={{ minHeight: '40px' }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-8 flex-1 ${index === steps.length - 1 ? '' : ''}`}>
                      <h3 className="font-serif text-base font-semibold text-green-deeper mb-2">{step.title}</h3>
                      <p className="font-sans text-sm text-darkgray/80 leading-[1.9]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
