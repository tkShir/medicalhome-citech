import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '医療機関・ご紹介の方へ',
  description: '退院支援・地域連携室のご担当者様へ。胃ろう・気管切開・人工呼吸器など高医療依存の方の退院後施設をお探しでしたら、シーズメディカルホームへ。別表第7・第8対応。横浜市保土ヶ谷区・藤沢市・川崎市・日野市。',
}

const acceptableConditions = [
  { label: 'ターミナルケア', desc: '末期がん・神経難病など、終末期を迎える方の看取りに対応します。' },
  { label: '胃ろう・腸ろう管理', desc: '胃ろう・腸ろうによる経管栄養の管理・実施に対応します。' },
  { label: '経管栄養（経鼻）', desc: '経鼻チューブによる栄養管理が可能です。' },
  { label: '気管切開', desc: '気管切開された方の受け入れ・ケアに対応します。' },
  { label: '人工呼吸器（IPPV・NPPV）', desc: '侵襲的・非侵襲的人工呼吸器管理が必要な方もご相談ください。' },
  { label: '点滴・CV管理', desc: '中心静脈カテーテルや末梢点滴の管理に対応します。' },
  { label: '疼痛管理（麻薬含む）', desc: '訪問診療医と連携した疼痛コントロールを行います。' },
  { label: '褥瘡処置', desc: '専門的な褥瘡ケアに対応します。' },
]

const bekihyo7 = [
  '末期の悪性腫瘍', '多発性硬化症', '重症筋無力症', 'スモン',
  '筋萎縮性側索硬化症', '脊髄小脳変性症', 'ハンチントン病', '進行性筋ジストロフィー症',
  'パーキンソン病関連疾患', '多系統萎縮症', 'プリオン病', '亜急性硬化性全脳炎',
  'ライソゾーム病', '副腎白質ジストロフィー', '脊髄性筋萎縮症', '球脊髄性筋萎縮症',
  '慢性炎症性脱髄性多発神経炎', '後天性免疫不全症候群', '頸髄損傷', '人工呼吸器を使用している状態',
]

const bekihyo8 = [
  '在宅悪性腫瘍等患者指導管理（ターミナルケア）',
  '在宅気管切開患者指導管理を受けている状態',
  '気管カニューレを使用している状態',
  '留置カテーテルを使用している状態',
  '在宅自己腹膜灌流指導管理を受けている状態',
  '在宅血液透析指導管理を受けている状態',
  '在宅酸素療法指導管理を受けている状態',
  '在宅中心静脈栄養法指導管理を受けている状態',
  '在宅成分栄養経管栄養法指導管理を受けている状態',
  '在宅自己導尿指導管理を受けている状態',
  '在宅人工呼吸指導管理を受けている状態',
  '在宅持続陽圧呼吸療法指導管理を受けている状態（CPAP含む）',
  '在宅自己疼痛管理または在宅肺高血圧症患者指導管理を受けている状態',
  '在宅植込み型補助人工心臓（非拍動流型）指導管理を受けている状態',
  '人工肛門または人工膀胱を設置している状態',
  '真皮を超える褥瘡の状態',
  '在宅患者訪問点滴注射管理指導料を算定している状態',
]

const medicalSupport = [
  {
    title: '24時間看護体制',
    desc: '正看護師が24時間体制で入居者様の状態を管理します。夜間の急変時にも迅速に対応できる体制を整えています。',
  },
  {
    title: '訪問診療連携',
    desc: '複数の訪問診療クリニックと連携し、定期診察と緊急時の往診に対応しています。医療処置の指示・管理を担います。',
  },
  {
    title: '施設内訪問看護',
    desc: '併設の訪問看護ステーションが施設内の入居者様を担当します。貴院の担当看護師との引き継ぎもスムーズに行います。',
  },
  {
    title: '施設内訪問介護',
    desc: '併設の訪問介護ステーションによる生活支援を提供します。看護師と介護士が連携し、医療と生活を一体的にサポートします。',
  },
]

const steps = [
  {
    num: '01',
    title: 'ご相談・お問い合わせ',
    desc: 'お電話またはお問い合わせフォームにて、対象者様の状態・ご希望をお聞かせください。看護サマリーのご送付前でも構いません。受付時間は平日10:00〜19:00です。',
  },
  {
    num: '02',
    title: '情報共有・アセスメント',
    desc: '看護サマリーや診療情報等をご共有いただき、受け入れ可否の判断を行います。必要に応じて施設見学・病院訪問面談もご案内します。',
  },
  {
    num: '03',
    title: '入居申込・契約',
    desc: 'ご入居者様・ご家族様とともに入居申込・契約手続きを進めます。退院日程に合わせてスケジュールを調整します。',
  },
  {
    num: '04',
    title: '入居・引き継ぎ',
    desc: 'スムーズな引き継ぎのため、退院前カンファレンスへの参加も可能です。入居後も担当看護師・訪問診療医と継続的に連携します。',
  },
]

export default function RenkeiPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">For Medical Professionals</span>
            <h1 className="page-header-title">医療機関・ご紹介の方へ</h1>
          </div>
        </div>

        {/* Lead section */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <span className="section-heading-en">For Discharge Support</span>
                <h2 className="section-heading">
                  退院後の行き先に、<br />
                  シーズメディカルホームを。
                </h2>
                <div className="divider-green" />
                <div className="space-y-4 font-sans text-sm text-darkgray leading-[1.9]">
                  <p>
                    退院支援・地域連携室のご担当者様へ。シーズメディカルホームは、神奈川県・東京都を中心に医療依存度の高い方や終末期の方が退院後も安心して暮らせる医療特化型介護施設です。
                  </p>
                  <p>
                    現在、神奈川県横浜市・藤沢市・川崎市や東京都日野市に拠点があります（一部開設予定）。
                  </p>
                  <p>
                    24時間看護体制と訪問診療医との密な連携により、胃ろう・気管切開・人工呼吸器管理など高度な医療ケアが必要な方の受け入れが可能です。「退院先が見つからない」「医療依存度が高くて施設を断られた」という方のご相談をお待ちしています。
                  </p>
                  <p>
                    別表第7・第8に該当する方を含め、幅広い状態の方にご対応します。まずはお気軽にご連絡ください。
                  </p>
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-white border border-lightgray p-8">
                <p className="font-sans text-[10px] tracking-widest text-green-dark uppercase mb-6">Quick Info</p>
                <div className="space-y-0 divide-y divide-lightgray">
                  {[
                    { label: '看護体制', value: '24時間看護師常駐' },
                    { label: '訪問診療', value: '複数クリニックと連携' },
                    { label: '訪問看護', value: '施設内訪問看護ステーション併設' },
                    { label: '訪問介護', value: '施設内訪問介護ステーション併設' },
                    { label: '面会時間', value: '24時間対応（家としてのコンセプト）' },
                    { label: 'エリア', value: '横浜市・藤沢市・川崎市（神奈川県）\n日野市（東京都）' },
                    { label: '受付時間', value: '平日 10:00 – 19:00' },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 py-3.5">
                      <span className="font-sans text-xs text-midgray w-24 flex-shrink-0 pt-0.5">{item.label}</span>
                      <span className="font-sans text-sm text-darkgray font-medium leading-snug whitespace-pre-line">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 受け入れ対応一覧 */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <span className="section-heading-en">Acceptable Conditions</span>
              <h2 className="section-heading">受け入れ対応一覧</h2>
              <div className="divider-green" />
              <p className="font-sans text-sm text-darkgray/70 leading-relaxed mt-4 max-w-xl">
                下記はおもな対応例です。記載のない状態についてもご相談ください。<br />
                受け入れ可否は対象者様の状態を確認したうえで個別に判断いたします。
              </p>
            </div>
            {/* 主な対応ケア */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-lightgray border border-lightgray mb-12">
              {acceptableConditions.map((item) => (
                <div key={item.label} className="p-6 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 bg-green-main flex-shrink-0" />
                    <h3 className="font-serif text-sm font-semibold text-green-deeper">{item.label}</h3>
                  </div>
                  <p className="font-sans text-xs text-darkgray/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 別表7 */}
            <div className="mb-8">
              <h3 className="font-serif text-base font-semibold text-green-deeper mb-1">
                別表第7 ― 厚生労働大臣が定める疾病等（医療保険による訪問看護が適用）
              </h3>
              <div className="w-8 h-0.5 bg-green-main mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {bekihyo7.map((d) => (
                  <div
                    key={d}
                    className="bg-green-light border border-green-pale font-sans text-xs text-green-deeper text-center px-3 py-2 tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* 別表8 */}
            <div>
              <h3 className="font-serif text-base font-semibold text-green-deeper mb-1">
                別表第8 ― 厚生労働大臣が定める状態等（医療保険による訪問看護が適用）
              </h3>
              <div className="w-8 h-0.5 bg-green-main mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {bekihyo8.map((d) => (
                  <div
                    key={d}
                    className="bg-offwhite border border-lightgray font-sans text-xs text-darkgray px-4 py-2.5 tracking-wide flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-green-main flex-shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 医療・ケア体制 */}
        <section className="py-16 md:py-20 bg-offwhite">
          <div className="max-w-5xl mx-auto px-6">
            <span className="section-heading-en">Medical Support</span>
            <h2 className="section-heading">医療・ケア体制</h2>
            <div className="divider-green" />
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              {medicalSupport.map((item) => (
                <div key={item.title} className="bg-white border border-lightgray p-6 md:p-8">
                  <h3 className="font-serif text-base font-semibold text-green-deeper mb-1">{item.title}</h3>
                  <div className="w-6 h-0.5 bg-green-main mb-4" />
                  <p className="font-sans text-sm text-darkgray/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 紹介の流れ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <span className="section-heading-en">Referral Process</span>
            <h2 className="section-heading">ご紹介・相談の流れ</h2>
            <div className="divider-green" />
            <div className="mt-8 border border-lightgray">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`flex gap-6 p-6 md:p-8 ${i < steps.length - 1 ? 'border-b border-lightgray' : ''}`}
                >
                  <span className="font-sans text-3xl font-light text-green-main/40 tracking-tighter flex-shrink-0 leading-none pt-1">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-green-deeper mb-2">{step.title}</h3>
                    <p className="font-sans text-sm text-darkgray/80 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-sans text-xs text-midgray mt-5 leading-relaxed">
              ※ 退院前カンファレンスへの参加・病院への訪問面談等にも対応可能です。お気軽にご相談ください。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green-deeper text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-widest text-green-pale uppercase mb-4">Contact</p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide mb-3">
              まずはご相談ください
            </h2>
            <p className="font-sans text-sm text-white/70 mb-8 leading-[1.9] tracking-wide">
              看護サマリーのご送付前でも構いません。<br />
              状態をご説明いただければ、受け入れ可否の目安をお伝えします。
            </p>
            <a
              href="tel:03-3797-4002"
              className="font-sans text-2xl md:text-3xl font-semibold tracking-wider hover:text-green-pale transition-colors block mb-4"
            >
              ☎&ensp;03-3797-4002
            </a>
            <p className="font-sans text-xs text-white/60 mb-8 tracking-wide">受付時間 / 平日 10:00 – 19:00</p>
            <Link href="/contact" className="btn-white">
              お問い合わせフォームはこちら
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
