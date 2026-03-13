import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  title: {
    default: '【公式】シーズメディカルホーム｜関東の医療特化型介護施設',
    template: '%s | シーズメディカルホーム',
  },
  description: '終末期・難病・医療依存度の高い方の住まいをお探しなら、シーズメディカルホームへ。24時間看護体制・看取り対応・訪問診療連携。横浜市保土ヶ谷区・藤沢市・川崎市・日野市に展開する医療特化型介護施設。入居相談受付中。',
  keywords: [
    '医療特化型介護施設', 'ホスピス住宅', 'ホスピス型住宅', 'ナーシングホーム', '終末期ケア', '看取りケア',
    '在宅医療', '訪問看護', '24時間看護', '介護施設', '有料老人ホーム',
    '難病', '神経難病', 'ALS', '筋萎縮性側索硬化症', 'パーキンソン病', '特定疾病',
    '横浜', '保土ヶ谷', '藤沢', '川崎', '日野', '神奈川', '東京', '関東', 'シーズメディカルホーム',
  ],
  openGraph: {
    type: 'website',
    url: 'https://medicalhome.citech.co.jp',
    locale: 'ja_JP',
    siteName: 'シーズメディカルホーム',
    title: '【公式】シーズメディカルホーム｜関東の医療特化型介護施設',
    description: '終末期・難病・医療依存度の高い方の住まいをお探しなら。24時間看護・看取り対応・訪問診療連携。横浜市保土ヶ谷区・藤沢市・川崎市・日野市に展開する医療特化型介護施設。',
    images: [
      {
        url: 'https://cagtyscyplrhkhkzbeay.supabase.co/storage/v1/object/public/web_asset/cizmedihome_ogimage.png',
        width: 1200,
        height: 630,
        alt: 'シーズメディカルホーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '【公式】シーズメディカルホーム｜関東の医療特化型介護施設',
    description: '終末期・難病・医療依存度の高い方の入居相談受付中。24時間看護・看取り対応。横浜市保土ヶ谷区・藤沢市・川崎市・日野市に展開する医療特化型介護施設。',
  },
  icons: {
    icon: 'https://cagtyscyplrhkhkzbeay.supabase.co/storage/v1/object/public/web_asset/cizmedihome_favicon.png',
    apple: 'https://cagtyscyplrhkhkzbeay.supabase.co/storage/v1/object/public/web_asset/cizmedihome_favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      {/* Google Tag Manager — head snippet */}
      {GTM_ID && (
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <body>
        {/* Google Tag Manager — noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
