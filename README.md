# 麻雀対局記録アプリ

ReactとTypeScriptを使用して作成した、麻雀の対局結果を記録・分析するWebアプリです。

## 概要

対局日、ルール、順位、得点、メモを入力すると、対局履歴として保存される。

登録されたデータから、対局数、平均順位、平均得点、各順位の割合を自動で計算できる。

三麻と四麻を切り替えて、成績を確認することができる。

## 主な機能

- 対局結果の登録
- 対局履歴の一覧表示
- 対局記録の削除
- 三麻・四麻の絞り込み
- 対局数の計算
- 平均順位の計算
- 平均得点の計算
- 各順位率の計算
- localStorageを使用したデータ保存
- スマートフォン画面への対応

## 使用技術

- React
- TypeScript
- Vite
- HTML
- CSS
- localStorage

## TypeScriptで使用した内容

このアプリでは、以下のTypeScriptの機能を使用しました。

### 型エイリアス

対局記録のデータ構造を型として定義しました。

```ts
type MahjongRecord = {
  id: number;
  date: string;
  gameType: GameType;
  rank: Rank;
  score: number;
  memo: string;
};

'''

##  起動方法

npm install
npm run dev