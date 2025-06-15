# Reservation System

中小企業向け・多業種対応型の汎用予約管理システム  
初期構築の目的は、美容室、クリニック、会議室、飲食店など幅広い業種に対応する、柔軟な予約管理ソリューションの開発。

---

## 🎯 目的と特徴

- 多業種に対応できる汎用型構造
- 中小企業でも扱いやすいUI/UXと運用コスト
- テナント（店舗）ごとに管理分離
- 将来的なマルチ言語対応、PWA対応、決済連携も視野

---

## ✅ 想定業種と特有機能（初期設定時に分岐）

| 業種             | 特有機能例 |
|------------------|------------|
| 美容サロン       | スタッフ指名 / メニュー所要時間 / クーポン設定 |
| 医療・クリニック | 医師ごとの診療メニュー / 問診票フォーム |
| 会議室・レンタル | 時間帯別料金 / 備品オプション / 連続予約 |
| 飲食店           | 席タイプ予約 / コース事前選択 / 最大人数制限 |
| レンタカー       | 保証金設定 / 延滞金計算 / 在庫管理 |
| イベント         | 定員管理 / チケット種別 / QR受付 |
| スクール         | 振替予約 / 月謝 or チケット制 / 出欠管理 |

---

## 🧱 技術スタック

### フロントエンド（`frontend/`）
- Next.js + TypeScript
- Tailwind CSS
- Axios
- App Router構成
- JWT トークンは `src/lib/api/login.ts` でデコードし `localStorage` へ保存
- 主要ディレクトリ:
  - `src/app` - 画面コンポーネント
  - `src/lib/api` - API ラッパー

#### 起動コマンド
```bash
cd frontend
npm install
npm run dev   # 開発サーバー
npm run build # 本番ビルド
npm start     # 本番起動
```
- 環境変数：`frontend/.env.example` を `.env.local` にコピーして `NEXT_PUBLIC_API_BASE_URL` を設定

### バックエンド（`backend/`）
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL（照合順序問題回避のため template0 + Cロケール使用）
- JWT認証（アクセストークン + remember-token）
- 環境変数：`backend/.env.example` を `.env` にコピーし以下を設定

```env
DATABASE_URL=postgresql://user:password@localhost:5432/reservationsystem_db
SHADOW_DATABASE_URL=postgresql://user:password@localhost:5432/shadow_db
JWT_SECRET=your_jwt_secret
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```


現在の進捗状況（2025年5月21日時点）
| 機能カテゴリ                  | 状況   | 備考                                   |
| ----------------------- | ---- | ------------------------------------ |
| 初期設定（業種別 + 共通）          | ✅ 完了 | 7業種対応、設定保存済み                         |
| 初期設定編集                  | ✅ 完了 | `/admin/settings/[uuid]/edit`        |
| 認証・ログイン（JWT + remember） | ✅ 完了 | ロールベースの認可付き                          |
| ログアウト処理                 | ✅ 完了 | DB + Cookie 双方からトークン削除               |
| 顧客・スタッフ・サービスAPI         | ✅ 完了 | `/users`, `/staffs`, `/services`, `/services/all`, `/services/bulk` |
| 予約登録（本番DTO準拠）           | ✅ 完了 | userId, staffId, serviceId を選択可      |
| 予約一覧表示                  | ✅ 完了 | APIから取得、name表示可能（user/staff/service） |
| DB登録確認済み                | ✅ 完了 | `Reservation` テーブルに保存されることを確認        |

--------------------------------------------------------------------------------------------------

📊 機能進捗一覧（2025年5月22日時点）
機能カテゴリ	状況	備考
初期設定（業種別 + 共通）	✅ 完了	7業種対応、設定保存済み
初期設定編集	✅ 完了	/admin/settings/[uuid]/edit
認証・ログイン（JWT + remember）	✅ 完了	ロールベースの認可付き
ログアウト処理	✅ 完了	DB + Cookie 双方からトークン削除
顧客・スタッフ・サービスAPI	✅ 完了	/users, /staffs, /services, /services/all, /services/bulk
予約登録（本番DTO準拠）	✅ 完了	userId, staffId, serviceId を選択可
予約一覧表示	✅ 完了	APIから取得、name表示可能（user/staff/service）
DB登録確認済み	✅ 完了	Reservation テーブルに保存されることを確認


## 🔐 ログイン認証機能（JWT + ロール分岐）

- NestJS にて JWT 発行と認証を実装。
- トークンにはユーザーの `id`, `tenantId`, `email`, `role` を含む。
- ログイン成功後、JWT をフロント側でデコードし `localStorage` に `token` および `role` を保存。
- ロールに応じてログイン後の画面を自動分岐：

| ロール    | 遷移先                   |
|---------|------------------------|
| admin   | `/admin/settings`     |
| user    | `/user/home`（仮ページ）|

### 実装ファイル構成（認証関連）

backend/
└─ src/
├─ controllers/
│ └─ auth.controller.ts # POST /auth/login
├─ services/
│ ├─ auth.service.ts # validateUser() + JWT発行
│ └─ user.service.ts # findByEmail()
├─ strategies/jwt.strategy.ts # JWT認証ストラテジー
└─ guards/jwt-auth.guard.ts # 認証ガード

frontend/
└─ src/
├─ app/
│ └─ login/page.tsx # ログイン画面 + 認証後画面遷移
└─ lib/api/
└─ login.ts # API呼び出し + JWT decode処理


### 使用ライブラリ

- `jsonwebtoken`（サーバー側 JWT 生成）
- `jwt-decode`（クライアント側 JWT デコード）
- `bcrypt`（パスワードハッシュ）

---

## Setup

### Prerequisites
- Node.js and npm
- PostgreSQL server

### Environment variables
Create the following files before running the services.
### `/setup` エンドポイント
初回セットアップ用の POST `/setup` では以下のフィールドを含む JSON を送信します:
- `tenant`
- `admin`
- `setting`
- `staffList`
- `menuList`
- `coupon`

これらを Prisma のトランザクションで一括登録し、成功すると `{message, tenantId}` を返します。
-------------------------------------------------------------

`backend/.env`
```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/reservationsystem_db
SHADOW_DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shadow_db
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_API_VERSION=2024-04-10
STRIPE_WEBHOOK_SECRET=your_webhook_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
TWILIO_SID=ACxxx
TWILIO_AUTH_TOKEN=token
TWILIO_FROM=+10000000000
SETUP_EMAIL=admin@example.com
SETUP_PASSWORD=changeme
```

`frontend/.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Install dependencies
Run the helper script to install packages for both the backend and frontend:
```bash
./install_dependencies.sh
```

### Lint fix
Run ESLint for both the backend and frontend projects and automatically fix issues:
```bash
./scripts/lint-fix.sh
```

### Database migration and seeding
```bash
cd backend
npx prisma migrate dev
export SETUP_EMAIL=admin@example.com
export SETUP_PASSWORD=changeme
npm run seed
```

### Run services
```bash
# backend
npm run start:dev

# frontend
cd ../frontend
npm run dev
```

### Directory layout
```
Reservation-system/
├─ frontend/          # Next.js client
└─ backend/           # NestJS API and Prisma schema
```

### Tests
```bash
cd backend
npm run test       # unit tests
npm run test:e2e   # e2e tests
```
