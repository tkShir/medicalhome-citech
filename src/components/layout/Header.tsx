'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: '施設一覧', href: '/shisetsu-ichiran' },
  { label: 'ご入居希望の方へ', href: '/residence-application' },
  { label: '採用情報', href: '/saiyo' },
  { label: 'パンフレット', href: '/pamphlet' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'border-b border-lightgray'
      }`}
    >
      {/* Top bar – phone + CTA */}
      <div className="hidden md:block bg-green-dark text-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-end items-center gap-6 h-9">
          <span className="font-sans text-xs text-green-pale tracking-wider">
            入居ご相談窓口&ensp;受付時間 / 平日 10:00 – 19:00
          </span>
          <a
            href="tel:03-3797-4002"
            className="font-sans text-sm font-semibold tracking-wider hover:text-green-pale transition-colors"
          >
            ☎&ensp;03-3797-4002
          </a>
          <Link
            href="/contact"
            className="font-sans text-xs font-medium tracking-wider bg-white text-green-dark px-5 py-1.5 hover:bg-offwhite transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* ロゴ文字 */}
            <div className="flex flex-col leading-none">
              <span className="font-sans text-[10px] text-midgray tracking-widest">地域と共にその人らしく</span>
              <span className="font-serif text-base md:text-lg font-semibold text-green-deeper tracking-wide">
                シーズメディカルホーム
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="メインメニュー">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-sans text-sm tracking-wider transition-colors pb-0.5 ${
                  pathname === item.href
                    ? 'text-green-dark border-b border-green-dark'
                    : 'text-darkgray hover:text-green-dark border-b border-transparent hover:border-green-pale'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: recruit link + phone + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/saiyo"
              className={`font-sans text-[10px] font-medium tracking-wider px-2 py-1.5 border transition-colors ${
                pathname === '/saiyo' || pathname === '/recruit'
                  ? 'text-green-dark border-green-dark bg-green-light'
                  : 'text-midgray border-lightgray hover:text-green-dark hover:border-green-dark'
              }`}
              aria-label="採用情報"
            >
              採用情報
            </Link>
            <a
              href="tel:03-3797-4002"
              className="font-sans text-sm font-semibold text-white bg-green-dark px-4 py-2 tracking-wider hover:bg-green-deeper transition-colors"
              aria-label="電話相談"
            >
              ☎ 電話
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-darkgray"
              aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-lightgray shadow-lg">
          <nav className="px-6 py-6 flex flex-col gap-0" aria-label="モバイルメニュー">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-sans text-sm tracking-wider py-3.5 border-b border-lightgray flex items-center justify-between transition-colors ${
                  pathname === item.href ? 'text-green-dark' : 'text-darkgray hover:text-green-dark'
                }`}
              >
                {item.label}
                <svg className="w-4 h-4 text-midgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            <div className="pt-5 flex flex-col gap-3">
              <Link href="/contact" className="btn-primary w-full text-center">
                お問い合わせフォーム
              </Link>
              <a href="tel:03-3797-4002" className="btn-primary-outline w-full text-center">
                ☎&ensp;03-3797-4002
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
