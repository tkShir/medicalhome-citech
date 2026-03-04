'use client'

import Link from 'next/link'

const footerLinks = {
  main: [
    { label: 'トップ', href: '/' },
    { label: '施設一覧', href: '/shisetsu-ichiran' },
    { label: 'ご入居希望の方へ', href: '/residence-application' },
    { label: 'お知らせ', href: '/news' },
  ],
  sub: [
    { label: '採用情報', href: '/saiyo' },
    { label: 'パンフレット', href: '/pamphlet' },
    { label: 'お問い合わせ', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-green-deeper text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand block */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <p className="font-sans text-[10px] tracking-widest text-green-pale mb-1">地域と共にその人らしく</p>
              <p className="font-serif text-lg font-semibold tracking-wide text-white">シーズメディカルホーム</p>
            </div>
            <p className="font-sans text-xs text-green-pale leading-relaxed">
              医療と介護の力を結集し、<br />
              その人「らしさ」を実現する<br />
              ホスピス住宅です。
            </p>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/ciz_medicalhome/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-green-pale hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-sans text-xs tracking-wider">@ciz_medicalhome</span>
            </a>
          </div>

          {/* Nav col 1 */}
          <div>
            <p className="font-sans text-[10px] tracking-widest text-green-pale uppercase mb-4">Menu</p>
            <ul className="flex flex-col gap-3">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/80 hover:text-white tracking-wide transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav col 2 */}
          <div>
            <p className="font-sans text-[10px] tracking-widest text-green-pale uppercase mb-4">&nbsp;</p>
            <ul className="flex flex-col gap-3">
              {footerLinks.sub.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/80 hover:text-white tracking-wide transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company info */}
          <div>
            <p className="font-sans text-[10px] tracking-widest text-green-pale uppercase mb-4">Company</p>
            <p className="font-sans text-xs text-green-pale mb-1">運営会社</p>
            <p className="font-serif text-sm font-semibold text-white mb-3 leading-snug">
              株式会社シーズ・テクノロジーズ
            </p>
            <address className="not-italic font-sans text-xs text-white/70 leading-relaxed">
              〒150-0012<br />
              東京都渋谷区広尾1-1-39<br />
              恵比寿プライムスクエアタワー17階
            </address>
            <a
              href="tel:03-3797-4002"
              className="font-sans text-sm font-semibold text-white hover:text-green-pale transition-colors mt-3 block tracking-wider"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => (window as any).dataLayer?.push({ event: 'phone_click' })}
            >
              ☎&ensp;03-3797-4002
            </a>
            <p className="font-sans text-xs text-white/60 mt-1">平日 10:00 – 19:00</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-sans text-xs text-white/40 tracking-wider">
            © {new Date().getFullYear()} 株式会社シーズ・テクノロジーズ. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
