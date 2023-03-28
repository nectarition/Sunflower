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
1. スペースIDとスペース記号(「A01」等)を紐づけるためのCSVデータを作成します。
  - `<スペースID>,<スペース記号>`: 例(hogehoge-1,A01)
1. システムにログインし、CSVデータを流し込みます。
1. 完了！

### スペースIDシールの作成

1. スペースIDのデータのみが入ったQRコードを作成してください。

## 🐤 利用方法

### 出席登録

1. 「出席登録」ボタンを押します。
1. 封筒のQRコードを読み取ります。

### 出欠確認(欠席登録)

1. 「出欠確認」ボタンを押します。
1. リストが表示されます。
