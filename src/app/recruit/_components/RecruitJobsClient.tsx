'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { JobListing } from '@/types'

interface Props {
  jobs: JobListing[]
}

function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '応相談'
  if (min && max) return `¥${min.toLocaleString()} – ¥${max.toLocaleString()}`
  if (min) return `¥${min.toLocaleString()}〜`
  if (max) return `〜¥${max.toLocaleString()}`
  return '応相談'
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
}

export default function RecruitJobsClient({ jobs }: Props) {
  const [facilityFilter, setFacilityFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [employmentFilter, setEmploymentFilter] = useState('')

  // Derive unique filter options from actual job data
  const facilities = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.facility).filter(Boolean))).sort(),
    [jobs]
  )
  const jobTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.job_type).filter(Boolean))).sort(),
    [jobs]
  )
  const employmentTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.employment_type).filter(Boolean))).sort(),
    [jobs]
  )

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (facilityFilter && job.facility !== facilityFilter) return false
      if (jobTypeFilter && job.job_type !== jobTypeFilter) return false
      if (employmentFilter && job.employment_type !== employmentFilter) return false
      return true
    })
  }, [jobs, facilityFilter, jobTypeFilter, employmentFilter])

  const hasFilter = !!(facilityFilter || jobTypeFilter || employmentFilter)

  const clearFilters = () => {
    setFacilityFilter('')
    setJobTypeFilter('')
    setEmploymentFilter('')
  }

  return (
    <div>
      {/* Filter bar */}
      {jobs.length > 0 && (
        <div className="bg-white border border-lightgray p-4 md:p-6 mb-8">
          <p className="font-sans text-[10px] tracking-widest text-midgray uppercase mb-3">絞り込み</p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 施設 */}
            <div className="flex-1">
              <label className="font-sans text-[10px] text-midgray tracking-widest block mb-1.5">
                施設
              </label>
              <select
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                className="w-full font-sans text-sm text-darkgray border border-lightgray px-3 py-2 bg-white focus:outline-none focus:border-green-main"
              >
                <option value="">すべての施設</option>
                {facilities.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* 職種 */}
            <div className="flex-1">
              <label className="font-sans text-[10px] text-midgray tracking-widest block mb-1.5">
                職種
              </label>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="w-full font-sans text-sm text-darkgray border border-lightgray px-3 py-2 bg-white focus:outline-none focus:border-green-main"
              >
                <option value="">すべての職種</option>
                {jobTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 雇用形態 */}
            <div className="flex-1">
              <label className="font-sans text-[10px] text-midgray tracking-widest block mb-1.5">
                雇用形態
              </label>
              <select
                value={employmentFilter}
                onChange={(e) => setEmploymentFilter(e.target.value)}
                className="w-full font-sans text-sm text-darkgray border border-lightgray px-3 py-2 bg-white focus:outline-none focus:border-green-main"
              >
                <option value="">すべての雇用形態</option>
                {employmentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Clear button */}
            {hasFilter && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="font-sans text-xs text-midgray hover:text-darkgray transition-colors px-4 py-2 border border-lightgray bg-white whitespace-nowrap"
                >
                  クリア
                </button>
              </div>
            )}
          </div>

          {/* Result count */}
          {hasFilter && (
            <p className="font-sans text-xs text-midgray mt-3 tracking-wide">
              <span className="text-green-dark font-medium">{filtered.length}</span>
              {' '}件 / 全 {jobs.length} 件
            </p>
          )}
        </div>
      )}

      {/* Job cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-lightgray bg-white">
          {hasFilter ? (
            <>
              <p className="font-serif text-base text-green-deeper mb-2">条件に合う求人は見つかりませんでした</p>
              <button
                onClick={clearFilters}
                className="font-sans text-xs text-green-dark hover:text-green-deeper transition-colors mt-2 underline underline-offset-2"
              >
                フィルターをリセット
              </button>
            </>
          ) : (
            <>
              <p className="font-serif text-base text-green-deeper mb-2">現在募集中の求人はありません</p>
              <p className="font-sans text-xs text-darkgray/60">お問い合わせは採用担当までご連絡ください</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <Link
              key={job.id}
              href={`/recruit/${job.id}`}
              className="group block bg-white border border-lightgray border-l-4 border-l-green-main/40 p-6 md:p-8
                         hover:border-green-main hover:border-l-green-dark hover:shadow-lg hover:-translate-y-1
                         hover:bg-gradient-to-br hover:from-white hover:to-green-light/20
                         transition-all duration-200 cursor-pointer"
            >
              {/* Tag row */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5">
                  {job.job_type}
                </span>
                <span className="font-sans text-[10px] tracking-widest text-darkgray bg-offwhite border border-lightgray px-2 py-0.5">
                  {job.employment_type}
                </span>
                {isNew(job.created_at) && (
                  <span className="font-sans text-[10px] tracking-widest text-white bg-pink-main px-2 py-0.5">
                    NEW
                  </span>
                )}
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
                  <span className="font-sans text-sm font-semibold text-green-dark">
                    {formatSalary(job.total_salary_min, job.total_salary_max)}
                  </span>
                </div>
              </div>
              {job.appeal_content && (
                <p className="font-sans text-xs text-darkgray/80 leading-relaxed line-clamp-3">
                  {job.appeal_content}
                </p>
              )}
              {/* CTA button */}
              <div className="mt-5 pt-4 border-t border-lightgray flex items-center justify-between">
                <span className="font-sans text-xs font-medium text-green-dark tracking-wider group-hover:text-green-deeper transition-colors">
                  詳細を見る・応募する
                </span>
                <div className="w-7 h-7 bg-green-dark flex items-center justify-center group-hover:bg-green-deeper transition-colors flex-shrink-0">
                  <svg className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
