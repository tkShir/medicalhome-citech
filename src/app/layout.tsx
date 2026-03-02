import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '【公式】シーズメディカルホーム｜関東のホスピス型住宅',
    template: '%s | シーズメディカルホーム',
  },
  description: '関東エリアに展開するホスピス型住宅のシーズメディカルホーム。24時間看護体制・訪問診療連携により、終末期・医療依存度の高い方が安心して暮らせる住まいを提供します。横浜・藤沢・川崎エリア。入居相談受付中。',
  keywords: [
    'ホスピス住宅', 'ホスピス型住宅', 'ナーシングホーム', '終末期ケア', '看取りケア',
    '在宅医療', '訪問看護', '24時間看護', '介護施設', '有料老人ホーム',
    '横浜', '藤沢', '川崎', '神奈川', '関東', 'シーズメディカルホーム',
  ],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: '【公式】シーズメディカルホーム｜関東のホスピス型住宅',
    description: '関東エリアに展開するホスピス型住宅。24時間看護体制・訪問診療連携で終末期・医療依存度の高い方が安心して暮らせる環境を提供。横浜・藤沢・川崎。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '【公式】シーズメディカルホーム｜関東のホスピス型住宅',
    description: '関東エリアに展開するホスピス型住宅。24時間看護体制・訪問診療連携で安心の終末期ケアを提供。',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
