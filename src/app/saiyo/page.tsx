import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: '採用情報',
  description: '正看護師・介護職員（初任者研修以上）募集。施設内訪問看護・看取りケアに携わりたい方歓迎。残業少なめ・夜勤負担軽減で子育て中の方も活躍中。横浜・藤沢・川崎の医療特化型介護施設。',
}

const values = [
  { label: '大地', desc: '現場で働くひとりひとりが大地となる' },
  { label: '木', desc: '専門性とチームワークで樹木を育てる' },
  { label: '実', desc: '入居者の「らしさ」という実りを生み出す' },
]

const jobCategories = [
  { title: '看護師（正看護師）', desc: '施設内訪問看護を担う正看護師を募集。看取りケア・終末期経験者歓迎。夜勤負担軽減・残業少なめ。' },
  { title: '介護職員', desc: '初任者研修以上の資格をお持ちの方を募集。看取り経験のある方は尚可。看護師と連携し、その人らしい生活を支えます。' },
  { title: 'PT/OT職員', desc: 'リハビリ専門職として、理想のケアを実現しませんか。' },
  { title: '相談員・事務', desc: '入居相談・事務スタッフも積極採用中です。' },
]

const nurseSchedule = [
  { time: '8:30〜', task: '利用者様の状況に関する申し送り' },
  { time: '9:00〜', task: '訪問開始：胃ろう管理、点滴管理、採血など' },
  { time: '11:00〜', task: '経管栄養の準備' },
  { time: '11:30頃', task: '食事介助、経管栄養の実施、薬の手配' },
  { time: '12:30〜13:30', task: '休憩' },
  { time: '13:30頃', task: '入浴介助、処置など' },
  { time: '16:00', task: '訪問看護記録作成、情報共有' },
  { time: '16:30', task: '夜勤者への申し送り' },
  { time: '17:30', task: '業務終了' },
]

const nurseTasks = [
  'バイタルサイン測定',
  'フィジカルアセスメント',
  '個別ケア（清拭・口腔ケア等）',
  '排せつコントロール',
  '摂食嚥下訓練・食事介助',
  '医師の指示による医療処置',
  '訪問診療時の医師対応',
  '看護記録の記載',
  '意思決定支援・グリーフケア',
]

export default function SaiyoPage() {
  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Recruitment</span>
            <h1 className="page-header-title">採用情報</h1>
          </div>
        </div>

        {/* Hero message */}
        <section className="py-16 md:py-24 bg-offwhite">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <span className="section-heading-en">Our Philosophy</span>
                <h2 className="section-heading">
                  あなたのケアが、<br />
                  人生の「らしさ」を実らせる。
                </h2>
                <div className="divider-green" />
                <div className="space-y-4 font-sans text-sm text-darkgray leading-[1.9]">
                  <p>
                    シーズメディカルホームは、関わる人全ての「らしさ」を尊重し、それが人生の実となるように支える住まいです。
                  </p>
                  <p>
                    あなたの経験と頑張りが大地となり、樹を育て、人生の「らしさ」という実りを生み出す。その過程で、あなた「らしさ」を見つけられる場所になることが、シーズメディカルホームの願いです。
                  </p>
                  <p>
                    私たちは、入居者様とご家族様の「実り」を支える一番大切な存在は、現場で向き合う職員だと考えています。介護職・看護職・リハビリ職・相談員・事務スタッフ…それぞれの専門性とチームワークが、大地となり、樹木に栄養を届けます。
                  </p>
                </div>
              </div>

              {/* Values visual */}
              <div className="bg-white border border-lightgray p-8">
                <p className="font-sans text-[10px] tracking-widest text-green-dark uppercase mb-6">Our Values</p>
                <div className="space-y-6">
                  {values.map((v) => (
                    <div key={v.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-light flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-lg font-semibold text-green-deeper">{v.label}</span>
                      </div>
                      <div>
                        <p className="font-sans text-sm text-darkgray leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-lightgray">
                  <p className="font-sans text-xs text-midgray leading-relaxed">
                    「実りのある木」に込められた想い。<br />
                    大地をつくるのは、現場で働くひとりひとり。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job categories */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10 text-center">
              <span className="section-heading-en">Job Categories</span>
              <h2 className="section-heading-center">募集職種</h2>
              <div className="divider-green-center" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-lightgray">
              {jobCategories.map((job, i) => (
                <div
                  key={job.title}
                  className={`p-6 md:p-8 bg-white ${i < jobCategories.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-lightgray' : ''}`}
                >
                  <h3 className="font-serif text-base font-semibold text-green-deeper mb-3">{job.title}</h3>
                  <p className="font-sans text-xs text-darkgray/80 leading-relaxed">{job.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/recruit" className="btn-primary">
                求人一覧・応募フォームはこちら
              </Link>
            </div>
          </div>
        </section>

        {/* Nurse's day */}
        <section className="py-16 md:py-20 bg-offwhite">
          <div className="max-w-4xl mx-auto px-6">
            <span className="section-heading-en">A Day in the Life</span>
            <h2 className="section-heading">あなた「らしく」働く</h2>
            <p className="font-sans text-sm text-midgray mb-2 tracking-wide">看護師の1日</p>
            <div className="divider-green" />

            {/* Nurse tasks */}
            <div className="bg-white border border-lightgray p-6 md:p-8 mb-6">
              <h3 className="font-serif text-base font-semibold text-green-deeper mb-1">仕事内容</h3>
              <div className="w-8 h-0.5 bg-green-main mb-5" />
              <p className="font-sans text-sm text-darkgray leading-[1.9] mb-5">
                訪問診療医の指示のもと24時間体制で状態を管理し、モニタリングや疼痛コントロールなどの医療的ケアを行います。
                医療特化型介護施設には訪問看護ステーションと訪問介護ステーションを併設しており、日々の暮らしの中での会話を大切にしながら、生活面や必要援助について相談しながら看護を提供します。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {nurseTasks.map((task) => (
                  <div key={task} className="flex items-center gap-2 font-sans text-xs text-darkgray">
                    <span className="w-1 h-1 bg-green-main flex-shrink-0" />
                    {task}
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white border border-lightgray p-6 md:p-8">
              <h3 className="font-serif text-base font-semibold text-green-deeper mb-1">1日のタイムスケジュール</h3>
              <div className="w-8 h-0.5 bg-green-main mb-5" />
              <div className="space-y-0 border-t border-lightgray">
                {nurseSchedule.map((item) => (
                  <div key={item.time} className="flex items-start gap-4 py-3 border-b border-lightgray">
                    <span className="font-sans text-xs font-medium text-green-dark w-28 flex-shrink-0 tracking-wide">
                      {item.time}
                    </span>
                    <span className="font-sans text-sm text-darkgray">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 施設内訪問看護という働き方 */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <span className="section-heading-en">Nursing Style</span>
            <h2 className="section-heading">施設内訪問看護という働き方</h2>
            <div className="divider-green" />
            <div className="space-y-4 font-sans text-sm text-darkgray leading-[1.9] mb-8">
              <p>
                シーズメディカルホームでは、併設する訪問看護ステーションの正看護師が施設内の入居者様を担当する「施設内訪問看護」というスタイルで勤務します。病棟看護とは異なり、生活の場である「住まい」に寄り添いながら医療ケアを提供するため、患者さんと深く関わりたい方に適した環境です。
              </p>
              <p>
                訪問診療医との密な連携のもと、状態管理・処置・看取りまでを一貫して担うことができます。「急性期を離れ、その人らしさを支えるケアに携わりたい」「看取りの経験を活かしたい」「残業の少ない環境で子育てと両立したい」という正看護師の方を歓迎します。
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-0 border border-lightgray">
              {[
                { label: '病棟看護との違い', desc: '処置の回転ではなく、一人ひとりの生活リズムに合わせた丁寧な関わりができます。' },
                { label: '訪問看護との違い', desc: '施設内なので移動がなく、急変時にも迅速に対応できる安心感があります。' },
                { label: '看取りへの関わり', desc: '入居者様・ご家族と信頼関係を築きながら、最期まで寄り添えます。' },
              ].map((item, i) => (
                <div key={item.label} className={`p-6 bg-white ${i < 2 ? 'border-b sm:border-b-0 sm:border-r border-lightgray' : ''}`}>
                  <h3 className="font-serif text-sm font-semibold text-green-deeper mb-2">{item.label}</h3>
                  <p className="font-sans text-xs text-darkgray/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* チームで支える看取りケア */}
        <section className="py-16 md:py-20 bg-offwhite">
          <div className="max-w-4xl mx-auto px-6">
            <span className="section-heading-en">End-of-Life Care</span>
            <h2 className="section-heading">チームで支える看取りケア</h2>
            <div className="divider-green" />
            <div className="space-y-4 font-sans text-sm text-darkgray leading-[1.9] mb-8">
              <p>
                シーズメディカルホームでは、看護師と介護士が対等なパートナーとして、入居者様の看取りに向き合います。看護師の医療的な視点と、日常生活を長時間ともにしてきた介護士の気づきが合わさることで、ご本人・ご家族が望む「最期のかたち」を一緒に作り上げていきます。
              </p>
              <p>
                介護士だからこそ気づける食事量のわずかな変化、表情のちょっとした違い——それが看護師の的確な判断を支えます。看護師の医療サポートがあるから、介護士が安心してケアを続けられる。どちらの専門性も欠かせない、チーム看取りを大切にしています。
              </p>
            </div>
            <div className="bg-white border border-lightgray p-6 md:p-8">
              <p className="font-sans text-[10px] tracking-widest text-green-dark uppercase mb-5">Team Approach</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-green-deeper mb-3">看護師の役割</h3>
                  <ul className="space-y-2">
                    {['状態管理・医療処置', '疼痛コントロール', '訪問診療医との連携', '意思決定・看取りの判断支援', 'ご家族へのグリーフケア'].map((t) => (
                      <li key={t} className="flex items-center gap-2 font-sans text-xs text-darkgray">
                        <span className="w-1 h-1 bg-green-main flex-shrink-0" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-green-deeper mb-3">介護士の役割</h3>
                  <ul className="space-y-2">
                    {['日常生活の全介助・見守り', '食事・入浴・排泄ケア', '変化への早期気づき・報告', '本人・家族との信頼関係構築', '看護師との密な情報共有'].map((t) => (
                      <li key={t} className="flex items-center gap-2 font-sans text-xs text-darkgray">
                        <span className="w-1 h-1 bg-pink-main flex-shrink-0" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-16 bg-green-deeper text-white">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-widest text-green-pale uppercase mb-4">Join Us</p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide mb-4">
              一緒に働きませんか？
            </h2>
            <p className="font-sans text-sm text-white/70 mb-8 leading-[1.9] tracking-wide">
              経験・資格・勤務形態のご希望など、<br />まずはお気軽にお問い合わせください。
            </p>
            <Link href="/recruit" className="btn-white">
              求人一覧・応募フォーム
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
