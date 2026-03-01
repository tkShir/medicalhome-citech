import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RecruitForm from '@/components/forms/RecruitForm'

export const metadata = {
  title: '求人一覧・採用応募',
  description: 'シーズメディカルホームの求人一覧と採用応募フォームです。',
}

const jobs = [
  {
    id: '1',
    title: '【職員募集】リハビリ専門職として、理想のケアを実現しませんか？',
    facilityName: 'ナーシングホームAbee保土ヶ谷',
    jobType: 'PT/OT職員',
    employmentType: '正社員',
    salaryMin: 276586,
    salaryMax: 353223,
    description: 'あなたの専門知識を活かしませんか？利用者さま一人ひとりの"自分らしく"を叶えるために、離床訓練や、自分の足で歩きたい。そんな夢を叶えるリハビリを期待しています。',
  },
  {
    id: '2',
    title: 'スタッフ大募集！あなたの「やりたかった介護」、ここでカタチにしませんか？',
    facilityName: 'ナーシングホームAbee保土ヶ谷',
    jobType: '介護職員',
    employmentType: '正社員',
    salaryMin: 262757,
    salaryMax: 344004,
    description: '私たちの介護は「身体の不自由さを補うこと」だけを目的とするのではなく、日々の暮らしを快適に、その人らしく過ごしていただくことを目標としています。',
  },
]

export default function RecruitPage() {
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
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-lightgray p-6 md:p-8">
                    {/* Tag row */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-sans text-[10px] tracking-widest text-green-dark bg-green-light px-2 py-0.5">
                        {job.jobType}
                      </span>
                      <span className="font-sans text-[10px] tracking-widest text-darkgray bg-offwhite border border-lightgray px-2 py-0.5">
                        {job.employmentType}
                      </span>
                    </div>
                    <h2 className="font-serif text-base font-semibold text-green-deeper leading-snug mb-3">
                      {job.title}
                    </h2>
                    <div className="space-y-2 mb-4 border-t border-lightgray pt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs text-midgray w-16 flex-shrink-0">施設</span>
                        <span className="font-sans text-xs text-darkgray">{job.facilityName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs text-midgray w-16 flex-shrink-0">給与</span>
                        <span className="font-sans text-xs text-darkgray font-medium">
                          ¥{job.salaryMin.toLocaleString()} – ¥{job.salaryMax.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-darkgray/80 leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application form */}
            <div className="bg-white border border-lightgray p-6 md:p-10">
              <h2 className="font-serif text-lg font-semibold text-green-deeper mb-1">採用応募フォーム</h2>
              <div className="w-8 h-0.5 bg-green-main mb-6" />
              <RecruitForm />
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
