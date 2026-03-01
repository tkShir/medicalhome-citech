'use client'

import { useState } from 'react'

export default function RecruitForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      lastName: formData.get('lastName') as string,
      firstName: formData.get('firstName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      jobType: formData.get('jobType') as string,
      facility: formData.get('facility') as string,
      message: formData.get('message') as string,
      agreedToPrivacyPolicy: formData.get('agreedToPrivacyPolicy') === 'on',
    }

    try {
      const res = await fetch('/api/recruit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('送信に失敗しました')
      setSubmitted(true)
    } catch {
      setError('送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-green-light mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-lg text-green-deeper mb-2">応募が完了しました</h3>
        <p className="font-sans text-sm text-darkgray/70 tracking-wide">
          ご応募ありがとうございます。<br />担当者より折り返しご連絡いたします。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            姓 <span className="text-pink-main">*</span>
          </label>
          <input name="lastName" required className="form-input" placeholder="山田" />
        </div>
        <div>
          <label className="form-label">
            名 <span className="text-pink-main">*</span>
          </label>
          <input name="firstName" required className="form-input" placeholder="太郎" />
        </div>
      </div>

      <div>
        <label className="form-label">
          メールアドレス <span className="text-pink-main">*</span>
        </label>
        <input name="email" type="email" required className="form-input" placeholder="example@email.com" />
      </div>

      <div>
        <label className="form-label">
          電話番号 <span className="text-pink-main">*</span>
        </label>
        <input name="phone" type="tel" required className="form-input" placeholder="090-0000-0000" />
      </div>

      <div>
        <label className="form-label">
          希望職種 <span className="text-pink-main">*</span>
        </label>
        <select name="jobType" required className="form-select">
          <option value="">選択してください</option>
          <option value="nurse">看護師</option>
          <option value="care">介護職員</option>
          <option value="rehab">PT/OT職員</option>
          <option value="counselor">相談員</option>
          <option value="office">事務スタッフ</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label className="form-label">希望施設</label>
        <select name="facility" className="form-select">
          <option value="">選択してください（未定の場合は空白）</option>
          <option value="abee-hodogaya">ナーシングホームAbee保土ヶ谷</option>
          <option value="ciz-fujisawahonmachi">シーズメディカルホーム藤沢本町</option>
          <option value="ciz-kawasakishiratori">シーズメディカルホーム川崎白鳥</option>
        </select>
      </div>

      <div>
        <label className="form-label">メッセージ・ご質問</label>
        <textarea
          name="message"
          rows={4}
          className="form-input resize-none"
          placeholder="ご質問や希望の勤務形態など、ご自由にご記入ください"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          name="agreedToPrivacyPolicy"
          type="checkbox"
          required
          id="recruit-privacy"
          className="mt-0.5 accent-green-dark w-4 h-4 flex-shrink-0"
        />
        <label htmlFor="recruit-privacy" className="font-sans text-xs text-darkgray leading-relaxed cursor-pointer">
          個人情報利用規約に同意します <span className="text-pink-main">*</span>
        </label>
      </div>

      {error && (
        <p className="font-sans text-xs text-pink-main bg-pink-light px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? '送信中...' : '応募する'}
      </button>
    </form>
  )
}
