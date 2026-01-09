# Sunflower
🌻 Circle Attendance Confirmation Support System

## ✨ 機能

- 同人誌即売会における、サークル出席確認を支援するシステムです。
- QRコードで読み取った内容をリアルタイムに共有できます。
- 出欠状態を一覧からリアルタイムに更新できます。

## 🐣 利用準備

### データの準備

1. 下記のID形態でQRコードを生成します。(以下スペースID)
    - `<イベント名英数字>-<連番>`: 例(hogehoge-1)
2. スペースIDとスペース記号(「A01」等)を紐づけるためのTSVデータを作成します。
    - `<スペースID>\t<スペース記号>\tサークル名`: 例(hogehoge-1,A01)
3. システムにログインし、CSVデータを流し込みます。
4. 完了！

### スペースIDシールの作成

1. スペースIDのデータのみが入ったQRコードを作成し、印刷してください。

## 🐤 利用方法

### 出席登録

1. 「出席登録」ボタンを押します。
2. 封筒のQRコードを読み取ります。

### 出欠確認(欠席登録)

1. 「出欠確認」ボタンを押します。
2. リストが表示されます。

## 開発

### API

#### マイグレーション

```bash
yarn workspace api wrangler d1 migrations create d1-nct-soleil \<migration_name\>
yarn workspace api prisma migrate diff --from-empty --to-schema-datamodel packages/api/prisma/schema.prisma --script --output packages/api/migrations/d1-nct-soleil/\<migration_name\>/migration.sql # 初回マイグレーション時
yarn workspace api prisma migrate diff --from-local-d1 --to-schema-datamodel packages/api/prisma/schema.prisma --script --output packages/api/migrations/d1-nct-soleil/\<migration_name\>/data-migration.sql # 2回目以降のマイグレーション時
yarn workspace api wrangler d1 migrations apply d1-nct-soleil --local
yarn workspace api prisma generate
```
