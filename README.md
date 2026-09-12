# Tsurugaoka Quest


TSURUGAOKA QUEST の Web アプリと AWS バックエンドを管理する pnpm monorepo です。

## 使用技術

- Node.js 22 / pnpm 9
- フロントエンド: TypeScript, React, Vite
- バックエンド: AWS Amplify Gen 2 (AWS AppSync + DynamoDB)
- ツールチェーン: mise

## セットアップ

### 前提

Node.js と pnpm を mise で揃える場合:

```sh
mise install
```

Docker を利用する場合は、イメージの build 時に mise と `mise.toml` で指定した Node.js / pnpm がインストールされます。

```sh
docker build -t tsurugaoka-quest .
docker run --rm -it -p 8081:8081 tsurugaoka-quest
```

GitHub Codespaces では `.devcontainer/devcontainer.json` が使用され、zsh が既定のターミナルとして開きます。mise はコンテナ内の全ユーザーから利用できます。

### 依存関係のインストール

```sh
pnpm install
```

### 開発

Web アプリの開発サーバーを起動します。ブラウザで `http://localhost:5173` を開いて確認できます。

```sh
pnpm dev
```

バックエンドを AWS の sandbox 環境へデプロイし、Amplify の outputs を生成します。AWS 認証済みの環境で実行してください。

```sh
pnpm dev:backend
```

### ビルド・テスト

```sh
pnpm build
pnpm test
pnpm lint
```

モバイルアプリ化は Web 版のゲーム完成後に行います。現在の `apps/mobile` は将来の移植用に保持しています。
モバイル側の既存コードを個別に確認する場合は `pnpm test:mobile` または `pnpm build:mobile` を使用します。

## ディレクトリ構成

```text
apps/web/          React + Vite の Web アプリ
apps/mobile/       将来のモバイル移植用 React Native アプリ
packages/backend/  Amplify Gen 2 の AppSync/DynamoDB 定義
docs/userstory/    ユーザーストーリー
```

Amplify の生成物 (`amplify_outputs.json`) は環境ごとに異なるため、Git 管理対象外です。
