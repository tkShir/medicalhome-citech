'use client'

import { useState } from 'react'

const inquiryOptions = [
  { name: 'inquiryType_nyukyo', label: '利用者様の入居相談' },
  { name: 'inquiryType_kengaku', label: '施設見学' },
  { name: 'inquiryType_ryokin', label: '料金の確認' },
  { name: 'inquiryType_other', label: 'その他' },
]

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const inquiryTypes = inquiryOptions
      .filter((opt) => formData.get(opt.name) === 'on')
      .map((opt) => opt.label)
      .join('、')

    const data = {
      lastName: formData.get('lastName') as string,
      firstName: formData.get('firstName') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      inquiryTypes,
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
        event: 'form_submit_vercel',
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

      {/* Inquiry type */}
      <div>
        <label className="form-label">お問い合わせの種類</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {inquiryOptions.map((opt) => (
            <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
              <input
                name={opt.name}
                type="checkbox"
                className="accent-green-dark w-4 h-4 flex-shrink-0"
              />
              <span className="font-sans text-sm text-darkgray">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

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
          担当者名 <span className="text-pink-main">*</span>
        </label>
        <p className="font-sans text-xs text-midgray mb-1 tracking-wide">
          ご家族・医療機関スタッフなど、ご対応いただく方のお名前をご記入ください
        </p>
        <input
          name="contactPerson"
          required
          className="form-input"
          placeholder="鈴木 花子（担当者のお名前）"
        />
      </div>

      <div>
        <label className="form-label">
          電話番号 <span className="text-pink-main">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          required
          className="form-input"
          placeholder="03-0000-0000"
        />
      </div>

      <div>
        <label className="form-label">
          メールアドレス <span className="text-pink-main">*</span>
        </label>
        <input name="email" type="email" required className="form-input" placeholder="example@email.com" />
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
