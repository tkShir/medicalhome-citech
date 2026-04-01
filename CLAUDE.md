# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

株式会社シーズ・テクノロジーズが運営する医療特化型介護施設「シーズメディカルホーム」の公式ウェブサイト。一都三県（東京・神奈川・埼玉・千葉）で施設を展開している。

ウェブサイトの主な目的（優先度順）：
1. 施設で働く介護士・看護師の採用促進
2. 地域の病院やケアマネジャーなど、入居者の紹介元となる医療従事者への情報提供
3. 入居者様およびそのご家族への情報提供

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint実行
npm run start    # 本番サーバー起動
```

テストコマンドは設定されていない。

## アーキテクチャ

Next.js 14 App Router を使用。公開ページと管理者ダッシュボードで構成される。

### 主要ディレクトリ

- `src/app/` — App Router ページおよびAPIルート
- `src/app/admin/` — クッキー認証付き管理ダッシュボード（タブ形式の単一ページ）
- `src/app/api/admin/` — 求人・ニュース・施設・お問い合わせ・設定の保護されたCRUDエンドポイント
- `src/components/` — 共通レイアウト（Header、Footer）とフォームコンポーネント
- `src/lib/` — Supabaseクライアント、メールユーティリティ
- `src/types/index.ts` — 全TypeScriptインターフェース（Facility、JobListing、NewsPostなど）

### データ層

Supabaseクライアントは2種類：
- `src/lib/supabase.ts` — anonキー、クライアントサイドの読み取り用
- `src/lib/supabase-server.ts` — サービスロールキー、APIルートおよびサーバーコンポーネント用

公開ページ（採用情報、ニュース）はISR（60秒再検証）を使用。管理者APIルートは `force-dynamic`。

### 認証

ミドルウェア（`src/middleware.ts`）が `ADMIN_SECRET` 環境変数に対して `admin_token` httpOnly クッキーを検証。`/admin/login` を除く全 `/admin` ルートが保護対象。`/api/admin/login` 経由で認証をセット。

### メール

Resend SDK（`src/lib/email.ts`）がお問い合わせ・採用応募フォームの送信時に通知メールを送信。送信先はSupabaseの `settings.notification_email` または `NOTIFICATION_EMAIL` 環境変数から取得。

### 必須環境変数

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_SECRET
```

任意：
```
RESEND_API_KEY
RESEND_FROM_EMAIL
NOTIFICATION_EMAIL
NEXT_PUBLIC_GTM_ID
```

### スタイリング

TailwindCSS にカスタムグリーンパレット（`green-main: #93DA49`、`green-dark: #578E1D`）とピンクアクセントを追加。フォント：Noto Serif JP（serif）、Noto Sans JP（sans）。パスエイリアス `@/*` は `src/*` にマッピング。
