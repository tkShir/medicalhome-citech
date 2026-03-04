'use client'

import { useState } from 'react'

export default function ContactForm() {
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
      jobTitle: formData.get('jobTitle') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string,
      agreedToPrivacyPolicy: formData.get('agreedToPrivacyPolicy') === 'on',
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('送信に失敗しました')
      // GTM / GA4 コンバージョンイベント
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).dataLayer?.push({
        event: 'form_submit',
        form_type: 'contact',
      })
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
        <h3 className="font-serif text-lg text-green-deeper mb-2">送信が完了しました</h3>
        <p className="font-sans text-sm text-darkgray/70 tracking-wide">
          お問い合わせありがとうございます。<br />担当者より折り返しご連絡いたします。
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
        <label className="form-label">職種</label>
        <input name="jobTitle" className="form-input" placeholder="看護師、介護職員、など" />
      </div>

      <div>
        <label className="form-label">会社名・所属</label>
        <input name="company" className="form-input" placeholder="株式会社〇〇、または空白" />
      </div>

      <div>
        <label className="form-label">お問い合わせ内容</label>
        <textarea
          name="message"
          rows={5}
          className="form-input resize-none"
          placeholder="ご質問・ご相談の内容をご記入ください"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          name="agreedToPrivacyPolicy"
          type="checkbox"
          required
          id="privacy"
          className="mt-0.5 accent-green-dark w-4 h-4 flex-shrink-0"
        />
        <label htmlFor="privacy" className="font-sans text-xs text-darkgray leading-relaxed cursor-pointer">
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
        {submitting ? '送信中...' : '送信する'}
      </button>
    </form>
  )
}
