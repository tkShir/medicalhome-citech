import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'シーズメディカルホーム | 地域と共にその人らしく',
    template: '%s | シーズメディカルホーム',
  },
  description: '医療と介護の力を結集し、その人「らしさ」を実現するホスピス住宅。終末期医療・介護のご相談はシーズメディカルホームへ。',
  keywords: ['ホスピス住宅', '在宅医療', '介護', 'ナーシングホーム', '終末期ケア'],
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
