import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { createClient } from '@supabase/supabase-js'
import type { JobListing } from '@/types'

export const metadata = {
  title: '求人一覧・採用応募',
  description: 'シーズメディカルホームの求人一覧です。各施設の求人詳細・応募フォームはこちらから。',
}

export const revalidate = 60 // ISR: 60秒ごとに再検証

async function getJobs(): Promise<JobListing[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url') {
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
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
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '応相談'
  if (min && max) return `¥${min.toLocaleString()} – ¥${max.toLocaleString()}`
  if (min) return `¥${min.toLocaleString()}〜`
  if (max) return `〜¥${max.toLocaleString()}`
  return '応相談'
}

export default async function RecruitPage() {
  const jobs = await getJobs()

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

            {/* Job cards */}
            <div className="mb-12">
              <span className="section-heading-en">Open Positions</span>
              <h2 className="section-heading">募集中の求人</h2>
              <div className="divider-green" />

              {jobs.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-lightgray bg-white">
                  <p className="font-serif text-base text-green-deeper mb-2">現在募集中の求人はありません</p>
                  <p className="font-sans text-xs text-darkgray/60">お問い合わせは採用担当までご連絡ください</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/recruit/${job.id}`}
                      className="group block bg-white border border-lightgray p-6 md:p-8 hover:border-green-main hover:shadow-sm transition-all"
                    >
                      {/* Tag row */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5">
                          {job.job_type}
                        </span>
                        <span className="font-sans text-[10px] tracking-widest text-darkgray bg-offwhite border border-lightgray px-2 py-0.5">
                          {job.employment_type}
                        </span>
                      </div>
                      <h2 className="font-serif text-base font-semibold text-green-deeper leading-snug mb-3 group-hover:text-green-dark transition-colors">
                        {job.title}
                      </h2>
                      <div className="space-y-2 mb-4 border-t border-lightgray pt-4">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs text-midgray w-16 flex-shrink-0">施設</span>
                          <span className="font-sans text-xs text-darkgray">{job.facility}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs text-midgray w-16 flex-shrink-0">給与</span>
                          <span className="font-sans text-xs text-darkgray font-medium">
                            {formatSalary(job.total_salary_min, job.total_salary_max)}
                          </span>
                        </div>
                      </div>
                      {job.appeal_content && (
                        <p className="font-sans text-xs text-darkgray/80 leading-relaxed line-clamp-3">
                          {job.appeal_content}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-1 text-green-dark">
                        <span className="font-sans text-xs">詳細を見る</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
