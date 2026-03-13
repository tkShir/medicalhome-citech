import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: '採用情報',
  description: '正看護師・介護職員（初任者研修以上）募集。施設内訪問看護・看取りケアに携わりたい方歓迎。残業少なめ・夜勤負担軽減で子育て中の方も活躍中。横浜市保土ヶ谷区・藤沢市・川崎市・日野市の医療特化型介護施設。',
  openGraph: {
    type: 'website',
    url: 'https://medicalhome.citech.co.jp/saiyo',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: '採用情報 | シーズメディカルホーム',
    description: '正看護師・介護職員（初任者研修以上）募集。東京・神奈川を中心に関東エリアで展開する医療特化型介護施設。施設内訪問看護・看取りケア。残業少なめ・夜勤負担軽減・子育て中も活躍中。横浜市保土ヶ谷区・藤沢市・川崎市・日野市。',
  },
}

const values = [
  { label: '大地', desc: '現場で働くひとりひとりが大地となる' },
  { label: '木', desc: '専門性とチームワークで樹木を育てる' },
  { label: '実', desc: '入居者の「らしさ」という実りを生み出す' },
]

const jobCategories = [
  { title: '看護師（正看護師）', desc: '施設内訪問看護を担う正看護師を募集。看取りケア・終末期経験者歓迎。夜勤負担軽減・残業少なめ。' },
  { title: '看護師（パート職員）', desc: '週2〜3日・4時間〜の柔軟な勤務スタイル。家庭やライフスタイルと両立しながら、スキルを活かして働きたい看護師の方を歓迎します。' },
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
        <div className="page-header relative overflow-hidden">
          {/* Wave decoration */}
          <svg className="absolute bottom-0 left-0 w-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
          {/* Floating circles */}
          <svg className="absolute right-16 top-1/2 -translate-y-1/2 w-32 opacity-[0.06] pointer-events-none hidden lg:block" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="56" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="60" cy="60" r="35" fill="none" stroke="white" strokeWidth="1"/>
          </svg>
          <div className="relative max-w-7xl mx-auto px-6">
            <span className="page-header-en">Recruitment</span>
            <h1 className="page-header-title">採用情報</h1>
          </div>
        </div>

        {/* Hero message */}
        <section className="relative py-16 md:py-24 bg-offwhite overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.45]" />
          {/* Leaf decoration bottom-left */}
          <svg className="absolute bottom-0 left-0 w-36 opacity-[0.06] pointer-events-none hidden md:block" viewBox="0 0 120 160" aria-hidden="true">
            <path d="M60,10 C90,10 110,40 110,80 C110,120 90,150 60,150 C30,150 10,120 10,80 C10,40 30,10 60,10 Z" fill="#578E1D"/>
            <line x1="60" y1="10" x2="60" y2="150" stroke="#578E1D" strokeWidth="2"/>
            <line x1="60" y1="50" x2="28" y2="38" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="60" y1="70" x2="22" y2="65" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="60" y1="90" x2="28" y2="90" stroke="#578E1D" strokeWidth="1.5"/>
          </svg>
          <div className="relative max-w-5xl mx-auto px-6">
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
                    シーズメディカルホームは、東京・神奈川を中心に関東エリアで展開する医療特化型介護施設です。関わる人全ての「らしさ」を尊重し、それが人生の実となるように支える住まいを目指しています。
                  </p>
                  <p>
                    あなたの経験と頑張りが大地となり、樹を育て、人生の「らしさ」という実りを生み出す。その過程で、あなた「らしさ」を見つけられる場所になることが、シーズメディカルホームの願いです。
                  </p>
                  <p>
                    私たちは、入居者様とご家族様の「実り」を支える一番大切な存在は、現場で向き合う職員だと考えています。介護職・看護職・リハビリ職・相談員・事務スタッフ…それぞれの専門性とチームワークが、大地となり、樹木に栄養を届けます。
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/recruit" className="btn-primary">
                    求人一覧・応募フォームはこちら
                  </Link>
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
        <section className="relative py-16 md:py-20 bg-white overflow-hidden">
          {/* Dot pattern (subtle on white) */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.22]" />
          {/* Leaf top-right */}
          <svg className="absolute top-8 right-6 w-24 opacity-[0.04] pointer-events-none hidden lg:block" viewBox="0 0 100 140" aria-hidden="true">
            <path d="M50,8 C75,8 92,35 92,70 C92,105 75,132 50,132 C25,132 8,105 8,70 C8,35 25,8 50,8 Z" fill="#578E1D"/>
            <line x1="50" y1="8" x2="50" y2="132" stroke="#578E1D" strokeWidth="2"/>
            <line x1="50" y1="50" x2="78" y2="38" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="70" x2="82" y2="65" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="90" x2="78" y2="88" stroke="#578E1D" strokeWidth="1.5"/>
          </svg>
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="mb-10 text-center">
              <span className="section-heading-en">Job Categories</span>
              <h2 className="section-heading-center">募集職種</h2>
              <div className="divider-green-center" />
              <p className="font-sans text-xs text-midgray tracking-wide">各職種カードをクリックして求人詳細をご確認ください</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-0 border border-lightgray">
              {jobCategories.map((job, i) => (
                <Link
                  key={job.title}
                  href="/recruit"
                  className={`group p-6 md:p-8 bg-white hover:bg-green-light/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer ${i < jobCategories.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-lightgray' : ''}`}
                >
                  <h3 className="font-serif text-base font-semibold text-green-deeper mb-3 group-hover:text-green-dark transition-colors">{job.title}</h3>
                  <p className="font-sans text-xs text-darkgray/80 leading-relaxed">{job.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-green-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-sans text-xs font-medium">求人を見る</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-6 font-sans text-xs text-midgray text-center tracking-wide">
              現在の募集エリア：横浜市保土ヶ谷区・藤沢市・川崎市・日野市（今後も順次拡大予定）
            </p>
            <div className="mt-4 text-center">
              <Link href="/recruit" className="btn-primary">
                求人一覧・応募フォームはこちら
              </Link>
            </div>
          </div>
        </section>

        {/* Nurse's day */}
        <section className="relative py-16 md:py-20 bg-offwhite overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.45]" />
          {/* Cloud bottom-right */}
          <svg className="absolute bottom-0 right-0 w-56 opacity-[0.05] pointer-events-none hidden md:block" viewBox="0 0 200 120" aria-hidden="true">
            <ellipse cx="100" cy="90" rx="85" ry="50" fill="#578E1D"/>
            <ellipse cx="55" cy="80" rx="55" ry="40" fill="#578E1D"/>
            <ellipse cx="150" cy="85" rx="50" ry="38" fill="#578E1D"/>
          </svg>
          <div className="relative max-w-4xl mx-auto px-6">
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
        <section className="relative py-16 md:py-20 bg-white overflow-hidden">
          {/* Dot pattern (subtle on white) */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.20]" />
          {/* Leaf top-left */}
          <svg className="absolute top-10 left-6 w-20 opacity-[0.04] pointer-events-none hidden lg:block" viewBox="0 0 100 140" aria-hidden="true">
            <path d="M50,8 C75,8 92,35 92,70 C92,105 75,132 50,132 C25,132 8,105 8,70 C8,35 25,8 50,8 Z" fill="#578E1D"/>
            <line x1="50" y1="8" x2="50" y2="132" stroke="#578E1D" strokeWidth="2"/>
            <line x1="50" y1="50" x2="22" y2="38" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="70" x2="18" y2="65" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="90" x2="22" y2="88" stroke="#578E1D" strokeWidth="1.5"/>
          </svg>
          <div className="relative max-w-4xl mx-auto px-6">
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

        {/* ── インライン求人CTAバナー ── */}
        <div className="bg-green-light border-y border-green-pale">
          <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif text-base text-green-deeper leading-snug">
                現在、看護師・介護職員を<span className="text-pink-main font-semibold">積極募集中</span>
              </p>
              <p className="font-sans text-xs text-darkgray/70 mt-1">詳しい求人情報・勤務条件・応募はこちらから</p>
            </div>
            <Link href="/recruit" className="btn-primary flex-shrink-0">
              求人一覧を見る
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* チームで支える看取りケア */}
        <section className="relative py-16 md:py-20 bg-offwhite overflow-hidden">
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.45]" />
          {/* Cloud top-right */}
          <svg className="absolute top-8 right-0 w-52 opacity-[0.06] pointer-events-none hidden md:block" viewBox="0 0 200 100" aria-hidden="true">
            <ellipse cx="100" cy="60" rx="80" ry="40" fill="#578E1D"/>
            <ellipse cx="60" cy="55" rx="50" ry="35" fill="#578E1D"/>
            <ellipse cx="145" cy="58" rx="45" ry="30" fill="#578E1D"/>
          </svg>
          <div className="relative max-w-4xl mx-auto px-6">
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
        <section className="relative py-16 md:py-20 bg-green-deeper text-white overflow-hidden">
          {/* Wave top */}
          <svg className="absolute top-0 left-0 w-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 C1300,45 1370,20 1440,30 L1440,0 L0,0 Z" fill="white" />
          </svg>
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.18]" />
          {/* Floating circles */}
          <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-36 opacity-[0.05] pointer-events-none hidden lg:block" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="56" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="60" cy="60" r="36" fill="none" stroke="white" strokeWidth="1"/>
          </svg>
          <svg className="absolute right-10 bottom-8 w-24 opacity-[0.04] pointer-events-none hidden lg:block" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="white"/>
          </svg>
          {/* Wave bottom */}
          <svg className="absolute bottom-0 left-0 w-full opacity-[0.06] pointer-events-none" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,10 1440,20 L1440,40 L0,40 Z" fill="white"/>
          </svg>
          <div className="relative max-w-2xl mx-auto px-6 text-center">
            <p className="font-sans text-xs tracking-widest text-green-pale uppercase mb-4">Join Us</p>
            <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-wide mb-4">
              一緒に働きませんか？
            </h2>
            <p className="font-sans text-sm text-white/70 mb-6 leading-[1.9] tracking-wide">
              経験・資格・勤務形態のご希望など、<br />まずはお気軽にお問い合わせください。
            </p>
            {/* Phone */}
            <a
              href="tel:03-3797-4002"
              className="font-sans text-xl md:text-2xl font-semibold tracking-wider hover:text-green-pale transition-colors block mb-2"
            >
              ☎&ensp;03-3797-4002
            </a>
            <p className="font-sans text-xs text-white/50 mb-8 tracking-wide">採用担当 / 平日 10:00 – 19:00</p>
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/recruit" className="btn-white">
                求人一覧・応募フォーム
              </Link>
              <Link href="/contact" className="btn-white-outline">
                お問い合わせ
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
