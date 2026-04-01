import { Suspense } from 'react'
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

interface FilterOptions {
  facilities: string[]
  jobTypes: string[]
  employmentTypes: string[]
}

async function getFilterOptions(): Promise<FilterOptions> {
  if (!hasValidSupabaseConfig()) return { facilities: [], jobTypes: [], employmentTypes: [] }

  try {
    const supabase = createServerSupabaseClient()
    const [facilitiesRes, jobTypesRes, employmentTypesRes] = await Promise.all([
      supabase
        .from('job_listings')
        .select('facility')
        .eq('is_active', true)
        .order('facility', { ascending: true }),
      supabase
        .from('job_listings')
        .select('job_type')
        .eq('is_active', true)
        .order('job_type', { ascending: true }),
      supabase
        .from('job_listings')
        .select('employment_type')
        .eq('is_active', true)
        .order('employment_type', { ascending: true }),
    ])

    const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))

    return {
      facilities: unique((facilitiesRes.data ?? []).map((r) => r.facility).filter(Boolean)),
      jobTypes: unique((jobTypesRes.data ?? []).map((r) => r.job_type).filter(Boolean)),
      employmentTypes: unique((employmentTypesRes.data ?? []).map((r) => r.employment_type).filter(Boolean)),
    }
  } catch (err) {
    console.error('Failed to fetch filter options:', err)
    return { facilities: [], jobTypes: [], employmentTypes: [] }
  }
}

export default async function RecruitPage() {
  const [jobs, filterOptions] = await Promise.all([getJobs(), getFilterOptions()])

  return (
    <>
      <Header />
      <main>

        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Job Listings</span>
            <h1 className="page-header-title">求人一覧</h1>
          </div>
        </div>

        <section className="py-12 md:py-20 bg-offwhite">
          <div className="max-w-5xl mx-auto px-6">

            {/* Job cards with filter */}
            <div className="mb-12">
              <span className="section-heading-en">Open Positions</span>
              <h2 className="section-heading">募集中の求人</h2>
              <div className="divider-green" />

              <Suspense fallback={null}>
                <RecruitJobsClient jobs={jobs} filterOptions={filterOptions} />
              </Suspense>
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
