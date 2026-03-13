import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createServerSupabaseClient, hasValidSupabaseConfig } from '@/lib/supabase-server'
import RecruitJobsClient from './_components/RecruitJobsClient'
import type { JobListing } from '@/types'

export const metadata = {
  title: '求人一覧・採用応募',
  description: 'シーズメディカルホームの求人一覧。看護師・介護職・PT/OT職員を募集中。施設・職種・雇用形態で絞り込みができます。各求人の詳細・応募フォームはこちらから。',
  openGraph: {
    type: 'website',
    url: 'https://medicalhome.citech.co.jp/recruit',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: '求人一覧・採用応募 | シーズメディカルホーム',
    description: '看護師・介護職・PT/OT職員を募集中。東京・神奈川を中心に関東エリアで展開する医療特化型介護施設。残業少なめ・看取り対応・子育て中も活躍中。求人一覧・応募フォームはこちら。',
  },
}

export const revalidate = 60 // ISR: 60秒ごとに再検証

async function getJobs(): Promise<JobListing[]> {
  if (!hasValidSupabaseConfig()) return []

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('facility', { ascending: true })
      .order('job_type', { ascending: true })

    if (error) {
      console.error('Failed to fetch jobs:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Failed to fetch jobs:', err)
    return []
  }
}

export default async function RecruitPage() {
  const jobs = await getJobs()

  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header relative overflow-hidden">
          {/* Cloud wave decoration */}
          <svg className="absolute bottom-0 left-0 w-full opacity-[0.08] pointer-events-none" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
          <div className="relative max-w-7xl mx-auto px-6">
            <span className="page-header-en">Job Listings</span>
            <h1 className="page-header-title">求人一覧</h1>
          </div>
        </div>

        <section className="relative py-12 md:py-20 bg-offwhite overflow-hidden">
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-[0.45]" />
          {/* Leaf decoration right */}
          <svg className="absolute top-16 right-6 w-24 opacity-[0.06] pointer-events-none hidden lg:block" viewBox="0 0 100 140" aria-hidden="true">
            <path d="M50,8 C75,8 92,35 92,70 C92,105 75,132 50,132 C25,132 8,105 8,70 C8,35 25,8 50,8 Z" fill="#578E1D"/>
            <line x1="50" y1="8" x2="50" y2="132" stroke="#578E1D" strokeWidth="2"/>
            <line x1="50" y1="50" x2="78" y2="38" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="70" x2="82" y2="65" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="90" x2="78" y2="88" stroke="#578E1D" strokeWidth="1.5"/>
          </svg>
          {/* Leaf decoration left */}
          <svg className="absolute bottom-16 left-6 w-20 opacity-[0.05] pointer-events-none hidden lg:block" viewBox="0 0 100 140" aria-hidden="true">
            <path d="M50,8 C75,8 92,35 92,70 C92,105 75,132 50,132 C25,132 8,105 8,70 C8,35 25,8 50,8 Z" fill="#578E1D"/>
            <line x1="50" y1="8" x2="50" y2="132" stroke="#578E1D" strokeWidth="2"/>
            <line x1="50" y1="50" x2="22" y2="38" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="70" x2="18" y2="65" stroke="#578E1D" strokeWidth="1.5"/>
            <line x1="50" y1="90" x2="22" y2="88" stroke="#578E1D" strokeWidth="1.5"/>
          </svg>
          <div className="relative max-w-5xl mx-auto px-6">

            {/* Job cards with filter */}
            <div className="mb-12">
              <span className="section-heading-en">Open Positions</span>
              <h2 className="section-heading">募集中の求人</h2>
              <div className="divider-green" />

              <RecruitJobsClient jobs={jobs} />
            </div>

            {/* CTA section */}
            <div className="bg-green-light border border-green-pale p-6 md:p-8 text-center">
              <p className="font-serif text-base text-green-deeper mb-2">ご質問・見学のお申し込み</p>
              <p className="font-sans text-xs text-darkgray/70 mb-4 leading-relaxed">
                お電話でもお気軽にお問い合わせください
              </p>
              <a
                href="tel:03-3797-4002"
                className="font-sans text-lg font-semibold text-green-deeper hover:text-green-dark transition-colors tracking-wider"
              >
                ☎&ensp;03-3797-4002
              </a>
              <p className="font-sans text-xs text-darkgray/60 mt-1">採用担当 / 平日 10:00 – 19:00</p>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
