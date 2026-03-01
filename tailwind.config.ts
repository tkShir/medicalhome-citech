import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // メインカラー：パステルグリーン系
        green: {
          light:   '#e8f5d0', // 薄いパステルグリーン（背景用）
          pale:    '#d4edb0', // 少し濃いパステルグリーン
          main:    '#93DA49', // メインカラー
          dark:    '#578E1D', // ダークパステルグリーン
          deeper:  '#3d6614', // さらに深いグリーン（テキスト用）
        },
        // アクセント：ピンク系
        pink: {
          light:   '#F5DEDA', // 薄いパステルピンク（背景用）
          main:    '#EF6079', // パステルピンク
        },
        // ニュートラル
        offwhite: '#F4F5F0', // ホワイト（背景）
        lightgray: '#D9D9D6', // ライトグレー
        midgray:   '#B7B8B9', // もう少し濃いライトグレー
        darkgray:  '#63666A', // ダークグレー（本文テキスト）
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
        sans:  ['"Noto Sans JP"', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.15em',
      },
    },
  },
  plugins: [],
}
export default config
