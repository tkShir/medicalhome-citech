import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RecruitForm from '@/components/forms/RecruitForm'
import type { JobListing } from '@/types'

export const revalidate = 60

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

async function getJob(id: string): Promise<JobListing | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url') {
    return null
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)
  if (!job) return { title: '求人が見つかりません' }
  return {
    title: `${job.job_type}（${job.employment_type}）– ${job.facility}`,
    description: job.appeal_content?.slice(0, 120) || `${job.facility}の${job.job_type}求人です。`,
  }
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '—'
  if (min && max) return `¥${min.toLocaleString()} – ¥${max.toLocaleString()}`
  if (min) return `¥${min.toLocaleString()}〜`
  if (max) return `〜¥${max.toLocaleString()}`
  return '—'
}

function SalaryRow({ label, value }: { label: string; value: string }) {
  if (value === '—') return null
  return (
    <tr className="border-b border-lightgray/50">
      <td className="py-2.5 pr-4 font-sans text-xs text-midgray w-44 flex-shrink-0">{label}</td>
      <td className="py-2.5 font-sans text-xs text-darkgray font-medium">{value}</td>
    </tr>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 border-b border-lightgray/50 py-3">
      <span className="font-sans text-xs text-midgray w-36 flex-shrink-0">{label}</span>
      <span className="font-sans text-xs text-darkgray leading-relaxed whitespace-pre-line">{value}</span>
    </div>
  )
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-6">
            <span className="page-header-en">Job Detail</span>
            <h1 className="page-header-title">求人詳細</h1>
          </div>
        </div>

        <section className="py-12 md:py-20 bg-offwhite">
          <div className="max-w-3xl mx-auto px-6 space-y-8">

            {/* Breadcrumb */}
            <nav className="font-sans text-xs text-midgray flex items-center gap-2">
              <a href="/" className="hover:text-green-dark transition-colors">ホーム</a>
              <span>›</span>
              <a href="/recruit" className="hover:text-green-dark transition-colors">求人一覧</a>
              <span>›</span>
              <span className="text-darkgray">{job.job_type}</span>
            </nav>

            {/* Job header card */}
            <div className="bg-white border border-lightgray p-6 md:p-10">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5">
                  {job.job_type}
                </span>
                <span className="font-sans text-[10px] tracking-widest text-darkgray bg-offwhite border border-lightgray px-2 py-0.5">
                  {job.employment_type}
                </span>
                <span className="font-sans text-[10px] tracking-widest text-midgray bg-offwhite border border-lightgray px-2 py-0.5">
                  {job.facility}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl md:text-2xl font-semibold text-green-deeper leading-snug mb-4">
                {job.title}
              </h2>

              {/* Title message */}
              {job.title_message && (
                <p className="font-sans text-sm text-darkgray/80 leading-relaxed border-l-2 border-green-main pl-4">
                  {job.title_message}
                </p>
              )}
            </div>

            {/* Appeal content */}
            {job.appeal_content && (
              <div className="bg-white border border-lightgray p-6 md:p-10">
                <h3 className="font-serif text-base text-green-deeper mb-3">アピール内容</h3>
                <div className="w-6 h-0.5 bg-green-main mb-5" />
                <p className="font-sans text-sm text-darkgray leading-relaxed whitespace-pre-line">
                  {job.appeal_content}
                </p>
              </div>
            )}

            {/* Salary breakdown */}
            <div className="bg-white border border-lightgray p-6 md:p-10">
              <h3 className="font-serif text-base text-green-deeper mb-3">給与・待遇</h3>
              <div className="w-6 h-0.5 bg-green-main mb-5" />

              {job.salary_type && (
                <p className="font-sans text-xs text-midgray mb-4">{job.salary_type}</p>
              )}

              <table className="w-full">
                <tbody>
                  <SalaryRow label="基本給" value={formatSalary(job.base_salary_min, job.base_salary_max)} />
                  <SalaryRow label="資格手当" value={formatSalary(job.qualification_allowance_min, job.qualification_allowance_max)} />
                  <SalaryRow label="職務手当" value={formatSalary(job.job_allowance_min, job.job_allowance_max)} />
                  <SalaryRow label="毎月支給額" value={formatSalary(job.monthly_total_min, job.monthly_total_max)} />
                  <SalaryRow label="みなし残業手当（月20時間）" value={formatSalary(job.overtime_allowance_min, job.overtime_allowance_max)} />
                  {job.oncall_allowance && (
                    <SalaryRow label="オンコール手当" value={job.oncall_allowance} />
                  )}
                  {job.night_shift_allowance && (
                    <SalaryRow label="夜勤手当" value={job.night_shift_allowance} />
                  )}
                  {job.year_end_allowance && (
                    <SalaryRow label="年末年始手当" value={job.year_end_allowance} />
                  )}
                  {job.adjustment_allowance && (
                    <SalaryRow label="調整手当" value={job.adjustment_allowance} />
                  )}
                  {job.commuting_allowance && (
                    <SalaryRow label="通勤手当" value={job.commuting_allowance} />
                  )}
                  {job.incentive_allowance && (
                    <SalaryRow label="インセンティブ手当" value={job.incentive_allowance} />
                  )}
                </tbody>
              </table>

              {/* Total salary highlight */}
              {(job.total_salary_min || job.total_salary_max) && (
                <div className="mt-5 bg-green-light border border-green-pale p-4 flex items-center justify-between">
                  <span className="font-sans text-xs font-medium text-green-darker">給与総額</span>
                  <span className="font-sans text-lg font-bold text-green-deeper">
                    {formatSalary(job.total_salary_min, job.total_salary_max)}
                  </span>
                </div>
              )}

              {job.bonus && (
                <p className="font-sans text-xs text-darkgray/70 mt-3">
                  <span className="text-midgray">賞与：</span>{job.bonus}
                </p>
              )}
              {job.payroll_cutoff && (
                <p className="font-sans text-xs text-darkgray/70 mt-1">
                  <span className="text-midgray">賃金締め切り日：</span>{job.payroll_cutoff}
                </p>
              )}
            </div>

            {/* Job details */}
            <div className="bg-white border border-lightgray p-6 md:p-10">
              <h3 className="font-serif text-base text-green-deeper mb-3">勤務情報</h3>
              <div className="w-6 h-0.5 bg-green-main mb-5" />

              <div>
                <InfoRow label="勤務時間" value={job.working_hours} />
                <InfoRow label="休日" value={job.holidays} />
                <InfoRow label="必要資格" value={job.required_qualifications} />
                <InfoRow label="その他" value={job.other_benefits} />
              </div>
            </div>

            {/* Job description */}
            {job.job_description && (
              <div className="bg-white border border-lightgray p-6 md:p-10">
                <h3 className="font-serif text-base text-green-deeper mb-3">仕事の内容</h3>
                <div className="w-6 h-0.5 bg-green-main mb-5" />
                <p className="font-sans text-sm text-darkgray leading-relaxed whitespace-pre-line">
                  {job.job_description}
                </p>
              </div>
            )}

            {/* Application form */}
            <div className="bg-white border border-lightgray p-6 md:p-10" id="apply">
              <h3 className="font-serif text-lg font-semibold text-green-deeper mb-1">この求人に応募する</h3>
              <div className="w-8 h-0.5 bg-green-main mb-6" />
              <RecruitForm
                jobListingId={job.id}
                jobTitle={`${job.job_type}（${job.employment_type}）– ${job.facility}`}
                facilityDefault={job.facility}
                jobTypeDefault={job.job_type}
              />
            </div>

            {/* Back link */}
            <div className="text-center">
              <a
                href="/recruit"
                className="font-sans text-xs text-midgray hover:text-green-dark transition-colors"
              >
                ← 求人一覧に戻る
              </a>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
